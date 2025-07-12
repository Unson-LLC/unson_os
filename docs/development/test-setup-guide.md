# UnsonOS LP テスト環境構築ガイド

## 概要

t_wada方式のTDD（Test Driven Development）に基づくテスト環境構築。Red-Green-Refactorサイクルを重視し、最終的なコードにベタ書き・ハードコードが残らないことを保証。

## テスト戦略

### TDD アプローチ
1. **Red**: まず失敗するテストを書く
2. **Green**: テストを通すための最低限のコード（ベタ書き・ハードコード OK）
3. **Refactor**: **必ずベタ書き・ハードコードを除去**し、保守性を向上

### テストピラミッド
```
        E2E Tests (少数)
      ↗              ↖
Integration Tests (適度)
  ↗                    ↖
Unit Tests (多数・高速)
```

---

## 必要依存関係のインストール

### テスト関連パッケージ

```bash
# Core testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# MSW (Mock Service Worker) for API mocking
npm install -D msw

# Additional testing utilities
npm install -D @types/jest jest-axe @testing-library/jest-dom

# E2E testing with Playwright
npm install -D @playwright/test

# Test coverage
npm install -D @jest/coverage-v8
```

---

## Jest設定

### jest.config.js
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.jsアプリのディレクトリパス
  dir: './',
})

// Jestカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js
```javascript
import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

// MSW設定
import { server } from './src/mocks/server'

// テスト開始前にMSWサーバー起動
beforeAll(() => server.listen())

// 各テスト後にハンドラーリセット
afterEach(() => server.resetHandlers())

// テスト終了後にMSWサーバー停止
afterAll(() => server.close())

// IntersectionObserver のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

---

## MSW (Mock Service Worker) 設定

### src/mocks/handlers.ts
```typescript
import { rest } from 'msw'
import type { RevenueData, WaitlistEntry, ContactForm } from '@/types'

export const handlers = [
  // Revenue analytics API
  rest.get('/api/analytics/revenue', (req, res, ctx) => {
    const mockRevenueData: RevenueData = {
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: 12,
      communityMembers: 1250,
      lastUpdated: new Date(),
    }
    
    return res(
      ctx.status(200),
      ctx.json(mockRevenueData)
    )
  }),

  // Waitlist registration API
  rest.post('/api/waitlist', async (req, res, ctx) => {
    const body = await req.json() as WaitlistEntry
    
    if (!body.email) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email is required' })
      )
    }

    return res(
      ctx.status(201),
      ctx.json({ 
        message: 'Successfully added to waitlist',
        id: 'mock-id-123'
      })
    )
  }),

  // Contact form API  
  rest.post('/api/contact', async (req, res, ctx) => {
    const body = await req.json() as ContactForm
    
    if (!body.email || !body.name || !body.message) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Required fields missing' })
      )
    }

    return res(
      ctx.status(201),
      ctx.json({ 
        message: 'Contact form submitted successfully',
        id: 'contact-mock-id-456'
      })
    )
  }),

  // Error case for testing
  rest.get('/api/analytics/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    )
  }),
]
```

### src/mocks/server.ts
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node.js環境用のMSWサーバー設定
export const server = setupServer(...handlers)
```

### src/mocks/browser.ts
```typescript
import { setupWorker } from 'msw'
import { handlers } from './handlers'

// ブラウザ環境用のMSWワーカー設定
export const worker = setupWorker(...handlers)
```

---

## コンポーネントテスト例

### src/components/ui/__tests__/Button.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Component', () => {
  // Red: まず失敗するテストを書く
  it('should render with default variant and size', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-blue-600', 'h-10')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('border-gray-300')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-100')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('should support custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
```

### src/components/interactive/__tests__/DAOSimulator.test.tsx
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DAOSimulator } from '../DAOSimulator'

// モック: useAnalytics フック
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
  }),
}))

describe('DAOSimulator Component', () => {
  const user = userEvent.setup()

  it('should render simulator with default values', () => {
    render(<DAOSimulator />)
    
    // ヘッダーの確認
    expect(screen.getByText('🧮 DAO配当シミュレーター')).toBeInTheDocument()
    expect(screen.getByText(/あなたの貢献度に基づいて月収を計算/)).toBeInTheDocument()
    
    // デフォルト値の確認
    expect(screen.getByText('$100,000')).toBeInTheDocument() // 月間収益
    expect(screen.getByText('$40,000')).toBeInTheDocument() // 配当プール
  })

  it('should calculate points correctly with default metrics', () => {
    render(<DAOSimulator />)
    
    // デフォルト: 10*3 + 5*2 + 3*2 + 15*1 = 30 + 10 + 6 + 15 = 61pt
    expect(screen.getByText('61 pt')).toBeInTheDocument()
  })

  it('should update earnings when sliders change', async () => {
    render(<DAOSimulator />)
    
    // コード貢献スライダーを変更（テストでは属性を直接変更）
    const codeSlider = screen.getByDisplayValue('10') // デフォルトのコード貢献値
    await user.clear(codeSlider)
    await user.type(codeSlider, '20')
    
    // ポイント計算が更新されることを確認
    // 20*3 + 5*2 + 3*2 + 15*1 = 60 + 10 + 6 + 15 = 91pt
    await waitFor(() => {
      expect(screen.getByText('91 pt')).toBeInTheDocument()
    })
  })

  it('should update revenue pool when monthly revenue changes', async () => {
    render(<DAOSimulator />)
    
    // 月間収益を$200,000に変更
    const revenueSlider = screen.getByDisplayValue('100000')
    await user.clear(revenueSlider)
    await user.type(revenueSlider, '200000')
    
    // 配当プール（40%）が更新されることを確認
    await waitFor(() => {
      expect(screen.getByText('$80,000')).toBeInTheDocument()
    })
  })

  it('should show estimated earnings calculation', () => {
    render(<DAOSimulator />)
    
    // デフォルト計算: ($100,000 * 0.4 * 61) / 1000 = $2,440
    expect(screen.getByText('$2,440')).toBeInTheDocument()
    
    // 年収計算: $2,440 * 12 = $29,280
    expect(screen.getByText('$29,280')).toBeInTheDocument()
  })

  it('should track analytics when CTA is clicked', async () => {
    const mockTrack = jest.fn()
    jest.mocked(require('@/hooks/useAnalytics').useAnalytics).mockReturnValue({
      track: mockTrack,
    })

    render(<DAOSimulator />)
    
    const ctaButton = screen.getByText('今すぐDAO参加 →')
    await user.click(ctaButton)
    
    expect(mockTrack).toHaveBeenCalledWith('dao_simulator_cta_clicked', {
      estimatedEarnings: expect.any(Number),
    })
  })

  it('should be accessible', async () => {
    const { container } = render(<DAOSimulator />)
    
    // フォーカス可能な要素の確認
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(5) // 収益 + 4つの貢献指標
    
    // ラベル関連付けの確認
    expect(screen.getByLabelText(/月間収益総額/)).toBeInTheDocument()
    expect(screen.getByLabelText(/コード貢献/)).toBeInTheDocument()
  })
})
```

### src/components/interactive/__tests__/RevenueCounter.test.tsx
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RevenueCounter } from '../RevenueCounter'

// fetch のモック
global.fetch = jest.fn()

// useAnalytics のモック
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
  }),
}))

describe('RevenueCounter Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    // APIレスポンスを遅延させる
    ;(fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    render(<RevenueCounter />)
    
    // スケルトンローダーが表示されることを確認
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(4)
  })

  it('should display revenue data after loading', async () => {
    const mockData = {
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: 12,
      communityMembers: 1250,
      lastUpdated: new Date('2024-01-01T10:00:00Z'),
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<RevenueCounter />)
    
    // データが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('$250,000')).toBeInTheDocument()
      expect(screen.getByText('$50,000')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('1,250')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<RevenueCounter />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Revenue data fetch failed:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('should track analytics when counter cards are clicked', async () => {
    const mockTrack = jest.fn()
    jest.mocked(require('@/hooks/useAnalytics').useAnalytics).mockReturnValue({
      track: mockTrack,
    })

    const mockData = {
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: 12,
      communityMembers: 1250,
      lastUpdated: new Date(),
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<RevenueCounter />)
    
    await waitFor(() => {
      expect(screen.getByText('$250,000')).toBeInTheDocument()
    })

    // 総収益カードをクリック
    const totalRevenueCard = screen.getByText('総収益').closest('div')
    await user.click(totalRevenueCard!)
    
    expect(mockTrack).toHaveBeenCalledWith('revenue_counter_clicked', {
      metric: 'total_revenue',
    })
  })

  it('should update data every 30 seconds', async () => {
    jest.useFakeTimers()
    
    const mockData1 = {
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: 12,
      communityMembers: 1250,
      lastUpdated: new Date(),
    }

    const mockData2 = {
      totalRevenue: 260000,
      monthlyRevenue: 55000,
      activeProducts: 13,
      communityMembers: 1300,
      lastUpdated: new Date(),
    }

    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      })

    render(<RevenueCounter />)
    
    // 初期データの確認
    await waitFor(() => {
      expect(screen.getByText('$250,000')).toBeInTheDocument()
    })

    // 30秒経過をシミュレート
    jest.advanceTimersByTime(30000)
    
    // 更新されたデータの確認
    await waitFor(() => {
      expect(screen.getByText('$260,000')).toBeInTheDocument()
    })

    jest.useRealTimers()
  })

  it('should format currency and numbers correctly', async () => {
    const mockData = {
      totalRevenue: 1250000, // $1,250,000
      monthlyRevenue: 75500, // $75,500
      activeProducts: 25,
      communityMembers: 15750, // 15,750
      lastUpdated: new Date(),
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<RevenueCounter />)
    
    await waitFor(() => {
      expect(screen.getByText('$1,250,000')).toBeInTheDocument()
      expect(screen.getByText('$75,500')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('15,750')).toBeInTheDocument()
    })
  })
})
```

---

## APIテスト例

### src/app/api/waitlist/__tests__/route.test.ts
```typescript
import { POST } from '../route'
import { NextRequest } from 'next/server'

// Resend API のモック
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}))

describe('/api/waitlist', () => {
  it('should successfully add email to waitlist', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        role: 'developer',
        interests: ['dao', 'saas'],
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('id')
  })

  it('should return 400 for missing email', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Email is required')
  })

  it('should return 400 for invalid email format', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test User',
      }),
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid email format')
  })

  it('should handle duplicate email submissions', async () => {
    const email = 'duplicate@example.com'
    
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name: 'Test User',
      }),
    })

    // 1回目の登録
    const response1 = await POST(mockRequest)
    expect(response1.status).toBe(201)

    // 2回目の登録（重複）
    const response2 = await POST(mockRequest)
    const data2 = await response2.json()
    
    expect(response2.status).toBe(409)
    expect(data2.error).toContain('Email already registered')
  })
})
```

---

## ユーティリティ関数テスト

### src/lib/__tests__/utils.test.ts
```typescript
import { cn, formatCurrency, formatNumber, sleep } from '../utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle Tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })

  describe('formatCurrency function', () => {
    it('should format currency without decimals for whole numbers', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(50000)).toBe('$50,000')
      expect(formatCurrency(1250000)).toBe('$1,250,000')
    })

    it('should handle zero and negative numbers', () => {
      expect(formatCurrency(0)).toBe('$0')
      expect(formatCurrency(-1000)).toBe('-$1,000')
    })

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.50)).toBe('$1,001')
      expect(formatCurrency(999.99)).toBe('$1,000')
    })
  })

  describe('formatNumber function', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(999)).toBe('999')
    })
  })

  describe('sleep function', () => {
    it('should resolve after specified milliseconds', async () => {
      const start = Date.now()
      await sleep(100)
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(95) // 多少の誤差を許容
      expect(elapsed).toBeLessThan(150)
    })
  })
})
```

---

## E2Eテスト例（Playwright）

### tests/e2e/homepage.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section correctly', async ({ page }) => {
    // ヒーローセクションの要素確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('100個の')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('マイクロSaaS')
    
    // CTAボタンの確認
    await expect(page.getByRole('button', { name: /早期アクセス登録/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /デモを見る/ })).toBeVisible()
  })

  test('should navigate to DAO page', async ({ page }) => {
    await page.getByRole('link', { name: 'DAO参加' }).click()
    await expect(page).toHaveURL('/dao')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('DAO')
  })

  test('should submit waitlist form successfully', async ({ page }) => {
    // ウェイトリストフォームの場所に移動
    await page.getByRole('button', { name: /早期アクセス登録/ }).click()
    
    // フォーム入力
    await page.getByPlaceholder('メールアドレス').fill('test@example.com')
    await page.getByPlaceholder('お名前').fill('テストユーザー')
    await page.getByRole('button', { name: /登録/ }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText(/登録ありがとうございます/)).toBeVisible()
  })

  test('should interact with DAO simulator', async ({ page }) => {
    // DAO シミュレーターまでスクロール
    await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
    
    // スライダーを操作
    const codeSlider = page.getByLabel('コード貢献')
    await codeSlider.fill('20')
    
    // 計算結果の更新を確認
    await expect(page.getByText(/月収予想/)).toBeVisible()
    await expect(page.getByText(/\$[0-9,]+/)).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // アクセシビリティチェック
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // キーボードナビゲーション
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // モバイルビューポート
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // タブレットビューポート
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // デスクトップビューポート
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
```

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## package.json scripts 追加

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

---

## TDD ワークフロー例

### Red-Green-Refactor サイクル実践

#### 1. Red Phase (失敗するテストを書く)
```typescript
// __tests__/Button.test.tsx
it('should render primary button with correct styles', () => {
  render(<Button variant="primary">Click me</Button>)
  expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
})
```

#### 2. Green Phase (最低限の実装 - ベタ書き OK)
```typescript
// Button.tsx (Green Phase - ベタ書き)
export function Button({ children, variant }: ButtonProps) {
  if (variant === 'primary') {
    return <button className="bg-blue-600">{children}</button>
  }
  return <button>{children}</button>
}
```

#### 3. Refactor Phase (ベタ書き除去 - 必須)
```typescript
// Button.tsx (Refactor Phase - cva 使用)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white",
        secondary: "bg-gray-100 text-gray-900",
      },
    },
  }
)

export function Button({ children, variant, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)}>
      {children}
    </button>
  )
}
```

## まとめ

この設定により：
- **t_wada方式TDD**: Red-Green-Refactorサイクルの実践
- **包括的テスト**: Unit → Integration → E2E の完全カバー
- **モック戦略**: MSWによるAPI モッキング
- **アクセシビリティ**: jest-axe による自動チェック
- **継続的品質**: カバレッジ閾値とCI/CD統合