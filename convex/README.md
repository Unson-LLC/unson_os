# Convex バックエンド設計書

## 🏗️ データベース設計

### 主要テーブル

#### 1. products（プロダクト情報）
```typescript
{
  _id: Id<"products">
  name: string                    // プロダクト名
  category: string                // カテゴリ
  description: string             // 短い説明
  longDescription?: string        // 詳細説明
  price: string                   // 価格表示
  users: string                   // ユーザー数表示
  rating: number                  // レーティング（1-5）
  status: "active" | "beta" | "coming-soon"
  features: string[]              // 機能リスト
  detailedFeatures?: Array<{      // 詳細機能
    icon: string
    title: string
    description: string
  }>
  plans?: Array<{                 // 料金プラン
    name: string
    price: string
    features: string[]
    popular?: boolean
  }>
  techSpecs?: {                   // 技術仕様
    api: string
    uptime: string
    security: string
    integrations: string[]
  }
  reviews?: Array<{               // レビュー
    user: string
    rating: number
    comment: string
    date: string
  }>
  createdAt: number
  updatedAt: number
}
```

#### 2. waitlist（ウェイトリスト）
```typescript
{
  _id: Id<"waitlist">
  email: string                   // メールアドレス（ユニーク）
  name: string                    // 名前
  role?: string                   // 職種・役割
  referralSource?: string         // 流入元
  createdAt: number
}
```

#### 3. contacts（お問い合わせ）
```typescript
{
  _id: Id<"contacts">
  name: string                    // 名前
  email: string                   // メールアドレス
  company?: string                // 会社名
  phone?: string                  // 電話番号
  type: string                    // 問い合わせ種別
  message: string                 // メッセージ内容
  status: "new" | "in_progress" | "resolved" | "closed"
  assignedTo?: Id<"team_members"> // 担当者
  createdAt: number
  updatedAt: number
}
```

#### 4. productRequests（プロダクトリクエスト）
```typescript
{
  _id: Id<"productRequests">
  name: string                    // 申請者名
  email: string                   // メールアドレス
  productTitle: string            // 希望プロダクト名
  category: string                // カテゴリ
  description: string             // 説明
  priority: "low" | "medium" | "high"
  status: "submitted" | "reviewing" | "approved" | "in_development" | "completed" | "rejected"
  estimatedDevelopmentTime?: string
  assignedTeam?: string
  createdAt: number
  updatedAt: number
}
```

#### 5. careerApplications（採用応募）
```typescript
{
  _id: Id<"careerApplications">
  name: string                    // 氏名
  email: string                   // メールアドレス
  position: string                // 希望ポジション
  experience: string              // 経験・スキル
  coverLetter: string             // 志望動機
  portfolio?: string              // ポートフォリオURL
  status: "submitted" | "screening" | "interview" | "rejected" | "hired"
  resumeFileId?: Id<"_storage">   // 履歴書ファイル
  notes?: string                  // 選考メモ
  createdAt: number
  updatedAt: number
}
```

### インデックス設計

#### 検索・フィルター最適化
```typescript
// プロダクト関連
products.index("by_category", ["category"])
products.index("by_status", ["status"])  
products.index("by_rating", ["rating"])

// ウェイトリスト
waitlist.index("by_email", ["email"])        // 重複チェック
waitlist.index("by_created_at", ["createdAt"]) // 時系列順

// お問い合わせ
contacts.index("by_type", ["type"])
contacts.index("by_status", ["status"])
contacts.index("by_created_at", ["createdAt"])

// プロダクトリクエスト
productRequests.index("by_category", ["category"])
productRequests.index("by_status", ["status"])
productRequests.index("by_priority", ["priority"])

// 採用応募
careerApplications.index("by_position", ["position"])
careerApplications.index("by_status", ["status"])
```

## 📊 API関数設計

### Products API
```typescript
// 読み取り（Query）
api.products.list({ category?, status?, limit? })
api.products.getById({ id })
api.products.getByCategory({ category })
api.products.getStats({ category? })
api.products.getRelated({ productId, limit? })
api.products.search({ query, category?, limit? })

// 書き込み（Mutation）  
api.products.create({ name, category, description, ... })
api.products.update({ id, name?, category?, ... })
```

### Waitlist API
```typescript
// 読み取り
api.waitlist.list({ limit?, offset? })
api.waitlist.getStats()
api.waitlist.checkEmail({ email })

// 書き込み
api.waitlist.register({ email, name, role?, referralSource? })
```

### Contacts API
```typescript
// 読み取り
api.contacts.list({ status?, type?, limit? })
api.contacts.getById({ id })
api.contacts.getStats()

// 書き込み
api.contacts.create({ name, email, company?, phone?, type, message })
api.contacts.updateStatus({ id, status, assignedTo? })
```

### Product Requests API
```typescript
// 読み取り
api.productRequests.list({ status?, category?, priority?, limit? })
api.productRequests.getById({ id })
api.productRequests.getStats()
api.productRequests.getPopularCategories()

// 書き込み
api.productRequests.create({ name, email, productTitle, category, description })
api.productRequests.update({ id, status?, priority?, estimatedDevelopmentTime?, assignedTeam? })
```

### Careers API
```typescript
// 読み取り
api.careers.list({ position?, status?, limit? })
api.careers.getById({ id })
api.careers.getStats()
api.careers.getPopularPositions()

// 書き込み
api.careers.apply({ name, email, position, experience, coverLetter, portfolio? })
api.careers.updateStatus({ id, status, notes? })
```

## 🔄 データ移行計画

### Phase 1: 初期データ投入
```typescript
// モックデータからConvexへの移行
const migrateProducts = async () => {
  // src/data/products.ts → Convex products テーブル
  const productsData = require('../src/data/products.ts');
  
  for (const product of productsData.products) {
    await api.products.create({
      name: product.name,
      category: product.category,
      description: product.description,
      // ... 他のフィールド
    });
  }
};
```

### Phase 2: API エンドポイント置き換え
```typescript
// src/app/api/waitlist/route.ts → api.waitlist.register()
// src/app/api/contact/route.ts → api.contacts.create()
// src/app/api/careers/route.ts → api.careers.apply()
// src/app/api/product-request/route.ts → api.productRequests.create()
```

### Phase 3: フロントエンド統合
```typescript
// useConvex フックの利用
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const ProductsList = () => {
  const products = useQuery(api.products.list, { category: "全て" });
  const createProduct = useMutation(api.products.create);
  
  // ...
};
```

## 🔒 セキュリティ設計

### 認証・認可（将来実装）
```typescript
// ユーザー認証
users: defineTable({
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("admin"), v.literal("user")),
  isActive: v.boolean(),
})

// 管理者限定関数
export const adminOnlyFunction = mutation({
  args: { ... },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", identity.email))
      .first();
      
    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }
    
    // 管理者限定処理
  },
});
```

### データ検証
```typescript
// 入力値検証
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
};

// 重複チェック
const checkDuplicateEmail = async (ctx: any, email: string) => {
  const existing = await ctx.db
    .query("waitlist")
    .withIndex("by_email", q => q.eq("email", email))
    .first();
    
  if (existing) {
    throw new Error("Email already registered");
  }
};
```

## 📈 パフォーマンス最適化

### インデックス活用
```typescript
// 効率的なクエリ
// ❌ 非効率: フルスキャン
const products = await ctx.db.query("products").collect();
const filtered = products.filter(p => p.category === "生産性");

// ✅ 効率的: インデックス利用
const products = await ctx.db
  .query("products")
  .withIndex("by_category", q => q.eq("category", "生産性"))
  .collect();
```

### ページネーション
```typescript
export const listWithPagination = query({
  args: { 
    cursor: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    let q = ctx.db.query("products").order("desc");
    
    if (args.cursor) {
      q = q.after(args.cursor);
    }
    
    const results = await q.take(limit + 1);
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, -1) : results;
    
    return {
      items,
      hasMore,
      nextCursor: hasMore ? results[limit]._id : null,
    };
  },
});
```

## 🚀 デプロイメント

### 本番環境設定
```bash
# Convex プロジェクト作成
npx convex deploy --cmd

# 環境変数設定
CONVEX_URL=https://your-production-project.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://your-production-project.convex.cloud
```

### CI/CD パイプライン
```yaml
# .github/workflows/deploy.yml
name: Deploy to Convex
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx convex deploy --cmd
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
```

## ⚠️ 重要な注意事項: Node.js バージョン管理

### Vercel Node 18 廃止とConvex Node Actionsの制約

**問題**: 
- Vercel: 2025年8月1日にNode 18サポート廃止予定
- Convex Node Actions: Node 18固定（AWS Lambda制約）

**影響分析**:

| フェーズ | 実行環境 | 必要バージョン | 影響 |
|---------|----------|----------------|------|
| ビルド/デプロイ | Vercel CI | Node 20 (推奨) | ✅ 問題なし |
| フロントエンド実行 | Vercel Edge/Functions | Node 20 | ✅ 問題なし |
| Node Actions実行(本番) | Convex Cloud (AWS Lambda) | Node 18固定 | ⚠️ Convex側で管理 |
| ローカル開発 | 開発マシン | Node 18必須 | ⚠️ nvm必要 |

**結論**: **リスクはほぼない**が、運用で2つの注意点あり

### 対策1: nvm による Node.js バージョン管理

#### .nvmrc ファイルの作成
```bash
# プロジェクトルートに作成
echo "18.18.0" > .nvmrc
```

#### nvm 切り替え運用
```bash
# Convex開発時（Node Actions使用）
nvm use 18.18.0
npx convex dev

# Next.js開発時（通常開発）
nvm use 20.10.0
npm run dev
```

#### package.json に Node バージョン明記
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "volta": {
    "node": "18.18.0"
  }
}
```

### 対策2: 開発環境の分離

#### オプション1: フォルダ分離 (推奨)
```bash
# Convex開発用
cd /path/to/unson_os_convex
nvm use 18.18.0
npx convex dev

# Next.js開発用 
cd /path/to/unson_os_frontend
nvm use 20.10.0
npm run dev
```

#### オプション2: シェルスクリプト自動化
```bash
#!/bin/bash
# scripts/dev-convex.sh
echo "Switching to Node 18 for Convex development..."
nvm use 18.18.0
npx convex dev

# scripts/dev-nextjs.sh  
echo "Switching to Node 20 for Next.js development..."
nvm use 20.10.0
npm run dev
```

### 対策3: 将来のアップグレード準備

#### Convex Node Actions のアップグレード監視
```bash
# 定期的にチェック
npx convex --version

# リリースノート確認
# https://docs.convex.dev/changelog
```

#### Node 18 EOL への対応準備
- **Node 18 EOL**: 2025年4月30日
- **Convex予想アップグレード**: 2025年Q2-Q3
- **対応**: Convex公式のNode 20移行発表を待ち、速やかに対応

### 対策4: チーム開発での運用ルール

#### 開発者向けセットアップガイド
```markdown
# 開発環境セットアップ

## 必須ツール
1. nvm インストール
2. Node 18.18.0 インストール: `nvm install 18.18.0`
3. Node 20.10.0 インストール: `nvm install 20.10.0`

## 開発フロー
1. Convex開発: `nvm use 18 && npx convex dev`
2. Next.js開発: `nvm use 20 && npm run dev`
3. コミット前: 両バージョンでテスト実行
```

#### VS Code / Cursor 設定
```json
// .vscode/settings.json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.env.osx": {
    "NVM_DIR": "$HOME/.nvm"
  },
  "eslint.nodePath": "${workspaceFolder}/node_modules"
}
```

### 緊急時の代替案

#### Node Actions を使わない設計への変更
```typescript
// ❌ Node Actions使用（Node 18必須）
"use node";
export const processPayment = action({...});

// ✅ 通常のmutation使用（Node 20対応）
export const processPayment = mutation({...});
```

#### 外部サービスへの移行
- **Stripe**: 決済処理
- **SendGrid**: メール送信  
- **Cloudinary**: 画像処理
- **Vercel Edge Functions**: 軽量な外部API呼び出し

**まとめ**: Node Actionsは本番でConvex側のインフラで動くため、Vercelの変更による直接的影響はなし。ただし、ローカル開発でのnvm運用とConvexの将来アップグレードへの準備が重要。

---

この設計により、Unson OSはスケーラブルでリアルタイムなバックエンドシステムを持つことになります。