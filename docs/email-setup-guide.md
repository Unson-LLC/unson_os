# メール送信設定ガイド

## 概要
Unson OSプロジェクトでは、メール送信に[Resend](https://resend.com/)を使用しています。
送信元アドレスは`noreply@unson.jp`に設定されています。

## 環境変数の設定

### 必要な環境変数
`.env.local`ファイルに以下の環境変数を設定してください：

```bash
# Resend API Key（Resendダッシュボードから取得）
RESEND_API_KEY=re_YOUR_API_KEY

# メール送信元アドレス
RESEND_FROM_EMAIL=noreply@unson.jp

# 管理者メールアドレス（通知を受け取るアドレス）
ADMIN_EMAIL=admin@unson.jp
```

### 設定手順

1. **Resendアカウントの作成**
   - [Resend](https://resend.com/)にアクセスしてアカウントを作成
   - ダッシュボードからAPIキーを取得

2. **ドメインの検証**
   - Resendダッシュボードで`unson.jp`ドメインを追加
   - DNSレコードを設定してドメインを検証
   - 必要なDNSレコード：
     - SPFレコード
     - DKIMレコード
     - Return-Pathレコード（推奨）

3. **環境変数の設定**
   - `.env.local.example`をコピーして`.env.local`を作成
   - 上記の環境変数を設定

## 使用箇所

現在、メール送信は以下の機能で使用されています：

### Discord参加申請（実装済み）
- ファイル: `/src/app/api/discord-join/route.ts`
- 送信内容:
  - 申請者へ: Discord招待リンクを含む承認メール
  - 管理者へ: 新規申請の通知メール

### 今後実装予定
- お問い合わせフォーム（`/api/contact`）
- ウェイトリスト登録（`/api/waitlist`）
- 採用応募（`/api/careers`）

## テスト方法

1. **ローカル環境でのテスト**
   ```bash
   npm run dev
   ```

2. **メール送信のテスト**
   - Discord参加フォームから申請を送信
   - Resendダッシュボードでメール送信ログを確認

## トラブルシューティング

### メールが送信されない場合
1. APIキーが正しく設定されているか確認
2. ドメインが検証されているか確認
3. Resendダッシュボードでエラーログを確認

### 開発環境での注意点
- 開発環境では実際のメール送信を無効化することも可能
- `RESEND_API_KEY`を設定しない場合、メール送信はスキップされます