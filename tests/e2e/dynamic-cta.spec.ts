import { test, expect } from '@playwright/test'

test.describe('動的CTAシステム E2E', () => {
  test.describe('CTASectionコンポーネントの動作', () => {
    test('ホームページの複数CTAセクションが正常に動作する', async ({ page }) => {
      await page.goto('/')
      
      // ページが完全に読み込まれるまで待機
      await expect(page.locator('h1')).toBeVisible()
      
      // ヒーローセクションのCTAボタンをテスト
      const heroSection = page.locator('section').first()
      await expect(heroSection).toBeVisible()
      
      // プライマリーCTAボタン（プラットフォームを探索）
      const primaryCTA = heroSection.locator('a:has-text("プラットフォームを探索")')
      await expect(primaryCTA).toBeVisible()
      
      const primaryHref = await primaryCTA.getAttribute('href')
      expect(primaryHref).toBe('/products')
      
      // セカンダリーCTAボタン（ドキュメントを見る）
      const secondaryCTA = heroSection.locator('a:has-text("ドキュメントを見る")')
      await expect(secondaryCTA).toBeVisible()
      
      const secondaryHref = await secondaryCTA.getAttribute('href')
      expect(secondaryHref).toBe('/docs')
      
      // CTAボタンのクリック動作をテスト
      await primaryCTA.click()
      await expect(page).toHaveURL(/products/)
      
      // 戻ってセカンダリーCTAをテスト
      await page.goBack()
      await expect(page).toHaveURL(/\/$/)
      
      await secondaryCTA.click()
      await expect(page).toHaveURL(/docs/)
    })

    test('プロダクトページのCTAセクションが正常に動作する', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      // プロダクトページ下部のCTAセクションまでスクロール
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      
      // CTAセクションの存在確認
      const ctaSection = page.locator('text=革新的なSaaSエコシステムに参加').locator('xpath=ancestor::section[1]')
      await expect(ctaSection).toBeVisible()
      
      // CTAボタンをテスト
      const communityButton = ctaSection.locator('a:has-text("コミュニティに参加")')
      const aboutButton = ctaSection.locator('a:has-text("詳細を見る")')
      
      await expect(communityButton).toBeVisible()
      await expect(aboutButton).toBeVisible()
      
      // ボタンのhref属性を確認
      const communityHref = await communityButton.getAttribute('href')
      const aboutHref = await aboutButton.getAttribute('href')
      
      expect(communityHref).toBe('/community')
      expect(aboutHref).toBe('/about')
      
      // ナビゲーション動作のテスト
      await communityButton.click()
      await expect(page).toHaveURL(/community/)
      
      await page.goBack()
      await aboutButton.click()
      await expect(page).toHaveURL(/about/)
    })

    test('コミュニティページのCTAセクションが正常に動作する', async ({ page }) => {
      await page.goto('/community')
      await expect(page.locator('h1')).toBeVisible()
      
      // CTAセクションまでスクロール
      await page.locator('text=今すぐUnson OSコミュニティに参加しよう').scrollIntoViewIfNeeded()
      
      const ctaSection = page.locator('text=今すぐUnson OSコミュニティに参加しよう').locator('xpath=ancestor::section[1]')
      await expect(ctaSection).toBeVisible()
      
      // CTAボタンのテスト
      const productsButton = ctaSection.locator('a:has-text("プロダクトを探索")')
      const docsButton = ctaSection.locator('a:has-text("ドキュメントを見る")')
      
      await expect(productsButton).toBeVisible()
      await expect(docsButton).toBeVisible()
      
      // リンク先の確認
      expect(await productsButton.getAttribute('href')).toBe('/products')
      expect(await docsButton.getAttribute('href')).toBe('/docs')
    })

    test('アバウトページのCTAセクションが正常に動作する', async ({ page }) => {
      await page.goto('/about')
      await expect(page.locator('h1')).toBeVisible()
      
      // CTAセクションまでスクロール
      await page.locator('text=Unson OSの未来に参加しませんか').scrollIntoViewIfNeeded()
      
      const ctaSection = page.locator('text=Unson OSの未来に参加しませんか').locator('xpath=ancestor::section[1]')
      await expect(ctaSection).toBeVisible()
      
      // CTAボタンのテスト
      const communityButton = ctaSection.locator('a:has-text("コミュニティに参加")')
      const productsButton = ctaSection.locator('a:has-text("プロダクトを探索")')
      
      await expect(communityButton).toBeVisible()
      await expect(productsButton).toBeVisible()
      
      // リンク先の確認
      expect(await communityButton.getAttribute('href')).toBe('/community')
      expect(await productsButton.getAttribute('href')).toBe('/products')
    })
  })

  test.describe('useNavigationフックのCTAパターン', () => {
    test('共通CTAパターンの一貫性確認', async ({ page }) => {
      // 各ページの共通CTAパターンをテスト
      const pages = [
        { url: '/', section: 'ヒーロー' },
        { url: '/products', section: 'プロダクト' },
        { url: '/community', section: 'コミュニティ' },
        { url: '/about', section: 'アバウト' }
      ]
      
      for (const pageInfo of pages) {
        await page.goto(pageInfo.url)
        await expect(page.locator('h1')).toBeVisible()
        
        // ページの最後のCTAセクションを見つける
        const ctaSections = page.locator('section').filter({ hasText: /参加|探索|見る/ })
        
        if (await ctaSections.count() > 0) {
          const lastCTASection = ctaSections.last()
          await lastCTASection.scrollIntoViewIfNeeded()
          
          // CTAボタンの存在確認
          const ctaButtons = lastCTASection.locator('a[href^="/"]')
          const buttonCount = await ctaButtons.count()
          
          expect(buttonCount).toBeGreaterThan(0)
          expect(buttonCount).toBeLessThanOrEqual(3) // 最大3つのCTAボタン
          
          // 各CTAボタンのhref属性が有効であることを確認
          for (let i = 0; i < buttonCount; i++) {
            const button = ctaButtons.nth(i)
            const href = await button.getAttribute('href')
            
            expect(href).toBeTruthy()
            expect(href).toMatch(/^\/[a-z-]*$/) // 有効なパス形式
          }
        }
      }
    })

    test('CTAボタンのスタイリング一貫性', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // ヒーローセクションのCTAボタンを取得
      const heroSection = page.locator('section').first()
      const ctaButtons = heroSection.locator('a').filter({ hasText: /探索|見る/ })
      
      const buttonCount = await ctaButtons.count()
      expect(buttonCount).toBeGreaterThanOrEqual(2)
      
      // 各ボタンのスタイリングクラスを確認
      for (let i = 0; i < buttonCount; i++) {
        const button = ctaButtons.nth(i)
        const buttonClass = await button.getAttribute('class')
        
        // ボタンスタイルクラスが適用されていることを確認
        expect(buttonClass).toBeTruthy()
        expect(buttonClass).toContain('inline-flex') // Tailwind ボタンクラス
        expect(buttonClass).toContain('items-center')
        expect(buttonClass).toContain('justify-center')
      }
    })

    test('CTAボタンのホバー・フォーカス状態', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      const primaryCTA = page.locator('a:has-text("プラットフォームを探索")').first()
      await expect(primaryCTA).toBeVisible()
      
      // ホバー状態をテスト
      await primaryCTA.hover()
      
      // フォーカス状態をテスト
      await primaryCTA.focus()
      await expect(primaryCTA).toBeFocused()
      
      // キーボードナビゲーション
      await page.keyboard.press('Tab')
      const secondaryCTA = page.locator('a:has-text("ドキュメントを見る")').first()
      await expect(secondaryCTA).toBeFocused()
      
      // Enterキーでクリック
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/docs/)
    })
  })

  test.describe('動的CTAコンテンツ', () => {
    test('ページコンテキストに応じたCTAメッセージ', async ({ page }) => {
      // ホームページのCTAメッセージ
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      const homeCtaTitle = page.locator('text=革新的なSaaSエコシステムに参加')
      await expect(homeCtaTitle).toBeVisible()
      
      // プロダクトページのCTAメッセージ
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      const productsCtaTitle = page.locator('text=革新的なSaaSエコシステムに参加')
      await expect(productsCtaTitle).toBeVisible()
      
      // コミュニティページのCTAメッセージ
      await page.goto('/community')
      await expect(page.locator('h1')).toBeVisible()
      
      await page.locator('text=今すぐUnson OSコミュニティに参加しよう').scrollIntoViewIfNeeded()
      const communityCtaTitle = page.locator('text=今すぐUnson OSコミュニティに参加しよう')
      await expect(communityCtaTitle).toBeVisible()
    })

    test('CTAセクションの背景グラデーション', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // CTAセクションの背景を確認
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      const ctaSection = page.locator('text=革新的なSaaSエコシステムに参加').locator('xpath=ancestor::section[1]')
      
      // 背景グラデーションクラスの確認
      const sectionClass = await ctaSection.getAttribute('class')
      expect(sectionClass).toContain('bg-gradient-to-r')
    })

    test('レスポンシブCTAレイアウト', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // デスクトップレイアウト確認
      await page.setViewportSize({ width: 1024, height: 768 })
      
      await page.locator('text=革新的なSaaSエコシステムに参加').scrollIntoViewIfNeeded()
      const ctaSection = page.locator('text=革新的なSaaSエコシステムに参加').locator('xpath=ancestor::section[1]')
      const ctaButtons = ctaSection.locator('a')
      
      // デスクトップで水平配置の確認
      const buttonContainer = ctaButtons.first().locator('xpath=ancestor::div[1]')
      const containerClass = await buttonContainer.getAttribute('class')
      expect(containerClass).toContain('sm:flex-row')
      
      // モバイルレイアウト確認
      await page.setViewportSize({ width: 375, height: 667 })
      
      // モバイルで垂直配置の確認
      await expect(buttonContainer).toBeVisible()
      expect(containerClass).toContain('flex-col')
    })
  })

  test.describe('CTAアナリティクス追跡', () => {
    test('CTAクリックイベントの追跡', async ({ page }) => {
      // アナリティクス追跡のモック
      let analyticsEvents: any[] = []
      
      await page.exposeFunction('trackAnalytics', (event: any) => {
        analyticsEvents.push(event)
      })
      
      await page.addInitScript(() => {
        window.gtag = (...args: any[]) => {
          window.trackAnalytics?.(args)
        }
      })
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // CTAボタンをクリック
      const primaryCTA = page.locator('a:has-text("プラットフォームを探索")').first()
      await primaryCTA.click()
      
      // アナリティクスイベントが送信されたことを確認
      await page.waitForTimeout(1000) // イベント送信待機
      
      expect(analyticsEvents.length).toBeGreaterThan(0)
      
      // CTA関連のイベントが記録されていることを確認
      const hasCTAEvent = analyticsEvents.some(event => 
        Array.isArray(event) && event.some(arg => 
          typeof arg === 'string' && arg.includes('cta_click')
        )
      )
      
      if (analyticsEvents.length > 0) {
        // アナリティクスイベントが実装されている場合の確認
        expect(hasCTAEvent).toBeTruthy()
      }
    })
  })

  test.describe('CTAパフォーマンス', () => {
    test('CTA表示パフォーマンス', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // CTAボタンが表示されるまでの時間を測定
      await expect(page.locator('a:has-text("プラットフォームを探索")')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // CTAが5秒以内に表示されることを確認
      expect(loadTime).toBeLessThan(5000)
    })

    test('複数CTAの同時表示パフォーマンス', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // 複数のCTAセクションが同時に表示されることを確認
      const ctaSections = page.locator('section').filter({ hasText: /参加|探索/ })
      const sectionCount = await ctaSections.count()
      
      expect(sectionCount).toBeGreaterThanOrEqual(1)
      
      // 各セクションの表示を並行してテスト
      for (let i = 0; i < sectionCount; i++) {
        const section = ctaSections.nth(i)
        await section.scrollIntoViewIfNeeded()
        await expect(section).toBeVisible({ timeout: 3000 })
      }
    })
  })
})