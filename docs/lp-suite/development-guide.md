# LP Suite 開発・運用ガイド

## 🔧 開発環境構築

### 必要なツール・バージョン
```bash
Node.js: >=18.0.0
npm: >=9.0.0
TypeScript: >=5.0.0
```

### 初回セットアップ
```bash
# リポジトリクローン
git clone https://github.com/Unson-LLC/unson_os.git
cd unson_os

# 依存関係インストール
npm install

# LP Suiteディレクトリに移動
cd apps/lp-suite

# 環境変数設定
cp .env.example .env.local
# .env.localを編集して必要なAPI Keyを設定

# Convex初期化・デプロイ
npx convex dev

# 開発サーバー起動
npm run dev
```

### 必須環境変数
```env
# Convex
CONVEX_DEPLOYMENT=dev:unson-os
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=*****
GOOGLE_ADS_CLIENT_ID=*****
GOOGLE_ADS_CLIENT_SECRET=*****
GOOGLE_ADS_REFRESH_TOKEN=*****
GOOGLE_ADS_LOGIN_CUSTOMER_ID=*****

# OpenAI
OPENAI_API_KEY=sk-*****

# PostHog（将来実装）
NEXT_PUBLIC_POSTHOG_KEY=*****
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 📋 開発４大原則（CLAUDE.md準拠）

### 1. YAGNI（You Aren't Gonna Need It）
```typescript
// ❌ 悪い例：今は不要な複雑な抽象化
interface GenericDataProvider<T, U, V> {
  fetch(params: U): Promise<T>
  transform(data: T): V
  cache(data: V): void
}

// ✅ 良い例：必要最小限の実装
async function getWindowMetrics(productId: string) {
  return await convex.query(api.ads.getWindowMetricsByProduct, {
    product_id: productId,
    window_hours: 4
  })
}
```

### 2. DRY（Don't Repeat Yourself）
```typescript
// ❌ 悪い例：同じロジックの重複
function formatCtr(clicks: number, impressions: number) {
  return impressions > 0 ? Math.round(clicks / impressions * 10000) / 100 : 0
}

function formatCvr(conversions: number, clicks: number) {
  return clicks > 0 ? Math.round(conversions / clicks * 10000) / 100 : 0
}

// ✅ 良い例：共通化
function formatPercentage(numerator: number, denominator: number) {
  return denominator > 0 ? Math.round(numerator / denominator * 10000) / 100 : 0
}

const ctr = formatPercentage(clicks, impressions)
const cvr = formatPercentage(conversions, clicks)
```

### 3. KISS（Keep It Simple Stupid）
```typescript
// ❌ 悪い例：過度に複雑
class GoogleAdsMetricsProcessor {
  private aggregator: MetricsAggregator
  private transformer: DataTransformer
  private validator: SchemaValidator
  
  async processComplexMetrics(data: RawMetrics[]): Promise<ProcessedMetrics> {
    const validated = await this.validator.validate(data)
    const transformed = await this.transformer.transform(validated)
    return await this.aggregator.aggregate(transformed)
  }
}

// ✅ 良い例：シンプル・直接的
async function processGoogleAdsMetrics(rawData: any[]) {
  return rawData.map(item => ({
    timeSlot: formatTimeSlot(item.ts_start),
    impressions: item.impressions,
    clicks: item.clicks,
    ctr: formatPercentage(item.clicks, item.impressions),
    cost: item.cost,
    conversions: item.conversions
  }))
}
```

### 4. Git Worktree活用
```bash
# 機能別ブランチでの並列開発
git worktree add ../lp-suite-google-ads -b feature/google-ads-optimization
git worktree add ../lp-suite-ui-improvement -b feature/ui-improvement
git worktree add ../lp-suite-automation -b feature/mastra-automation

# 並行作業
# Terminal 1: メイン開発
cd apps/lp-suite
npm run dev

# Terminal 2: Google Ads機能
cd ../lp-suite-google-ads
npm run dev -- --port 3001

# Terminal 3: UI改善
cd ../lp-suite-ui-improvement  
npm run dev -- --port 3002
```

## 🧪 TDD実装ガイド（t_wada方式）

### RED-GREEN-REFACTORサイクル

#### 1. RED: テストから開始
```typescript
// __tests__/ads/sync.test.ts
import { describe, it, expect } from '@jest/globals'
import { syncGoogleAdsData } from '../../../convex/ads'

describe('Google Ads同期', () => {
  it('AI-BRIDGE専用データを正しく同期する', async () => {
    // RED: まず失敗するテストを書く
    const result = await syncGoogleAdsData({
      product_id: 'AI-BRIDGE',
      workspace_id: 'test_workspace'
    })
    
    expect(result.success).toBe(true)
    expect(result.productId).toBe('AI-BRIDGE')
    expect(result.windowRecords).toBeGreaterThan(0)
  })
})
```

#### 2. GREEN: ベタ書きで通す
```typescript
// convex/ads.ts - 最初の実装（ベタ書き許容）
export const syncGoogleAdsData = mutation({
  handler: async (ctx, args) => {
    // GREEN: ハードコードでテストを通す
    if (args.product_id === 'AI-BRIDGE') {
      return {
        success: true,
        productId: 'AI-BRIDGE', 
        windowRecords: 18,
        message: 'ハードコード実装'
      }
    }
    
    return { success: false }
  }
})
```

#### 3. REFACTOR: ハードコード除去必須
```typescript
// convex/ads.ts - リファクタリング後
export const syncGoogleAdsData = mutation({
  args: {
    product_id: v.optional(v.string()),
    workspace_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const productId = args.product_id || 'MYWA'
    const workspaceId = args.workspace_id || 'unson_main'
    
    // プロダクト別実データ取得ロジック
    const metrics = await fetchProductSpecificMetrics(productId)
    const windowData = transformToWindowData(metrics)
    
    // Convexに保存
    for (const window of windowData) {
      await saveWindowMetric(ctx, {
        workspace_id: workspaceId,
        product_id: productId,
        ...window
      })
    }
    
    return {
      success: true,
      productId,
      windowRecords: windowData.length,
      message: `${productId}のデータを同期完了`
    }
  }
})
```

## 📊 テスト戦略

### テストピラミッド
```
E2E Tests (Playwright)     ← 少数、重要フロー
├─ ユーザージャーニー全体テスト
├─ Google Ads同期→UI表示フロー
└─ 異常値検知→アラート発報フロー

Integration Tests          ← 中程度
├─ API + Convex統合テスト
├─ 外部API統合テスト  
└─ コンポーネント統合テスト

Unit Tests (Jest)          ← 多数、網羅的
├─ Convex mutation/query
├─ ユーティリティ関数
├─ React hooks
└─ ビジネスロジック
```

### E2Eテスト例
```typescript
// e2e/google-ads-sync.spec.ts
import { test, expect } from '@playwright/test'

test('Google Ads 4時間毎同期フロー', async ({ page }) => {
  // 1. ダッシュボードアクセス
  await page.goto('/position/AI-BRIDGE')
  
  // 2. 手動同期実行
  await page.click('[data-testid="sync-button"]')
  await page.waitForSelector('[data-testid="sync-success"]')
  
  // 3. 時系列データ表示確認
  await expect(page.locator('[data-testid="time-series-chart"]')).toBeVisible()
  
  // 4. 実データ表示確認（サンプルデータでない）
  await expect(page.locator('text=※サンプルデータ')).not.toBeVisible()
  
  // 5. 正しいメトリクス表示確認
  await expect(page.locator('[data-testid="ctr-value"]')).toContainText('%')
  await expect(page.locator('[data-testid="impressions-value"]')).not.toContainText('0')
})
```

### 単体テスト例
```typescript
// __tests__/utils/format.test.ts
import { formatTimeSlot, formatPercentage } from '../../src/lib/utils'

describe('formatTimeSlot', () => {
  it('4時間窓を正しくフォーマット', () => {
    const timestamp = new Date('2025-09-04T20:00:00Z').getTime()
    expect(formatTimeSlot(timestamp, 4)).toBe('20h~0h')
  })
  
  it('日跨ぎを正しく処理', () => {
    const timestamp = new Date('2025-09-04T21:00:00Z').getTime()  
    expect(formatTimeSlot(timestamp, 4)).toBe('21h~1h')
  })
})

describe('formatPercentage', () => {
  it('CTRを小数点2桁でフォーマット', () => {
    expect(formatPercentage(66, 1596)).toBe(4.14)
  })
  
  it('ゼロ割を安全に処理', () => {
    expect(formatPercentage(0, 0)).toBe(0)
  })
})
```

## 🚀 コマンド・スクリプト集

### 開発用コマンド
```bash
# 開発サーバー起動
npm run dev

# Convex開発環境
npx convex dev

# 型チェック
npm run typecheck  

# リンター
npm run lint
npm run lint:fix

# テスト実行
npm test              # 単体テスト
npm run test:watch    # ウォッチモード
npx playwright test   # E2Eテスト
```

### Google Ads操作コマンド  
```bash
# 手動データ同期
npx convex run ads:syncGoogleAdsData '{"product_id":"AI-BRIDGE"}'
npx convex run ads:syncGoogleAdsData '{"product_id":"MYWA"}'

# ウィンドウデータ確認
npx convex run ads:getWindowMetricsByProduct '{"product_id":"AI-BRIDGE","limit":10}'

# データクリア（開発用）
npx convex run ads:clearWindowMetricsByProduct '{"product_id":"AI-BRIDGE"}'
```

### デプロイコマンド
```bash
# Staging環境
npm run build
npx convex deploy --cmd-deployment staging
vercel --target preview

# Production環境
npm run build  
npm run lint
npm test
npx convex deploy --prod
vercel --prod
```

## 🔍 デバッグガイド

### よくある問題・解決方法

#### 1. Google Ads API認証エラー
```bash
# エラー例
Error: Google Ads API authentication failed

# 解決手順
1. 環境変数確認: GOOGLE_ADS_REFRESH_TOKEN等
2. OAuth 2.0トークン再取得
3. Developer Console quota確認
4. Login Customer ID確認
```

#### 2. Convexデータ同期問題
```typescript
// デバッグ用クエリ
const debugData = await convex.query(api.ads.getWindowMetricsByProduct, {
  product_id: 'AI-BRIDGE',
  window_hours: 4,
  limit: 5
})

console.log('Debug data:', debugData)

// データ整合性確認
const count = await convex.query(api.ads.countWindowMetrics, {
  product_id: 'AI-BRIDGE'
})
```

#### 3. UI表示問題
```typescript
// React DevTools + Convex DevTools併用
// 1. コンポーネント状態確認
// 2. Convex query状態確認  
// 3. ネットワークタブでAPI呼び出し確認
// 4. Console でエラーログ確認
```

### ログ・監視設定
```typescript
// 開発環境ログ設定
if (process.env.NODE_ENV === 'development') {
  console.log('Google Ads同期開始:', { productId, timestamp: Date.now() })
}

// Production監視
import { MonitoringService } from '@/lib/monitoring'

await MonitoringService.trackEvent('google_ads_sync', {
  productId,
  duration: syncDuration,
  success: syncResult.success,
  recordCount: syncResult.windowRecords
})
```

## 📈 パフォーマンス最適化

### Convexクエリ最適化
```typescript
// ❌ 非効率：フィルターなしクエリ
const allData = await ctx.db.query('adsWindowMetrics').collect()
const filtered = allData.filter(item => item.product_id === productId)

// ✅ 効率的：インデックス活用
const optimizedData = await ctx.db
  .query('adsWindowMetrics')
  .withIndex('by_product_ts', q => q.eq('product_id', productId))
  .order('desc')
  .take(limit)
```

### フロントエンド最適化
```typescript
// 動的インポートでコード分割
const TimeSeriesChart = lazy(() => import('@/components/TimeSeriesChart'))

// メモ化で再計算回避
const memoizedMetrics = useMemo(() => {
  return calculateDerivedMetrics(rawData)
}, [rawData])

// 仮想化で大量データ表示
import { FixedSizeList as List } from 'react-window'
```

## 🚢 デプロイ・運用

### CI/CDパイプライン
```yaml
# .github/workflows/deploy.yml
name: Deploy LP Suite
on:
  push:
    branches: [main]
    paths: ['apps/lp-suite/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      # テスト実行
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npx playwright test
      
      # ビルド・デプロイ
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 本番チェックリスト
```bash
# デプロイ前確認事項
□ 全テスト通過
□ TypeScriptエラーなし  
□ Lintエラーなし
□ E2Eテスト通過
□ 環境変数設定完了
□ Convex本番デプロイ完了

# デプロイ後確認事項  
□ ヘルスチェックAPI正常応答
□ Google Ads同期動作確認
□ 時系列データ表示確認
□ アラート機能動作確認
□ パフォーマンス指標確認
```

### 監視・アラート設定
```typescript
// アプリケーション監視
const monitoring = {
  metrics: {
    apiResponseTime: "< 500ms p95",
    errorRate: "< 1%", 
    cronJobSuccess: "> 99%",
    dataFreshness: "< 4.25時間"
  },
  
  alerts: {
    critical: "Discord + Slack + Email",
    warning: "Slack",
    info: "Dashboard only"
  }
}
```

---

## 📚 追加リソース

### 関連ドキュメント
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Convex Documentation](https://docs.convex.dev/)
- [Google Ads API](https://developers.google.com/google-ads/api/docs)
- [Playwright Testing](https://playwright.dev/)

### 開発チーム連絡先
- **技術的質問**: #lp-suite-dev (Slack)
- **バグ報告**: GitHub Issues
- **緊急連絡**: Discord #urgent-issues

**最終更新**: 2025年9月4日  
**ガイドバージョン**: v2.0