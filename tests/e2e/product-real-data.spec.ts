import { test, expect } from '@playwright/test'

test.describe('プロダクトページ - 実データ表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('実サービスのバッジが表示される', async ({ page }) => {
    const mywaCard = page.locator('[data-testid="product-card-MyWa（マイワ）"]')
    
    await expect(mywaCard).toBeVisible()
    await expect(mywaCard.locator('[data-testid="real-service-badge"]')).toBeVisible()
    await expect(mywaCard.locator('[data-testid="real-service-badge"]')).toContainText('運用中')
  })

  test('サービスURLへのリンクが表示される', async ({ page }) => {
    const mywaCard = page.locator('[data-testid="product-card-MyWa（マイワ）"]')
    
    const serviceLink = mywaCard.locator('[data-testid="service-url-link"]')
    await expect(serviceLink).toBeVisible()
    await expect(serviceLink).toHaveAttribute('href', 'https://mywa.unson.jp/')
    await expect(serviceLink).toContainText('サービスを見る')
  })

  test('LPへのリンクが表示される', async ({ page }) => {
    const mywaCard = page.locator('[data-testid="product-card-MyWa（マイワ）"]')
    
    const lpLink = mywaCard.locator('[data-testid="lp-link"]')
    await expect(lpLink).toBeVisible()
    await expect(lpLink).toHaveAttribute('href', 'https://mywa.unson.jp/')
  })

  test('詳細ページで広告LP情報が表示される', async ({ page }) => {
    await page.goto('/products/0')
    
    const adSection = page.locator('[data-testid="advertising-lps-section"]')
    await expect(adSection).toBeVisible()
    await expect(adSection).toContainText('広告運用LP')
    
    const adLPCard = adSection.locator('[data-testid="ad-lp-card"]').first()
    await expect(adLPCard).toContainText('Facebook')
    await expect(adLPCard).toContainText('コンバージョン率')
  })

  test('実サービスと構想段階のサービスが区別される', async ({ page }) => {
    const realServiceCards = page.locator('[data-testid="real-service-badge"]')
    const conceptCards = page.locator('[data-testid="concept-badge"]')
    
    await expect(realServiceCards).toHaveCount(1)
    await expect(conceptCards.first()).toBeVisible()
  })
})