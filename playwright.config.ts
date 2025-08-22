import { defineConfig, devices } from '@playwright/test'

/**
 * PlaywrightでのE2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* テスト実行時の最大並列数 */
  fullyParallel: true,
  /* CI環境での失敗時の設定 */
  forbidOnly: !!process.env.CI,
  /* テスト失敗時のリトライ回数 */
  retries: process.env.CI ? 2 : 0,
  /* 並列実行するワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* レポーター設定 */
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }]
  ],
  
  /* 出力ディレクトリ設定 */
  outputDir: 'test-results/playwright-artifacts',

  /* すべてのテストプロジェクトで共有される設定 */
  use: {
    /* すべての失敗に対してトレースを収集 */
    trace: 'on-first-retry',
    /* スクリーンショット設定 */
    screenshot: 'only-on-failure',
    /* ベースURL */
    baseURL: 'http://localhost:3000',
  },

  /* ブラウザプロジェクト設定 */
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
    /* モバイルブラウザテスト */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})