# Google Analytics 4 API Setup for MCP

## 🎯 概要

Google Analytics 4データをMCP経由で分析するためのAPI設定ガイド。

## 🚀 セットアップ手順

### 1. Google Cloud Console設定

#### 1.1 プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存プロジェクトを選択）
3. プロジェクト名: `unson-analytics` （推奨）

#### 1.2 Google Analytics Reporting API の有効化
1. **APIとサービス** → **ライブラリ**
2. "Google Analytics Reporting API" を検索
3. **有効にする** をクリック

#### 1.3 サービスアカウント作成
1. **APIとサービス** → **認証情報**
2. **認証情報を作成** → **サービスアカウント**
3. サービスアカウント名: `unson-analytics-reader`
4. **作成して続行**

#### 1.4 サービスアカウントキー作成
1. 作成したサービスアカウントをクリック
2. **キー** タブ → **キーを追加** → **新しいキーを作成**
3. **JSON** を選択してダウンロード
4. ファイル名を `google-service-account.json` に変更

### 2. Google Analytics 4 設定

#### 2.1 プロパティIDの取得
1. [Google Analytics](https://analytics.google.com/) にアクセス
2. **管理** → **プロパティ設定**
3. **プロパティID**（数字のみ）をコピー

#### 2.2 サービスアカウントのアクセス権限付与
1. **管理** → **プロパティアクセス管理**
2. **+** → **ユーザーを追加**
3. サービスアカウントのメールアドレスを入力
4. 役割: **閲覧者** を選択
5. **追加** をクリック

### 3. 環境変数設定

プロジェクトルートに `.env.local` を作成/更新：

```bash
# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# または JSONキーを直接設定（本番環境推奨）
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
CLARITY_API_TOKEN=your_clarity_api_token_here
```

### 4. セキュリティ設定

#### 4.1 .gitignore に追加
```bash
# Google Service Account Key
google-service-account.json
```

#### 4.2 サービスアカウントキーの本番管理
```bash
# 本番環境ではBase64エンコードして環境変数に設定
base64 -i google-service-account.json
```

## 🔍 使用方法

### MCP経由でのGA4データ分析

```
"過去30日間のmywa LPで：
- ページビュー数とユニークユーザー数
- デバイス別のセッション時間
- コンバージョン率をチャネル別で分析
- 直帰率が高いページを特定"
```

### 利用可能なメトリクス

#### 基本メトリクス
- **sessions**: セッション数
- **users**: ユーザー数
- **pageviews**: ページビュー数
- **bounceRate**: 直帰率
- **averageSessionDuration**: 平均セッション時間

#### コンバージョンメトリクス
- **conversions**: コンバージョン数
- **conversionRate**: コンバージョン率
- **eventCount**: イベント数

#### トラフィックメトリクス
- **organicSearchClicks**: オーガニック検索クリック
- **socialClicks**: ソーシャルメディアクリック
- **referralClicks**: 参照サイトクリック

### ディメンション（フィルタリング）

- **country**: 国
- **deviceCategory**: デバイスカテゴリ
- **browser**: ブラウザ
- **operatingSystem**: OS
- **channelGrouping**: チャネルグループ
- **pagePath**: ページパス

## 📊 分析例

### サービス別パフォーマンス比較

```
"過去7日間で各LPサービスの比較：
- mywa, ai-bridge, ai-stylist, ai-legacy-creator, ai-coach
- それぞれのコンバージョン率とセッション数
- モバイル vs デスクトップの傾向
- 最もパフォーマンスが良いサービスの特徴"
```

### 流入元分析

```
"ai-bridge LPの過去14日間で：
- チャネル別の流入数（オーガニック、SNS、直接、参照）
- 各チャネルのコンバージョン率
- 最も質の高いトラフィック源
- 改善が必要なチャネル"
```

## 🛠️ トラブルシューティング

### 認証エラー

```
Error: Google Analytics API authentication failed
```

**解決方法**:
1. サービスアカウントキーが正しい場所にあるか確認
2. GA4プロパティでアクセス権限が付与されているか確認
3. Google Analytics Reporting API が有効か確認

### データが表示されない

**確認項目**:
1. プロパティIDが正しいか（Measurement IDではなくProperty ID）
2. データ収集開始から24-48時間経過しているか
3. サービスアカウントが正しいプロパティにアクセス権を持っているか

### クォータ制限

GA4 Reporting APIには以下の制限があります：
- **同時リクエスト**: 10件/秒
- **日次リクエスト**: 50,000件/日

## 🔗 関連リソース

- [GA4 Reporting API ドキュメント](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Analytics](https://analytics.google.com/)

---

**最終更新**: 2025年8月19日  
**担当**: Analytics Team