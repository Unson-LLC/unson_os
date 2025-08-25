# 環境変数セットアップガイド

## 🚀 クイックスタート

### 1. 共通環境変数のセットアップ
```bash
# リポジトリルートで実行
cp .env.shared .env.local
# .env.local を編集して必要な値を設定
```

### 2. アプリケーション環境変数のセットアップ

#### Portal
```bash
cd apps/portal
cp .env.template .env
cp .env.template .env.local  # ローカル開発用
# .env.local を編集
```

#### LP検証システム
```bash
cd apps/lp-validation
cp .env.template .env
cp .env.template .env.local
# Google Ads認証情報を設定
```

### 3. プロダクトLPのセットアップ
```bash
# 例: AI Coachの場合
cd products/validation/2025-08-003-ai-coach/lp
cp ../../../../products/.env.template .env
# プロダクト固有の値を設定
```

## 📁 ファイル構造と優先順位

```
優先度: 高 → 低
1. apps/*/env.local         # ローカルオーバーライド（最優先）
2. apps/*/.env.production   # 本番環境設定
3. apps/*/.env              # アプリデフォルト
4. .env.local               # モノレポローカル
5. .env.shared              # モノレポ共通（最低優先）
```

## 🔧 アプリケーションでの使用方法

### Next.jsアプリの場合

```typescript
// app/layout.tsx または pages/_app.tsx
import { loadEnv, validateEnv, createAppEnvSchema } from '@unson-os/env-config';
import { z } from 'zod';

// アプリ固有の環境変数スキーマを定義
const appEnvSchema = createAppEnvSchema({
  // Portal固有
  PORTAL_API_VERSION: z.string().default('v1'),
  PORTAL_SESSION_SECRET: z.string().min(32),
  
  // オプショナル
  FEATURES_AUTH: z.boolean().default(true),
});

// 環境変数を読み込んでバリデーション
export function initializeEnv() {
  // 環境変数ファイルを読み込み
  loadEnv({ verbose: process.env.NODE_ENV === 'development' });
  
  // バリデーション実行
  const env = validateEnv(appEnvSchema);
  
  if (!env) {
    throw new Error('Environment validation failed');
  }
  
  return env;
}

// アプリ起動時に実行
const env = initializeEnv();
```

### サービス/CLIツールの場合

```typescript
// services/domain-automation/src/index.ts
import { loadEnv, sharedEnvSchema } from '@unson-os/env-config';
import { z } from 'zod';

// サービス固有のスキーマ
const serviceEnvSchema = sharedEnvSchema.extend({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  VERCEL_TOKEN: z.string(),
  HOSTED_ZONE_ID: z.string(),
});

// 初期化
function init() {
  loadEnv();
  const env = validateEnv(serviceEnvSchema);
  return env;
}

const env = init();
```

## 🔐 機密情報の管理

### レベル分類

| レベル | 種類 | 管理方法 | 例 |
|-------|------|---------|-----|
| L1 | 公開可能 | `.env.shared` にコミット | `NEXT_PUBLIC_APP_NAME` |
| L2 | 内部共有 | `.env.template` に記載 | `CONVEX_URL` |
| L3 | 機密 | `.env.local` のみ | `AWS_SECRET_ACCESS_KEY` |

### 機密情報の取得方法

#### 1. Convex
```bash
# Convexダッシュボード
https://dashboard.convex.dev
# Settings → Deploy Key をコピー
```

#### 2. Google Ads API
```bash
# Google Ads API Center
https://ads.google.com/aw/apicenter
# Tools → API Access → Create credentials
```

#### 3. AWS (Route53)
```bash
# IAMユーザー作成
aws iam create-user --user-name unson-route53
# ポリシーアタッチ（Route53のみ）
aws iam attach-user-policy --user-name unson-route53 \
  --policy-arn arn:aws:iam::aws:policy/AmazonRoute53FullAccess
# アクセスキー作成
aws iam create-access-key --user-name unson-route53
```

#### 4. Vercel
```bash
# Vercelダッシュボード
https://vercel.com/account/tokens
# Create Token → スコープを限定
```

## 🔄 環境別の設定

### 開発環境
```bash
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
LOG_LEVEL=debug
```

### ステージング環境
```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://staging.unson.jp/api
LOG_LEVEL=info
```

### 本番環境
```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.unson.jp
LOG_LEVEL=error
```

## 🐛 デバッグ

### 環境変数の確認
```typescript
import { debugEnv, analyzeEnvUsage } from '@unson-os/env-config';

// 全環境変数を表示（開発時のみ）
if (process.env.NODE_ENV === 'development') {
  debugEnv();
  
  // 特定のキーワードでフィルタ
  debugEnv('google');  // GOOGLE_で始まる変数のみ
  
  // 使用状況を分析
  analyzeEnvUsage();
}
```

### トラブルシューティング

#### 環境変数が読み込まれない
```bash
# 読み込み順序を確認
npx tsx -e "
  import { loadEnv } from '@unson-os/env-config';
  loadEnv({ verbose: true });
"
```

#### バリデーションエラー
```typescript
// エラー詳細を取得
validateEnv(schema, {
  onError: (error) => {
    console.error('Validation errors:', error.issues);
  },
  throwOnError: false
});
```

## 📋 チェックリスト

### 新規アプリ追加時
- [ ] `apps/{app-name}/.env.template` 作成
- [ ] `apps/{app-name}/.gitignore` に `.env.local` 追加
- [ ] README.md にセットアップ手順記載
- [ ] CI/CD環境変数設定

### 新規プロダクト追加時
- [ ] `products/.env.template` をコピー
- [ ] プロダクト固有の値を設定
- [ ] GA/Clarity IDを発行
- [ ] ドメイン設定

### デプロイ時
- [ ] Vercel環境変数設定
- [ ] GitHub Secrets設定
- [ ] 本番用APIキー発行
- [ ] 環境変数バリデーション確認

## 🚨 注意事項

### DO ✅
- `.env.local` は必ず `.gitignore` に追加
- 環境変数は必ずバリデーション
- APIキーは最小権限で発行
- 定期的にキーローテーション

### DON'T ❌
- 機密情報をコミットしない
- ハードコーディングしない
- 本番キーを開発で使わない
- 全権限のAPIキーを使わない