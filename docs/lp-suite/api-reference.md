# LP Suite API リファレンス

## 📡 API概要

LP Suiteは37のAPIエンドポイントを提供し、Google Ads管理・時系列データ・LP生成・プロダクト管理を統合的にサポートします。

## 🔗 Base URL
```
Production: https://lp-suite.unson.com/api
Development: http://localhost:3000/api
```

## 📊 Google Ads関連API

### 1. データ同期API

#### `POST /api/ads-sync`
Google Ads APIから最新データを手動同期

**Request:**
```typescript
interface SyncRequest {
  product_id?: string    // デフォルト: "MYWA"
  workspace_id?: string  // デフォルト: "unson_main" 
  days?: number         // デフォルト: 7日間
  force_sync?: boolean  // デフォルト: false
}
```

**Response:**
```typescript
interface SyncResponse {
  success: true
  productId: string
  windowRecords: number
  message: string
  data: {
    totalImpressions: number
    totalClicks: number
    totalCost: number
    avgCtr: number
    avgCpc: number
  }
}
```

**Example:**
```bash
curl -X POST https://lp-suite.unson.com/api/ads-sync \
  -H "Content-Type: application/json" \
  -d '{"product_id": "AI-BRIDGE", "days": 7}'
```

### 2. 時系列データAPI

#### `GET /api/time-series-real-data`
4時間窓の時系列パフォーマンスデータ取得

**Parameters:**
```typescript
interface TimeSeriesParams {
  date?: string         // "YYYY-MM-DD", デフォルト: 今日
  interval?: "4h"       // 固定値
  format?: "raw-data"   // 固定値
  productId?: string    // デフォルト: "MYWA"
}
```

**Response:**
```typescript
interface TimeSeriesResponse {
  success: boolean
  data: Array<{
    timeSlot: string      // "20h~24h"
    impressions: number
    clicks: number
    cost: number
    conversions: number
    ctr: number          // 小数点2桁
    cpc: number          // 整数
    cvr: number          // 小数点2桁  
    cpa: number          // 整数
  }>
  metadata: {
    dateRange: string
    totalWindows: number
    lastSyncTime: string
    dataFreshness: "fresh" | "stale" | "missing"
  }
}
```

#### `GET /api/daily-ads-data` 
日次集計データ取得

**Parameters:**
```typescript
interface DailyDataParams {
  productId?: string    // デフォルト: "MYWA"
  days?: number        // デフォルト: 7日間
}
```

#### `GET /api/weekly-ads-data`
週次集計データ取得

**Parameters:**
```typescript
interface WeeklyDataParams {
  productId?: string    // デフォルト: "MYWA"  
  weeks?: number       // デフォルト: 4週間
}
```

### 3. キャンペーン管理API

#### `POST /api/campaigns/sync-from-google-ads`
Google Adsからキャンペーン情報同期

#### `GET /api/campaigns/counts`
プロダクト別キャンペーン数取得

#### `POST /api/create-google-campaigns`
新規Google Adsキャンペーン作成

**Request:**
```typescript
interface CreateCampaignRequest {
  productId: string
  campaignName: string
  dailyBudget: number      // JPY
  targetCpa?: number       // JPY
  keywords: string[]
  adGroups: AdGroup[]
}
```

## 🎯 プロダクト管理API

### 4. ポジション管理API

#### `GET /api/positions`
全プロダクト一覧取得

**Response:**
```typescript
interface Position {
  id: string               // "AI-BRIDGE", "MYWA", etc.
  name: string
  category: string
  status: "running" | "paused" | "completed"
  metrics: {
    impressions: number
    clicks: number
    ctr: number
    cost: number
    conversions: number
    cpa: number
  }
  lastUpdated: string
}
```

#### `POST /api/positions`
新規プロダクト登録

#### `GET /api/positions/[id]`
特定プロダクト詳細取得

#### `PUT /api/positions/[id]`
プロダクト情報更新

#### `DELETE /api/positions/purge`
全プロダクトデータ削除（開発用）

#### `GET /api/positions/[id]/ads`
プロダクト別広告パフォーマンス取得

#### `GET /api/positions/[id]/executions`
プロダクト別実行履歴取得

## 🚀 LP生成・最適化API

### 5. LP生成API

#### `POST /api/generate-lp`
AI駆動LP自動生成

**Request:**
```typescript
interface LpGenerationRequest {
  productInfo: {
    name: string
    category: string
    targetAudience: string
    valueProposition: string
  }
  requirements: {
    template?: string      // デフォルトテンプレート
    colors?: string[]      // ブランドカラー
    features?: string[]    // 強調する機能
  }
  optimization: {
    seo?: boolean         // デフォルト: true
    performance?: boolean // デフォルト: true
    accessibility?: boolean // デフォルト: true
  }
}
```

#### `POST /api/generate-images`
LP用画像AI生成

### 6. 統合・バリデーションAPI

#### `POST /api/integration/generate-to-validation`
LP生成→検証フロー統合実行

**Request:**
```typescript
interface IntegrationRequest {
  productId: string
  generationParams: LpGenerationRequest
  validationParams: {
    testDuration: number    // 日数
    trafficSplit: number    // %
    primaryMetric: string
  }
}
```

## 🤖 自動化・ワークフローAPI

### 7. 自動化API

#### `POST /api/ads-automation`
Google Ads自動最適化実行

#### `POST /api/comprehensive-ads-automation`
包括的広告自動化（Mastra統合）

#### `GET /api/sync-complete-hourly`
時間毎完全同期実行

### 8. スケジューリングAPI  

#### `POST /api/ads-sync/schedule`
定期同期スケジュール設定

**Request:**
```typescript
interface ScheduleRequest {
  productIds: string[]
  frequency: "4h" | "daily" | "weekly"
  timezone: "Asia/Tokyo"
  enabled: boolean
}
```

## ⚠️ アラート・監視API

### 9. アラートAPI

#### `GET /api/alerts`
アクティブアラート一覧取得

**Response:**
```typescript
interface Alert {
  id: string
  type: "cpa_exceeded" | "ctr_dropped" | "conversion_stopped"
  severity: "critical" | "warning" | "info"
  productId: string
  message: string
  threshold: number
  current: number
  createdAt: string
  status: "active" | "acknowledged" | "resolved"
}
```

#### `POST /api/alerts`
カスタムアラート作成

#### `PUT /api/alerts/[id]`
アラート状態更新（確認済み・解決済み）

### 10. ヘルスチェックAPI

#### `GET /api/health`
システム全体ヘルスチェック

**Response:**
```typescript
interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy"
  services: {
    convex: "up" | "down"
    googleAds: "up" | "down" 
    openai: "up" | "down"
  }
  metrics: {
    responseTime: number   // ms
    errorRate: number     // %
    lastSync: string      // ISO timestamp
  }
}
```

## 🌐 ドメイン・インフラAPI

### 11. ドメイン管理API

#### `GET /api/domains`
管理中ドメイン一覧

#### `POST /api/domains`
新規ドメイン追加・設定

#### `GET /api/domains/[id]`
ドメイン詳細・SSL状態確認

## 🔧 開発・テストAPI

### 12. 開発支援API

#### `POST /api/seed-sample-data`
サンプルデータ投入（開発用）

#### `GET /api/watch`
リアルタイムデータ監視（WebSocket）

#### `POST /api/test-openai`
OpenAI API接続テスト

#### `POST /api/migrate-product-names`
プロダクト名マイグレーション（メンテナンス用）

## 🔑 認証・認可

### API Key認証（将来実装）
```typescript
// Header
Authorization: Bearer <API_KEY>

// または Query Parameter  
?api_key=<API_KEY>
```

### レート制限
```typescript
interface RateLimits {
  general: "1000 requests/hour"
  googleAds: "500 requests/hour"  
  aiGeneration: "100 requests/hour"
  bulkOperations: "50 requests/hour"
}
```

## 📝 エラーレスポンス

### 標準エラーフォーマット
```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string           // "INVALID_PRODUCT_ID"
    message: string        // "Product ID 'invalid' not found"
    details?: any         // 追加エラー情報
    timestamp: string     // ISO timestamp
    requestId: string     // トレーシング用ID
  }
}
```

### 主要エラーコード
```typescript
const ErrorCodes = {
  // 共通エラー
  INVALID_REQUEST: "リクエスト形式が不正",
  MISSING_PARAMETER: "必須パラメータが不足",
  RATE_LIMITED: "レート制限に達しました",
  
  // Google Ads関連
  GOOGLE_ADS_AUTH_FAILED: "Google Ads認証失敗", 
  GOOGLE_ADS_QUOTA_EXCEEDED: "Google Ads APIクォータ超過",
  CAMPAIGN_NOT_FOUND: "キャンペーンが見つかりません",
  
  // データ関連
  PRODUCT_NOT_FOUND: "プロダクトが見つかりません",
  DATA_SYNC_FAILED: "データ同期に失敗",
  STALE_DATA: "データが古くなっています",
  
  // システム関連
  INTERNAL_ERROR: "内部サーバーエラー",
  SERVICE_UNAVAILABLE: "サービス一時停止中"
}
```

## 📋 API使用例

### 基本的なワークフロー
```typescript
// 1. プロダクト一覧取得
const products = await fetch('/api/positions')
  .then(r => r.json())

// 2. 特定プロダクトのデータ同期  
await fetch('/api/ads-sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product_id: 'AI-BRIDGE' })
})

// 3. 時系列データ取得・表示
const timeSeriesData = await fetch('/api/time-series-real-data?productId=AI-BRIDGE')
  .then(r => r.json())

// 4. アラート確認
const alerts = await fetch('/api/alerts')
  .then(r => r.json())
```

---

**最終更新**: 2025年9月4日  
**API バージョン**: v1.0  
**エンドポイント数**: 37個