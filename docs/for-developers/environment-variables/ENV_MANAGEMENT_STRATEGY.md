# 環境変数管理戦略

## 📋 現状の問題
- **散在する環境変数**: 各アプリ/サービスごとにバラバラ
- **重複する設定**: 同じ値が複数箇所で定義
- **管理の複雑さ**: どこで何を設定すべきか不明確
- **セキュリティリスク**: 機密情報の管理が統一されていない

## 🏗️ モノレポ環境変数アーキテクチャ

### 階層構造
```
unson_os/
├── .env.shared                 # 共通環境変数（全プロジェクト共有）
├── .env.local                  # ローカル開発用（gitignore）
├── .env.production            # 本番共通設定
│
├── apps/
│   ├── portal/
│   │   ├── .env              # アプリ固有のデフォルト値
│   │   ├── .env.local        # ローカルオーバーライド（gitignore）
│   │   └── .env.production   # 本番環境設定
│   │
│   ├── lp-validation/
│   │   └── ...同様の構造
│   │
│   └── management-ui/
│       └── ...同様の構造
│
├── products/
│   └── validation/
│       └── 2025-08-XXX-{name}/
│           └── lp/
│               ├── .env       # LP固有設定
│               └── .env.local # ローカルオーバーライド
│
└── services/
    └── domain-automation/
        ├── .env              # サービス固有設定
        └── .env.local       # ローカルオーバーライド
```

## 🎯 環境変数の分類と配置

### 1. グローバル共通変数（.env.shared）
```bash
# インフラ基盤
CONVEX_URL=
AWS_REGION=ap-northeast-1
ROOT_DOMAIN=unson.jp

# 共通API
OPENAI_API_KEY=
RESEND_API_KEY=

# 組織設定
ADMIN_EMAIL=admin@unson.jp
DISCORD_SERVER_ID=
```

### 2. アプリケーション固有変数（apps/*/）
```bash
# apps/portal/.env
APP_NAME=Unson Portal
APP_URL=https://portal.unson.jp
FEATURES_ENABLED=auth,docs,products

# apps/lp-validation/.env
APP_NAME=LP Validation System
GOOGLE_ADS_ENABLED=true
MONITORING_INTERVAL=3600
```

### 3. プロダクト/LP固有変数（products/*/）
```bash
# products/validation/2025-08-003-ai-coach/lp/.env
PRODUCT_ID=ai-coach-001
PRODUCT_NAME=AI Coach
GA_MEASUREMENT_ID=G-AICOACH123
CLARITY_PROJECT_ID=aicoach
TARGET_CPA=3000
```

### 4. サービス固有変数（services/*/）
```bash
# services/domain-automation/.env
SERVICE_NAME=Domain Automation
AWS_ACCESS_KEY_ID=    # このサービス専用のIAMキー
VERCEL_TOKEN=          # 権限を限定したトークン
```

## 🔧 実装方法

### 1. 環境変数ローダー作成
```typescript
// lib/env-loader.ts
import { config } from 'dotenv';
import path from 'path';

export function loadEnv() {
  const envFiles = [
    '.env.local',           // 最優先：ローカル設定
    '.env.production',      // 本番環境
    '.env',                 // デフォルト
    '../../.env.local',     // モノレポローカル
    '../../.env.shared',    // モノレポ共通
  ];

  envFiles.forEach(file => {
    config({ path: path.resolve(process.cwd(), file) });
  });
}
```

### 2. 環境変数バリデーター
```typescript
// lib/env-validator.ts
import { z } from 'zod';

const envSchema = z.object({
  // 必須の共通変数
  CONVEX_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // オプショナル
  GOOGLE_ADS_ENABLED: z.boolean().optional(),
});

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error);
    throw new Error('Environment validation failed');
  }
  return parsed.data;
}
```

## 📝 環境変数管理ルール

### DO ✅
1. **階層的管理**: 共通→アプリ→固有の順で管理
2. **型安全**: zodでバリデーション
3. **文書化**: 各.envに説明コメント
4. **最小権限**: サービスごとに必要最小限の権限
5. **暗号化**: 機密情報は暗号化して保存

### DON'T ❌
1. **重複定義**: 同じ値を複数箇所で定義しない
2. **ハードコード**: コード内に直接記述しない
3. **全権限**: 1つのAPIキーに全権限を与えない
4. **コミット**: .env.localは絶対にコミットしない

## 🚀 マイグレーション計画

### Phase 1: 環境変数の棚卸し（1日）
- [ ] 全.envファイルの内容確認
- [ ] 重複の特定と削除
- [ ] 分類（共通/アプリ/固有）

### Phase 2: 新構造への移行（2日）
- [ ] .env.shared作成
- [ ] 各アプリの.env整理
- [ ] env-loaderの実装

### Phase 3: バリデーション追加（1日）
- [ ] zodスキーマ定義
- [ ] 起動時バリデーション
- [ ] エラーハンドリング

### Phase 4: ドキュメント化（1日）
- [ ] 環境変数一覧作成
- [ ] セットアップガイド
- [ ] トラブルシューティング

## 🔒 セキュリティ考慮事項

### 機密情報の管理
```bash
# レベル1: 公開可能
NEXT_PUBLIC_APP_NAME=Unson OS
NEXT_PUBLIC_GA_ID=G-XXX

# レベル2: 内部のみ
CONVEX_URL=https://xxx.convex.cloud
DISCORD_SERVER_ID=123456

# レベル3: 機密（暗号化必須）
AWS_SECRET_ACCESS_KEY=xxx
OPENAI_API_KEY=sk-xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

### 環境別の分離
- **開発**: .env.local（個人設定）
- **ステージング**: .env.staging（テスト用本番相当）
- **本番**: .env.production（実環境）

## 🔄 CI/CD統合

### GitHub Actions
```yaml
env:
  # 共通環境変数
  NODE_ENV: production
  
  # Secrets から取得
  CONVEX_URL: ${{ secrets.CONVEX_URL }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
```

### Vercel
```bash
# vercel env pull で環境変数取得
vercel env pull .env.production

# プロジェクトごとに設定
vercel env add PRODUCT_ID production
```

## 📊 環境変数監査

### チェックリスト
- [ ] 未使用の環境変数削除
- [ ] APIキーの有効期限確認
- [ ] アクセス権限の最小化
- [ ] ローテーション計画

## 🎯 最終目標

1. **統一管理**: 1箇所で全体を把握
2. **自動化**: 環境変数の自動セットアップ
3. **安全性**: 機密情報の適切な保護
4. **拡張性**: 200サービスでも管理可能