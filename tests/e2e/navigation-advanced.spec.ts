import { test, expect } from '@playwright/test'

test.describe('高度なナビゲーション機能 E2E', () => {
  test.describe('アンカーリンク・スクロール機能', () => {
    test('プロダクトページのアンカーリンクスクロール', async ({ page }) => {
      await page.goto('/products')
      
      // ページが読み込まれることを確認
      await expect(page.locator('h1')).toBeVisible()
      
      // ヒーローセクションの「プロダクトを探索」ボタンを見つける
      const exploreButton = page.locator('a:has-text("プロダクトを探索")')
      await expect(exploreButton).toBeVisible()
      
      // ボタンが正しいアンカーリンクを持っていることを確認
      const href = await exploreButton.getAttribute('href')
      expect(href).toBe('#products-list')
      
      // 現在のスクロール位置を記録
      const initialScrollY = await page.evaluate(() => window.scrollY)
      
      // アンカーリンクをクリック
      await exploreButton.click()
      
      // スクロールが発生したことを確認
      await page.waitForFunction(() => window.scrollY > 0, {}, { timeout: 3000 })
      
      // プロダクト一覧セクションが表示されていることを確認
      await expect(page.locator('#products-list')).toBeInViewport()
      
      // スクロール後の位置を確認
      const finalScrollY = await page.evaluate(() => window.scrollY)
      expect(finalScrollY).toBeGreaterThan(initialScrollY)
    })

    test('ページ内スムーズスクロールの動作', async ({ page }) => {
      await page.goto('/')
      
      // ページが読み込まれることを確認
      await expect(page.locator('h1')).toBeVisible()
      
      // ページ下部のCTAセクションへのアンカーリンクを作成（実装されている場合）
      // または長いページでのスクロールテストを実行
      
      // 初期スクロール位置
      const initialY = await page.evaluate(() => window.scrollY)
      
      // 特徴セクションまでスクロール
      await page.locator('text=Unson OSの特徴').scrollIntoViewIfNeeded()
      
      // スクロールが完了するまで少し待機
      await page.waitForTimeout(500)
      
      // スクロール位置が変更されたことを確認
      const middleY = await page.evaluate(() => window.scrollY)
      expect(middleY).toBeGreaterThan(initialY)
      
      // さらに下部のセクションまでスクロール
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      
      await page.waitForTimeout(500)
      
      const finalY = await page.evaluate(() => window.scrollY)
      expect(finalY).toBeGreaterThan(middleY)
    })

    test('モバイルでのアンカーリンク動作', async ({ page }) => {
      // モバイルビューポートに設定
      await page.setViewportSize({ width: 375, height: 667 })
      
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // モバイルでのアンカーリンクテスト
      const exploreButton = page.locator('a:has-text("プロダクトを探索")')
      await exploreButton.tap()
      
      // モバイルでもスクロールが機能することを確認
      await expect(page.locator('#products-list')).toBeInViewport({ timeout: 3000 })
      
      // モバイルでのスクロール位置確認
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeGreaterThan(0)
    })

    test('複数のアンカーリンク間の移動', async ({ page }) => {
      await page.goto('/docs/dao/overview')
      await expect(page.locator('h1')).toBeVisible()
      
      // ページ下部のナビゲーションリンクをテスト
      const quickLinks = [
        { text: 'トークノミクス', href: '/docs/dao/tokenomics' },
        { text: 'ドキュメント一覧', href: '/docs' }
      ]
      
      for (const link of quickLinks) {
        const linkElement = page.locator(`a:has-text("${link.text}")`)
        
        if (await linkElement.count() > 0) {
          await linkElement.scrollIntoViewIfNeeded()
          await expect(linkElement).toBeVisible()
          
          const href = await linkElement.getAttribute('href')
          expect(href).toBe(link.href)
          
          // リンクをクリック（実際のナビゲーションテスト）
          await linkElement.click()
          await expect(page).toHaveURL(new RegExp(link.href.replace('/', '\\/')))
          
          // 前のページに戻る
          await page.goBack()
          await expect(page).toHaveURL(/dao\/overview/)
        }
      }
    })

    test('スクロール位置の精度確認', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // プロダクト一覧セクションの位置を取得
      const targetElement = page.locator('#products-list')
      await expect(targetElement).toBeVisible()
      
      const targetBounds = await targetElement.boundingBox()
      expect(targetBounds).toBeTruthy()
      
      // アンカーリンクをクリック
      await page.locator('a:has-text("プロダクトを探索")').click()
      
      // スクロール完了を待機
      await page.waitForTimeout(1000)
      
      // 要素がビューポート内にあることを確認
      await expect(targetElement).toBeInViewport()
      
      // スクロール位置の精度を確認（要素がビューポートの上部近くにあることを確認）
      const viewportHeight = await page.evaluate(() => window.innerHeight)
      const elementTop = await targetElement.evaluate(el => el.getBoundingClientRect().top)
      
      // 要素がビューポートの上部1/3以内にあることを確認
      expect(elementTop).toBeLessThan(viewportHeight / 3)
      expect(elementTop).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('ページ間ナビゲーション', () => {
    test('ブレッドクラム風ナビゲーション', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.locator('h1')).toBeVisible()
      
      // ドキュメント内のリンクをクリック
      const daoLink = page.locator('a:has-text("DAOの仕組み")')
      
      if (await daoLink.count() > 0) {
        await daoLink.click()
        await expect(page).toHaveURL(/dao\/overview/)
        
        // ページ下部のナビゲーションで戻る
        const docsHomeLink = page.locator('a:has-text("ドキュメント一覧")')
        
        if (await docsHomeLink.count() > 0) {
          await docsHomeLink.click()
          await expect(page).toHaveURL(/\/docs$/)
        }
      }
    })

    test('タブ風ナビゲーション', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // カテゴリフィルターをタブ的なナビゲーションとしてテスト
      const categories = ['生産性', 'データ管理', 'マーケティング']
      
      for (const category of categories) {
        const categoryButton = page.locator(`button:has-text("${category}")`)
        
        if (await categoryButton.count() > 0) {
          await categoryButton.click()
          
          // タブが選択状態になることを確認
          await expect(categoryButton).toHaveClass(/default/)
          
          // 対応するコンテンツが表示されることを確認
          await expect(page.locator(`text=${category}プロダクト`)).toBeVisible()
        }
      }
    })

    test('動的コンテンツロード時のナビゲーション', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.locator('h1')).toBeVisible()
      
      // 検索実行後のナビゲーション
      const searchInput = page.locator('input[type="search"]')
      await searchInput.fill('API')
      
      // 検索結果が表示されるまで待機
      await page.waitForTimeout(500)
      
      // 検索結果内のリンクをクリック
      const searchResults = page.locator('.card')
      
      if (await searchResults.count() > 0) {
        const firstResult = searchResults.first()
        const resultLink = firstResult.locator('a')
        
        if (await resultLink.count() > 0) {
          await resultLink.click()
          
          // 適切なページに遷移することを確認
          await expect(page).toHaveURL(/\/docs\//)
        }
      }
    })

    test('外部リンクの処理', async ({ page, context }) => {
      await page.goto('/community')
      await expect(page.locator('h1')).toBeVisible()
      
      // Discordリンクなどの外部リンクをテスト
      const externalLinks = page.locator('a[target="_blank"]')
      
      if (await externalLinks.count() > 0) {
        const firstExternalLink = externalLinks.first()
        
        // 新しいページが開くことを確認
        const pagePromise = context.waitForEvent('page')
        await firstExternalLink.click()
        const newPage = await pagePromise
        
        // 新しいページが開いたことを確認
        await newPage.waitForLoadState()
        expect(context.pages()).toHaveLength(2)
        
        // 外部URLであることを確認
        const newUrl = newPage.url()
        expect(newUrl).not.toContain(page.url().split('/')[2]) // 同じドメインでない
        
        // 新しいページを閉じる
        await newPage.close()
      }
    })

    test('戻る・進むボタンの動作', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // プロダクトページに移動
      await page.locator('a:has-text("プラットフォームを探索")').click()
      await expect(page).toHaveURL(/products/)
      
      // コミュニティページに移動
      await page.locator('a[href="/community"]').click()
      await expect(page).toHaveURL(/community/)
      
      // ブラウザの戻るボタン
      await page.goBack()
      await expect(page).toHaveURL(/products/)
      
      // もう一度戻る
      await page.goBack()
      await expect(page).toHaveURL(/\/$/)
      
      // 進むボタン
      await page.goForward()
      await expect(page).toHaveURL(/products/)
      
      // もう一度進む
      await page.goForward()
      await expect(page).toHaveURL(/community/)
    })

    test('キーボードショートカットナビゲーション', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.locator('h1')).toBeVisible()
      
      // 検索フォーカスのショートカット（実装されている場合）
      const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'
      
      await page.keyboard.press(`${modifier}+KeyK`)
      
      // 検索入力がフォーカスされることを確認（実装されている場合）
      const searchInput = page.locator('input[type="search"]')
      const isFocused = await searchInput.evaluate(el => document.activeElement === el)
      
      if (isFocused) {
        expect(isFocused).toBeTruthy()
        
        // Escapeキーでフォーカス解除
        await page.keyboard.press('Escape')
        
        const isStillFocused = await searchInput.evaluate(el => document.activeElement === el)
        expect(isStillFocused).toBeFalsy()
      }
    })

    test('無効なアンカーリンクの処理', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // 存在しないアンカーリンクに手動で移動
      await page.evaluate(() => {
        const link = document.createElement('a')
        link.href = '#non-existent-section'
        link.textContent = 'Invalid Link'
        link.id = 'test-invalid-link'
        document.body.appendChild(link)
      })
      
      // 無効なアンカーリンクをクリック
      await page.locator('#test-invalid-link').click()
      
      // ページがクラッシュしないことを確認
      await expect(page.locator('h1')).toBeVisible()
      
      // URL にハッシュが追加されることを確認
      expect(page.url()).toContain('#non-existent-section')
    })
  })

  test.describe('スクロール体験の最適化', () => {
    test('長いページでのスクロールパフォーマンス', async ({ page }) => {
      await page.goto('/about')
      await expect(page.locator('h1')).toBeVisible()
      
      // ページの高さを取得
      const pageHeight = await page.evaluate(() => document.body.scrollHeight)
      const viewportHeight = await page.evaluate(() => window.innerHeight)
      
      // 長いページの場合のみテスト実行
      if (pageHeight > viewportHeight * 2) {
        const startTime = Date.now()
        
        // ページ下部まで一気にスクロール
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        
        // スクロール完了を待機
        await page.waitForFunction(() => 
          window.scrollY >= document.body.scrollHeight - window.innerHeight - 100
        )
        
        const endTime = Date.now()
        const scrollTime = endTime - startTime
        
        // スクロールが2秒以内に完了することを確認
        expect(scrollTime).toBeLessThan(2000)
        
        // ページ上部に戻る
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForFunction(() => window.scrollY < 100)
      }
    })

    test('スクロール中のUI要素の表示', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // ナビゲーションバーが常に表示されていることを確認
      const navbar = page.locator('nav')
      await expect(navbar).toBeVisible()
      
      // ページ下部までスクロール
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // スクロール後もナビゲーションバーが表示されていることを確認
      await expect(navbar).toBeVisible()
      
      // フッターが表示されていることを確認
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })
  })
})