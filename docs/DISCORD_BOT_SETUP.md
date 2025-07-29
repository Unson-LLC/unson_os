# Discord Bot 設定ガイド

## Discord Bot Token の取得手順

### 1. Discord Developer Portal にアクセス
1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. Discordアカウントでログイン

### 2. アプリケーションの作成
1. 「New Application」ボタンをクリック
2. アプリケーション名を入力（例：「Unson OS Bot」）
3. 利用規約に同意して「Create」

### 3. Bot の作成
1. 左側メニューから「Bot」を選択
2. 「Reset Token」ボタンをクリック
3. 表示されたトークンをコピー（一度しか表示されません！）

### 4. Bot の権限設定
1. 「Privileged Gateway Intents」セクションで必要な権限を有効化：
   - MESSAGE CONTENT INTENT（メッセージ読み取りが必要な場合）
   - SERVER MEMBERS INTENT（メンバー管理が必要な場合）

### 5. Bot をサーバーに招待
1. 左側メニューから「OAuth2」→「URL Generator」を選択
2. Scopes で「bot」にチェック
3. Bot Permissions で必要な権限にチェック：
   - **CREATE_INSTANT_INVITE**（招待リンク作成に必須）
   - VIEW_CHANNEL
   - SEND_MESSAGES（必要に応じて）
4. 生成されたURLをコピーしてブラウザで開く
5. 招待したいサーバーを選択して「認証」

### 6. チャンネルIDの取得
1. Discord設定 → 詳細設定 → 開発者モードをON
2. 招待を作成したいチャンネルを右クリック
3. 「IDをコピー」を選択

## 環境変数の設定

`.env.local` に以下を追加：

```env
# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here
```

## セキュリティ注意事項

- **Bot Token は絶対に公開しない**（GitHubにpushしない）
- トークンが漏洩した場合は即座にリセット
- 必要最小限の権限のみ付与する
- Rate Limit に注意（15分で50招待が上限）

## トラブルシューティング

### 「Missing Permissions」エラー
- BotにCREATE_INSTANT_INVITE権限があるか確認
- 対象チャンネルでBotがVIEW_CHANNEL権限を持っているか確認

### 「Invalid Token」エラー
- トークンが正しくコピーされているか確認
- 「Bot 」プレフィックスが不要（環境変数には生のトークンのみ）

### Rate Limit エラー
- 同一チャンネルでの招待作成は15分で50回まで
- 複数チャンネルに分散するか、OAuth2方式を検討