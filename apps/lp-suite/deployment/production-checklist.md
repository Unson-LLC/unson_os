# LP検証システム 本番環境デプロイチェックリスト

## 📋 デプロイ前チェックリスト

### 🔧 システム構成
- [x] Convex Database スキーマ設計完了
- [x] Convex Cron Jobs 設定完了（4時間/24時間サイクル）
- [x] Google Ads API認証・接続テスト完了
- [x] OpenAI API統合完了
- [x] Discord通知機能実装完了

### 🏗️ アプリケーション構成
- [x] Next.js 14.0.4 アプリケーション構築
- [x] TypeScript型安全性確保
- [x] Tailwind CSS スタイリング完了
- [x] レスポンシブデザイン対応

### 🧪 テスト・品質保証
- [x] t_wada式TDD実装（Red-Green-Refactor）
- [x] 単体テスト（Vitest）カバレッジ確保
- [x] 統合テスト完了
- [x] エラーハンドリング実装
- [x] TypeScript型チェック通過

### 🔐 セキュリティ
- [ ] 環境変数の適切な設定
  - `GITHUB_TOKEN`
  - `GOOGLE_ADS_CLIENT_ID`
  - `GOOGLE_ADS_CLIENT_SECRET`
  - `OPENAI_API_KEY`
  - `DISCORD_WEBHOOK_URL`
- [ ] API キーの安全な管理
- [ ] HTTPS通信の強制
- [ ] CORS設定の適切な構成

### 📊 監視・ログ
- [ ] アプリケーションログ設定
- [ ] エラー監視（Sentry等）
- [ ] パフォーマンス監視
- [ ] ヘルスチェックエンドポイント

### 🚀 デプロイメント
- [ ] Vercel/Netlifyデプロイ設定
- [ ] 環境別設定管理
- [ ] ドメイン設定
- [ ] CDN設定

## 🔧 環境変数設定

### 必須環境変数
```bash
# GitHub統合
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_OWNER=Unson-LLC
GITHUB_REPO=unson_os

# Google Ads API
GOOGLE_ADS_CLIENT_ID=xxxxxxxxxx
GOOGLE_ADS_CLIENT_SECRET=xxxxxxxxxx
GOOGLE_ADS_REFRESH_TOKEN=xxxxxxxxxx
GOOGLE_ADS_DEVELOPER_TOKEN=xxxxxxxxxx

# OpenAI API
OPENAI_API_KEY=sk-xxxxxxxxxx

# Discord通知
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx

# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
CONVEX_DEPLOY_KEY=xxxxxxxxxx
```

### オプション環境変数
```bash
# カスタムWebhook
WEBHOOK_URL=https://your-webhook-endpoint.com

# 監視・ログ
SENTRY_DSN=https://xxxxxxxxxx@sentry.io/xxxxxx
LOG_LEVEL=info

# パフォーマンス
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX
```

## 📦 本番ビルド確認

### ビルドコマンド実行
```bash
cd /apps/lp-validation
npm run build
npm run start
```

### 型チェック
```bash
npm run type-check
```

### Lint確認
```bash
npm run lint
```

### テスト実行
```bash
npm test
```

## 🌐 デプロイ手順

### 1. Vercelデプロイ（推奨）
```bash
# Vercel CLI インストール
npm i -g vercel

# プロジェクトデプロイ
vercel --prod
```

### 2. 環境変数設定
```bash
# Vercel環境変数設定
vercel env add GITHUB_TOKEN
vercel env add GOOGLE_ADS_CLIENT_ID
vercel env add OPENAI_API_KEY
# 他の必須変数も同様に設定
```

### 3. カスタムドメイン設定
```bash
# ドメイン追加
vercel domains add lp-validation.unson-os.com
```

## 🔍 デプロイ後確認事項

### 動作確認
- [ ] アプリケーション正常起動
- [ ] ダッシュボード表示確認
- [ ] セッション作成機能
- [ ] メトリクス表示機能
- [ ] レポート生成機能
- [ ] PR自動作成機能

### API連携確認
- [ ] Convex Database接続
- [ ] Google Ads API接続
- [ ] OpenAI API接続
- [ ] GitHub API接続
- [ ] Discord通知機能

### パフォーマンス確認
- [ ] ページ読み込み速度（< 3秒）
- [ ] Core Web Vitals指標
- [ ] メモリ使用量
- [ ] API応答時間

## 📈 監視設定

### Vercel Analytics設定
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // Vercel Analytics有効化
  async rewrites() {
    return [
      {
        source: '/analytics/:path*',
        destination: 'https://va.vercel-analytics.com/:path*',
      },
    ];
  },
};
```

### ヘルスチェックエンドポイント
```typescript
// /api/health
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
}
```

## 🚨 緊急時対応

### ロールバック手順
```bash
# 前回のデプロイに戻す
vercel rollback
```

### 緊急停止
```bash
# デプロイメント無効化
vercel --prod --env MAINTENANCE_MODE=true
```

### 監視アラート設定
- エラー率 > 5%
- 応答時間 > 10秒
- ダウンタイム検知

## 📚 ドキュメント

### 運用マニュアル
- [システム監視ガイド](./monitoring-guide.md)
- [トラブルシューティング](./troubleshooting.md)
- [API仕様書](./api-documentation.md)

### 開発者向け
- [開発環境構築](../README.md)
- [テスト実行方法](./testing-guide.md)
- [デバッグガイド](./debugging-guide.md)

## ✅ 完了確認

- [ ] 全チェック項目完了
- [ ] ステークホルダー承認取得
- [ ] 運用チーム引き継ぎ完了
- [ ] 本番環境デプロイ実行

---

**デプロイ責任者**: [担当者名]
**デプロイ日時**: [YYYY-MM-DD HH:MM JST]
**承認者**: [承認者名]