# UnsonOS LP 統合・E2Eテスト基盤

## 概要

統合テスト（Integration Tests）とE2E（End-to-End）テストの完全な基盤設計。実際のユーザーフローをテストし、システム全体の品質を保証。TDD原則に従い、信頼性の高いテスト環境を構築。

---

## Playwright E2Eテスト環境

### インストールと設定

```bash
# Playwright のインストール
npm install -D @playwright/test

# ブラウザバイナリのインストール
npx playwright install

# 追加の依存関係
npm install -D @axe-core/playwright # アクセシビリティテスト
```

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
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

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

---

## ユーザーフロー E2E テスト

### tests/e2e/user-journeys/waitlist-signup.spec.ts
```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Waitlist Signup Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await injectAxe(page) // アクセシビリティテスト準備
  })

  test('should complete full waitlist signup flow', async ({ page }) => {
    // Step 1: ヒーローセクションからCTAクリック
    await page.getByRole('button', { name: /早期アクセス登録/ }).click()
    
    // Step 2: ウェイトリストページに移動
    await expect(page).toHaveURL('/waitlist')
    await expect(page.getByRole('heading', { name: /早期アクセス/ })).toBeVisible()
    
    // Step 3: フォーム入力
    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByLabel('お名前').fill('テストユーザー')
    await page.getByLabel('職種').selectOption('developer')
    
    // 興味のある分野をチェック
    await page.getByLabel('DAO参加').check()
    await page.getByLabel('プロダクト開発').check()
    
    // Step 4: フォーム送信
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // Step 5: 成功メッセージの確認
    await expect(page.getByText(/登録ありがとうございます/)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/確認メールを送信しました/)).toBeVisible()
    
    // Step 6: 次のステップ案内の確認
    await expect(page.getByRole('link', { name: /DAO参加について詳しく/ })).toBeVisible()
    
    // アクセシビリティチェック
    await checkA11y(page)
  })

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/waitlist')
    
    // 空のフォームで送信
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // バリデーションエラーの確認
    await expect(page.getByText(/メールアドレスは必須です/)).toBeVisible()
    await expect(page.getByText(/お名前は必須です/)).toBeVisible()
    
    // 無効なメールアドレスのテスト
    await page.getByLabel('メールアドレス').fill('invalid-email')
    await page.getByLabel('お名前').fill('テストユーザー')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    await expect(page.getByText(/正しいメールアドレスを入力してください/)).toBeVisible()
  })

  test('should handle duplicate email registration', async ({ page }) => {
    // Mock API response for duplicate email
    await page.route('/api/waitlist', route => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already registered' })
      })
    })
    
    await page.goto('/waitlist')
    
    await page.getByLabel('メールアドレス').fill('existing@example.com')
    await page.getByLabel('お名前').fill('既存ユーザー')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    await expect(page.getByText(/このメールアドレスは既に登録されています/)).toBeVisible()
  })

  test('should track analytics events during signup', async ({ page }) => {
    // Analytics tracking のモニタリング
    const analyticsEvents: any[] = []
    
    await page.addInitScript(() => {
      (window as any).gtag = (...args: any[]) => {
        (window as any).analyticsEvents = (window as any).analyticsEvents || []
        ;(window as any).analyticsEvents.push(args)
      }
    })
    
    await page.goto('/waitlist')
    
    // フォーム入力開始
    await page.getByLabel('メールアドレス').fill('analytics@example.com')
    
    // フォーム送信
    await page.getByLabel('お名前').fill('Analytics User')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // Analytics イベントの確認
    const events = await page.evaluate(() => (window as any).analyticsEvents)
    
    expect(events).toContainEqual([
      'event',
      'waitlist_form_submitted',
      expect.objectContaining({
        hasName: true,
      })
    ])
  })
})
```

### tests/e2e/user-journeys/dao-simulator-interaction.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('DAO Simulator Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // DAO シミュレーターまでスクロール
    await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
  })

  test('should interact with all simulator controls', async ({ page }) => {
    // 初期値の確認
    await expect(page.getByText('$100,000')).toBeVisible() // 月間収益
    await expect(page.getByText('61 pt')).toBeVisible() // 初期ポイント
    
    // 月間収益スライダーを調整
    const revenueSlider = page.getByLabel(/月間収益総額/)
    await revenueSlider.fill('200000')
    
    // 配当プールの更新を確認
    await expect(page.getByText('$80,000')).toBeVisible() // 40% of $200,000
    
    // コード貢献スライダーを調整
    const codeSlider = page.getByLabel(/コード貢献/)
    await codeSlider.fill('20')
    
    // ポイント計算の更新を確認
    await expect(page.getByText('91 pt')).toBeVisible() // 更新されたポイント
    
    // 収益予想の更新を確認
    const earningsText = await page.getByText(/\$[0-9,]+/).first().textContent()
    expect(parseInt(earningsText!.replace(/[$,]/g, ''))).toBeGreaterThan(5000)
    
    // CTA ボタンのクリック
    await page.getByRole('button', { name: /今すぐDAO参加/ }).click()
    
    // DAO参加ページへの遷移を確認
    await expect(page).toHaveURL('/dao')
  })

  test('should be responsive on mobile devices', async ({ page, browserName }) => {
    if (browserName !== 'chromium') return // モバイルテストはChromiumのみ
    
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
    
    // モバイルでのスライダー操作
    const codeSlider = page.getByLabel(/コード貢献/)
    await codeSlider.tap()
    await codeSlider.fill('15')
    
    // 結果の確認
    await expect(page.getByText(/月収予想/)).toBeVisible()
    
    // CTA ボタンのタップ
    await page.getByRole('button', { name: /今すぐDAO参加/ }).tap()
    await expect(page).toHaveURL('/dao')
  })

  test('should handle extreme values gracefully', async ({ page }) => {
    await page.goto('/')
    await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
    
    // 最大値でテスト
    await page.getByLabel(/月間収益総額/).fill('1000000')
    await page.getByLabel(/コード貢献/).fill('50')
    await page.getByLabel(/バグ修正/).fill('30')
    await page.getByLabel(/デザイン/).fill('20')
    await page.getByLabel(/Q&A/).fill('100')
    
    // 計算結果が表示されることを確認
    await expect(page.getByText(/\$[0-9,]+/)).toBeVisible()
    
    // 最小値でテスト
    await page.getByLabel(/月間収益総額/).fill('10000')
    await page.getByLabel(/コード貢献/).fill('0')
    await page.getByLabel(/バグ修正/).fill('0')
    await page.getByLabel(/デザイン/).fill('0')
    await page.getByLabel(/Q&A/).fill('0')
    
    // ゼロポイントでも正常に動作することを確認
    await expect(page.getByText('0 pt')).toBeVisible()
    await expect(page.getByText('$0')).toBeVisible()
  })
})
```

### tests/e2e/user-journeys/cross-page-navigation.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('Cross-Page Navigation', () => {
  test('should navigate through all main pages', async ({ page }) => {
    // ホームページから開始
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('100個の')
    
    // DAO参加ページへ
    await page.getByRole('link', { name: 'DAO参加' }).click()
    await expect(page).toHaveURL('/dao')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('DAO')
    
    // 投資家向けページへ
    await page.getByRole('link', { name: '投資家向け' }).click()
    await expect(page).toHaveURL('/investors')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('投資家')
    
    // ドキュメントページへ
    await page.getByRole('link', { name: 'ドキュメント' }).click()
    await expect(page).toHaveURL('/docs')
    
    // ホームページに戻る
    await page.getByRole('link', { name: 'UnsonOS' }).click()
    await expect(page).toHaveURL('/')
  })

  test('should maintain state across page navigation', async ({ page }) => {
    await page.goto('/')
    
    // ローカルストレージに設定を保存
    await page.evaluate(() => {
      localStorage.setItem('userPreferences', JSON.stringify({
        theme: 'dark',
        language: 'ja',
      }))
    })
    
    // 別ページに移動
    await page.getByRole('link', { name: 'DAO参加' }).click()
    
    // 設定が保持されていることを確認
    const preferences = await page.evaluate(() => 
      localStorage.getItem('userPreferences')
    )
    expect(JSON.parse(preferences!)).toEqual({
      theme: 'dark',
      language: 'ja',
    })
  })

  test('should handle 404 errors gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page')
    
    await expect(page.getByRole('heading')).toContainText('404')
    await expect(page.getByText(/ページが見つかりません/)).toBeVisible()
    
    // ホームページに戻るリンク
    await page.getByRole('link', { name: /ホームページに戻る/ }).click()
    await expect(page).toHaveURL('/')
  })
})
```

---

## 統合テスト（Integration Tests）

### tests/integration/api-frontend-integration.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('API-Frontend Integration', () => {
  test('should handle API responses correctly', async ({ page }) => {
    // Mock successful API response
    await page.route('/api/waitlist', route => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Successfully added to waitlist',
          id: 'test-id-123'
        })
      })
    })
    
    await page.goto('/waitlist')
    
    await page.getByLabel('メールアドレス').fill('integration@example.com')
    await page.getByLabel('お名前').fill('Integration Test')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // API レスポンスに基づく UI 更新の確認
    await expect(page.getByText(/登録ありがとうございます/)).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/waitlist', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        })
      })
    })
    
    await page.goto('/waitlist')
    
    await page.getByLabel('メールアドレス').fill('error@example.com')
    await page.getByLabel('お名前').fill('Error Test')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // エラーハンドリングの確認
    await expect(page.getByText(/エラーが発生しました/)).toBeVisible()
    await expect(page.getByRole('button', { name: /再試行/ })).toBeVisible()
  })

  test('should handle network timeouts', async ({ page }) => {
    // Mock timeout response
    await page.route('/api/waitlist', route => {
      // 10秒後にタイムアウト
      setTimeout(() => {
        route.fulfill({
          status: 408,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Request timeout'
          })
        })
      }, 10000)
    })
    
    await page.goto('/waitlist')
    
    await page.getByLabel('メールアドレス').fill('timeout@example.com')
    await page.getByLabel('お名前').fill('Timeout Test')
    await page.getByRole('button', { name: /登録する/ }).click()
    
    // ローディング状態の確認
    await expect(page.getByText(/送信中/)).toBeVisible()
    
    // タイムアウトエラーの確認
    await expect(page.getByText(/タイムアウトしました/)).toBeVisible({ timeout: 15000 })
  })
})
```

### tests/integration/database-integration.test.ts
```typescript
/**
 * Note: This would be a Node.js test file, not a Playwright test
 * Run with Jest in Node environment
 */
import { createMockRequest } from '@/test-utils/api-helpers'
import { POST as waitlistPOST } from '@/app/api/waitlist/route'

// 実際のデータベース接続をテスト（テスト用DB使用）
describe('Database Integration Tests', () => {
  beforeAll(async () => {
    // テスト用データベースのセットアップ
    await setupTestDatabase()
  })

  afterAll(async () => {
    // テスト用データベースのクリーンアップ
    await cleanupTestDatabase()
  })

  beforeEach(async () => {
    // 各テスト前にデータベースをリセット
    await resetTestDatabase()
  })

  test('should persist waitlist data correctly', async () => {
    const requestData = {
      email: 'db-test@example.com',
      name: 'Database Test User',
      role: 'developer',
      interests: ['dao', 'saas'],
    }

    const request = createMockRequest('POST', '/api/waitlist', requestData)
    const response = await waitlistPOST(request)
    
    expect(response.status).toBe(201)
    
    // データベースから直接データを確認
    const savedEntry = await getWaitlistEntryByEmail('db-test@example.com')
    expect(savedEntry).toMatchObject({
      email: 'db-test@example.com',
      name: 'Database Test User',
      role: 'developer',
      interests: ['dao', 'saas'],
    })
    expect(savedEntry.createdAt).toBeInstanceOf(Date)
  })

  test('should handle database constraints', async () => {
    const requestData = {
      email: 'duplicate@example.com',
      name: 'First User',
    }

    // 初回登録
    const request1 = createMockRequest('POST', '/api/waitlist', requestData)
    const response1 = await waitlistPOST(request1)
    expect(response1.status).toBe(201)

    // 重複登録の試行
    const request2 = createMockRequest('POST', '/api/waitlist', {
      ...requestData,
      name: 'Second User',
    })
    const response2 = await waitlistPOST(request2)
    expect(response2.status).toBe(409)
  })

  test('should handle database connection failures', async () => {
    // データベース接続を一時的に無効化
    await disconnectTestDatabase()

    const requestData = {
      email: 'connection-error@example.com',
      name: 'Connection Error User',
    }

    const request = createMockRequest('POST', '/api/waitlist', requestData)
    const response = await waitlistPOST(request)
    
    expect(response.status).toBe(500)
    
    // データベース接続を復旧
    await reconnectTestDatabase()
  })
})

// テストヘルパー関数
async function setupTestDatabase() {
  // テスト用データベースの初期化
}

async function cleanupTestDatabase() {
  // テスト用データベースの削除
}

async function resetTestDatabase() {
  // データベーステーブルのリセット
}

async function getWaitlistEntryByEmail(email: string) {
  // データベースからエントリを取得
}

async function disconnectTestDatabase() {
  // データベース接続を無効化
}

async function reconnectTestDatabase() {
  // データベース接続を復旧
}
```

---

## パフォーマンステスト

### tests/performance/page-performance.spec.ts
```typescript
import { test, expect } from '@playwright/test'

test.describe('Page Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/')
    
    // Core Web Vitals の測定
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {}
        
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // FID (First Input Delay) - シミュレート
        document.addEventListener('click', () => {
          vitals.fid = performance.now()
        }, { once: true })
        
        // CLS (Cumulative Layout Shift)
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          vitals.cls = clsValue
        }).observe({ entryTypes: ['layout-shift'] })
        
        setTimeout(() => resolve(vitals), 5000)
      })
    })
    
    // Core Web Vitals の閾値チェック
    expect(webVitals.lcp).toBeLessThan(2500) // LCP < 2.5s
    expect(webVitals.cls).toBeLessThan(0.1)  // CLS < 0.1
  })

  test('should load all critical resources within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // ヒーローセクションの表示を待機
    await page.getByRole('heading', { level: 1 }).waitFor()
    
    const loadTime = Date.now() - startTime
    
    // 3秒以内に主要コンテンツが表示されることを確認
    expect(loadTime).toBeLessThan(3000)
  })

  test('should handle heavy interactions without blocking', async ({ page }) => {
    await page.goto('/')
    await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
    
    const startTime = Date.now()
    
    // 複数のスライダーを同時に操作
    await Promise.all([
      page.getByLabel(/月間収益総額/).fill('500000'),
      page.getByLabel(/コード貢献/).fill('25'),
      page.getByLabel(/バグ修正/).fill('15'),
      page.getByLabel(/デザイン/).fill('10'),
      page.getByLabel(/Q&A/).fill('50'),
    ])
    
    // 結果の更新を待機
    await page.getByText(/月収予想/).waitFor()
    
    const interactionTime = Date.now() - startTime
    
    // インタラクションが1秒以内に完了することを確認
    expect(interactionTime).toBeLessThan(1000)
  })
})
```

---

## アクセシビリティテスト

### tests/accessibility/a11y-compliance.spec.ts
```typescript
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y, getViolations } from 'axe-playwright'

test.describe('Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
  })

  test('should meet WCAG 2.1 AA standards on homepage', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('should meet WCAG 2.1 AA standards on DAO page', async ({ page }) => {
    await page.goto('/dao')
    await checkA11y(page)
  })

  test('should meet WCAG 2.1 AA standards on waitlist form', async ({ page }) => {
    await page.goto('/waitlist')
    await checkA11y(page)
  })

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/')
    
    // Tab navigation through interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    let focusedElements = 0
    
    // Navigate through all tabbable elements
    for (let i = 0; i < 20; i++) {
      const focusedElement = await page.locator(':focus').count()
      if (focusedElement > 0) {
        focusedElements++
      }
      await page.keyboard.press('Tab')
    }
    
    // At least 10 interactive elements should be focusable
    expect(focusedElements).toBeGreaterThan(10)
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper landmarks
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // Only one h1 per page
    
    // Check for alt text on images
    const images = await page.locator('img').all()
    for (const image of images) {
      const alt = await image.getAttribute('alt')
      expect(alt).toBeTruthy() // All images should have alt text
    }
  })

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for skip links
    await expect(page.getByRole('link', { name: /メインコンテンツにスキップ/ })).toBeVisible()
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    
    for (let i = 0; i < headings.length - 1; i++) {
      const currentLevel = parseInt((await headings[i].tagName()).substring(1))
      const nextLevel = parseInt((await headings[i + 1].tagName()).substring(1))
      
      // Heading levels should not skip (e.g., h1 -> h3)
      expect(nextLevel - currentLevel).toBeLessThanOrEqual(1)
    }
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addStyleTag({
      content: `
        * {
          background: black !important;
          color: white !important;
          border-color: white !important;
        }
      `
    })
    
    await page.goto('/')
    
    // Check that content is still visible and readable
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: /早期アクセス登録/ })).toBeVisible()
  })

  test('should support voice navigation commands', async ({ page }) => {
    await page.goto('/')
    
    // Test voice control simulation (click by voice)
    await page.getByRole('button', { name: /早期アクセス登録/ }).click()
    await expect(page).toHaveURL('/waitlist')
    
    // Navigate by voice commands (link by name)
    await page.getByRole('link', { name: 'DAO参加' }).click()
    await expect(page).toHaveURL('/dao')
  })
})
```

---

## モバイル・レスポンシブテスト

### tests/responsive/mobile-experience.spec.ts
```typescript
import { test, expect, devices } from '@playwright/test'

const mobileDevices = [
  devices['iPhone 12'],
  devices['iPhone 12 Pro'],
  devices['Pixel 5'],
  devices['Galaxy S21'],
]

mobileDevices.forEach(device => {
  test.describe(`Mobile Experience - ${device.userAgent?.split(' ').pop()}`, () => {
    test.use({ ...device })

    test('should display mobile navigation correctly', async ({ page }) => {
      await page.goto('/')
      
      // Mobile menu button should be visible
      await expect(page.getByRole('button', { name: /メニュー/ })).toBeVisible()
      
      // Desktop navigation should be hidden
      const desktopNav = page.locator('nav >> text=ホーム')
      await expect(desktopNav).toHaveCount(0)
      
      // Open mobile menu
      await page.getByRole('button', { name: /メニュー/ }).tap()
      
      // Menu items should be visible
      await expect(page.getByRole('link', { name: 'ホーム' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'DAO参加' })).toBeVisible()
    })

    test('should handle touch interactions correctly', async ({ page }) => {
      await page.goto('/')
      await page.getByText('DAO配当シミュレーター').scrollIntoViewIfNeeded()
      
      // Touch slider interaction
      const slider = page.getByLabel(/コード貢献/)
      
      // Get slider bounding box
      const sliderBox = await slider.boundingBox()
      if (sliderBox) {
        // Tap at 75% position
        await page.touchscreen.tap(
          sliderBox.x + sliderBox.width * 0.75,
          sliderBox.y + sliderBox.height / 2
        )
      }
      
      // Verify value changed
      const value = await slider.inputValue()
      expect(parseInt(value)).toBeGreaterThan(30)
    })

    test('should display content without horizontal scroll', async ({ page }) => {
      await page.goto('/')
      
      // Check that page width doesn't exceed viewport
      const viewportWidth = page.viewportSize()?.width || 0
      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
      
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // 5px tolerance
    })

    test('should have appropriately sized touch targets', async ({ page }) => {
      await page.goto('/')
      
      // All buttons should be at least 44x44px (Apple guidelines)
      const buttons = await page.locator('button').all()
      
      for (const button of buttons) {
        const box = await button.boundingBox()
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })
})
```

---

## CI/CD統合

### .github/workflows/e2e-tests.yml
```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps ${{ matrix.browser }}
      
    - name: Build application
      run: npm run build
      
    - name: Run E2E tests
      run: npx playwright test --project=${{ matrix.browser }}
      env:
        E2E_BASE_URL: http://localhost:3000
        
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-${{ matrix.browser }}
        path: playwright-report/
        retention-days: 30
```

### package.json scripts 拡張
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
    "test:e2e:a11y": "playwright test tests/accessibility/",
    "test:e2e:performance": "playwright test tests/performance/",
    "test:integration": "jest tests/integration/",
    "test:all": "npm run test && npm run test:integration && npm run test:e2e"
  }
}
```

---

## テストレポート生成

### tests/utils/test-reporter.ts
```typescript
/**
 * カスタムテストレポーター
 * 統合・E2Eテストの結果を集約してレポート生成
 */
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter'

class UnsonOSTestReporter implements Reporter {
  private startTime: number = 0
  private results: TestResult[] = []

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now()
    console.log(`\n🚀 UnsonOS LP テスト開始: ${suite.allTests().length} tests`)
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push(result)
    
    const status = result.status === 'passed' ? '✅' : '❌'
    const duration = result.duration
    
    console.log(`${status} ${test.title} (${duration}ms)`)
    
    if (result.status === 'failed') {
      console.log(`   Error: ${result.error?.message}`)
    }
  }

  onEnd() {
    const duration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.status === 'passed').length
    const failed = this.results.filter(r => r.status === 'failed').length
    const skipped = this.results.filter(r => r.status === 'skipped').length
    
    console.log(`\n📊 テスト結果サマリー:`)
    console.log(`   合計: ${this.results.length}`)
    console.log(`   成功: ${passed}`)
    console.log(`   失敗: ${failed}`)
    console.log(`   スキップ: ${skipped}`)
    console.log(`   実行時間: ${duration}ms`)
    
    // 失敗があった場合は詳細を出力
    if (failed > 0) {
      console.log(`\n❌ 失敗したテスト:`)
      this.results
        .filter(r => r.status === 'failed')
        .forEach(r => {
          console.log(`   - ${r.error?.message}`)
        })
    }
    
    console.log(`\n🎯 カバレッジレポート: ./coverage/index.html`)
    console.log(`📝 詳細レポート: ./playwright-report/index.html`)
  }
}

export default UnsonOSTestReporter
```

この包括的な統合・E2Eテスト基盤により、UnsonOS LPの品質を実際のユーザー体験レベルで保証し、TDDアプローチでの継続的な改善が可能になります。