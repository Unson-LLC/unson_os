import { test, expect } from '@playwright/test'

test.describe('お問い合わせフォーム E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    
    // ページが完全に読み込まれるまで待機
    await expect(page.locator('h1')).toBeVisible()
  })

  test('お問い合わせフォームの基本機能', async ({ page }) => {
    // フォーム要素の存在確認（設計書に基づく）
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const companyInput = page.locator('input[name="company"]')
    const phoneInput = page.locator('input[name="phone"]')
    const typeSelect = page.locator('select[name="type"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 必須フィールドの表示確認
    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(typeSelect).toBeVisible()
    await expect(messageTextarea).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // 任意フィールドの表示確認
    await expect(companyInput).toBeVisible()
    await expect(phoneInput).toBeVisible()
    
    // 正常なお問い合わせ送信
    await nameInput.fill('山田太郎')
    await emailInput.fill('yamada@example.com')
    await companyInput.fill('株式会社テスト')
    await phoneInput.fill('03-1234-5678')
    await typeSelect.selectOption('一般的なお問い合わせ')
    await messageTextarea.fill('プラットフォームについて詳しく教えてください。')
    
    await submitButton.click()
    
    // 成功メッセージの確認
    await expect(page.locator('text=お問い合わせを送信しました')).toBeVisible({ timeout: 5000 })
    
    // フォームリセットの確認
    await expect(nameInput).toHaveValue('')
    await expect(emailInput).toHaveValue('')
    await expect(messageTextarea).toHaveValue('')
  })

  test('お問い合わせ種別の全選択肢確認', async ({ page }) => {
    const typeSelect = page.locator('select[name="type"]')
    
    // 設計書に基づく問い合わせ種別の確認
    const expectedOptions = [
      '一般的なお問い合わせ',
      '技術的な質問',
      '料金・プランについて',
      'カスタム開発の相談',
      'パートナーシップについて'
    ]
    
    for (const option of expectedOptions) {
      await expect(typeSelect.locator(`option:has-text("${option}")`)).toBeVisible()
    }
  })

  test('クエリパラメータ対応の確認', async ({ page }) => {
    // カスタム開発相談のクエリパラメータテスト
    await page.goto('/contact?type=custom-product')
    await expect(page.locator('h1')).toBeVisible()
    
    const typeSelect = page.locator('select[name="type"]')
    
    // クエリパラメータに基づいて問い合わせ種別が事前選択されることを確認
    const selectedValue = await typeSelect.inputValue()
    expect(selectedValue).toBe('カスタム開発の相談')
    
    // パートナーシップ相談のクエリパラメータテスト
    await page.goto('/contact?type=partnership')
    await expect(page.locator('h1')).toBeVisible()
    
    const partnershipSelected = await typeSelect.inputValue()
    expect(partnershipSelected).toBe('パートナーシップについて')
    
    // サポート問い合わせのクエリパラメータテスト
    await page.goto('/contact?type=support')
    await expect(page.locator('h1')).toBeVisible()
    
    const supportSelected = await typeSelect.inputValue()
    expect(supportSelected).toBe('技術的な質問')
  })

  test('バリデーションエラーの表示', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const typeSelect = page.locator('select[name="type"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 空の状態で送信（必須フィールドエラー）
    await submitButton.click()
    
    await expect(page.locator('text=名前を入力してください')).toBeVisible()
    await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible()
    await expect(page.locator('text=お問い合わせ種別を選択してください')).toBeVisible()
    await expect(page.locator('text=お問い合わせ内容を入力してください')).toBeVisible()
    
    // 名前の文字数制限テスト（設計書: 100文字以内）
    await nameInput.fill('あ'.repeat(101))
    await emailInput.fill('test@example.com')
    await typeSelect.selectOption('一般的なお問い合わせ')
    await messageTextarea.fill('テストメッセージ')
    await submitButton.click()
    
    await expect(page.locator('text=名前は100文字以内で入力してください')).toBeVisible()
    
    // メッセージの文字数制限テスト（設計書: 5000文字以内）
    await nameInput.fill('正常な名前')
    await messageTextarea.fill('あ'.repeat(5001))
    await submitButton.click()
    
    await expect(page.locator('text=お問い合わせ内容は5000文字以内で入力してください')).toBeVisible()
    
    // 無効なメールアドレス
    await emailInput.fill('invalid-email')
    await messageTextarea.fill('正常なメッセージ')
    await submitButton.click()
    
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
  })

  test('お問い合わせ方法セクションの表示', async ({ page }) => {
    // 設計書に基づく4つのお問い合わせ方法の確認
    await expect(page.locator('text=メールサポート')).toBeVisible()
    await expect(page.locator('text=ライブチャット')).toBeVisible()
    await expect(page.locator('text=電話サポート')).toBeVisible()
    await expect(page.locator('text=ビデオ通話')).toBeVisible()
    
    // 各方法の詳細情報確認
    await expect(page.locator('text=24時間以内返信')).toBeVisible()
    await expect(page.locator('text=平日10-18時')).toBeVisible()
    await expect(page.locator('text=緊急時対応')).toBeVisible()
    await expect(page.locator('text=技術相談・デモ')).toBeVisible()
  })

  test('オフィス情報セクションの表示', async ({ page }) => {
    // オフィス情報までスクロール
    await page.locator('text=オフィス情報').scrollIntoViewIfNeeded()
    
    // 設計書に基づく情報の確認
    await expect(page.locator('text=本社（東京）')).toBeVisible()
    await expect(page.locator('text=営業時間')).toBeVisible()
    await expect(page.locator('text=定休日')).toBeVisible()
    await expect(page.locator('text=緊急時サポート')).toBeVisible()
    
    // 住所・アクセス情報の表示確認
    const addressInfo = page.locator('text=住所').or(page.locator('text=アクセス'))
    await expect(addressInfo).toBeVisible()
  })

  test('フォーム送信のネットワークエラーハンドリング', async ({ page }) => {
    // ネットワークエラーをシミュレート
    await page.route('/api/contact', route => {
      route.abort('failed')
    })
    
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const typeSelect = page.locator('select[name="type"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 正常な入力でフォーム送信
    await nameInput.fill('エラーテスト')
    await emailInput.fill('error@example.com')
    await typeSelect.selectOption('一般的なお問い合わせ')
    await messageTextarea.fill('ネットワークエラーのテストです')
    
    await submitButton.click()
    
    // エラーメッセージの確認
    await expect(page.locator('text=送信に失敗しました')).toBeVisible({ timeout: 5000 })
    
    // フォームが再度送信可能な状態に戻ることを確認
    await expect(submitButton).toBeEnabled()
  })

  test('フォームのアクセシビリティ', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const typeSelect = page.locator('select[name="type"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // ラベルとの関連付けを確認
    const nameId = await nameInput.getAttribute('id')
    const nameLabel = await page.locator(`label[for="${nameId}"]`).count()
    expect(nameLabel).toBeGreaterThan(0)
    
    // キーボードナビゲーション
    await nameInput.focus()
    await expect(nameInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    // company fieldをスキップして次のフィールドへ
    
    await page.keyboard.press('Tab')
    // phone fieldをスキップして次のフィールドへ
    
    await page.keyboard.press('Tab')
    await expect(typeSelect).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(messageTextarea).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(submitButton).toBeFocused()
  })

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルビューポートでのテスト
    await page.setViewportSize({ width: 375, height: 667 })
    
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const typeSelect = page.locator('select[name="type"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    
    // モバイルでフォーム要素が適切に表示されることを確認
    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(typeSelect).toBeVisible()
    await expect(messageTextarea).toBeVisible()
    
    // モバイルでの入力テスト
    await nameInput.tap()
    await nameInput.fill('モバイルテスト')
    
    await emailInput.tap()
    await emailInput.fill('mobile@example.com')
    
    await typeSelect.tap()
    await typeSelect.selectOption('一般的なお問い合わせ')
    
    await messageTextarea.tap()
    await messageTextarea.fill('モバイルからのテストメッセージです')
    
    // モバイルでの送信
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.tap()
    
    await expect(page.locator('text=お問い合わせを送信しました')).toBeVisible({ timeout: 5000 })
  })
})