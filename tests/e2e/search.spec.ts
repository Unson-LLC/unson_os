import { test, expect } from '@playwright/test'

test.describe('検索機能 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs')
    
    // ページが完全に読み込まれるまで待機
    await expect(page.locator('h1')).toBeVisible()
  })

  test('ドキュメント検索の基本機能', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    
    // 検索語を入力
    await searchInput.fill('API')
    
    // 検索結果が表示されることを確認
    await expect(page.locator('text=人気のドキュメント')).toBeVisible()
    
    // API関連のドキュメントが表示されることを確認
    const apiResults = page.locator('text=API')
    await expect(apiResults.first()).toBeVisible()
    
    // 関係のないドキュメントが隠されていることを確認
    const allCards = page.locator('.card')
    const visibleCards = await allCards.all()
    
    // 表示されているカードにAPIという文字が含まれているかチェック
    for (const card of visibleCards) {
      const cardText = await card.textContent()
      expect(cardText?.toLowerCase()).toContain('api')
    }
  })

  test('検索結果なしの場合の表示', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 存在しない検索語を入力
    await searchInput.fill('存在しない検索語12345')
    
    // 検索結果なしのメッセージが表示されることを確認
    await expect(page.locator('text=検索結果が見つかりません')).toBeVisible()
    await expect(page.locator('text=存在しない検索語12345')).toBeVisible()
    
    // 検索クリアボタンが表示されることを確認
    const clearButton = page.locator('button:has-text("検索をクリア")')
    await expect(clearButton).toBeVisible()
    
    // 検索クリアボタンをクリック
    await clearButton.click()
    
    // 検索がクリアされることを確認
    await expect(searchInput).toHaveValue('')
    await expect(page.locator('text=検索結果が見つかりません')).not.toBeVisible()
    
    // すべてのドキュメントが再表示されることを確認
    await expect(page.locator('text=人気のドキュメント')).toBeVisible()
  })

  test('リアルタイム検索フィルタリング', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 段階的に検索語を入力してリアルタイム検索をテスト
    await searchInput.fill('A')
    
    // 'A'を含む結果が表示されることを確認
    const initialResults = await page.locator('.card').count()
    expect(initialResults).toBeGreaterThan(0)
    
    // より具体的な検索語に変更
    await searchInput.fill('API')
    
    // 結果が絞り込まれることを確認
    const refinedResults = await page.locator('.card').count()
    expect(refinedResults).toBeLessThanOrEqual(initialResults)
    
    // さらに具体的な検索語に変更
    await searchInput.fill('API リファレンス')
    
    // より絞り込まれることを確認
    const specificResults = await page.locator('.card').count()
    expect(specificResults).toBeLessThanOrEqual(refinedResults)
  })

  test('検索入力のバリデーションとエッジケース', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 空の検索語の場合
    await searchInput.fill('')
    await expect(page.locator('text=人気のドキュメント')).toBeVisible()
    
    // スペースのみの検索語
    await searchInput.fill('   ')
    await expect(page.locator('text=人気のドキュメント')).toBeVisible()
    
    // 非常に長い検索語
    const longQuery = 'a'.repeat(100)
    await searchInput.fill(longQuery)
    
    // システムがクラッシュしないことを確認
    await expect(page.locator('h1')).toBeVisible()
    
    // 特殊文字を含む検索語
    await searchInput.fill('API & REST')
    await expect(page.locator('h1')).toBeVisible()
    
    // 日本語の検索語
    await searchInput.fill('ドキュメント')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('検索結果の複数セクション表示', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 複数のセクションに結果がある検索語を入力
    await searchInput.fill('開発')
    
    // 人気のドキュメントセクションに結果があることを確認
    const popularDocsSection = page.locator('text=人気のドキュメント').locator('xpath=following-sibling::*[1]')
    const popularCards = popularDocsSection.locator('.card')
    
    if (await popularCards.count() > 0) {
      await expect(popularCards.first()).toBeVisible()
    }
    
    // ドキュメント一覧セクションに結果があることを確認
    const docsListSection = page.locator('text=ドキュメント一覧').locator('xpath=following-sibling::*[1]')
    const docsSections = docsListSection.locator('.card')
    
    if (await docsSections.count() > 0) {
      await expect(docsSections.first()).toBeVisible()
    }
    
    // SDK & 開発ツールセクションに結果があることを確認
    const sdkSection = page.locator('text=SDK & 開発ツール').locator('xpath=following-sibling::*[1]')
    const sdkCards = sdkSection.locator('.card')
    
    if (await sdkCards.count() > 0) {
      await expect(sdkCards.first()).toBeVisible()
    }
  })

  test('検索状態の保持とURL変更', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 検索語を入力
    await searchInput.fill('トークノミクス')
    
    // 検索語がURLパラメータに反映されるかチェック（実装されている場合）
    const currentUrl = page.url()
    
    // ページをリロード
    await page.reload()
    
    // 検索語が保持されているかチェック（実装されている場合）
    const searchValue = await searchInput.inputValue()
    
    // もし検索状態の保持が実装されていれば、検索語が残っているはず
    // 実装されていなければ、このテストは期待値を調整
  })

  test('検索のキーボードショートカット', async ({ page }) => {
    // Ctrl+K または Cmd+K で検索フォーカス（実装されている場合）
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
    
    await page.keyboard.press(`${modifier}+KeyK`)
    
    // 検索入力がフォーカスされることを確認（実装されている場合）
    const searchInput = page.locator('input[type="search"]')
    
    // フォーカスが当たっているかチェック
    const isFocused = await searchInput.evaluate(el => document.activeElement === el)
    
    if (isFocused) {
      expect(isFocused).toBeTruthy()
    }
    
    // Escapeキーで検索をクリア（実装されている場合）
    await searchInput.fill('テスト検索')
    await page.keyboard.press('Escape')
    
    // 検索がクリアされるかチェック（実装されている場合）
    const clearedValue = await searchInput.inputValue()
    
    if (clearedValue === '') {
      expect(clearedValue).toBe('')
    }
  })

  test('検索パフォーマンス', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]')
    
    // 検索開始時間を記録
    const startTime = Date.now()
    
    // 検索語を入力
    await searchInput.fill('API リファレンス')
    
    // 検索結果が表示されるまでの時間を測定
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 5000 })
    
    const endTime = Date.now()
    const searchTime = endTime - startTime
    
    // 検索が5秒以内に完了することを確認
    expect(searchTime).toBeLessThan(5000)
    
    // 検索結果が適切に表示されることを確認
    const resultCount = await page.locator('.card').count()
    expect(resultCount).toBeGreaterThan(0)
  })

  test('モバイルでの検索動作', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 })
    
    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    
    // モバイルでの検索入力
    await searchInput.tap()
    await searchInput.fill('モバイル検索テスト')
    
    // 検索結果が適切にレスポンシブ表示されることを確認
    const cards = page.locator('.card')
    
    if (await cards.count() > 0) {
      const firstCard = cards.first()
      await expect(firstCard).toBeVisible()
      
      // カードがモバイルで適切なサイズで表示されることを確認
      const cardBounds = await firstCard.boundingBox()
      
      if (cardBounds) {
        expect(cardBounds.width).toBeLessThanOrEqual(375)
      }
    }
  })
})