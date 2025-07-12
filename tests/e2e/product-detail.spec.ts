import { test, expect } from '@playwright/test'

test.describe('プロダクト詳細ページ', () => {
  test('プロダクト詳細ページが正常に表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page).toHaveTitle(/TaskFlow Pro/)
    await expect(page.locator('h1')).toContainText('TaskFlow Pro')
  })

  test('プロダクト情報が表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=チーム向けタスク管理とワークフロー自動化プラットフォーム')).toBeVisible()
    await expect(page.locator('text=¥2,980/月')).toBeVisible()
    await expect(page.locator('text=1,250+')).toBeVisible()
    await expect(page.locator('text=4.8')).toBeVisible()
  })

  test('機能一覧が表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=自動タスク分配')).toBeVisible()
    await expect(page.locator('text=ワークフロー可視化')).toBeVisible()
    await expect(page.locator('text=レポート自動生成')).toBeVisible()
  })

  test('詳細な機能説明セクションが表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=主な機能')).toBeVisible()
    await expect(page.locator('text=技術仕様')).toBeVisible()
    await expect(page.locator('text=料金プラン')).toBeVisible()
  })

  test('無料トライアルボタンが機能する', async ({ page }) => {
    await page.goto('/products/1')
    
    const trialButton = page.locator('text=無料トライアル開始')
    await expect(trialButton).toBeVisible()
    
    await trialButton.click()
    await expect(page.url()).toContain('/trial/1')
  })

  test('お問い合わせボタンが機能する', async ({ page }) => {
    await page.goto('/products/1')
    
    const contactButton = page.locator('text=お問い合わせ')
    await expect(contactButton).toBeVisible()
    
    await contactButton.click()
    await expect(page.url()).toContain('/contact')
  })

  test('関連プロダクトが表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=関連プロダクト')).toBeVisible()
    await expect(page.locator('[data-testid="related-products"]')).toBeVisible()
  })

  test('存在しないプロダクトIDで404ページが表示される', async ({ page }) => {
    await page.goto('/products/999')
    
    await expect(page.locator('text=プロダクトが見つかりません')).toBeVisible()
    await expect(page.locator('text=プロダクト一覧に戻る')).toBeVisible()
  })

  test('プロダクト2の詳細ページが正常に表示される', async ({ page }) => {
    await page.goto('/products/2')
    
    await expect(page).toHaveTitle(/DataSync Hub/)
    await expect(page.locator('h1')).toContainText('DataSync Hub')
    await expect(page.locator('text=複数システム間のリアルタイムデータ同期ソリューション')).toBeVisible()
  })

  test('価格情報とユーザー数が表示される', async ({ page }) => {
    await page.goto('/products/2')
    
    await expect(page.locator('text=¥4,500/月')).toBeVisible()
    await expect(page.locator('text=890+')).toBeVisible()
  })

  test('パンくずナビゲーションが表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=ホーム')).toBeVisible()
    await expect(page.locator('text=プロダクト')).toBeVisible()
    await expect(page.locator('text=TaskFlow Pro')).toBeVisible()
  })

  test('ユーザーレビューセクションが表示される', async ({ page }) => {
    await page.goto('/products/1')
    
    await expect(page.locator('text=ユーザーレビュー')).toBeVisible()
    await expect(page.locator('[data-testid="user-reviews"]')).toBeVisible()
  })
})