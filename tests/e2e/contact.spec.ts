import { test, expect } from '@playwright/test'

test.describe('お問い合わせページ', () => {
  test('お問い合わせページが正常に表示される', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page).toHaveTitle(/お問い合わせ/)
    await expect(page.locator('h1')).toContainText('お問い合わせ')
  })

  test('お問い合わせフォームが表示される', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.locator('input[placeholder*="お名前"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="メールアドレス"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="会社名"]')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="お問い合わせ内容"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('お問い合わせフォームの送信が動作する', async ({ page }) => {
    await page.goto('/contact')
    
    await page.fill('input[placeholder*="お名前"]', 'テスト太郎')
    await page.fill('input[placeholder*="メールアドレス"]', 'test@example.com')
    await page.fill('input[placeholder*="会社名"]', 'テスト株式会社')
    await page.selectOption('select', 'general')
    await page.fill('textarea[placeholder*="お問い合わせ内容"]', 'テスト問い合わせです。')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=お問い合わせを受け付けました')).toBeVisible()
  })

  test('URLパラメータで問い合わせ種別が自動選択される', async ({ page }) => {
    await page.goto('/contact?type=custom-product')
    
    const select = page.locator('select')
    await expect(select).toHaveValue('custom-product')
  })

  test('連絡先情報が表示される', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.locator('text=直接お電話でのお問い合わせ')).toBeVisible()
    await expect(page.locator('text=メールでのお問い合わせ')).toBeVisible()
    await expect(page.locator('text=support@unson.com')).toBeVisible()
  })

  test('営業時間情報が表示される', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.locator('text=営業時間')).toBeVisible()
    await expect(page.locator('text=平日 9:00-18:00')).toBeVisible()
  })

  test('よくある質問へのリンクが機能する', async ({ page }) => {
    await page.goto('/contact')
    
    const faqLink = page.locator('text=よくある質問を見る')
    await expect(faqLink).toBeVisible()
    
    await faqLink.click()
    await expect(page.url()).toContain('/support')
  })

  test('各種お問い合わせタイプが選択できる', async ({ page }) => {
    await page.goto('/contact')
    
    const select = page.locator('select')
    
    await select.selectOption('general')
    await expect(select).toHaveValue('general')
    
    await select.selectOption('technical')
    await expect(select).toHaveValue('technical')
    
    await select.selectOption('partnership')
    await expect(select).toHaveValue('partnership')
  })

  test('必須項目のバリデーションが動作する', async ({ page }) => {
    await page.goto('/contact')
    
    await page.click('button[type="submit"]')
    
    const nameInput = page.locator('input[placeholder*="お名前"]')
    await expect(nameInput).toHaveAttribute('required')
    
    const emailInput = page.locator('input[placeholder*="メールアドレス"]')
    await expect(emailInput).toHaveAttribute('required')
  })

  test('緊急時のサポート情報が表示される', async ({ page }) => {
    await page.goto('/contact')
    
    await expect(page.locator('text=緊急時のサポート')).toBeVisible()
    await expect(page.locator('text=24時間以内')).toBeVisible()
  })
})