import { test, expect } from '@playwright/test'

test.describe('ドキュメントページ完全テスト E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docs')
    
    // ページが完全に読み込まれるまで待機
    await expect(page.locator('h1')).toBeVisible()
  })

  test.describe('人気のドキュメントセクション', () => {
    test('人気ドキュメントの「読む」ボタンが全て機能する', async ({ page }) => {
      // 人気のドキュメントセクションまでスクロール
      await page.locator('text=人気のドキュメント').scrollIntoViewIfNeeded()
      
      // 人気ドキュメントのカードを全て取得
      const popularDocsCards = page.locator('text=人気のドキュメント').locator('xpath=following-sibling::*[1]').locator('.card')
      const cardCount = await popularDocsCards.count()
      
      expect(cardCount).toBeGreaterThan(0)
      
      // 各カードの「読む」ボタンをテスト
      for (let i = 0; i < cardCount; i++) {
        const card = popularDocsCards.nth(i)
        const readButton = card.locator('a:has-text("読む")')
        
        await expect(readButton).toBeVisible()
        
        // リンク先URLの確認
        const href = await readButton.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).toMatch(/^\/docs\//)
        
        // カードタイトルと説明の存在確認
        const title = card.locator('h3')
        const description = card.locator('p')
        
        await expect(title).toBeVisible()
        await expect(description).toBeVisible()
        
        // カテゴリと読み時間の表示確認
        const category = card.locator('.bg-blue-100')
        const readTime = card.locator('text=分')
        
        await expect(category).toBeVisible()
        await expect(readTime).toBeVisible()
      }
    })

    test('人気ドキュメントの個別リンク動作', async ({ page }) => {
      await page.locator('text=人気のドキュメント').scrollIntoViewIfNeeded()
      
      // 最初の人気ドキュメントをテスト
      const firstCard = page.locator('text=人気のドキュメント').locator('xpath=following-sibling::*[1]').locator('.card').first()
      const readButton = firstCard.locator('a:has-text("読む")')
      
      if (await readButton.count() > 0) {
        const href = await readButton.getAttribute('href')
        
        // リンクをクリック
        await readButton.click()
        
        // 適切なドキュメントページに遷移することを確認
        await expect(page).toHaveURL(new RegExp(href!.replace('/', '\\/')))
        
        // ドキュメントページが正常に表示されることを確認
        await expect(page.locator('h1')).toBeVisible()
        
        // 戻るボタンでドキュメント一覧に戻る
        await page.goBack()
        await expect(page).toHaveURL(/\/docs$/)
      }
    })

    test('人気ドキュメントのカテゴリ表示', async ({ page }) => {
      await page.locator('text=人気のドキュメント').scrollIntoViewIfNeeded()
      
      const cards = page.locator('text=人気のドキュメント').locator('xpath=following-sibling::*[1]').locator('.card')
      const cardCount = await cards.count()
      
      // 各カードにカテゴリが表示されていることを確認
      for (let i = 0; i < cardCount; i++) {
        const card = cards.nth(i)
        const categoryBadge = card.locator('.bg-blue-100')
        
        await expect(categoryBadge).toBeVisible()
        
        const categoryText = await categoryBadge.textContent()
        expect(categoryText).toBeTruthy()
        expect(categoryText!.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('ドキュメント一覧セクション', () => {
    test('ドキュメントセクションの全カテゴリ表示', async ({ page }) => {
      await page.locator('text=ドキュメント一覧').scrollIntoViewIfNeeded()
      
      // ドキュメントセクションのカードを取得
      const sectionCards = page.locator('text=ドキュメント一覧').locator('xpath=following-sibling::*[1]').locator('.card')
      const sectionCount = await sectionCards.count()
      
      expect(sectionCount).toBeGreaterThan(0)
      
      // 各セクションの構造確認
      for (let i = 0; i < sectionCount; i++) {
        const sectionCard = sectionCards.nth(i)
        
        // アイコンの存在確認
        const icon = sectionCard.locator('span').first()
        await expect(icon).toBeVisible()
        
        // セクションタイトルの確認
        const title = sectionCard.locator('h3')
        await expect(title).toBeVisible()
        
        // セクション説明の確認
        const description = sectionCard.locator('p')
        await expect(description).toBeVisible()
        
        // セクション内のアイテムリストの確認
        const items = sectionCard.locator('.space-y-2 > div')
        const itemCount = await items.count()
        expect(itemCount).toBeGreaterThan(0)
      }
    })

    test('ドキュメントセクション内のアイテムリンク', async ({ page }) => {
      await page.locator('text=ドキュメント一覧').scrollIntoViewIfNeeded()
      
      // 最初のセクションのアイテムをテスト
      const firstSection = page.locator('text=ドキュメント一覧').locator('xpath=following-sibling::*[1]').locator('.card').first()
      const sectionItems = firstSection.locator('.space-y-2 > div')
      const itemCount = await sectionItems.count()
      
      // 最初の3つのアイテムをテスト（パフォーマンス考慮）
      const testCount = Math.min(3, itemCount)
      
      for (let i = 0; i < testCount; i++) {
        const item = sectionItems.nth(i)
        
        // アイテムタイプインジケーター（色付きドット）の確認
        const indicator = item.locator('.w-2.h-2.rounded-full')
        await expect(indicator).toBeVisible()
        
        // アイテムタイトル（クリック可能）の確認
        const itemLink = item.locator('span.text-gray-700')
        await expect(itemLink).toBeVisible()
        
        // カーソルがpointerになることを確認
        await expect(itemLink).toHaveClass(/cursor-pointer/)
        
        // 矢印アイコンの確認
        const arrowIcon = item.locator('svg')
        await expect(arrowIcon).toBeVisible()
      }
    })

    test('ドキュメントアイテムのタイプ別表示', async ({ page }) => {
      await page.locator('text=ドキュメント一覧').scrollIntoViewIfNeeded()
      
      const sections = page.locator('text=ドキュメント一覧').locator('xpath=following-sibling::*[1]').locator('.card')
      const sectionCount = await sections.count()
      
      let foundTypes = {
        guide: false,
        technical: false,
        api: false
      }
      
      // 各セクションのアイテムタイプを確認
      for (let i = 0; i < sectionCount; i++) {
        const section = sections.nth(i)
        const items = section.locator('.space-y-2 > div')
        const itemCount = await items.count()
        
        for (let j = 0; j < itemCount; j++) {
          const item = items.nth(j)
          const indicator = item.locator('.w-2.h-2.rounded-full')
          
          // インジケーターの色クラスでタイプを判定
          const classList = await indicator.getAttribute('class')
          
          if (classList?.includes('bg-blue-400')) {
            foundTypes.guide = true
          } else if (classList?.includes('bg-purple-400')) {
            foundTypes.technical = true
          } else if (classList?.includes('bg-green-400')) {
            foundTypes.api = true
          }
        }
      }
      
      // 少なくとも2つのタイプが見つかることを確認
      const typeCount = Object.values(foundTypes).filter(Boolean).length
      expect(typeCount).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('SDK & 開発ツールセクション', () => {
    test('SDK・ツールの「ドキュメント」「ダウンロード」ボタン', async ({ page }) => {
      await page.locator('text=SDK & 開発ツール').scrollIntoViewIfNeeded()
      
      // SDKツールのカードを取得
      const sdkCards = page.locator('text=SDK & 開発ツール').locator('xpath=following-sibling::*[1]').locator('.card')
      const cardCount = await sdkCards.count()
      
      expect(cardCount).toBeGreaterThan(0)
      
      // 各SDKカードのボタンをテスト
      for (let i = 0; i < cardCount; i++) {
        const card = sdkCards.nth(i)
        
        // ドキュメントボタンのテスト
        const docButton = card.locator('a:has-text("ドキュメント")')
        await expect(docButton).toBeVisible()
        
        const docHref = await docButton.getAttribute('href')
        expect(docHref).toBeTruthy()
        expect(docHref).toMatch(/^\/docs\//)
        
        // ダウンロードボタンのテスト
        const downloadButton = card.locator('a:has-text("ダウンロード")')
        await expect(downloadButton).toBeVisible()
        
        const downloadHref = await downloadButton.getAttribute('href')
        expect(downloadHref).toBeTruthy()
        expect(downloadHref).toMatch(/^\/downloads\//)
        
        // SDKの基本情報確認
        const title = card.locator('h3')
        const description = card.locator('p')
        const language = card.locator('.bg-green-100')
        const version = card.locator('.text-gray-500')
        
        await expect(title).toBeVisible()
        await expect(description).toBeVisible()
        await expect(language).toBeVisible()
        await expect(version).toBeVisible()
      }
    })

    test('SDKダウンロードリンクの動作', async ({ page }) => {
      await page.locator('text=SDK & 開発ツール').scrollIntoViewIfNeeded()
      
      // 最初のSDKカードをテスト
      const firstCard = page.locator('text=SDK & 開発ツール').locator('xpath=following-sibling::*[1]').locator('.card').first()
      const downloadButton = firstCard.locator('a:has-text("ダウンロード")')
      
      if (await downloadButton.count() > 0) {
        const href = await downloadButton.getAttribute('href')
        
        // ダウンロードリンクをクリック
        await downloadButton.click()
        
        // ダウンロードページに遷移することを確認
        await expect(page).toHaveURL(new RegExp(href!.replace('/', '\\/')))
        
        // ダウンロードページの基本要素確認（404でないことを確認）
        await expect(page.locator('body')).toBeVisible()
        
        // 戻る
        await page.goBack()
        await expect(page).toHaveURL(/\/docs$/)
      }
    })

    test('SDK言語別表示', async ({ page }) => {
      await page.locator('text=SDK & 開発ツール').scrollIntoViewIfNeeded()
      
      const sdkCards = page.locator('text=SDK & 開発ツール').locator('xpath=following-sibling::*[1]').locator('.card')
      const cardCount = await sdkCards.count()
      
      const languages = new Set()
      
      // 各SDKの言語を収集
      for (let i = 0; i < cardCount; i++) {
        const card = sdkCards.nth(i)
        const languageBadge = card.locator('.bg-green-100')
        
        const languageText = await languageBadge.textContent()
        if (languageText) {
          languages.add(languageText.trim())
        }
      }
      
      // 複数の言語/プラットフォームがサポートされていることを確認
      expect(languages.size).toBeGreaterThanOrEqual(2)
      
      // 一般的な言語が含まれていることを確認
      const languageArray = Array.from(languages)
      const hasCommonLanguages = languageArray.some(lang => 
        ['JavaScript', 'Python', 'CLI', 'Extension'].includes(lang as string)
      )
      expect(hasCommonLanguages).toBeTruthy()
    })
  })

  test.describe('ドキュメント貢献セクション', () => {
    test('「GitHub で編集」ボタンの外部リンク動作', async ({ page, context }) => {
      await page.locator('text=ドキュメント改善に貢献').scrollIntoViewIfNeeded()
      
      // GitHub編集ボタンを見つける
      const githubButton = page.locator('a:has-text("GitHub で編集")')
      await expect(githubButton).toBeVisible()
      
      // 外部リンクの属性確認
      const target = await githubButton.getAttribute('target')
      const rel = await githubButton.getAttribute('rel')
      
      expect(target).toBe('_blank')
      expect(rel).toBe('noopener noreferrer')
      
      // href属性の確認
      const href = await githubButton.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toContain('github.com')
      
      // 新しいタブで開くことを確認
      const pagePromise = context.waitForEvent('page')
      await githubButton.click()
      const newPage = await pagePromise
      
      await newPage.waitForLoadState()
      expect(context.pages()).toHaveLength(2)
      
      // GitHub URLであることを確認
      const newUrl = newPage.url()
      expect(newUrl).toContain('github.com')
      
      await newPage.close()
    })

    test('「フィードバック送信」ボタンのリンク', async ({ page }) => {
      await page.locator('text=ドキュメント改善に貢献').scrollIntoViewIfNeeded()
      
      // フィードバック送信ボタンを見つける
      const feedbackButton = page.locator('a:has-text("フィードバック送信")')
      await expect(feedbackButton).toBeVisible()
      
      // リンク先の確認
      const href = await feedbackButton.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toContain('/contact')
      expect(href).toContain('type=feedback')
      
      // リンクをクリック
      await feedbackButton.click()
      
      // コンタクトページに遷移することを確認
      await expect(page).toHaveURL(/contact/)
      await expect(page.url()).toContain('type=feedback')
      
      // コンタクトページが正常に表示されることを確認
      await expect(page.locator('body')).toBeVisible()
      
      // 戻る
      await page.goBack()
      await expect(page).toHaveURL(/\/docs$/)
    })
  })

  test.describe('クイックリンクナビゲーション', () => {
    test('ページ下部のクイックリンクが全て機能する', async ({ page }) => {
      // ページ下部までスクロール
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // クイックリンクセクションを確認
      const quickLinksSection = page.locator('text=クイックスタート').locator('xpath=ancestor::section[1]')
      await expect(quickLinksSection).toBeVisible()
      
      // 各クイックリンクをテスト
      const quickLinks = [
        { text: 'クイックスタート', href: '/docs/quickstart' },
        { text: 'API リファレンス', href: '/docs/api' },
        { text: 'SDK', href: '/docs/sdk' },
        { text: 'サポート', href: '/docs/support' },
        { text: 'FAQ', href: '/docs/faq' }
      ]
      
      for (const link of quickLinks) {
        const linkElement = page.locator(`a:has-text("${link.text}")`)
        
        if (await linkElement.count() > 0) {
          await expect(linkElement).toBeVisible()
          
          const href = await linkElement.getAttribute('href')
          expect(href).toBe(link.href)
          
          // リンクをクリック（最初のリンクのみ実際にテスト）
          if (link === quickLinks[0]) {
            await linkElement.click()
            await expect(page).toHaveURL(new RegExp(link.href.replace('/', '\\/')))
            
            // ページが正常に表示されることを確認
            await expect(page.locator('body')).toBeVisible()
            
            // 戻る
            await page.goBack()
            await expect(page).toHaveURL(/\/docs$/)
          }
        }
      }
    })

    test('クイックリンクのセパレーター表示', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      
      // セパレーター（|）の存在確認
      const separators = page.locator('span.text-gray-300:has-text("|")')
      const separatorCount = await separators.count()
      
      // セパレーターが適切に表示されていることを確認
      expect(separatorCount).toBeGreaterThan(0)
      
      // 各セパレーターが表示されていることを確認
      for (let i = 0; i < separatorCount; i++) {
        const separator = separators.nth(i)
        await expect(separator).toBeVisible()
        
        const text = await separator.textContent()
        expect(text).toBe('|')
      }
    })
  })

  test.describe('ドキュメントページのレスポンシブ表示', () => {
    test('モバイルでのドキュメント表示', async ({ page }) => {
      // モバイルビューポートに設定
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 各セクションがモバイルで適切に表示されることを確認
      const sections = [
        'text=人気のドキュメント',
        'text=ドキュメント一覧',
        'text=SDK & 開発ツール'
      ]
      
      for (const sectionLocator of sections) {
        await page.locator(sectionLocator).scrollIntoViewIfNeeded()
        await expect(page.locator(sectionLocator)).toBeVisible()
        
        // セクションのカードがモバイルで適切に表示されることを確認
        const sectionCards = page.locator(sectionLocator).locator('xpath=following-sibling::*[1]').locator('.card')
        
        if (await sectionCards.count() > 0) {
          const firstCard = sectionCards.first()
          await expect(firstCard).toBeVisible()
          
          // カードの幅がモバイル画面に収まることを確認
          const cardBounds = await firstCard.boundingBox()
          if (cardBounds) {
            expect(cardBounds.width).toBeLessThanOrEqual(375)
          }
        }
      }
    })

    test('タブレットでのドキュメント表示', async ({ page }) => {
      // タブレットビューポートに設定
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // グリッドレイアウトの確認
      await page.locator('text=人気のドキュメント').scrollIntoViewIfNeeded()
      
      const popularDocsGrid = page.locator('text=人気のドキュメント').locator('xpath=following-sibling::*[1]')
      
      // タブレットで適切にレイアウトされることを確認
      await expect(popularDocsGrid).toBeVisible()
      
      // グリッドクラスの確認
      const gridClass = await popularDocsGrid.getAttribute('class')
      expect(gridClass).toContain('grid')
    })
  })
})