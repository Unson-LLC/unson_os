# Product SDK実装ガイド

## 概要

Product SDKは、個々のSaaSアプリケーションがUnsonOSコアシステムと通信するための軽量クライアントライブラリです。イベント送信、フラグ取得、ユーザー割当の管理を簡潔なAPIで提供します。

## 設計原則

1. **軽量性**: 最小限の依存関係（< 50KB gzipped）
2. **Edge対応**: Vercel Edge、Cloudflare Workers対応
3. **型安全**: TypeScript完全サポート
4. **フォールバック**: Core不通時の優雅な劣化
5. **リアルタイム**: SSE/WebSocketによる即時更新

## インストール

```bash
npm install @unsonos/product-sdk
# または
yarn add @unsonos/product-sdk
# または
pnpm add @unsonos/product-sdk
```

## 基本的な使い方

### 初期化

```typescript
import { UnsonSDK } from '@unsonos/product-sdk'

const sdk = new UnsonSDK({
  productId: 'saas_watashi_compass',
  apiEndpoint: process.env.UNSON_CORE_API_URL,
  apiKey: process.env.UNSON_API_KEY,
  environment: 'production', // 'development' | 'staging' | 'production'
  options: {
    enableRealtime: true,     // SSE/WebSocketによるリアルタイム更新
    fallbackMode: 'cache',    // 'cache' | 'default' | 'fail'
    requestTimeout: 2000,     // ミリ秒
    retryAttempts: 3,
    logLevel: 'info'         // 'debug' | 'info' | 'warn' | 'error'
  }
})

// アプリ起動時に初期化
await sdk.initialize()
```

### ユーザーコンテキスト設定

```typescript
// ユーザー識別とセグメント設定
sdk.setUser({
  userKey: 'user_123456',  // 一意のユーザー識別子
  segmentId: 'JP-Web-SMB', // セグメント識別子
  attributes: {             // オプション：追加属性
    plan: 'premium',
    signupDate: '2025-01-01',
    industry: 'design'
  }
})
```

## イベント送信

### シンボルイベント送信

```typescript
// KPIの変化を記号化して送信
await sdk.sendSymbol({
  code: 'Stage=LP|Window=short|Segment=JP-Web-SMB',
  metric: 'CVR',
  dir: 'Down'  // 'Up' | 'Down' | 'Flat'
})

// 一括送信
await sdk.sendSymbols([
  { code: 'Stage=LP|Window=tiny|Segment=JP-Web-SMB', metric: 'A1', dir: 'Up' },
  { code: 'Stage=MVP|Window=short|Segment=JP-Web-SMB', metric: 'RET7', dir: 'Flat' }
])
```

### カスタムイベント

```typescript
// 汎用イベント送信
await sdk.track('button_clicked', {
  button: 'cta_hero',
  page: '/landing',
  variant: sdk.getFlag('hero.variant')
})

// コンバージョンイベント
await sdk.trackConversion('signup', {
  plan: 'free',
  source: 'organic'
})
```

## Feature Flags取得

### 同期的な取得

```typescript
// 単一フラグ取得
const heroVariant = sdk.getFlag('hero.variant', 'default')

// 複数フラグ取得
const flags = sdk.getFlags()
/*
{
  'hero.variant': 'B',
  'pricing.model': 'tiered',
  'onboarding.steps': 3
}
*/

// 型安全な取得
interface AppFlags {
  'hero.variant': 'A' | 'B' | 'C'
  'pricing.model': 'flat' | 'tiered'
  'onboarding.steps': number
}

const typedFlags = sdk.getFlags<AppFlags>()
```

### 非同期的な取得（最新値保証）

```typescript
// サーバーから最新値を取得
const freshFlags = await sdk.fetchFlags()

// 特定のフラグのみ更新
const heroVariant = await sdk.fetchFlag('hero.variant')
```

### リアルタイム更新

```typescript
// フラグ変更の監視
sdk.on('flagsUpdated', (updatedFlags) => {
  console.log('Flags updated:', updatedFlags)
  // UIの再レンダリングなど
})

// 特定フラグの監視
sdk.watchFlag('hero.variant', (newValue, oldValue) => {
  console.log(`Hero variant changed: ${oldValue} -> ${newValue}`)
})

// 監視の解除
const unwatch = sdk.watchFlag('pricing.model', handler)
unwatch() // 監視停止
```

## Sticky Assignment（一貫性のある割当）

```typescript
// ユーザーの実験割当を取得
const assignment = sdk.getAssignment('experiment_hero_copy')
/*
{
  variant: 'treatment',
  exposedAt: '2025-01-15T10:30:00Z',
  sticky: true
}
*/

// 割当の確認（露出イベントを送信しない）
const variant = sdk.peekVariant('experiment_pricing')

// 明示的な露出イベント送信
sdk.expose('experiment_onboarding')
```

## React統合

### Provider設定

```tsx
import { UnsonProvider } from '@unsonos/product-sdk/react'

function App() {
  return (
    <UnsonProvider
      config={{
        productId: 'saas_watashi_compass',
        apiEndpoint: process.env.NEXT_PUBLIC_UNSON_API
      }}
      user={{
        userKey: userId,
        segmentId: 'JP-Web-SMB'
      }}
    >
      <YourApp />
    </UnsonProvider>
  )
}
```

### Hooks使用

```tsx
import { useFlag, useFlags, useTracking } from '@unsonos/product-sdk/react'

function HeroSection() {
  // 単一フラグ
  const heroVariant = useFlag('hero.variant', 'A')
  
  // 複数フラグ
  const { pricing, onboarding } = useFlags(['pricing.model', 'onboarding.steps'])
  
  // トラッキング
  const track = useTracking()
  
  const handleClick = () => {
    track('cta_clicked', { variant: heroVariant })
  }
  
  return (
    <div>
      {heroVariant === 'B' ? <NewHero /> : <DefaultHero />}
      <button onClick={handleClick}>始める</button>
    </div>
  )
}
```

### コンポーネント分岐

```tsx
import { FeatureFlag } from '@unsonos/product-sdk/react'

function PricingSection() {
  return (
    <FeatureFlag
      flag="pricing.model"
      value="tiered"
      fallback={<FlatPricing />}
    >
      <TieredPricing />
    </FeatureFlag>
  )
}
```

## Next.js統合

### App Router (Server Components)

```tsx
import { UnsonSDK } from '@unsonos/product-sdk/server'

async function Page() {
  const sdk = new UnsonSDK({
    productId: 'saas_watashi_compass',
    apiEndpoint: process.env.UNSON_CORE_API_URL
  })
  
  // サーバーサイドでフラグ取得
  const flags = await sdk.fetchFlags({
    userKey: 'server_rendered',
    segmentId: 'JP-Web-SMB'
  })
  
  return <HomePage flags={flags} />
}
```

### Middleware統合

```typescript
// middleware.ts
import { UnsonMiddleware } from '@unsonos/product-sdk/edge'

export const middleware = UnsonMiddleware({
  productId: 'saas_watashi_compass',
  routes: {
    '/': { experiments: ['hero_copy', 'pricing'] },
    '/onboarding': { experiments: ['onboarding_flow'] }
  }
})

export const config = {
  matcher: ['/', '/onboarding']
}
```

## 高度な機能

### バッチ処理

```typescript
// イベントのバッチ送信
sdk.batch(() => {
  sdk.track('page_view', { page: '/pricing' })
  sdk.track('scroll_depth', { depth: 75 })
  sdk.sendSymbol({ code: 'Stage=LP|Window=tiny|Segment=JP-Web-SMB', metric: 'A1', dir: 'Up' })
})
// 自動的にバッチとして送信される
```

### オフラインサポート

```typescript
// オフライン時の自動キューイング
sdk.enableOfflineQueue({
  maxSize: 100,           // 最大キューサイズ
  persistQueue: true,     // LocalStorageに永続化
  flushOnReconnect: true  // 再接続時に自動送信
})

// 手動フラッシュ
await sdk.flushQueue()
```

### パフォーマンス最適化

```typescript
// 遅延初期化
const sdk = new UnsonSDK({
  // ...config
  lazyInit: true  // 初回API呼び出しまで初期化を遅延
})

// プリフェッチ
sdk.prefetchFlags(['hero.variant', 'pricing.model'])

// キャッシュ制御
sdk.setCacheStrategy({
  ttl: 300000,           // 5分間キャッシュ
  staleWhileRevalidate: true
})
```

## エラーハンドリング

### 基本的なエラー処理

```typescript
try {
  await sdk.sendSymbol({ /* ... */ })
} catch (error) {
  if (error instanceof UnsonNetworkError) {
    // ネットワークエラー
    console.error('Network error:', error.message)
  } else if (error instanceof UnsonValidationError) {
    // バリデーションエラー
    console.error('Invalid data:', error.details)
  }
}
```

### グローバルエラーハンドラー

```typescript
sdk.on('error', (error) => {
  // Sentryなどに送信
  Sentry.captureException(error)
})

// 特定のエラータイプのみ
sdk.on('networkError', (error) => {
  showOfflineBanner()
})
```

## デバッグ

### デバッグモード

```typescript
const sdk = new UnsonSDK({
  // ...config
  debug: true  // または process.env.NODE_ENV === 'development'
})

// ランタイムでの切り替え
sdk.setDebugMode(true)
```

### イベントログ

```typescript
// 全イベントのログ
sdk.on('*', (eventName, data) => {
  console.log(`[UnsonSDK] ${eventName}:`, data)
})

// Chrome DevToolsExtension
if (window.__UNSON_DEVTOOLS__) {
  window.__UNSON_DEVTOOLS__.connect(sdk)
}
```

## テスト

### モック化

```typescript
import { MockUnsonSDK } from '@unsonos/product-sdk/testing'

// テスト用のモックSDK
const mockSdk = new MockUnsonSDK({
  flags: {
    'hero.variant': 'B',
    'pricing.model': 'tiered'
  }
})

// イベント送信の検証
expect(mockSdk.getEvents()).toContainEqual({
  type: 'symbol',
  data: { metric: 'CVR', dir: 'Up' }
})
```

### E2Eテスト

```typescript
// Playwright/Cypress統合
await page.evaluateOnNewDocument(() => {
  window.__UNSON_CONFIG__ = {
    mockMode: true,
    flags: { /* テスト用フラグ */ }
  }
})
```

## マイグレーション

### v1からv2への移行

```typescript
// v1 (非推奨)
sdk.getFeatureFlag('hero_variant')

// v2 (推奨)
sdk.getFlag('hero.variant')

// 自動マイグレーション
sdk.enableV1Compatibility()
```

## パフォーマンス指標

### SDK自体のオーバーヘッド
- 初期化: < 10ms
- フラグ取得: < 1ms（キャッシュヒット時）
- イベント送信: < 5ms（非同期）
- メモリ使用量: < 1MB

### ネットワーク最適化
- HTTPキープアライブ
- Request batching（100ms window）
- Gzip圧縮
- Binary protocol（オプション）

## トラブルシューティング

### よくある問題

#### フラグが更新されない
```typescript
// キャッシュをクリア
sdk.clearCache()

// 強制再取得
await sdk.fetchFlags({ force: true })
```

#### イベントが送信されない
```typescript
// キューの確認
console.log('Pending events:', sdk.getPendingEvents())

// 手動フラッシュ
await sdk.flush()
```

#### メモリリーク
```typescript
// クリーンアップ
sdk.destroy()

// React: useEffectでクリーンアップ
useEffect(() => {
  return () => sdk.destroy()
}, [])
```

## セキュリティ

### APIキーの管理
- サーバーサイド: 環境変数
- クライアントサイド: Public keyのみ使用
- ローテーション: 90日ごと

### PII（個人識別情報）
```typescript
// PII を送信しない
sdk.setUser({
  userKey: hashUserId(email), // ハッシュ化
  // email: email  // ❌ 送信しない
})
```

## 関連ドキュメント

- [データ駆動コアシステム](./data-driven-core.md)
- [プレイブックDSL仕様](./playbook-dsl-spec.md)
- [APIリファレンス](../api-reference/sdk-api.md)
- [サンプルアプリケーション](https://github.com/unsonos/sdk-examples)