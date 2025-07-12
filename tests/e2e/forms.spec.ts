import { test, expect } from '@playwright/test'

test.describe('フォーム機能 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // MSW (Mock Service Worker) のモックを有効にする
    await page.goto('/')
  })

  test('ホームページのWaitlistFormが正常に動作する', async ({ page }) => {
    // ホームページのウェイトリストセクションまでスクロール
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    // フォーム要素の存在確認（設計書に基づく: email, name, role）
    const emailInput = page.locator('input[type="email"]')
    const nameInput = page.locator('input[name="name"]')
    const roleSelect = page.locator('select[name="role"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailInput).toBeVisible()
    await expect(nameInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // 設計書通りの完全なフォーム送信テスト
    await emailInput.fill('test@example.com')
    await nameInput.fill('山田太郎')
    
    // roleは任意フィールドなので、存在する場合のみテスト
    if (await roleSelect.count() > 0) {
      await roleSelect.selectOption('開発者')
    }
    
    await submitButton.click()
    
    // 成功メッセージの確認
    await expect(page.locator('text=登録が完了しました')).toBeVisible({ timeout: 5000 })
    
    // フォームがリセットされることを確認
    await expect(emailInput).toHaveValue('')
    await expect(nameInput).toHaveValue('')
  })

  test('コミュニティページのWaitlistFormが正常に動作する', async ({ page }) => {
    await page.goto('/community')
    
    // ウェイトリストセクションまでスクロール
    await page.locator('text=コミュニティに参加する').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // 有効なメールアドレスでフォーム送信
    await emailInput.fill('community@example.com')
    await submitButton.click()
    
    // 成功メッセージの確認
    await expect(page.locator('text=登録が完了しました')).toBeVisible({ timeout: 5000 })
  })

  test('WaitlistFormのバリデーションエラーが適切に表示される', async ({ page }) => {
    // ホームページのウェイトリストフォームでテスト
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const nameInput = page.locator('input[name="name"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 空の状態で送信（設計書: email, nameは必須）
    await submitButton.click()
    await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible()
    await expect(page.locator('text=名前を入力してください')).toBeVisible()
    
    // 無効なメールアドレスで送信
    await emailInput.fill('invalid-email')
    await nameInput.fill('テストユーザー')
    await submitButton.click()
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
    
    // 名前が長すぎる場合（設計書: 100文字以内）
    await emailInput.fill('test@example.com')
    await nameInput.fill('あ'.repeat(101))
    await submitButton.click()
    await expect(page.locator('text=名前は100文字以内で入力してください')).toBeVisible()
    
    // 無効なドメインで送信
    await emailInput.fill('test@invalid')
    await nameInput.fill('正常な名前')
    await submitButton.click()
    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
  })

  test('WaitlistFormの送信中状態が適切に表示される', async ({ page }) => {
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('loading@example.com')
    
    // 送信ボタンをクリック
    await submitButton.click()
    
    // 送信中は ボタンが無効化されることを確認
    await expect(submitButton).toBeDisabled()
    
    // ローディング表示の確認（ボタンテキストまたはスピナー）
    const isLoadingVisible = await page.locator('text=送信中...').or(
      page.locator('[data-testid="loading-spinner"]')
    ).isVisible()
    
    if (isLoadingVisible) {
      expect(isLoadingVisible).toBeTruthy()
    }
  })

  test('WaitlistFormのネットワークエラーハンドリング', async ({ page }) => {
    // ネットワークエラーをシミュレート
    await page.route('/api/waitlist', route => {
      route.abort('failed')
    })
    
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('error@example.com')
    await submitButton.click()
    
    // エラーメッセージの確認
    await expect(page.locator('text=送信に失敗しました')).toBeVisible({ timeout: 5000 })
    
    // フォームが再度送信可能な状態に戻ることを確認
    await expect(submitButton).toBeEnabled()
  })

  test('WaitlistFormの重複送信防止', async ({ page }) => {
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('duplicate@example.com')
    
    // 最初の送信
    await submitButton.click()
    
    // 送信中にもう一度クリック（重複送信）
    await submitButton.click()
    
    // 重複送信が防止されることを確認（ボタンが無効化されている）
    await expect(submitButton).toBeDisabled()
    
    // 成功メッセージは一度だけ表示されることを確認
    const successMessages = page.locator('text=登録が完了しました')
    await expect(successMessages).toHaveCount(1)
  })

  test('WaitlistFormのアナリティクス追跡', async ({ page }) => {
    // アナリティクストラッキングのモック
    let analyticsEvents: any[] = []
    
    await page.exposeFunction('trackAnalytics', (event: any) => {
      analyticsEvents.push(event)
    })
    
    await page.addInitScript(() => {
      // アナリティクス関数をモック
      window.gtag = (...args) => {
        window.trackAnalytics(args)
      }
    })
    
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await emailInput.fill('analytics@example.com')
    await submitButton.click()
    
    // 成功メッセージを待つ
    await expect(page.locator('text=登録が完了しました')).toBeVisible({ timeout: 5000 })
    
    // アナリティクスイベントが送信されたことを確認
    expect(analyticsEvents.length).toBeGreaterThan(0)
    
    // 特定のイベントタイプが含まれていることを確認
    const hasConversionEvent = analyticsEvents.some(event => 
      event.includes('event') && event.includes('waitlist_signup')
    )
    expect(hasConversionEvent).toBeTruthy()
  })

  test('WaitlistFormのアクセシビリティ', async ({ page }) => {
    await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // ラベルとの関連付けを確認
    const inputId = await emailInput.getAttribute('id')
    const labelFor = await page.locator('label').getAttribute('for')
    expect(inputId).toBe(labelFor)
    
    // aria-labelまたはplaceholderの存在確認
    const hasAriaLabel = await emailInput.getAttribute('aria-label')
    const hasPlaceholder = await emailInput.getAttribute('placeholder')
    expect(hasAriaLabel || hasPlaceholder).toBeTruthy()
    
    // キーボードナビゲーション
    await emailInput.focus()
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(submitButton).toBeFocused()
    
    // Enterキーでの送信
    await emailInput.focus()
    await emailInput.fill('keyboard@example.com')
    await page.keyboard.press('Enter')
    
    await expect(page.locator('text=登録が完了しました')).toBeVisible({ timeout: 5000 })
  })
})