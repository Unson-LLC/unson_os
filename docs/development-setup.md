# UnsonOS 開発環境セットアップ

## 🏗️ プロジェクト構造

UnsonOSは複数のアプリケーションから構成されています：

```
unson_os/
├── apps/
│   ├── landing/          # ランディングページ (Port 3000)
│   │   ├── .env.local
│   │   ├── .env.example
│   │   └── vercel.json
│   └── management-ui/    # 管理UI (Port 3001)
│       ├── .env.local
│       ├── .env.example
│       └── vercel.json
├── docs/
├── scripts/
│   └── dev-apps.sh      # 両アプリ同時起動
└── ...
```

## 🚀 開発環境起動

### 全アプリ同時起動（推奨）
```bash
npm run dev:apps
```

### 個別起動
```bash
# ランディングページのみ (http://localhost:3000)
npm run dev:landing

# 管理UIのみ (http://localhost:3001)
npm run dev:mgmt
```

## ⚙️ 環境変数設定

### Landing Page (`apps/landing/.env.local`)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_your_api_key
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Management UI (`apps/management-ui/.env.local`)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
GOOGLE_ADS_DEVELOPER_TOKEN=your_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
```

## 🏗️ ビルド

```bash
# 全アプリビルド
npm run build:apps

# 個別ビルド
npm run build:landing
npm run build:mgmt
```

## 🧪 テスト・品質チェック

```bash
# 全アプリLint
npm run lint:apps

# 個別Lint
npm run lint:landing
npm run lint:mgmt
```

## 🚀 デプロイ

各アプリは独立したVercelプロジェクトとしてデプロイされます：

- **Landing Page**: `unson-os-landing.vercel.app`
- **Management UI**: `unson-os-management.vercel.app`

### 環境変数の設定

各Vercelプロジェクトで以下の環境変数を設定：

#### Landing Page
- `RESEND_API_KEY`: メール送信用
- `NEXT_PUBLIC_CONVEX_URL`: バックエンドURL
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: アナリティクス

#### Management UI  
- `NEXT_PUBLIC_CONVEX_URL`: バックエンドURL
- `GOOGLE_ADS_*`: Google Ads API関連

## 🔧 開発時のベストプラクティス

1. **ポート分離**: Landing (3000), Management UI (3001)
2. **環境変数分離**: アプリごとに独立した設定
3. **並行開発**: `npm run dev:apps`で両方同時起動
4. **個別テスト**: 各アプリのテストは独立実行

## 🛠️ トラブルシューティング

### ポート競合
- Landing Pageが3000番ポート使用中の場合、Management UIは3001番を使用
- 他のプロセスがポートを使用している場合は該当プロセスを停止

### 環境変数が読み込まれない
- 各アプリの`.env.local`ファイルが正しい場所に配置されているか確認
- NEXT_PUBLIC_プレフィックスがブラウザ用変数に付いているか確認

### Vercelデプロイエラー
- プロジェクトルートではなく、各アプリディレクトリをVercelプロジェクトとして設定
- 環境変数がVercel管理画面で正しく設定されているか確認