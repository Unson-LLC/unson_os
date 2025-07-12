import { test, expect } from '@playwright/test'

test.describe('採用情報ページ E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/careers')
    
    // ページが完全に読み込まれるまで待機
    await expect(page.locator('h1')).toBeVisible()
  })

  test('採用ページの基本構造確認', async ({ page }) => {
    // ヒーローセクションの確認
    await expect(page.locator('text=Unson OSキャリア')).toBeVisible()
    await expect(page.locator('text=革新的なチームに参加')).toBeVisible()
    
    // CTAボタンの確認
    const jobsButton = page.locator('a:has-text("求人を見る")')
    const cultureButton = page.locator('a:has-text("カルチャーを知る")')
    
    await expect(jobsButton).toBeVisible()
    await expect(cultureButton).toBeVisible()
    
    // ボタンのナビゲーション確認
    await jobsButton.click()
    
    // 求人セクションまでスクロールされることを確認
    await expect(page.locator('text=募集中のポジション')).toBeInViewport()
  })

  test('会社の魅力セクションの表示', async ({ page }) => {
    await page.locator('text=会社の魅力').scrollIntoViewIfNeeded()
    
    // 設計書に基づく4つの魅力ポイントの確認
    await expect(page.locator('text=最先端技術での開発')).toBeVisible()
    await expect(page.locator('text=フレキシブルな働き方')).toBeVisible()
    await expect(page.locator('text=成長機会の豊富さ')).toBeVisible()
    await expect(page.locator('text=DAOガバナンス参加')).toBeVisible()
  })

  test('募集中のポジション詳細確認', async ({ page }) => {
    await page.locator('text=募集中のポジション').scrollIntoViewIfNeeded()
    
    // 設計書に基づく4つの募集職種の確認
    const positions = [
      { title: 'AIエンジニア', type: 'フルタイム' },
      { title: 'フルスタックデベロッパー', type: 'フルタイム/契約' },
      { title: 'プロダクトマネージャー', type: 'フルタイム' },
      { title: 'UI/UXデザイナー', type: '契約' }
    ]
    
    for (const position of positions) {
      await expect(page.locator(`text=${position.title}`)).toBeVisible()
      await expect(page.locator(`text=${position.type}`)).toBeVisible()
    }
    
    // 各ポジションに応募ボタンがあることを確認
    const applyButtons = page.locator('button:has-text("応募する"), a:has-text("応募する")')
    const buttonCount = await applyButtons.count()
    expect(buttonCount).toBeGreaterThanOrEqual(4)
  })

  test('福利厚生セクションの表示', async ({ page }) => {
    await page.locator('text=福利厚生').scrollIntoViewIfNeeded()
    
    // 設計書に基づく福利厚生項目の確認
    await expect(page.locator('text=競争力のある給与')).toBeVisible()
    await expect(page.locator('text=成果ボーナス')).toBeVisible()
    await expect(page.locator('text=健康保険')).toBeVisible()
    await expect(page.locator('text=有給休暇')).toBeVisible()
    await expect(page.locator('text=学習支援')).toBeVisible()
    await expect(page.locator('text=機器支給')).toBeVisible()
    await expect(page.locator('text=DAOトークン付与')).toBeVisible()
    await expect(page.locator('text=ストックオプション')).toBeVisible()
  })

  test('チームの価値観セクション確認', async ({ page }) => {
    await page.locator('text=チームの価値観').scrollIntoViewIfNeeded()
    
    // 設計書に基づく4つの価値観の確認
    const values = [
      { icon: '🚀', title: 'イノベーション' },
      { icon: '🤝', title: '協働' },
      { icon: '🔍', title: '透明性' },
      { icon: '📚', title: '学習' }
    ]
    
    for (const value of values) {
      await expect(page.locator(`text=${value.icon}`)).toBeVisible()
      await expect(page.locator(`text=${value.title}`)).toBeVisible()
    }
  })

  test('選考プロセスの表示確認', async ({ page }) => {
    await page.locator('text=選考プロセス').scrollIntoViewIfNeeded()
    
    // 設計書に基づく5ステップの選考プロセス確認
    const processSteps = [
      { step: '書類選考', duration: '3-5日' },
      { step: '一次面接', duration: '1週間' },
      { step: '技術面接', duration: '1週間' },
      { step: '最終面接', duration: '3-5日' },
      { step: '内定・入社', duration: '2週間' }
    ]
    
    for (const step of processSteps) {
      await expect(page.locator(`text=${step.step}`)).toBeVisible()
      await expect(page.locator(`text=${step.duration}`)).toBeVisible()
    }
  })

  test('応募フォームの機能確認', async ({ page }) => {
    // 応募フォームまでスクロール
    await page.locator('text=応募フォーム').scrollIntoViewIfNeeded()
    
    // 設計書に基づくフォーム要素の確認
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const positionSelect = page.locator('select[name="position"]')
    const experienceTextarea = page.locator('textarea[name="experience"]')
    const coverLetterTextarea = page.locator('textarea[name="coverLetter"]')
    const portfolioInput = page.locator('input[name="portfolio"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 必須フィールドの表示確認
    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(positionSelect).toBeVisible()
    await expect(experienceTextarea).toBeVisible()
    await expect(coverLetterTextarea).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // 任意フィールドの表示確認
    await expect(portfolioInput).toBeVisible()
    
    // 正常な応募フォーム送信
    await nameInput.fill('田中花子')
    await emailInput.fill('tanaka@example.com')
    await positionSelect.selectOption('フルスタックデベロッパー')
    await experienceTextarea.fill('React、Node.js、TypeScriptでの開発経験3年')
    await coverLetterTextarea.fill('貴社の技術ビジョンに共感し、ぜひチームに貢献したいと考えています。')
    await portfolioInput.fill('https://github.com/tanaka-hanako')
    
    await submitButton.click()
    
    // 成功メッセージの確認
    await expect(page.locator('text=応募を受け付けました')).toBeVisible({ timeout: 5000 })
  })

  test('応募フォームのバリデーション', async ({ page }) => {
    await page.locator('text=応募フォーム').scrollIntoViewIfNeeded()
    
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const positionSelect = page.locator('select[name="position"]')
    const experienceTextarea = page.locator('textarea[name="experience"]')
    const coverLetterTextarea = page.locator('textarea[name="coverLetter"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 空の状態で送信（必須フィールドエラー）
    await submitButton.click()
    
    await expect(page.locator('text=名前を入力してください')).toBeVisible()
    await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible()
    await expect(page.locator('text=希望ポジションを選択してください')).toBeVisible()
    await expect(page.locator('text=経験・スキルを入力してください')).toBeVisible()
    await expect(page.locator('text=志望動機を入力してください')).toBeVisible()
    
    // 文字数制限のテスト（設計書に基づく）
    await nameInput.fill('あ'.repeat(101)) // 100文字制限
    await emailInput.fill('test@example.com')
    await positionSelect.selectOption('AIエンジニア')
    await experienceTextarea.fill('正常な経験')
    await coverLetterTextarea.fill('あ'.repeat(5001)) // 5000文字制限
    
    await submitButton.click()
    
    await expect(page.locator('text=名前は100文字以内で入力してください')).toBeVisible()
    await expect(page.locator('text=志望動機は5000文字以内で入力してください')).toBeVisible()
    
    // 無効なメールアドレス
    await nameInput.fill('正常な名前')
    await emailInput.fill('invalid-email')
    await coverLetterTextarea.fill('正常な志望動機')
    
    await submitButton.click()
    
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
  })

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルビューポートでのテスト
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 主要セクションがモバイルで適切に表示されることを確認
    await expect(page.locator('text=Unson OSキャリア')).toBeVisible()
    
    await page.locator('text=募集中のポジション').scrollIntoViewIfNeeded()
    await expect(page.locator('text=募集中のポジション')).toBeVisible()
    
    // モバイルでの応募フォーム操作
    await page.locator('text=応募フォーム').scrollIntoViewIfNeeded()
    
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    
    await nameInput.tap()
    await nameInput.fill('モバイルユーザー')
    
    await emailInput.tap()
    await emailInput.fill('mobile@example.com')
    
    // フォーム要素がモバイルで適切に操作できることを確認
    await expect(nameInput).toHaveValue('モバイルユーザー')
    await expect(emailInput).toHaveValue('mobile@example.com')
  })
})