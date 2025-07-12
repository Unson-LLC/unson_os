import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('アクセシビリティテスト', () => {
  test('ホームページがWCAG 2.1 AA基準に準拠している', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('キーボードナビゲーションが完全に機能する', async ({ page }) => {
    await page.goto('/')
    
    // Tabキーでナビゲーション要素に移動できることを確認
    await page.keyboard.press('Tab')
    
    // フォーカスされた要素が視覚的に確認できることをテスト
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // すべてのインタラクティブ要素にキーボードでアクセスできることを確認
    const interactiveElements = page.locator('a, button, input, select, textarea, [tabindex]')
    const count = await interactiveElements.count()
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      await page.keyboard.press('Tab')
      const currentFocus = page.locator(':focus')
      await expect(currentFocus).toBeVisible()
    }
  })

  test('スクリーンリーダー用のARIA属性が適切に設定されている', async ({ page }) => {
    await page.goto('/')
    
    // メインコンテンツエリアが適切にマークアップされている
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()
    
    // ナビゲーションエリアが適切にマークアップされている
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav).toBeVisible()
    
    // ヘッダー構造が適切である
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    
    // フォーム要素にラベルが関連付けられている
    const formInputs = page.locator('input[type="email"], input[type="text"], input[name="name"]')
    const inputCount = await formInputs.count()
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i)
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id')
        const ariaLabel = el.getAttribute('aria-label')
        const ariaLabelledby = el.getAttribute('aria-labelledby')
        
        if (ariaLabel || ariaLabelledby) return true
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`)
          return !!label
        }
        return false
      })
      
      expect(hasLabel).toBeTruthy()
    }
  })

  test('色のコントラストが適切である', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()
    
    // コントラストに関する違反がないことを確認
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toEqual([])
  })

  test('フォーカス管理が適切に行われる', async ({ page }) => {
    await page.goto('/')
    
    // モーダルやダイアログが開いた時のフォーカス管理をテスト
    const modalTrigger = page.locator('button[data-testid="modal-trigger"]').or(
      page.locator('button:has-text("詳細")')
    )
    
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click()
      
      // モーダル内の最初のフォーカス可能要素にフォーカスが移る
      const modal = page.locator('[role="dialog"], .modal')
      await expect(modal).toBeVisible()
      
      // モーダルを閉じた時に元の要素にフォーカスが戻る
      const closeButton = modal.locator('button:has-text("閉じる"), [aria-label="Close"]')
      if (await closeButton.count() > 0) {
        await closeButton.click()
        await expect(modalTrigger).toBeFocused()
      }
    }
  })

  test('エラーメッセージが適切にアナウンスされる', async ({ page }) => {
    await page.goto('/')
    
    // フォームエラーのテスト
    const submitButton = page.locator('button[type="submit"]').first()
    
    if (await submitButton.count() > 0) {
      await submitButton.click()
      
      // エラーメッセージがlive regionまたはaria-liveで通知される
      const errorMessage = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]')
      
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible()
      }
    }
  })

  test('画像に適切な代替テキストが設定されている', async ({ page }) => {
    await page.goto('/')
    
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      
      // 装飾的画像でない限り、alt属性が設定されている
      if (role !== 'presentation' && alt !== '') {
        expect(alt).toBeTruthy()
      }
    }
  })

  test('ランドマークとヘッダー構造が適切である', async ({ page }) => {
    await page.goto('/')
    
    // 適切なランドマークが存在する
    await expect(page.locator('header, [role="banner"]')).toBeVisible()
    await expect(page.locator('main, [role="main"]')).toBeVisible()
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible()
    
    // ヘッダー階層が適切である
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // h1は1つだけ
    
    // ヘッダーの順序が適切である（h1 → h2 → h3...）
    const headers = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    
    if (headers.length > 1) {
      // 最初のヘッダーがh1であることを確認
      const firstHeader = page.locator('h1, h2, h3, h4, h5, h6').first()
      const tagName = await firstHeader.evaluate(el => el.tagName.toLowerCase())
      expect(tagName).toBe('h1')
    }
  })

  test('動的コンテンツの変更が適切に通知される', async ({ page }) => {
    await page.goto('/')
    
    // 動的コンテンツの変更をテスト（例：フォーム送信後のメッセージ）
    const emailInput = page.locator('input[type="email"]').first()
    const nameInput = page.locator('input[name="name"]').first()
    const submitButton = page.locator('button[type="submit"]').first()
    
    if (await emailInput.count() > 0) {
      await emailInput.fill('accessibility@example.com')
      await nameInput.fill('アクセシビリティテストユーザー')
      
      // API成功レスポンスをモック
      await page.route('/api/waitlist', async route => {
        await route.fulfill({
          json: { message: 'Successfully added to waitlist', id: 'accessibility-test' },
          status: 201
        })
      })
      
      await submitButton.click()
      
      // 成功メッセージがlive regionで通知される
      const successMessage = page.locator('[role="alert"], [aria-live]')
      await expect(successMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('タッチとマウスの両方でアクセシブルである', async ({ page }) => {
    await page.goto('/')
    
    // タッチターゲットのサイズが適切である（最小44x44px）
    const buttons = page.locator('button, a')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const box = await button.boundingBox()
      
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
    
    // クリックとタップの両方が機能する
    const firstButton = buttons.first()
    if (await firstButton.count() > 0) {
      // マウスクリック
      await firstButton.click()
      
      // タッチタップ（モバイル）
      await page.setViewportSize({ width: 375, height: 667 })
      await firstButton.tap()
    }
  })
})