# 現在のLP（src/）から管理ダッシュボード実装への移行計画

## 現状の問題

現在 `src/` フォルダにはUnsonOSのランディングページ（マーケティングサイト）が入っており、100個のSaaS管理ダッシュボードを実装するスペースがない。

## 移行戦略の選択肢

### 🏆 Option A: apps/構成に移行（推奨）

#### 理由
- LPと管理UIの責務を明確に分離
- 将来的なモバイルアプリ等の追加が容易
- チーム開発時の影響範囲が限定
- 独立したデプロイ・設定が可能

#### 移行手順

##### Phase 1: 現在のLPをapps/landingに移動

```bash
# 1. appsディレクトリ作成
mkdir -p apps/landing

# 2. 現在のsrcをapps/landingに移動
mv src apps/landing/src
mv public apps/landing/public

# 3. LP用の設定ファイルを移動
mv next.config.js apps/landing/
mv tailwind.config.js apps/landing/
mv tsconfig.json apps/landing/
mv middleware.ts apps/landing/

# 4. LP用のpackage.json作成
# （後述の内容で作成）
```

##### Phase 2: ルートレベル設定の調整

```json
// package.json (root)
{
  "name": "unson-os-monorepo",
  "private": true,
  "scripts": {
    "dev:landing": "cd apps/landing && npm run dev",
    "dev:dashboard": "cd apps/management-ui && npm run dev",
    "build:landing": "cd apps/landing && npm run build",
    "build:dashboard": "cd apps/management-ui && npm run build"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

```json
// apps/landing/package.json
{
  "name": "@unson-os/landing",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    // 既存のLP依存関係をそのまま
  }
}
```

##### Phase 3: 管理UIの新規作成

```bash
# 5. 管理UI用のディレクトリ作成
mkdir -p apps/management-ui/src

# 6. 管理UI用のpackage.json作成
# （後述）
```

### Option B: src/内にダッシュボードを追加（非推奨）

現在のLPと並存させる構成。混在により保守性が悪化するため推奨しない。

### Option C: LPを別リポジトリに移動（非推奨）

戦略ドキュメントとマーケティングサイトの分離により、一貫性の維持が困難。

## 推奨移行後の構成

```
unson_os/                           # 🌟 戦略＋実装の統合リポジトリ
├── docs/                           # 戦略・設計ドキュメント
├── playbooks/                      # プレイブック定義  
├── scripts/                        # 開発・運用スクリプト
├── convex/                         # DB（LP+管理UI共用）
│
├── apps/                           # アプリケーション層
│   ├── landing/                    # 🔄 UnsonOS LP（現在のsrc）
│   │   ├── src/
│   │   │   ├── app/                # 既存のLP構成
│   │   │   ├── components/
│   │   │   └── lib/
│   │   ├── package.json            # LP用依存関係
│   │   └── next.config.js          # LP用設定
│   │
│   └── management-ui/              # 🆕 SaaS管理ダッシュボード
│       ├── src/
│       │   ├── app/                # フェーズ別管理画面
│       │   │   ├── (dashboard)/    # 統合ダッシュボード
│       │   │   ├── saas/           # SaaS管理
│       │   │   ├── gates/          # Gate承認
│       │   │   ├── phases/         # フェーズ別管理
│       │   │   └── ai-monitoring/  # AI監視・教育
│       │   ├── components/         # 管理UI専用コンポーネント
│       │   │   ├── dashboard/      # ダッシュボード系
│       │   │   ├── phases/         # フェーズ別コンポーネント
│       │   │   ├── gates/          # Gate承認系
│       │   │   └── ai/             # AI監視系
│       │   └── lib/                # 管理UI専用ロジック
│       ├── package.json            # 管理UI用依存関係
│       └── next.config.js          # 管理UI用設定
│
├── packages/                       # 共有パッケージ
│   ├── shared-types/               # 型定義共有
│   ├── ui-components/              # UIコンポーネント共有
│   └── phase-logic/                # フェーズロジック共有
│
├── package.json                    # ワークスペース管理
└── pnpm-workspace.yaml             # pnpm設定
```

## 技術的考慮事項

### 1. URL設計

```
# 現在
unsonos.app/                # LP
unsonos.app/docs/           # ドキュメント
unsonos.app/products/       # プロダクト紹介

# 移行後
unsonos.app/                # LP（apps/landing）
unsonos.app/docs/           # ドキュメント（apps/landing）
unsonos.app/dashboard/      # 管理ダッシュボード（apps/management-ui）
# または
dashboard.unsonos.app/      # 管理ダッシュボード（サブドメイン）
```

### 2. 認証・権限設計

```typescript
// 共有認証ロジック
interface User {
  id: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: {
    canViewDashboard: boolean;
    canApproveGates: boolean;
    canEditPlaybooks: boolean;
  };
}

// LP用認証（軽量）
interface LPUser {
  email: string;
  waitlistStatus: 'pending' | 'approved';
}
```

### 3. データベース共有

```typescript
// convex/schema.ts（共通）
export default defineSchema({
  // LP用テーブル
  waitlist: defineTable({
    email: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"))
  }),
  
  // 管理UI用テーブル
  saas: defineTable({
    name: v.string(),
    phase: v.union(
      v.literal("market-research"),
      v.literal("landing-validation"),
      v.literal("mvp-development"),
      v.literal("monetization"),
      v.literal("scale")
    ),
    kpis: v.object({
      // フェーズ別KPI
    })
  }),
  
  // Gate承認用テーブル
  gates: defineTable({
    saasId: v.id("saas"),
    type: v.union(
      v.literal("phase-gate"),
      v.literal("approval-gate")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    )
  })
});
```

### 4. ビルド・デプロイ戦略

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-landing:
    if: contains(github.event.head_commit.modified, 'apps/landing/')
    runs-on: ubuntu-latest
    steps:
      - name: Deploy LP
        run: |
          cd apps/landing
          npm run build
          # Vercel deployment

  deploy-dashboard:
    if: contains(github.event.head_commit.modified, 'apps/management-ui/')
    runs-on: ubuntu-latest  
    steps:
      - name: Deploy Dashboard
        run: |
          cd apps/management-ui
          npm run build
          # Dashboard deployment
```

## 移行の実行手順

### Step 1: バックアップ作成

```bash
# 現在の状態をバックアップ
git checkout -b backup/current-lp-structure
git commit -am "Backup: Current LP structure before migration"
git push -u origin backup/current-lp-structure
```

### Step 2: 段階的移行

```bash
# 1. 新ブランチ作成
git checkout -b feature/migrate-to-apps-structure

# 2. ディレクトリ構造作成
mkdir -p apps/landing
mkdir -p apps/management-ui
mkdir -p packages/shared-types

# 3. 現在のsrcを移動
git mv src apps/landing/src
git mv public apps/landing/public
git mv next.config.js apps/landing/
git mv tailwind.config.js apps/landing/
git mv tsconfig.json apps/landing/

# 4. 新しい設定ファイル作成
# （package.json, pnpm-workspace.yaml等）

# 5. 管理UIの基本構造作成
# （後の実装フェーズで）
```

### Step 3: 動作確認

```bash
# LP動作確認
cd apps/landing
npm install
npm run dev  # localhost:3000

# 管理UI動作確認（基本構造のみ）
cd apps/management-ui
npm install  
npm run dev  # localhost:3001
```

### Step 4: CI/CD更新

- GitHub Actions の更新
- Vercel設定の更新
- 環境変数の整理

## 移行スケジュール

| フェーズ | 期間 | 作業内容 |
|---------|------|----------|
| **Phase 1** | 1週間 | LP移行・動作確認 |
| **Phase 2** | 2週間 | 管理UI基本構造構築 |
| **Phase 3** | 1週間 | CI/CD・デプロイ設定 |
| **Phase 4** | 4-6週間 | 管理UI本格実装 |

## リスク管理

### 想定リスク
1. **LP動作不良**: 移行時にLPが動かなくなる
2. **SEO影響**: URL構造変更によるSEO劣化
3. **開発効率低下**: 初期の複雑性増加

### 対策
1. **段階的移行**: 一つずつ確実に移行
2. **リダイレクト設定**: 既存URLの維持
3. **十分なテスト**: 各フェーズでの動作確認

## 結論

**推奨**: Option A（apps/構成移行）を採用

- 現在のLPを `apps/landing` に移動
- 新しい管理UIを `apps/management-ui` に作成  
- モノレポ構成で統合管理
- 段階的な実装・デプロイが可能

これにより、戦略ドキュメントと両方の実装を一つのリポジトリで効率的に管理できる。