import { test, expect } from '@playwright/test'

test.describe('フィルター機能 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
    
    // ページが完全に読み込まれるまで待機
    await expect(page.locator('h1')).toBeVisible()
  })

  test('プロダクトカテゴリフィルターの基本動作', async ({ page }) => {
    // カテゴリフィルターセクションまでスクロール
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 初期状態では「全て」が選択されていることを確認
    const allButton = page.locator('button:has-text("全て")')
    await expect(allButton).toHaveClass(/default/)
    
    // すべてのプロダクトが表示されていることを確認
    const initialProductCount = await page.locator('#products-list .card').count()
    expect(initialProductCount).toBeGreaterThan(0)
    
    // 統計データが表示されていることを確認
    const statsSection = page.locator('text=アクティブプロダクト').or(page.locator('text=プロダクト'))
    await expect(statsSection).toBeVisible()
  })

  test('特定カテゴリフィルターの動作', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 初期の表示数を記録
    const initialCount = await page.locator('#products-list .card').count()
    
    // 「生産性」カテゴリを選択
    const productivityButton = page.locator('button:has-text("生産性")')
    await productivityButton.click()
    
    // 「生産性」ボタンがアクティブになることを確認
    await expect(productivityButton).toHaveClass(/default/)
    
    // 「全て」ボタンが非アクティブになることを確認
    const allButton = page.locator('button:has-text("全て")')
    await expect(allButton).toHaveClass(/outline/)
    
    // フィルター後の表示数を確認
    const filteredCount = await page.locator('#products-list .card').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    
    // 統計データが更新されることを確認
    await expect(page.locator('text=生産性プロダクト')).toBeVisible()
    
    // 表示されているプロダクトが「生産性」カテゴリであることを確認
    const productCards = page.locator('#products-list .card')
    const cardCount = await productCards.count()
    
    for (let i = 0; i < cardCount; i++) {
      const card = productCards.nth(i)
      const categoryBadge = card.locator('.bg-blue-100')
      
      if (await categoryBadge.count() > 0) {
        await expect(categoryBadge).toContainText('生産性')
      }
    }
  })

  test('全カテゴリのフィルター動作確認', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 利用可能なカテゴリを取得
    const categoryButtons = page.locator('button').filter({ hasText: /^(全て|生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ })
    const buttonCount = await categoryButtons.count()
    
    // 各カテゴリをテスト
    for (let i = 0; i < buttonCount; i++) {
      const button = categoryButtons.nth(i)
      const buttonText = await button.textContent()
      
      await button.click()
      
      // ボタンがアクティブになることを確認
      await expect(button).toHaveClass(/default/)
      
      // 統計データが更新されることを確認
      if (buttonText === '全て') {
        await expect(page.locator('text=アクティブプロダクト')).toBeVisible()
      } else {
        await expect(page.locator(`text=${buttonText}プロダクト`)).toBeVisible()
      }
      
      // プロダクトが表示されることを確認（カテゴリに該当するプロダクトがある場合）
      const productCount = await page.locator('#products-list .card').count()
      
      if (productCount > 0) {
        // 最初のプロダクトが表示されていることを確認
        await expect(page.locator('#products-list .card').first()).toBeVisible()
      }
    }
  })

  test('フィルター後の統計データ更新', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 初期統計を記録
    const initialActiveProducts = await page.locator('text=アクティブプロダクト').locator('xpath=preceding-sibling::*[1]').textContent()
    const initialTotalUsers = await page.locator('text=総ユーザー数').locator('xpath=preceding-sibling::*[1]').textContent()
    const initialAvgRating = await page.locator('text=平均レーティング').locator('xpath=preceding-sibling::*[1]').textContent()
    
    // 特定カテゴリを選択
    await page.locator('button:has-text("データ管理")').click()
    
    // 統計データが更新されることを確認
    const filteredProducts = await page.locator('text=データ管理プロダクト').locator('xpath=preceding-sibling::*[1]').textContent()
    const filteredTotalUsers = await page.locator('text=総ユーザー数').locator('xpath=preceding-sibling::*[1]').textContent()
    const filteredAvgRating = await page.locator('text=平均レーティング').locator('xpath=preceding-sibling::*[1]').textContent()
    
    // 統計が変更されていることを確認（フィルター対象プロダクトがある場合）
    expect(filteredProducts).not.toBe(initialActiveProducts)
    
    // 数値が適切に計算されていることを確認
    const productCount = parseInt(filteredProducts || '0')
    expect(productCount).toBeGreaterThanOrEqual(0)
    
    // 「全て」に戻して統計が元に戻ることを確認
    await page.locator('button:has-text("全て")').click()
    
    const restoredProducts = await page.locator('text=アクティブプロダクト').locator('xpath=preceding-sibling::*[1]').textContent()
    expect(restoredProducts).toBe(initialActiveProducts)
  })

  test('フィルター状態の保持', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 特定カテゴリを選択
    await page.locator('button:has-text("セキュリティ")').click()
    
    // 選択状態を確認
    await expect(page.locator('button:has-text("セキュリティ")')).toHaveClass(/default/)
    
    // ページをリロード
    await page.reload()
    
    // デフォルトでは「全て」に戻る（URLパラメータでの状態保持が実装されていない場合）
    await expect(page.locator('button:has-text("全て")')).toHaveClass(/default/)
    
    // もしフィルター状態の保持が実装されていれば、以下のテストを有効にする
    // await expect(page.locator('button:has-text("セキュリティ")')).toHaveClass(/default/)
  })

  test('フィルターのレスポンシブ表示', async ({ page }) => {
    // デスクトップでのフィルター表示確認
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    const desktopButtons = page.locator('button').filter({ hasText: /^(全て|生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ })
    const desktopCount = await desktopButtons.count()
    expect(desktopCount).toBeGreaterThan(0)
    
    // モバイルビューポートに変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // モバイルでもフィルターが表示されることを確認
    const mobileButtons = page.locator('button').filter({ hasText: /^(全て|生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ })
    await expect(mobileButtons.first()).toBeVisible()
    
    // モバイルでフィルター操作
    await mobileButtons.filter({ hasText: '生産性' }).tap()
    await expect(mobileButtons.filter({ hasText: '生産性' })).toHaveClass(/default/)
    
    // モバイルでプロダクトが適切に表示されることを確認
    const mobileProducts = page.locator('#products-list .card')
    if (await mobileProducts.count() > 0) {
      await expect(mobileProducts.first()).toBeVisible()
    }
  })

  test('フィルターのアクセシビリティ', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // キーボードナビゲーション
    const firstButton = page.locator('button:has-text("全て")')
    await firstButton.focus()
    await expect(firstButton).toBeFocused()
    
    // Tabキーで次のボタンに移動
    await page.keyboard.press('Tab')
    const secondButton = page.locator('button').filter({ hasText: /^(生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ }).first()
    await expect(secondButton).toBeFocused()
    
    // Enterキーでフィルター実行
    await page.keyboard.press('Enter')
    await expect(secondButton).toHaveClass(/default/)
    
    // Spaceキーでもフィルター実行可能かテスト
    await page.keyboard.press('Tab')
    const thirdButton = page.locator('button').filter({ hasText: /^(生産性|データ管理|マーケティング|セキュリティ|コンテンツ|環境)$/ }).nth(1)
    await page.keyboard.press(' ')
    await expect(thirdButton).toBeFocused()
  })

  test('フィルターのパフォーマンス', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // フィルター実行の開始時間を記録
    const startTime = Date.now()
    
    // フィルターを実行
    await page.locator('button:has-text("マーケティング")').click()
    
    // フィルター結果が表示されるまでの時間を測定
    await expect(page.locator('text=マーケティングプロダクト')).toBeVisible({ timeout: 3000 })
    
    const endTime = Date.now()
    const filterTime = endTime - startTime
    
    // フィルターが3秒以内に完了することを確認
    expect(filterTime).toBeLessThan(3000)
    
    // 複数回のフィルター切り替えパフォーマンステスト
    const categories = ['生産性', 'データ管理', 'セキュリティ', '全て']
    
    for (const category of categories) {
      const switchStartTime = Date.now()
      
      await page.locator(`button:has-text("${category}")`).click()
      
      // 統計データの更新を待つ
      if (category === '全て') {
        await expect(page.locator('text=アクティブプロダクト')).toBeVisible({ timeout: 2000 })
      } else {
        await expect(page.locator(`text=${category}プロダクト`)).toBeVisible({ timeout: 2000 })
      }
      
      const switchEndTime = Date.now()
      const switchTime = switchEndTime - switchStartTime
      
      // 各フィルター切り替えが2秒以内に完了することを確認
      expect(switchTime).toBeLessThan(2000)
    }
  })

  test('フィルターとプロダクト詳細の連携', async ({ page }) => {
    await page.locator('text=全て').scrollIntoViewIfNeeded()
    
    // 特定カテゴリを選択
    await page.locator('button:has-text("コンテンツ")').click()
    
    // フィルターされたプロダクトの詳細ボタンをクリック
    const productCards = page.locator('#products-list .card')
    
    if (await productCards.count() > 0) {
      const firstCard = productCards.first()
      const detailButton = firstCard.locator('a:has-text("詳細を見る")')
      
      if (await detailButton.count() > 0) {
        await detailButton.click()
        
        // プロダクト詳細ページに遷移することを確認
        await expect(page).toHaveURL(/\/products\/\d+/)
        
        // 戻るボタンまたはブラウザバックで戻る
        await page.goBack()
        
        // フィルター状態が保持されているか確認（実装によって異なる）
        await expect(page.locator('button:has-text("コンテンツ")')).toBeVisible()
      }
    }
  })
})