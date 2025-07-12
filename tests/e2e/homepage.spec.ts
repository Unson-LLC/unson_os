import { test, expect } from '@playwright/test'

test.describe('ホームページ', () => {
  test('ページが正常に読み込まれる', async ({ page }) => {
    await page.goto('/')
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/Unson OS/i)
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toBeVisible()
    
    // ナビゲーションメニューの確認
    await expect(page.locator('nav')).toBeVisible()
  })

  test('基本的なナビゲーションが機能する', async ({ page }) => {
    await page.goto('/')
    
    // 各ナビゲーションリンクが存在することを確認
    const navLinks = page.locator('nav a')
    await expect(navLinks).toContainText(['ホーム', 'プロダクト', 'コミュニティ', 'ドキュメント'])
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // モバイルビューポートでテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // モバイルメニューボタンが表示される
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
    await expect(mobileMenuButton).toBeVisible()
    
    // デスクトップビューポートでテスト
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    
    // デスクトップナビゲーションが表示される
    const desktopNav = page.locator('nav')
    await expect(desktopNav).toBeVisible()
  })

  test('メタデータとSEO要素が正しく設定されている', async ({ page }) => {
    await page.goto('/')
    
    // メタディスクリプションの確認
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /Unson OS/)
    
    // OGタグの確認
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /Unson OS/)
    
    // 構造化データの存在確認
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toBeAttached()
  })
})