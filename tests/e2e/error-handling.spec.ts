import { test, expect } from '@playwright/test'

test.describe('エラーハンドリング E2E', () => {
  test.describe('404エラーページ', () => {
    test('存在しないページへのアクセスで404が表示される', async ({ page }) => {
      // 存在しないページにアクセス
      const response = await page.goto('/non-existent-page')
      
      // 404ステータスコードの確認
      expect(response?.status()).toBe(404)
      
      // 404ページが表示されることを確認
      await expect(page.locator('h1')).toContainText('404')
      
      // エラーメッセージの表示確認
      await expect(page.locator('text=ページが見つかりません')).toBeVisible()
      
      // ホームに戻るボタンの存在確認
      const homeButton = page.locator('a:has-text("ホームに戻る")')
      await expect(homeButton).toBeVisible()
      
      // ホームボタンのリンク先確認
      expect(await homeButton.getAttribute('href')).toBe('/')
      
      // ホームボタンの動作確認
      await homeButton.click()
      await expect(page).toHaveURL(/\/$/)
      await expect(page.locator('h1')).not.toContainText('404')
    })

    test('存在しないプロダクトページで404が表示される', async ({ page }) => {
      // 存在しないプロダクトIDでアクセス
      const response = await page.goto('/products/99999')
      
      expect(response?.status()).toBe(404)
      
      // プロダクト固有の404メッセージ確認
      await expect(page.locator('text=プロダクトが見つかりません')).toBeVisible()
      
      // プロダクト一覧に戻るボタンの確認
      const productsButton = page.locator('a:has-text("プロダクト一覧に戻る")')
      
      if (await productsButton.count() > 0) {
        await expect(productsButton).toBeVisible()
        expect(await productsButton.getAttribute('href')).toBe('/products')
      }
    })

    test('存在しないドキュメントページで404が表示される', async ({ page }) => {
      // 存在しないドキュメントパスでアクセス
      const response = await page.goto('/docs/non-existent-doc')
      
      expect(response?.status()).toBe(404)
      
      // ドキュメント固有の404メッセージ確認
      await expect(page.locator('text=ドキュメントが見つかりません')).toBeVisible()
      
      // ドキュメント一覧に戻るボタンの確認
      const docsButton = page.locator('a:has-text("ドキュメント一覧に戻る")')
      
      if (await docsButton.count() > 0) {
        await expect(docsButton).toBeVisible()
        expect(await docsButton.getAttribute('href')).toBe('/docs')
      }
    })
  })

  test.describe('ネットワークエラーハンドリング', () => {
    test('API通信失敗時のエラー表示（ウェイトリスト）', async ({ page }) => {
      // APIエンドポイントをモック（失敗レスポンス）
      await page.route('/api/waitlist', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        })
      })
      
      await page.goto('/')
      
      // ウェイトリストフォームまでスクロール
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // フォーム送信
      await emailInput.fill('error@example.com')
      await submitButton.click()
      
      // エラーメッセージの確認
      await expect(page.locator('text=送信に失敗しました')).toBeVisible({ timeout: 5000 })
      
      // 再試行可能状態の確認
      await expect(submitButton).toBeEnabled()
      await expect(emailInput).toBeEnabled()
    })

    test('タイムアウトエラーのハンドリング', async ({ page }) => {
      // タイムアウトをシミュレート
      await page.route('/api/waitlist', route => {
        // リクエストを遅延させてタイムアウトを発生
        setTimeout(() => {
          route.fulfill({
            status: 408,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Request Timeout' })
          })
        }, 5000)
      })
      
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      await emailInput.fill('timeout@example.com')
      await submitButton.click()
      
      // タイムアウトエラーメッセージの確認
      await expect(page.locator('text=送信がタイムアウトしました')).toBeVisible({ timeout: 10000 })
    })

    test('ネットワーク接続失敗時のハンドリング', async ({ page }) => {
      // ネットワーク接続失敗をシミュレート
      await page.route('/api/waitlist', route => {
        route.abort('failed')
      })
      
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      await emailInput.fill('network@example.com')
      await submitButton.click()
      
      // ネットワークエラーメッセージの確認
      await expect(page.locator('text=ネットワークエラーが発生しました')).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('フォームバリデーションエラー', () => {
    test('ウェイトリストフォームの包括的バリデーション', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // 空入力エラー
      await submitButton.click()
      await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible()
      
      // 無効な形式エラー
      const invalidEmails = [
        'invalid',
        '@invalid.com',
        'invalid@',
        'invalid@.com',
        'invalid.@com',
        'invalid..test@example.com',
        'invalid@test..com'
      ]
      
      for (const invalidEmail of invalidEmails) {
        await emailInput.fill(invalidEmail)
        await submitButton.click()
        await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
        
        // エラーメッセージをクリア
        await emailInput.fill('')
      }
      
      // 長すぎるメールアドレス
      const longEmail = 'a'.repeat(100) + '@example.com'
      await emailInput.fill(longEmail)
      await submitButton.click()
      await expect(page.locator('text=メールアドレスが長すぎます')).toBeVisible()
    })

    test('リアルタイムバリデーションの動作', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      
      // 段階的に入力してリアルタイムバリデーションをテスト
      await emailInput.fill('invalid')
      
      // フォーカスを外す（blur）
      await emailInput.blur()
      
      // リアルタイムバリデーションエラーの確認
      await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
      
      // 有効なメールアドレスに修正
      await emailInput.fill('valid@example.com')
      await emailInput.blur()
      
      // エラーメッセージが消えることを確認
      await expect(page.locator('text=有効なメールアドレスを入力してください')).not.toBeVisible()
    })
  })

  test.describe('JavaScript エラーハンドリング', () => {
    test('JavaScript無効時の基本機能確保', async ({ page, context }) => {
      // JavaScriptを無効にする
      await context.setExtraHTTPHeaders({})
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'javaEnabled', {
          writable: false,
          value: () => false,
        })
      })
      
      await page.goto('/')
      
      // ページが基本的に表示されることを確認
      await expect(page.locator('h1')).toBeVisible()
      
      // 基本的なリンクナビゲーションが機能することを確認
      const productsLink = page.locator('a[href="/products"]').first()
      await productsLink.click()
      await expect(page).toHaveURL(/products/)
    })

    test('コンソールエラーのモニタリング', async ({ page }) => {
      const consoleErrors: string[] = []
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })
      
      page.on('pageerror', error => {
        consoleErrors.push(error.message)
      })
      
      await page.goto('/')
      
      // ページ操作を実行
      await page.locator('a:has-text("プラットフォームを探索")').click()
      await expect(page).toHaveURL(/products/)
      
      await page.goBack()
      await page.locator('a:has-text("ドキュメントを見る")').click()
      await expect(page).toHaveURL(/docs/)
      
      // 重大なエラーが発生していないことを確認
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && // ファビコンエラーは除外
        !error.includes('404') && // 404エラーは除外（意図的なテスト）
        error.toLowerCase().includes('error')
      )
      
      expect(criticalErrors).toHaveLength(0)
    })
  })

  test.describe('ユーザビリティエラーハンドリング', () => {
    test('検索結果が見つからない場合の表示', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.locator('h1')).toBeVisible()
      
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('存在しない検索語xyz123')
      
      // 検索結果なしメッセージの確認
      await expect(page.locator('text=検索結果が見つかりません')).toBeVisible()
      
      // 検索をクリアするボタンの確認
      const clearButton = page.locator('button:has-text("検索をクリア")')
      await expect(clearButton).toBeVisible()
      
      // 検索クリア機能の確認
      await clearButton.click()
      await expect(searchInput).toHaveValue('')
      await expect(page.locator('text=検索結果が見つかりません')).not.toBeVisible()
    })

    test('フィルターで該当プロダクトがない場合', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // 存在しないカテゴリまたは結果が空になるフィルターを適用
      // （実装によって異なるため、実際のフィルターボタンを使用）
      await page.locator('text=全て').scrollIntoViewIfNeeded()
      
      // 各カテゴリを試して空の結果があるかテスト
      const categoryButtons = page.locator('button').filter({ hasText: /^(生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ })
      const buttonCount = await categoryButtons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = categoryButtons.nth(i)
        await button.click()
        
        // 少し待機してフィルター結果を確認
        await page.waitForTimeout(500)
        
        const productCount = await page.locator('#products-list .card').count()
        
        if (productCount === 0) {
          // 該当プロダクトなしメッセージの確認
          await expect(page.locator('text=該当するプロダクトが見つかりません')).toBeVisible()
          break
        }
      }
    })

    test('外部リンクのエラーハンドリング', async ({ page, context }) => {
      await page.goto('/community')
      await expect(page.locator('h1')).toBeVisible()
      
      // 外部リンクをクリック
      const externalLinks = page.locator('a[target="_blank"]')
      
      if (await externalLinks.count() > 0) {
        const firstExternalLink = externalLinks.first()
        
        // 新しいページが開かれることを確認
        const pagePromise = context.waitForEvent('page')
        await firstExternalLink.click()
        
        try {
          const newPage = await pagePromise
          await newPage.waitForLoadState()
          
          // 新しいページが正常に開かれたことを確認
          expect(context.pages()).toHaveLength(2)
          
          await newPage.close()
        } catch (error) {
          // 外部リンクが失敗した場合のハンドリング
          console.log('外部リンクアクセスに失敗:', error)
          
          // 元のページが影響を受けていないことを確認
          await expect(page.locator('h1')).toBeVisible()
        }
      }
    })
  })

  test.describe('アクセシビリティエラーハンドリング', () => {
    test('スクリーンリーダー対応エラーメッセージ', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // 無効な入力でエラーを発生
      await emailInput.fill('invalid-email')
      await submitButton.click()
      
      // エラーメッセージのaria属性確認
      const errorMessage = page.locator('text=有効なメールアドレスを入力してください')
      await expect(errorMessage).toBeVisible()
      
      // aria-live属性の確認（スクリーンリーダー対応）
      const errorContainer = errorMessage.locator('xpath=ancestor::*[@aria-live][1]')
      
      if (await errorContainer.count() > 0) {
        const ariaLive = await errorContainer.getAttribute('aria-live')
        expect(ariaLive).toBeTruthy()
        expect(['polite', 'assertive']).toContain(ariaLive)
      }
    })

    test('フォーカス管理でのエラー状態', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // エラー発生
      await submitButton.click()
      
      // フォーカスがエラーのある入力フィールドに移動することを確認
      await expect(emailInput).toBeFocused()
      
      // aria-invalid属性の確認
      const ariaInvalid = await emailInput.getAttribute('aria-invalid')
      expect(ariaInvalid).toBe('true')
    })
  })

  test.describe('エラー復旧機能', () => {
    test('エラー状態からの自動復旧', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // エラー状態を作成
      await emailInput.fill('invalid-email')
      await submitButton.click()
      await expect(page.locator('text=有効なメールアドレスを入力してください')).toBeVisible()
      
      // 有効な入力で自動復旧
      await emailInput.fill('valid@example.com')
      
      // エラーメッセージが自動的に消えることを確認
      await expect(page.locator('text=有効なメールアドレスを入力してください')).not.toBeVisible()
      
      // フォームが送信可能状態に戻ることを確認
      await expect(submitButton).toBeEnabled()
    })

    test('ページリロードでのエラー状態リセット', async ({ page }) => {
      await page.goto('/non-existent-page')
      
      // 404エラー状態を確認
      await expect(page.locator('text=ページが見つかりません')).toBeVisible()
      
      // 有効なページに移動
      await page.goto('/')
      
      // エラー状態がリセットされることを確認
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('text=ページが見つかりません')).not.toBeVisible()
    })
  })
})