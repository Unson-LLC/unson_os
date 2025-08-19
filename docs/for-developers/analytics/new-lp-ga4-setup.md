# 新規LP用GA4プロパティ作成ガイド

## 🚀 クイックスタート（3分で完了）

新しいLPサービスを作成する際、専用のGA4プロパティを自動作成できます。

### 1. コマンド実行

```bash
# 基本形式
node scripts/create-single-ga4-property.js <サービス名> <表示名> <URL>

# 実例
node scripts/create-single-ga4-property.js my-new-lp "My New LP Analytics" "https://my-new-lp.vercel.app"
```

### 2. 自動処理される内容

- ✅ GA4プロパティ作成
- ✅ Webデータストリーム作成
- ✅ 測定ID（G-XXXXXXXXXX）取得
- ✅ `.env.local`ファイル自動生成

## 📋 詳細手順

### Step 1: サービス準備

```bash
# 1. 新規LPサービスディレクトリ作成
cp -r templates/lp-template services/my-new-lp

# 2. サービス名を決定
# 例: my-new-lp, ai-translator, web3-wallet など
```

### Step 2: GA4プロパティ作成

```bash
# スクリプト実行
node scripts/create-single-ga4-property.js \
  my-new-lp \
  "My New LP Analytics" \
  "https://my-new-lp.vercel.app"
```

**パラメータ説明**：
- **第1引数**: サービス名（ディレクトリ名と一致させる）
- **第2引数**: GA4での表示名（日本語可）
- **第3引数**: LPのURL（Vercelデプロイ先）

### Step 3: 出力確認

```
🚀 GA4プロパティ作成: my-new-lp

✅ Google認証初期化完了
使用アカウント: Unson-LLC

✅ プロパティ作成成功: My New LP Analytics
✅ データストリーム作成成功
✅ .env.local作成完了: services/my-new-lp/.env.local

============================================================
🎯 GA4プロパティ作成完了
============================================================
サービス名: my-new-lp
表示名: My New LP Analytics
URL: https://my-new-lp.vercel.app
プロパティID: 123456789
測定ID: G-XXXXXXXXXX
============================================================
```

### Step 4: Vercel環境変数設定

```bash
# サービスディレクトリに移動
cd services/my-new-lp

# Vercel環境変数追加
vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production
# プロンプトで測定ID（G-XXXXXXXXXX）を入力

vercel env add GOOGLE_ANALYTICS_PROPERTY_ID production
# プロンプトでプロパティID（123456789）を入力
```

### Step 5: デプロイ

```bash
# 本番環境にデプロイ
vercel --prod
```

## 🔧 環境変数テンプレート

自動生成される`.env.local`の内容：

```env
# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# Microsoft Clarity (後で設定)
NEXT_PUBLIC_CLARITY_PROJECT_ID=
CLARITY_API_TOKEN=

# API Endpoint
NEXT_PUBLIC_API_URL=https://unsonos-api.vercel.app
NEXT_PUBLIC_DEFAULT_WORKSPACE_ID=unson_main
```

## ⚡ ワンライナー実行

すべてを一度に実行する場合：

```bash
# プロパティ作成 → 環境変数設定 → デプロイ
SERVICE_NAME="my-new-lp" && \
node scripts/create-single-ga4-property.js \
  $SERVICE_NAME \
  "$(echo $SERVICE_NAME | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1') Analytics" \
  "https://$SERVICE_NAME.vercel.app" && \
cd services/$SERVICE_NAME && \
vercel --prod
```

## 📊 Analytics確認

### 1. リアルタイム確認
- [Google Analytics](https://analytics.google.com/)
- 該当プロパティ選択 → レポート → リアルタイム

### 2. 測定タグ確認
```javascript
// ブラウザコンソールで確認
window.gtag
// function が返れば正常
```

### 3. ネットワーク確認
- Chrome DevTools → Network
- `collect`リクエストが送信されていることを確認

## ⚠️ トラブルシューティング

### エラー: サービスディレクトリが存在しません

```bash
# 先にディレクトリを作成
mkdir -p services/my-new-lp
cp -r templates/lp-template/* services/my-new-lp/
```

### エラー: 認証エラー

```bash
# サービスアカウントキーを確認
ls -la google-service-account.json

# 権限確認
cat google-service-account.json | grep client_email
# unson-analytics-reader@unsonos.iam.gserviceaccount.com が表示されるか確認
```

### エラー: API無効

Google Cloud Consoleで以下を有効化：
- Google Analytics Admin API

## 🎯 ベストプラクティス

### 命名規則

| 項目 | 推奨形式 | 例 |
|-----|---------|-----|
| サービス名 | kebab-case | ai-writer, web3-wallet |
| 表示名 | Title Case + Analytics | AI Writer Analytics |
| URL | https://[service-name].vercel.app | https://ai-writer.vercel.app |

### プロパティ管理

1. **1サービス = 1プロパティ**
   - 各LPに専用プロパティ作成
   - 個別分析・比較が容易

2. **命名一貫性**
   - すべて「〇〇 Analytics」形式
   - 管理画面での識別が容易

3. **タイムゾーン統一**
   - Asia/Tokyo（JST）で統一
   - レポート時刻の混乱防止

## 📈 スケーリング

### 10個のLP作成例

```bash
# services.txt にサービス名リスト作成
cat > services.txt << EOF
ai-writer
web3-wallet
nft-marketplace
defi-dashboard
crypto-exchange
EOF

# 一括作成スクリプト
while read service; do
  node scripts/create-single-ga4-property.js \
    "$service" \
    "$(echo $service | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1') Analytics" \
    "https://$service.vercel.app"
  sleep 2  # API制限回避
done < services.txt
```

## 🔄 継続的改善

### 月次レビュー項目

- [ ] 各プロパティのトラフィック確認
- [ ] コンバージョン率測定
- [ ] 低パフォーマンスLPの改善
- [ ] A/Bテスト結果分析

### データ活用

```javascript
// GA4 Reporting API でデータ取得
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const analyticsDataClient = new BetaAnalyticsDataClient();

async function getPageViews(propertyId) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'screenPageViews' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
  });
  return response;
}
```

---

**作業時間**: 3分/LP
**自動化率**: 95%
**スケーラビリティ**: 100-200 LPまで対応可能