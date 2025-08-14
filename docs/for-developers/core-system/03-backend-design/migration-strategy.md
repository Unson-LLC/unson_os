# ConvexからPostgreSQLへの移行戦略

> **重要**: ConvexとPostgreSQLの「良いとこ取り」戦略

## 0) 想定される痛点（事前把握）

### データ形状のギャップ
- **Convex**: 自由形（ネスト/配列/Nullが多い）
- **PostgreSQL**: 1NF（正規化・外部キー/RLS前提）

### 整合性のギャップ
- **Convex**: 関数境界での原子性
- **PostgreSQL**: ACID＋SQLトランザクション

### 購読/リアクティブのギャップ
- **Convex**: "再実行されるクエリ"
- **PostgreSQL**: 通知/トリガ/ストリームで模倣が必要

### 運用ギャップ
- **Convex**: マイグレーションが軽い
- **PostgreSQL**: DDL・移行・RLS・バックアップ設計が要る

**これらを「抽象化・二重化・記録化」で相殺する戦略を採用**

---

## 1) リポジトリ層の抽象化（今すぐ実装）

「ドメインはDBを知らない」を徹底。TypeScriptのインターフェイス＋実装2種で対応。

### ドメインポート定義

```typescript
// domain/ports/ILeadRepo.ts
export interface ILeadRepo {
  getById(workspaceId: string, id: string): Promise<Lead | null>;
  listBySegment(workspaceId: string, seg: SegQuery, limit: number): Promise<Lead[]>;
  upsert(workspaceId: string, input: LeadInput): Promise<LeadId>;
  delete(workspaceId: string, id: string): Promise<void>;
}
```

### 実装クラス（2種類）

```typescript
// infra/convex/LeadRepoConvex.ts（現行運用）
export class LeadRepoConvex implements ILeadRepo {
  constructor(private convex: ConvexClient) {}
  
  async getById(workspaceId: string, id: string): Promise<Lead | null> {
    return await this.convex.query(api.leads.getById, { workspaceId, id });
  }
  // ... 他のメソッド実装
}

// infra/pg/LeadRepoPg.ts（将来 or 影書き用）
export class LeadRepoPg implements ILeadRepo {
  constructor(private db: DrizzleClient) {}
  
  async getById(workspaceId: string, id: string): Promise<Lead | null> {
    const result = await this.db
      .select()
      .from(leadsTable)
      .where(
        and(
          eq(leadsTable.workspaceId, workspaceId),
          eq(leadsTable.id, id)
        )
      )
      .limit(1);
    return result[0] || null;
  }
  // ... 他のメソッド実装
}
```

### 契約テスト（Contract Test）

```typescript
// tests/contracts/LeadRepo.contract.test.ts
describe('ILeadRepo Contract', () => {
  const testCases = [
    { name: 'Convex', repo: new LeadRepoConvex(convexClient) },
    { name: 'PostgreSQL', repo: new LeadRepoPg(drizzleClient) }
  ];

  testCases.forEach(({ name, repo }) => {
    describe(`${name} implementation`, () => {
      it('should return null for non-existent lead', async () => {
        const result = await repo.getById('workspace1', 'non-existent');
        expect(result).toBeNull();
      });
      
      it('should upsert and retrieve lead correctly', async () => {
        const input = { email: 'test@example.com', segment: 'enterprise' };
        const id = await repo.upsert('workspace1', input);
        const retrieved = await repo.getById('workspace1', id);
        
        expect(retrieved?.email).toBe(input.email);
        expect(retrieved?.segment).toBe(input.segment);
      });
    });
  });
});
```

---

## 2) スキーマの"二重定義"を避ける（共通スキーマの単一起点）

### 共通スキーマ定義

```typescript
// schema/Lead.schema.ts
export const LeadSchema = z.object({
  id: z.string().ulid(),
  workspaceId: z.string(),
  email: z.string().email(),
  segment: z.enum(['startup', 'enterprise', 'smb']).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Lead = z.infer<typeof LeadSchema>;
```

### Convex用スキーマ生成

```typescript
// infra/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    workspaceId: v.string(),
    email: v.string(),
    segment: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),
});
```

### PostgreSQL用DDL生成

```typescript
// infra/pg/schema.ts
import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const leadsTable = pgTable('leads', {
  workspaceId: text('workspace_id').notNull(),
  id: text('id').notNull(),
  email: text('email').notNull(),
  segment: text('segment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.workspaceId, table.id] }),
}));
```

---

## 3) 書き込みは必ず"アウトボックス"に記録（移行の生命線）

### Outboxイベントスキーマ

```typescript
// events/outbox/schema.ts
export const OutboxEventSchema = z.object({
  id: z.string().ulid(),
  workspaceId: z.string(),
  topic: z.string(), // 例: "lead.upsert", "gate.approve"
  occurredAt: z.date(),
  dedupeKey: z.string(), // 例: "W^...:lead:123"
  payload: z.record(z.any()), // ドメインオブジェクト
});

export type OutboxEvent = z.infer<typeof OutboxEventSchema>;
```

### Convexでのアウトボックス実装

```typescript
// infra/convex/mutations.ts
export const upsertLead = mutation({
  args: {
    workspaceId: v.string(),
    leadData: v.object({
      email: v.string(),
      segment: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { workspaceId, leadData } = args;
    
    // 1. メインビジネスロジック実行
    const leadId = await ctx.db.insert("leads", {
      ...leadData,
      workspaceId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // 2. Outboxに記録（失敗時は全体ロールバック）
    await ctx.db.insert("outbox_events", {
      id: ulid(),
      workspaceId,
      topic: "lead.upsert",
      occurredAt: Date.now(),
      dedupeKey: `${workspaceId}:lead:${leadId}`,
      payload: { leadId, ...leadData },
    });
    
    return leadId;
  },
});
```

### PostgreSQL側でのOutbox消費

```typescript
// events/outbox/consumer.ts
export class OutboxConsumer {
  constructor(private pgClient: DrizzleClient) {}
  
  async processEvents(): Promise<void> {
    // Convex OutboxからイベントをPolling
    const events = await this.fetchUnprocessedEvents();
    
    for (const event of events) {
      try {
        await this.processEvent(event);
        await this.markEventProcessed(event.id);
      } catch (error) {
        console.error(`Failed to process event ${event.id}:`, error);
        // リトライ機構やDLQへの移行
      }
    }
  }
  
  private async processEvent(event: OutboxEvent): Promise<void> {
    const { workspaceId, topic, payload } = event;
    
    switch (topic) {
      case 'lead.upsert':
        await this.pgClient.insert(leadsTable)
          .values({
            workspaceId,
            id: payload.leadId,
            email: payload.email,
            segment: payload.segment,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [leadsTable.workspaceId, leadsTable.id],
            set: {
              email: payload.email,
              segment: payload.segment,
              updatedAt: new Date(),
            },
          });
        break;
      // 他のトピックの処理...
    }
  }
}
```

---

## 4) 影書き（Dual-write/Shadow）で常時練習

### 方式A: 同期二重書き

```typescript
// services/LeadService.ts
export class LeadService {
  constructor(
    private primaryRepo: ILeadRepo, // Convex
    private shadowRepo?: ILeadRepo   // PostgreSQL（オプション）
  ) {}
  
  async upsertLead(workspaceId: string, input: LeadInput): Promise<string> {
    // 1. プライマリ（Convex）に書き込み
    const leadId = await this.primaryRepo.upsert(workspaceId, input);
    
    // 2. シャドウ（PostgreSQL）にベストエフォートで書き込み
    if (this.shadowRepo) {
      try {
        await this.shadowRepo.upsert(workspaceId, { ...input, id: leadId });
      } catch (error) {
        // Pgエラーでも主処理は継続（ログ出力のみ）
        console.warn('Shadow write failed:', error);
      }
    }
    
    return leadId;
  }
}
```

### 方式B: Outbox→コンシューマ（推奨）

```typescript
// workers/outbox-processor.ts
export class OutboxProcessor {
  private consumer: OutboxConsumer;
  
  constructor() {
    this.consumer = new OutboxConsumer(drizzleClient);
  }
  
  async start(): Promise<void> {
    // 30秒間隔でOutboxを処理
    setInterval(async () => {
      try {
        await this.consumer.processEvents();
      } catch (error) {
        console.error('Outbox processing failed:', error);
      }
    }, 30_000);
  }
}
```

---

## 5) クエリは"再現可能な形"に寄せる

### 標準的なクエリパターン

```typescript
// domain/queries/LeadQuery.ts
export interface SegmentQuery {
  segment?: string;
  emailDomain?: string;
  createdAfter?: Date;
  cursor?: string;
  limit: number;
}

export class LeadQueryService {
  constructor(private repo: ILeadRepo) {}
  
  async searchLeads(
    workspaceId: string, 
    query: SegmentQuery
  ): Promise<{ leads: Lead[]; nextCursor?: string }> {
    // ConvexでもPgでも実装可能な標準的なパターン
    const leads = await this.repo.listBySegment(workspaceId, query, query.limit + 1);
    
    const hasMore = leads.length > query.limit;
    const results = hasMore ? leads.slice(0, -1) : leads;
    const nextCursor = hasMore ? results[results.length - 1].id : undefined;
    
    return { leads: results, nextCursor };
  }
}
```

### リアルタイム購読の抽象化

```typescript
// domain/events/LeadEvents.ts
export interface ILeadEventBus {
  subscribe(workspaceId: string, callback: (lead: Lead) => void): () => void;
  publish(workspaceId: string, lead: Lead): void;
}

// Convex実装
export class ConvexLeadEventBus implements ILeadEventBus {
  subscribe(workspaceId: string, callback: (lead: Lead) => void) {
    // Convexの購読機能を使用
    return this.convex.watchQuery(api.leads.listByWorkspace, 
      { workspaceId }, 
      (leads) => leads.forEach(callback)
    );
  }
}

// PostgreSQL実装
export class PgLeadEventBus implements ILeadEventBus {
  subscribe(workspaceId: string, callback: (lead: Lead) => void) {
    // WebSocket/Server-Sent Events等で実装
    return this.subscribeToChanges(workspaceId, callback);
  }
}
```

---

## 6) RLS/監査/削除の"設計書"を今から持つ

### RLSポリシー設計

```sql
-- migrations/pg/001_rls_policies.sql

-- Row Level Security有効化
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- テナント分離ポリシー
CREATE POLICY tenant_isolation ON leads 
  USING (workspace_id = current_setting('app.workspace_id', true));

-- 読み取り専用ユーザー用ポリシー
CREATE POLICY readonly_access ON leads 
  FOR SELECT 
  TO readonly_role
  USING (workspace_id = current_setting('app.workspace_id', true));
```

### 監査ログ設計

```typescript
// domain/audit/AuditLog.ts
export const AuditLogSchema = z.object({
  id: z.string().ulid(),
  workspaceId: z.string(),
  actorId: z.string(),
  action: z.enum(['gate.approve', 'lead.create', 'settings.update']),
  resourceType: z.string(),
  resourceId: z.string(),
  before: z.record(z.any()).optional(),
  after: z.record(z.any()).optional(),
  timestamp: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});
```

### 削除ポリシー

```yaml
# spec/data-retention.yaml
retention_policies:
  leads:
    soft_delete: true
    archive_after_days: 365
    hard_delete_after_days: 2555  # 7年
    
  audit_logs:
    soft_delete: false
    archive_after_days: 2555  # 7年間保持
    
  outbox_events:
    archive_after_days: 90
    hard_delete_after_days: 365

workspace_deletion:
  grace_period_days: 30
  notification_schedule: [7, 3, 1]  # 削除前の通知スケジュール
```

---

## 7) 移行手順（停止なし）テンプレート

### フェーズ1: 影書き開始

```bash
# 1. PostgreSQL環境構築
docker-compose up postgres
npm run migrate:pg

# 2. Outboxコンシューマー起動
npm run start:outbox-consumer

# 3. データ同期確認
npm run verify:data-sync
```

### フェーズ2: 読み取りの段階的移行

```typescript
// config/database.ts
export const DB_CONFIG = {
  readStrategy: process.env.READ_STRATEGY || 'convex', // convex | pg | hybrid
  writeStrategy: 'convex', // 書き込みは継続してConvex
};

// services/LeadService.ts（読み取り切り替え）
async getLeadById(workspaceId: string, id: string): Promise<Lead | null> {
  const strategy = DB_CONFIG.readStrategy;
  
  switch (strategy) {
    case 'pg':
      return await this.pgRepo.getById(workspaceId, id);
    case 'hybrid':
      // 新しいデータはPg、古いデータはConvexから読む等
      return await this.hybridRead(workspaceId, id);
    default:
      return await this.convexRepo.getById(workspaceId, id);
  }
}
```

### フェーズ3: 書き込み移行

```typescript
// 書き込みもPostgreSQLに切り替え
export const DB_CONFIG = {
  readStrategy: 'pg',
  writeStrategy: 'pg',
  backupStrategy: 'convex', // バックアップとしてConvexにも書き込み
};
```

### フェーズ4: Convex削除

```bash
# 1. 1週間の観察期間後
# 2. Convexバックアップ停止
# 3. Convexプロジェクト削除
```

---

## 8) やってはいけない地雷

### ❌ 避けるべきパターン

1. **workspace_idのないテーブル**
   - 後でRLS/パーティションが地獄になる

2. **クライアント直書き**
   - 必ずサーバ関数→Outbox→Repo経由にする

3. **Convex固有機能への密結合**
   - 購読やオブザーバビリティを抽象化せずに直使用

4. **自然キー/増分整数ID**
   - ULID/UUIDにして"両DB"で一貫性を保つ

### ✅ 推奨パターン

```typescript
// 良い例: 抽象化されたID生成
export const generateId = (): string => ulid();

// 良い例: workspace_id必須の設計
export interface BaseEntity {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 良い例: 抽象化されたイベント発行
export class DomainEventBus {
  publish(event: DomainEvent): void {
    // 実装に依存しないイベント発行
  }
}
```

---

## 9) 最小スターターキット

### フォルダ構成

```
/domain
  /models          # Zod/JSON Schema
  /ports           # I*Repo.ts
  /services        # ドメインサービス
  /events          # ドメインイベント
/infra
  /convex          # Convex adapters
  /pg              # Drizzle/Prisma adapters, DDL
/events
  /outbox          # schema + writer + consumer
/migrations
  /pg              # SQL, RLS, index, partition plan
  /spec            # RLS/YAML, retention, delete policy
/tests
  /contracts       # 実装間の契約テスト
  /integration     # エンドツーエンドテスト
```

### CI設定

```yaml
# .github/workflows/database-tests.yml
name: Database Contract Tests

on: [push, pull_request]

jobs:
  contract-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run Convex dev
        run: npm run convex:dev &
        
      - name: Setup PostgreSQL
        run: npm run migrate:pg
        
      - name: Run contract tests
        run: npm run test:contracts
        
      - name: Test outbox processing
        run: npm run test:outbox
```

### 運用メトリクス

```typescript
// monitoring/metrics.ts
export const DATABASE_METRICS = {
  replication_lag_seconds: new Gauge({
    name: 'convex_pg_replication_lag_seconds',
    help: 'Lag between Convex and PostgreSQL',
  }),
  
  outbox_backlog_count: new Gauge({
    name: 'outbox_backlog_count',
    help: 'Number of unprocessed outbox events',
  }),
  
  row_count_diff: new Gauge({
    name: 'convex_vs_pg_row_diff',
    help: 'Row count difference between Convex and PostgreSQL',
    labelNames: ['table'],
  }),
};
```

---

## 10) 代替アーキテクチャ選択肢

### A) Convex正 + Outbox影書き（推奨・低コスト）
- ✅ 現在の開発速度維持
- ✅ 常時PostgreSQL練習
- ✅ 切替が容易
- ❌ 初期はConvex依存

### B) PostgreSQL正 + Convexキャッシュ
- ✅ 初期からSQL資産蓄積
- ✅ 最も「安心」
- ❌ Convexの高速開発メリット減
- ❌ 初期開発コスト高

### C) ハイブリッド（重要ドメインのみPostgreSQL）
- ✅ 収益直結部分の安全性
- ✅ 実験部分の高速性
- ❌ 複雑性増大
- ❌ 運用負荷増

**推奨順序**: A → C（成熟に応じて重要ドメインをPostgreSQLに移行）

---

## まとめ（実務アクション）

### 今すぐ実装すべき5つ

1. **リポジトリ抽象化と契約テスト**
   - `ILeadRepo`インターフェイス導入
   - Convex/PostgreSQL両実装の契約テスト

2. **Outboxパターン**
   - 全書き込み操作でOutboxイベント記録
   - 冪等性保証の仕組み

3. **PostgreSQL影レプリカ**
   - Outboxコンシューマーで常時同期
   - ヘルスチェック機構

4. **共通スキーマ管理**
   - Zod等での型定義統一
   - 両DB向けコード生成

5. **移行Runbook**
   - 読む→書くの二段切替手順
   - ロールバック手順

### 期待される効果

- **「Convexの速さ」×「PostgreSQLへいつでも逃げられる安心」**の両取り
- 移行時のダウンタイム最小化
- データ整合性保証
- スケーラビリティ確保

この戦略により、100サービス運用時の技術的リスクを大幅に軽減できます。