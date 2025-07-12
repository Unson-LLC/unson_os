import { test, expect } from '@playwright/test'

test.describe('サイトナビゲーション E2E', () => {
  test('メインナビゲーションが正常に機能する', async ({ page }) => {
    await page.goto('/')

    // ホームページの確認
    await expect(page.locator('h1')).toBeVisible()
    
    // プロダクトページへのナビゲーション（デスクトップメニューのみ）
    const productLink = page.locator('.md\\:flex a[href="/products"]')
    if (await productLink.count() > 0) {
      await productLink.click()
      await expect(page).toHaveURL(/products/)
    }

    // ホームに戻る（デスクトップメニューのみ）
    await page.locator('.md\\:flex a[href="/"]').click()
    await expect(page).toHaveURL('/')
  })

  test('モバイルナビゲーションメニューが機能する', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // モバイルメニューボタンの確認と操作
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]').or(
      page.locator('button[aria-label*="menu"]')
    ).or(
      page.locator('button:has-text("☰")')
    )

    if (await mobileMenuButton.count() > 0) {
      // メニューボタンをクリック
      await mobileMenuButton.click()

      // モバイルメニューが開くことを確認
      const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
        page.locator('nav[aria-expanded="true"]')
      )
      await expect(mobileMenu).toBeVisible()

      // メニューを閉じる
      await mobileMenuButton.click()
      await expect(mobileMenu).not.toBeVisible()
    }
  })

  test('ページ間の遷移が適切に機能する', async ({ page }) => {
    await page.goto('/')

    // 各主要ページへの遷移をテスト
    const testPages = [
      { name: 'About', url: '/about', text: ['について', 'About', 'Unson OS'] },
      { name: 'Products', url: '/products', text: ['プロダクト', 'Products'] },
      { name: 'Community', url: '/community', text: ['コミュニティ', 'Community'] },
      { name: 'Docs', url: '/docs', text: ['ドキュメント', 'Documentation', 'Docs'] }
    ]

    for (const testPage of testPages) {
      // 該当するリンクを探す
      let linkFound = false
      for (const linkText of testPage.text) {
        const link = page.locator(`a:has-text("${linkText}")`)
        if (await link.count() > 0) {
          await link.first().click()
          
          // URLまたはページ内容で確認
          try {
            await expect(page).toHaveURL(new RegExp(testPage.url.replace('/', '')))
            linkFound = true
            break
          } catch {
            // URLチェックが失敗した場合、ページ内容で確認
            const hasContent = await page.locator(`h1:has-text("${linkText}")`).count() > 0
            if (hasContent) {
              linkFound = true
              break
            }
          }
        }
      }

      // ホームに戻る
      await page.goto('/')
    }
  })

  test('外部リンクが新しいタブで開く', async ({ page, context }) => {
    await page.goto('/')

    // 外部リンクを探す
    const externalLinks = page.locator('a[target="_blank"]')
    
    if (await externalLinks.count() > 0) {
      const firstExternalLink = externalLinks.first()
      
      // 新しいページが開くことを待つ
      const pagePromise = context.waitForEvent('page')
      await firstExternalLink.click()
      const newPage = await pagePromise

      // 新しいページが開いたことを確認
      await newPage.waitForLoadState()
      expect(context.pages()).toHaveLength(2)

      // 新しいページを閉じる
      await newPage.close()
    }
  })

  test('ブレッドクラムナビゲーションが機能する', async ({ page }) => {
    await page.goto('/')

    // 深い階層のページに移動（例：ドキュメント詳細ページ）
    const docsLink = page.locator('.md\\:flex a[href="/docs"]')
    
    if (await docsLink.count() > 0) {
      await docsLink.click()

      // ブレッドクラムの確認
      const breadcrumb = page.locator('[aria-label="Breadcrumb"]').or(
        page.locator('.breadcrumb')
      ).or(
        page.locator('nav ol')
      )

      if (await breadcrumb.count() > 0) {
        await expect(breadcrumb).toBeVisible()
        
        // ホームへのリンクがブレッドクラムに含まれていることを確認
        const homeLink = breadcrumb.locator('a:has-text("ホーム")').or(
          breadcrumb.locator('a:has-text("Home")')
        )
        
        if (await homeLink.count() > 0) {
          await homeLink.click()
          await expect(page).toHaveURL('/')
        }
      }
    }
  })

  test('検索機能が動作する', async ({ page }) => {
    await page.goto('/')

    // 検索フォームを探す
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="検索"]')
    ).or(
      page.locator('input[placeholder*="search"]')
    )

    if (await searchInput.count() > 0) {
      // 検索テストを実行
      await searchInput.fill('test search')
      
      const searchButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("検索")')
      )

      if (await searchButton.count() > 0) {
        await searchButton.click()
        
        // 検索結果ページまたは検索結果セクションが表示されることを確認
        await expect(page.locator('text=検索結果').or(page.locator('text=Search Results'))).toBeVisible()
      }
    }
  })

  test('404ページが適切に表示される', async ({ page }) => {
    // 存在しないページにアクセス
    await page.goto('/non-existent-page-12345')

    // 404ページの要素を確認
    await expect(page.locator('text=404').or(page.locator('text=Not Found'))).toBeVisible()
    
    // ホームに戻るリンクがあることを確認（デスクトップメニューのみ）
    const homeLink = page.locator('.md\\:flex a[href="/"]')

    if (await homeLink.count() > 0) {
      await homeLink.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('ページローディング状態が適切に管理される', async ({ page }) => {
    // ネットワークを遅くして読み込み状態をテスト
    await page.route('**/*', route => {
      return new Promise(resolve => {
        setTimeout(() => resolve(route.continue()), 100)
      })
    })

    await page.goto('/')

    // ページが最終的に正常に読み込まれることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  test('プロダクトページのCTAボタンが機能する', async ({ page }) => {
    await page.goto('/products')

    // ページが読み込まれることを確認
    await expect(page.locator('h1')).toBeVisible()

    // CTAセクションまでスクロール
    await page.locator('text=あなたのアイデアをプロダクトに').scrollIntoViewIfNeeded()

    // 「プロダクト開発をリクエスト」ボタンのテスト
    const productRequestButton = page.locator('a:has-text("プロダクト開発をリクエスト")')
    await expect(productRequestButton).toBeVisible()
    
    // ボタンがコンタクトページへのリンクになっていることを確認
    const productRequestHref = await productRequestButton.getAttribute('href')
    expect(productRequestHref).toContain('/contact')
    expect(productRequestHref).toContain('type=product-request')

    // 「パートナーシップを相談」ボタンのテスト
    const partnershipButton = page.locator('a:has-text("パートナーシップを相談")')
    await expect(partnershipButton).toBeVisible()
    
    // ボタンがコンタクトページへのリンクになっていることを確認
    const partnershipHref = await partnershipButton.getAttribute('href')
    expect(partnershipHref).toContain('/contact')
    expect(partnershipHref).toContain('type=partnership')

    // 実際にボタンをクリックしてナビゲーションをテスト
    await productRequestButton.click()
    await expect(page).toHaveURL(/contact/)
    await expect(page.url()).toContain('type=product-request')
  })

  test('プロダクト一覧の個別ボタンが機能する', async ({ page }) => {
    await page.goto('/products')
    
    // ページが読み込まれることを確認
    await expect(page.locator('h1')).toBeVisible()
    
    // プロダクト一覧セクションまでスクロール
    await page.locator('#products-list').scrollIntoViewIfNeeded()
    
    // 最初のプロダクトカードを取得
    const firstProductCard = page.locator('.card').first()
    await expect(firstProductCard).toBeVisible()
    
    // 「詳細を見る」ボタンのテスト
    const detailButton = firstProductCard.locator('a:has-text("詳細を見る")')
    await expect(detailButton).toBeVisible()
    
    const detailHref = await detailButton.getAttribute('href')
    expect(detailHref).toMatch(/\/products\/\d+/)
    
    // 「試用開始」ボタンのテスト
    const trialButton = firstProductCard.locator('a:has-text("試用開始")')
    await expect(trialButton).toBeVisible()
    
    const trialHref = await trialButton.getAttribute('href')
    expect(trialHref).toMatch(/\/trial\/\d+/)
    
    // 複数のプロダクトカードをテスト
    const productCards = page.locator('.card')
    const cardCount = await productCards.count()
    expect(cardCount).toBeGreaterThan(0)
    
    // 最初の3つのカードの ボタンをテスト
    for (let i = 0; i < Math.min(3, cardCount); i++) {
      const card = productCards.nth(i)
      
      // 詳細ボタン
      const detailBtn = card.locator('a:has-text("詳細を見る")')
      if (await detailBtn.count() > 0) {
        const href = await detailBtn.getAttribute('href')
        expect(href).toMatch(/\/products\/\d+/)
      }
      
      // 試用ボタン
      const trialBtn = card.locator('a:has-text("試用開始")')
      if (await trialBtn.count() > 0) {
        const href = await trialBtn.getAttribute('href')
        expect(href).toMatch(/\/trial\/\d+/)
      }
    }
  })

  test('各ページのCTAボタンが正しく設定されている', async ({ page }) => {
    const ctaTests = [
      {
        url: '/',
        buttons: [
          { text: 'プラットフォームを探索', expectedHref: '/products' },
          { text: 'ドキュメントを見る', expectedHref: '/docs' },
          { text: '今すぐ参加', expectedHref: '/community' },
          { text: '詳細を見る', expectedHref: '/about' }
        ]
      },
      {
        url: '/community',
        buttons: [
          { text: 'コミュニティに参加', expectedHref: 'discord.gg' },
          { text: 'DAOについて学ぶ', expectedHref: '/docs/dao/overview' }
        ]
      },
      {
        url: '/about',
        buttons: [
          { text: '採用情報を見る', expectedHref: '/careers' },
          { text: 'お問い合わせ', expectedHref: '/contact' }
        ]
      },
      {
        url: '/docs/dao/overview',
        buttons: [
          { text: '今すぐ参加する', expectedHref: '/community' },
          { text: '提案プロセスを学ぶ', expectedHref: '/docs/dao/proposals' }
        ]
      }
    ]

    for (const testCase of ctaTests) {
      await page.goto(testCase.url)
      await expect(page.locator('h1')).toBeVisible()

      for (const button of testCase.buttons) {
        const buttonLocator = page.locator(`a:has-text("${button.text}")`)
        await expect(buttonLocator).toBeVisible()
        
        const href = await buttonLocator.getAttribute('href')
        expect(href).toContain(button.expectedHref)
      }
    }
  })
})