# GA4プロパティAPI自動作成ガイド

## 🚀 概要

Google Analytics Admin API v1を使用してGA4プロパティを自動作成するスクリプトとその使用方法。

手動作成（30-45分）→ API自動作成（2-3分）で大幅な時間短縮を実現。

## ⚡ クイックスタート

### 1. API経由で5つのプロパティを一括作成

```bash
npm run ga4:create
```

このコマンドで以下が自動実行されます：

1. **5つのGA4プロパティ作成**
   - MyWa LP Analytics
   - AI Bridge LP Analytics  
   - AI Stylist LP Analytics
   - AI Legacy Creator LP Analytics
   - AI Coach LP Analytics

2. **各プロパティでWebデータストリーム作成**
   - 測定ID（G-XXXXXXXXXX）自動取得
   - 対応するVercel URLを設定

3. **サービスアカウントアクセス権自動付与**
   - unson-analytics-reader@unsonos.iam.gserviceaccount.com
   - 閲覧者権限で設定

4. **環境変数ファイル自動生成**
   - 各サービスの`.env.local`を更新
   - プロパティID・測定IDを自動設定

### 2. 手動設定が必要な場合

```bash
npm run ga4:setup
```

## 📋 前提条件

### 必須ファイル
- `google-service-account.json` (ルートディレクトリに配置済み)
- GA4アカウントへのサービスアカウントアクセス権

### 必要な権限
```json
{
  "scope": [
    "https://www.googleapis.com/auth/analytics.edit"
  ]
}
```

## 🔧 生成されるファイル

### 1. 実行結果ファイル
`ga4-properties-created.json` - 作成されたプロパティの詳細情報

```json
[
  {
    "serviceName": "mywa",
    "displayName": "MyWa LP Analytics", 
    "propertyId": "123456789",
    "measurementId": "G-XXXXXXXXXX",
    "websiteUrl": "https://unson-lp-mywa.vercel.app",
    "created": "2025-01-19T12:00:00.000Z"
  }
]
```

### 2. 環境変数ファイル
各サービスの`.env.local`が自動更新されます：

```bash
# services/mywa/.env.local
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
```

## 🛠️ スクリプト詳細

### GA4PropertyCreator クラス

| メソッド | 機能 |
|---------|-----|
| `initializeAuth()` | Google認証初期化 |
| `getAccounts()` | 利用可能なGA4アカウント取得 |
| `createProperty()` | GA4プロパティ作成 |
| `createWebDataStream()` | Webデータストリーム作成 |
| `grantServiceAccountAccess()` | サービスアカウントアクセス権付与 |
| `createCompletePropertySetup()` | 完全セットアップ実行 |

### 設定項目

```javascript
const LP_SERVICES = [
  {
    name: 'mywa',
    displayName: 'MyWa LP Analytics',
    websiteUrl: 'https://unson-lp-mywa.vercel.app',
    streamName: 'MyWa LP Stream'
  }
  // ...他のサービス
];
```

## ⚠️ エラーハンドリング

### よくあるエラーと対処法

#### 1. 認証エラー
```
❌ Google認証エラー: Could not load the default credentials
```
**対処法**: `google-service-account.json`ファイルパスを確認

#### 2. 権限不足エラー  
```
❌ プロパティ作成エラー: User does not have sufficient permissions
```
**対処法**: GA4アカウントでサービスアカウントに編集権限を付与

#### 3. API制限エラー
```
❌ Quota exceeded for quota metric 'Requests'
```
**対処法**: スクリプト内の待機時間を増加（現在1秒）

## 📊 パフォーマンス

| 作業 | 手動 | API自動 | 時間短縮 |
|-----|-----|--------|---------|
| プロパティ作成 | 30-45分 | 2-3分 | **90%短縮** |
| 環境変数設定 | 15分 | 自動 | **100%短縮** |
| 人的エラーリスク | 高 | 低 | **リスク大幅減** |

## 🔄 次のステップ

1. **Microsoft Clarity設定**
   ```bash
   # Clarityプロジェクト作成後
   # 各.env.localのCLARITY_PROJECT_IDを手動更新
   ```

2. **Vercel環境変数設定**
   ```bash
   # 各サービスディレクトリで実行
   vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production
   # 値: G-XXXXXXXXXX
   ```

3. **デプロイ・動作確認**
   ```bash
   npm run deploy
   ```

## 🎯 API活用の利点

### 1. **高速化**
- 手動30-45分 → API 2-3分

### 2. **自動化**
- ヒューマンエラー排除
- 一貫性のある設定

### 3. **スケーラビリティ**  
- 100-200個のプロパティも同じ手順で対応可能

### 4. **メンテナンス性**
- 設定変更はコードベースで管理
- バージョン管理・レビュー可能

---

**推定時間**: 初回 5分、2回目以降 2分  
**対象**: 5つのLPサービス → 100-200個のマイクロSaaSへスケール可能