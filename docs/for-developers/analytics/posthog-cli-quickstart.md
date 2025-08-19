# PostHog CLI クイックスタート

## 🚀 新規LP作成時の自動PostHog設定

新しいLPサービスにPostHogアナリティクスを1コマンドで設定できます。

### 基本的な使い方

```bash
# 新しいLPサービス作成
npx create-next-app services/ai-writer --typescript --tailwind --app

# PostHog設定を自動追加
node scripts/setup-posthog-for-new-lp.js ai-writer
```

### 実行例

```console
$ node scripts/setup-posthog-for-new-lp.js ai-writer

📊 PostHog設定を ai-writer に追加します...
1️⃣ PostHog SDKをインストール中...
✅ SDKインストール完了
✅ PostHogProvider作成完了
✅ PostHogAnalytics作成完了
✅ 環境変数ファイル作成完了

📝 最後の手動ステップ:
services/ai-writer/src/app/layout.tsx を以下のように更新してください:
```

### 自動で設定される内容

- ✅ `posthog-js` と `posthog-node` SDKインストール
- ✅ PostHogProviderコンポーネント生成
- ✅ PostHogAnalyticsコンポーネント生成
- ✅ 環境変数（.env.local）設定
- ✅ Vercel環境変数コマンド生成

### 手動で行う作業（1ステップのみ）

`layout.tsx`の更新：

```typescript
import PostHogProvider from '@/components/Analytics/PostHogProvider'
import PostHogAnalytics from '@/components/Analytics/PostHogAnalytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PostHogProvider>
          {children}
          <PostHogAnalytics serviceName="ai-writer" />
        </PostHogProvider>
      </body>
    </html>
  )
}
```

### デプロイ

```bash
# Vercel環境変数設定（スクリプトが出力するコマンドをコピペ）
printf "phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production

# デプロイ
vercel --prod
```

## ✅ 完了まで5分

1. **1分**: スクリプト実行
2. **2分**: layout.tsx手動更新
3. **2分**: Vercel環境変数設定＆デプロイ

**即座にPostHogダッシュボードでイベント確認可能！**

---

**関連ドキュメント**: [詳細セットアップガイド](./new-lp-posthog-setup.md)