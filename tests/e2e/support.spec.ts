import { test, expect } from '@playwright/test'

test.describe('サポートページ', () => {
  test('サポートページが正常に表示される', async ({ page }) => {
    await page.goto('/support')
    
    await expect(page).toHaveTitle(/サポート/)
    await expect(page.locator('h1')).toContainText('サポート')
  })

  test('FAQ検索機能が表示される', async ({ page }) => {
    await page.goto('/support')
    
    await expect(page.locator('input[placeholder*="FAQ"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('FAQ検索が機能する', async ({ page }) => {
    await page.goto('/support')
    
    await page.fill('input[placeholder*="FAQ"]', '料金')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=料金に関するFAQ')).toBeVisible()
  })

  test('主要FAQカテゴリが表示される', async ({ page }) => {
    await page.goto('/support')
    
    await expect(page.locator('text=アカウント・料金')).toBeVisible()
    await expect(page.locator('text=プロダクト利用')).toBeVisible()
    await expect(page.locator('text=技術的問題')).toBeVisible()
    await expect(page.locator('text=DAO・トークン')).toBeVisible()
  })

  test('FAQ項目が展開・折りたたみできる', async ({ page }) => {
    await page.goto('/support')
    
    const faqItem = page.locator('[data-testid="faq-item"]').first()
    await expect(faqItem).toBeVisible()
    
    await faqItem.click()
    await expect(page.locator('[data-testid="faq-answer"]').first()).toBeVisible()
  })

  test('お問い合わせフォームが表示される', async ({ page }) => {
    await page.goto('/support')
    
    await expect(page.locator('text=お問い合わせ')).toBeVisible()
    await expect(page.locator('input[placeholder*="お名前"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="メールアドレス"]')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="お問い合わせ内容"]')).toBeVisible()
  })

  test('お問い合わせフォームの送信が動作する', async ({ page }) => {
    await page.goto('/support')
    
    await page.fill('input[placeholder*="お名前"]', 'テスト太郎')
    await page.fill('input[placeholder*="メールアドレス"]', 'test@example.com')
    await page.selectOption('select', 'technical')
    await page.fill('textarea[placeholder*="お問い合わせ内容"]', 'テスト問い合わせです。')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=お問い合わせを受け付けました')).toBeVisible()
  })

  test('サポートオプションが表示される', async ({ page }) => {
    await page.goto('/support')
    
    await expect(page.locator('text=メールサポート')).toBeVisible()
    await expect(page.locator('text=チャットサポート')).toBeVisible()
    await expect(page.locator('text=コミュニティフォーラム')).toBeVisible()
  })

  test('ナレッジベースリンクが機能する', async ({ page }) => {
    await page.goto('/support')
    
    const knowledgeBaseLink = page.locator('text=ナレッジベースを見る')
    await expect(knowledgeBaseLink).toBeVisible()
    
    await knowledgeBaseLink.click()
    await expect(page.url()).toContain('/docs')
  })

  test('コミュニティリンクが機能する', async ({ page }) => {
    await page.goto('/support')
    
    const communityLink = page.locator('text=コミュニティに参加')
    await expect(communityLink).toBeVisible()
    
    await communityLink.click()
    await expect(page.url()).toContain('/community')
  })
})