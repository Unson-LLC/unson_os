# Google Service Account Configuration

## 📋 設定済み情報

### Google Cloud Project
- **Project ID**: `unsonos`
- **Project Name**: unsonos

### Service Account
- **Name**: unson-analytics-reader
- **Email**: `unson-analytics-reader@unsonos.iam.gserviceaccount.com`
- **Client ID**: 103291902423888455741

### 必要な設定

#### Google Analytics側
このサービスアカウントをGoogle Analytics 4プロパティに追加する必要があります：

1. [Google Analytics](https://analytics.google.com/) → **管理**
2. **プロパティアクセス管理** → **+** → **ユーザーを追加**
3. メールアドレス: `unson-analytics-reader@unsonos.iam.gserviceaccount.com`
4. 役割: **閲覧者**
5. **追加** をクリック

#### 環境変数設定
プロジェクトルートに `.env.local` を作成：

```bash
# Google Analytics 4 - フロントエンド用（あなたのMeasurement IDを入力）
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Analytics 4 - MCP/API用（あなたのProperty IDを入力）
GOOGLE_ANALYTICS_PROPERTY_ID=123456789

# Google Service Account Key
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# Microsoft Clarity（あなたのProject IDを入力）
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
CLARITY_API_TOKEN=your_clarity_api_token_here
```

### Property ID の取得方法

1. Google Analytics → **管理** → **プロパティ設定**
2. **プロパティの詳細** セクションの **プロパティID**（数字のみ）をコピー

### Measurement ID の取得方法

1. Google Analytics → **管理** → **データストリーム**
2. **ウェブストリーム** を選択
3. **測定ID**（G-XXXXXXXXXXの形式）をコピー

## 🔒 セキュリティ

- `google-service-account.json` は**.gitignore**で保護されています
- ファイル権限は**600**（所有者のみ読み書き可能）に設定済み
- このファイルを絶対にGitにコミットしないでください

## 🚀 次のステップ

1. Google Analyticsにサービスアカウントへのアクセス権を付与
2. Property IDとMeasurement IDを`.env.local`に設定
3. MCP接続テスト実行

---

**最終更新**: 2025年8月19日  
**設定者**: Analytics Team