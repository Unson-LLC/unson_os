# Discord参加申請システム セットアップガイド

## 概要
HP → フォーム入力 → アンケート → メール送信 → Discord参加の流れを実装しています。

## 必要なサービス

### 1. Convex（データベース）
- 申請データの保存・管理
- リアルタイムデータ同期

### 2. Resend（メール送信）
- 申請者への招待メール送信
- 管理者への通知メール送信

## セットアップ手順

### 1. Convexのセットアップ

```bash
# Convexプロジェクトを初期化（ブラウザが開きます）
npx convex dev

# 以下の手順を実行：
# 1. Convexアカウントにログイン
# 2. 新規プロジェクト作成
# 3. プロジェクト名を入力
```

Convexダッシュボードから`Deployment URL`をコピーして`.env.local`に追加：
```
NEXT_PUBLIC_CONVEX_URL=https://YOUR_PROJECT.convex.cloud
```

### 2. Resendのセットアップ

1. [Resend](https://resend.com)でアカウント作成
2. APIキーを取得
3. `.env.local`に追加：
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

#### ドメイン認証（本番環境用）
1. Resendダッシュボード → Domains → Add Domain
2. DNSレコードを追加（ドメイン管理画面で）
3. 認証完了を待つ

### 3. 環境変数の設定

`.env.local`ファイルを作成：
```bash
cp .env.local.example .env.local
```

必要な環境変数：
```
# Convex
NEXT_PUBLIC_CONVEX_URL=https://YOUR_PROJECT.convex.cloud

# Resend
RESEND_API_KEY=re_YOUR_API_KEY

# 管理者メール
ADMIN_EMAIL=admin@unson-os.com

# Discord招待リンク（無期限のもの）
DISCORD_INVITE_LINK=https://discord.gg/unsonos
```

### 4. セットアップ確認

```bash
# セットアップ状況を確認
npm run setup:check
```

### 5. 開発サーバーの起動

```bash
# 別々のターミナルで実行
npm run convex:dev  # Convex開発サーバー
npm run dev         # Next.js開発サーバー
```

## Discord側の設定

1. **招待リンクの作成**
   - サーバー設定 → 招待リンク作成
   - 有効期限：無期限
   - 最大使用回数：無制限

2. **ウィジェットの有効化**（オプション）
   - サーバー設定 → ウィジェット
   - 「サーバーウィジェットを有効化」をON

## トラブルシューティング

### Convexが動かない場合
```bash
# Convexを再インストール
npm uninstall convex
npm install convex
npx convex init
```

### メールが送信されない場合
- Resend APIキーが正しいか確認
- ドメイン認証が完了しているか確認（本番環境）
- 開発環境では`resend.com`のテストモードを使用

### データが保存されない場合
- Convex URLが正しいか確認
- `convex dev`が実行中か確認
- スキーマが正しくデプロイされているか確認

## 管理画面

- **Convex**: https://dashboard.convex.dev
- **Resend**: https://resend.com/emails