# Google Ads API 認証設定ガイド

## 必要な認証情報

1. **Developer Token**
   - [Google Ads API Center](https://ads.google.com/aw/apicenter) で取得
   - 「APIアクセス」→「開発者トークン」
   - テスト用トークンから開始可能

2. **OAuth 2.0 認証情報**
   - [Google Cloud Console](https://console.cloud.google.com) で作成
   - 新規プロジェクト作成 → APIとサービス → 認証情報
   - OAuth 2.0 クライアントID作成

3. **Refresh Token**
   - OAuth 2.0フローで取得
   - 永続的なアクセス権限

## 認証フロー

### ステップ1: Google Cloud Consoleでプロジェクト作成

1. https://console.cloud.google.com にアクセス
2. 新規プロジェクト作成
3. Google Ads APIを有効化

### ステップ2: OAuth 2.0クライアント作成

1. APIとサービス → 認証情報
2. 「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類：「ウェブアプリケーション」
4. 承認済みリダイレクトURI：`http://localhost:8080`

### ステップ3: Refresh Token取得

```bash
# 認証URLを生成
https://accounts.google.com/o/oauth2/auth?
client_id=YOUR_CLIENT_ID&
redirect_uri=http://localhost:8080&
scope=https://www.googleapis.com/auth/adwords&
response_type=code&
access_type=offline&
approval_prompt=force
```

### ステップ4: 認証コードをRefresh Tokenに交換

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:8080" \
  -d "grant_type=authorization_code"
```

## 簡易認証ツール

Node.jsで認証ヘルパーを作成します。