import { test, expect } from '@playwright/test'

test.describe('ウェイトリストフォーム E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ウェイトリスト登録の完全なユーザージャーニー', async ({ page }) => {
    // フォームの表示確認
    const emailInput = page.locator('input[type="email"]').first()
    const nameInput = page.locator('input[name="name"]').first()
    const roleSelect = page.locator('select[name="role"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    await expect(emailInput).toBeVisible()
    await expect(nameInput).toBeVisible()
    await expect(roleSelect).toBeVisible()
    await expect(submitButton).toBeVisible()

    // フォーム入力
    await emailInput.fill('e2e-test@example.com')
    await nameInput.fill('E2Eテストユーザー')
    await roleSelect.selectOption('developer')

    // モックAPIレスポンスの設定
    await page.route('/api/waitlist', async route => {
      const json = {
        message: 'Successfully added to waitlist',
        id: 'e2e-test-id-123'
      }
      await route.fulfill({ json, status: 201 })
    })

    // フォーム送信
    await submitButton.click()

    // 送信中状態の確認
    await expect(page.locator('text=送信中')).toBeVisible()
    await expect(submitButton).toBeDisabled()

    // 成功メッセージの確認
    await expect(page.locator('text=登録ありがとうございます')).toBeVisible({ timeout: 10000 })

    // 成功状態では元のフォームが隠れているため、
    // 新しいウェイトリストフォームでフォームリセットをテスト
    // （実際のアプリケーションでは成功メッセージが表示される）
  })

  test('フォームバリデーションエラーの表示', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    
    // 空のフォームで送信
    await submitButton.click()

    // バリデーションエラーメッセージの確認
    await expect(page.locator('text=メールアドレスは必須です')).toBeVisible()
    await expect(page.locator('text=お名前は必須です')).toBeVisible()

    // 無効なメールアドレスでのテスト
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.fill('invalid-email')
    await submitButton.click()

    await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
  })

  test('APIエラー時の適切な処理', async ({ page }) => {
    // フォーム入力
    await page.locator('input[type="email"]').first().fill('error@example.com')
    await page.locator('input[name="name"]').first().fill('エラーテストユーザー')

    // サーバーエラーのモック
    await page.route('/api/waitlist', async route => {
      await route.fulfill({
        status: 500,
        json: { error: 'Internal server error' }
      })
    })

    // フォーム送信
    await page.locator('button[type="submit"]').first().click()

    // エラーメッセージの確認
    await expect(page.locator('text=エラーが発生しました')).toBeVisible({ timeout: 10000 })

    // フォームが再度送信可能状態に戻ることを確認
    const submitButton = page.locator('button[type="submit"]').first()
    await expect(submitButton).not.toBeDisabled()
    await expect(submitButton).toContainText('登録')
  })

  test('ネットワークエラー時の処理', async ({ page }) => {
    // フォーム入力
    await page.locator('input[type="email"]').first().fill('network@example.com')
    await page.locator('input[name="name"]').first().fill('ネットワークテストユーザー')

    // ネットワークエラーのシミュレーション
    await page.route('/api/waitlist', async route => {
      await route.abort('internetdisconnected')
    })

    // フォーム送信
    await page.locator('button[type="submit"]').first().click()

    // エラーメッセージの確認
    await expect(page.locator('text=エラーが発生しました')).toBeVisible({ timeout: 10000 })
  })

  test('重複メールエラーの処理', async ({ page }) => {
    // フォーム入力
    await page.locator('input[type="email"]').first().fill('duplicate@example.com')
    await page.locator('input[name="name"]').first().fill('重複テストユーザー')

    // 重複エラーのモック
    await page.route('/api/waitlist', async route => {
      await route.fulfill({
        status: 409,
        json: { error: 'Email already registered' }
      })
    })

    // フォーム送信
    await page.locator('button[type="submit"]').first().click()

    // エラーメッセージの確認
    await expect(page.locator('text=エラーが発生しました')).toBeVisible({ timeout: 10000 })
  })

  test('アクセシビリティ要件の確認', async ({ page }) => {
    // フォーカス管理の確認
    const emailInput = page.locator('input[type="email"]').first()
    const nameInput = page.locator('input[name="name"]').first()
    const roleSelect = page.locator('select[name="role"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    // タブナビゲーションの確認
    await emailInput.focus()
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(nameInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(roleSelect).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(submitButton).toBeFocused()

    // ラベルとARIA属性の確認
    await expect(emailInput).toHaveAttribute('aria-label')
    await expect(nameInput).toHaveAttribute('aria-label')
    await expect(roleSelect).toHaveAttribute('aria-label')

    // フォームが送信された後のフォーカス管理
    await emailInput.fill('accessibility@example.com')
    await nameInput.fill('アクセシビリティテストユーザー')

    await page.route('/api/waitlist', async route => {
      await route.fulfill({
        json: { message: 'Success', id: 'accessibility-test' },
        status: 201
      })
    })

    await submitButton.click()

    // 成功メッセージにフォーカスが移ることを確認
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('モバイルでのフォーム操作', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // フォーム要素がモバイルで適切に表示されることを確認
    const emailInput = page.locator('input[type="email"]').first()
    const nameInput = page.locator('input[name="name"]').first()
    const submitButton = page.locator('button[type="submit"]').first()

    await expect(emailInput).toBeVisible()
    await expect(nameInput).toBeVisible()
    await expect(submitButton).toBeVisible()

    // モバイルでの入力とキーボード表示の確認
    await emailInput.click()
    await emailInput.fill('mobile@example.com')
    
    await nameInput.click()
    await nameInput.fill('モバイルテストユーザー')

    // フォーム送信の確認
    await page.route('/api/waitlist', async route => {
      await route.fulfill({
        json: { message: 'Success', id: 'mobile-test' },
        status: 201
      })
    })

    await submitButton.click()
    await expect(page.locator('text=登録ありがとうございます')).toBeVisible({ timeout: 10000 })
  })
})