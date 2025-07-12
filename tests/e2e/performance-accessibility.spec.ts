import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('パフォーマンス・アクセシビリティ E2E', () => {
  test.describe('ページパフォーマンス', () => {
    test('ホームページの読み込みパフォーマンス', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // First Contentful Paint (FCP) を測定
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // ページが5秒以内に読み込まれることを確認
      expect(loadTime).toBeLessThan(5000)
      
      // Largest Contentful Paint (LCP) の測定
      const lcpValue = await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver(list => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // 3秒後にタイムアウト
          setTimeout(() => resolve(null), 3000)
        })
      })
      
      if (lcpValue) {
        // LCPが2.5秒以内であることを確認（Web Vitals推奨値）
        expect(lcpValue).toBeLessThan(2500)
      }
    })

    test('プロダクトページの読み込みパフォーマンス', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/products')
      
      // メインコンテンツの表示を待機
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('#products-list')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // プロダクトページが5秒以内に読み込まれることを確認
      expect(loadTime).toBeLessThan(5000)
      
      // プロダクトカードの表示確認
      const productCards = page.locator('#products-list .card')
      const cardCount = await productCards.count()
      
      if (cardCount > 0) {
        // 最初のカードが3秒以内に表示されることを確認
        await expect(productCards.first()).toBeVisible({ timeout: 3000 })
      }
    })

    test('ドキュメントページの読み込みパフォーマンス', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/docs')
      
      // ドキュメントコンテンツの表示を待機
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=人気のドキュメント')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      expect(loadTime).toBeLessThan(5000)
    })

    test('ページ間ナビゲーションのパフォーマンス', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // ページ間の遷移時間を測定
      const pages = ['/products', '/community', '/docs', '/about']
      
      for (const targetPage of pages) {
        const navStartTime = Date.now()
        
        await page.goto(targetPage)
        await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
        
        const navEndTime = Date.now()
        const navTime = navEndTime - navStartTime
        
        // ページ遷移が3秒以内に完了することを確認
        expect(navTime).toBeLessThan(3000)
      }
    })

    test('スクロールパフォーマンス', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // スクロールパフォーマンスの測定
      const scrollStartTime = Date.now()
      
      // ページ下部まで段階的にスクロール
      const sections = [
        'text=Unson OSの特徴',
        'text=革新的なSaaSエコシステムに参加'
      ]
      
      for (const section of sections) {
        await page.locator(section).scrollIntoViewIfNeeded()
        await expect(page.locator(section)).toBeVisible()
        
        // スクロール間の短い待機
        await page.waitForTimeout(100)
      }
      
      const scrollEndTime = Date.now()
      const scrollTime = scrollEndTime - scrollStartTime
      
      // スクロール操作が3秒以内に完了することを確認
      expect(scrollTime).toBeLessThan(3000)
    })

    test('画像読み込みパフォーマンス', async ({ page }) => {
      await page.goto('/')
      
      // ページ内の画像要素を取得
      const images = page.locator('img')
      const imageCount = await images.count()
      
      if (imageCount > 0) {
        const loadStartTime = Date.now()
        
        // 全ての画像が読み込まれるまで待機
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i)
          
          // 画像が表示領域にスクロール
          await img.scrollIntoViewIfNeeded()
          
          // 画像の読み込み完了を確認
          await expect(img).toBeVisible({ timeout: 5000 })
          
          // naturalWidth が設定されていることを確認（画像が実際に読み込まれた）
          const isLoaded = await img.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)
          expect(isLoaded).toBeTruthy()
        }
        
        const loadEndTime = Date.now()
        const imageLoadTime = loadEndTime - loadStartTime
        
        // 画像読み込みが10秒以内に完了することを確認
        expect(imageLoadTime).toBeLessThan(10000)
      }
    })
  })

  test.describe('Webアクセシビリティ (WCAG)', () => {
    test('ホームページのアクセシビリティ検査', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // axe-coreを使用したアクセシビリティ検査
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      // アクセシビリティ違反がないことを確認
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('プロダクトページのアクセシビリティ検査', async ({ page }) => {
      await page.goto('/products')
      await expect(page.locator('h1')).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('ドキュメントページのアクセシビリティ検査', async ({ page }) => {
      await page.goto('/docs')
      await expect(page.locator('h1')).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('コミュニティページのアクセシビリティ検査', async ({ page }) => {
      await page.goto('/community')
      await expect(page.locator('h1')).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('アバウトページのアクセシビリティ検査', async ({ page }) => {
      await page.goto('/about')
      await expect(page.locator('h1')).toBeVisible()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('キーボードアクセシビリティ', () => {
    test('キーボードナビゲーションの完全性', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // ページの最初の要素にフォーカス
      await page.keyboard.press('Tab')
      
      // フォーカス可能な要素を順次移動
      const focusableElements = []
      let currentFocusedElement = await page.locator(':focus').first()
      
      // 最大50個の要素をタブで移動（無限ループ防止）
      for (let i = 0; i < 50; i++) {
        if (await currentFocusedElement.count() > 0) {
          const tagName = await currentFocusedElement.evaluate(el => el.tagName.toLowerCase())
          const role = await currentFocusedElement.getAttribute('role')
          
          focusableElements.push({ tagName, role, index: i })
          
          await page.keyboard.press('Tab')
          const nextFocused = await page.locator(':focus').first()
          
          // フォーカスが循環したかチェック
          const isSameElement = await currentFocusedElement.evaluate(
            (current, next) => current === next,
            await nextFocused.elementHandle()
          )
          
          if (isSameElement) {
            break
          }
          
          currentFocusedElement = nextFocused
        } else {
          break
        }
      }
      
      // フォーカス可能な要素が存在することを確認
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // 重要な要素（ボタン、リンク）がフォーカス可能であることを確認
      const hasButton = focusableElements.some(el => el.tagName === 'button' || el.role === 'button')
      const hasLink = focusableElements.some(el => el.tagName === 'a')
      
      expect(hasButton || hasLink).toBeTruthy()
    })

    test('フォームのキーボードアクセシビリティ', async ({ page }) => {
      await page.goto('/')
      await page.locator('text=ウェイトリストに参加').scrollIntoViewIfNeeded()
      
      const emailInput = page.locator('input[type="email"]')
      const submitButton = page.locator('button[type="submit"]')
      
      // タブでフォーム要素に移動
      await emailInput.focus()
      await expect(emailInput).toBeFocused()
      
      // キーボードで入力
      await page.keyboard.type('keyboard@example.com')
      
      // タブで送信ボタンに移動
      await page.keyboard.press('Tab')
      await expect(submitButton).toBeFocused()
      
      // Enterキーで送信
      await page.keyboard.press('Enter')
      
      // 成功メッセージが表示されることを確認
      await expect(page.locator('text=登録が完了しました')).toBeVisible({ timeout: 5000 })
    })

    test('スキップリンクの動作', async ({ page }) => {
      await page.goto('/')
      
      // ページの最初でTabキーを押してスキップリンクを表示
      await page.keyboard.press('Tab')
      
      // スキップリンクが表示されることを確認
      const skipLink = page.locator('a:has-text("メインコンテンツにスキップ")')
      
      if (await skipLink.count() > 0) {
        await expect(skipLink).toBeVisible()
        
        // スキップリンクをアクティベート
        await page.keyboard.press('Enter')
        
        // メインコンテンツ領域にフォーカスが移動することを確認
        const mainContent = page.locator('main, [role="main"], #main-content')
        
        if (await mainContent.count() > 0) {
          await expect(mainContent).toBeFocused()
        }
      }
    })
  })

  test.describe('色彩・コントラストアクセシビリティ', () => {
    test('色彩コントラスト比の確認', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // axe-coreの色彩コントラスト検査
      const colorContrastResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze()
      
      // 色彩コントラストの違反がないことを確認
      expect(colorContrastResults.violations).toEqual([])
    })

    test('ダークモード対応の確認', async ({ page }) => {
      // システムのダークモード設定をエミュレート
      await page.emulateMedia({ colorScheme: 'dark' })
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // ダークモードでの基本要素の表示確認
      const bodyStyle = await page.locator('body').evaluate(el => getComputedStyle(el))
      
      // 背景色が暗いことを確認（ダークモードが適用されている場合）
      if (bodyStyle.backgroundColor && bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // RGB値をパース（大まかな確認）
        const isDarkBackground = bodyStyle.backgroundColor.includes('rgb') && 
          !bodyStyle.backgroundColor.includes('255, 255, 255')
        
        expect(isDarkBackground).toBeTruthy()
      }
    })

    test('高コントラストモードの対応', async ({ page }) => {
      // 高コントラストモードをエミュレート
      await page.emulateMedia({ forcedColors: 'active' })
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      
      // 高コントラストモードでの基本機能確認
      const primaryButton = page.locator('a:has-text("プラットフォームを探索")').first()
      await expect(primaryButton).toBeVisible()
      
      // ボタンのクリック機能確認
      await primaryButton.click()
      await expect(page).toHaveURL(/products/)
    })
  })

  test.describe('レスポンシブデザインパフォーマンス', () => {
    test('モバイルビューポートでのパフォーマンス', async ({ page }) => {
      // モバイルビューポートに設定
      await page.setViewportSize({ width: 375, height: 667 })
      
      const startTime = Date.now()
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const mobileLoadTime = endTime - startTime
      
      // モバイルでの読み込み時間が5秒以内であることを確認
      expect(mobileLoadTime).toBeLessThan(5000)
      
      // モバイルレイアウトが適切に表示されることを確認
      const mainContent = page.locator('main, [role="main"]')
      
      if (await mainContent.count() > 0) {
        const contentBounds = await mainContent.boundingBox()
        
        if (contentBounds) {
          // コンテンツがビューポート幅に収まることを確認
          expect(contentBounds.width).toBeLessThanOrEqual(375)
        }
      }
    })

    test('タブレットビューポートでのパフォーマンス', async ({ page }) => {
      // タブレットビューポートに設定
      await page.setViewportSize({ width: 768, height: 1024 })
      
      const startTime = Date.now()
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const tabletLoadTime = endTime - startTime
      
      expect(tabletLoadTime).toBeLessThan(5000)
      
      // タブレット固有のレイアウト要素確認
      const navigationMenu = page.locator('nav')
      await expect(navigationMenu).toBeVisible()
    })

    test('デスクトップ大画面でのパフォーマンス', async ({ page }) => {
      // 大画面デスクトップビューポートに設定
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      const startTime = Date.now()
      
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
      
      const endTime = Date.now()
      const desktopLoadTime = endTime - startTime
      
      expect(desktopLoadTime).toBeLessThan(5000)
      
      // 大画面でのレイアウト確認
      const container = page.locator('.container, .container-custom')
      
      if (await container.count() > 0) {
        const containerBounds = await container.first().boundingBox()
        
        if (containerBounds) {
          // コンテナが中央に配置され、適切な最大幅を持つことを確認
          expect(containerBounds.width).toBeLessThan(1920)
          expect(containerBounds.width).toBeGreaterThan(1200)
        }
      }
    })
  })

  test.describe('SEOパフォーマンス', () => {
    test('メタデータの適切な設定', async ({ page }) => {
      await page.goto('/')
      
      // タイトルタグの確認
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(60)
      
      // メタディスクリプションの確認
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toBeTruthy()
      expect(metaDescription!.length).toBeGreaterThan(120)
      expect(metaDescription!.length).toBeLessThan(160)
      
      // Canonical URLの確認
      const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonicalUrl).toBeTruthy()
      
      // Open Graph タグの確認
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
      
      expect(ogTitle).toBeTruthy()
      expect(ogDescription).toBeTruthy()
    })

    test('構造化データの検証', async ({ page }) => {
      await page.goto('/')
      
      // JSON-LD構造化データの確認
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
      
      if (structuredData) {
        // 有効なJSONであることを確認
        expect(() => JSON.parse(structuredData)).not.toThrow()
        
        const parsedData = JSON.parse(structuredData)
        
        // 基本的な構造化データプロパティの確認
        expect(parsedData['@context']).toBeTruthy()
        expect(parsedData['@type']).toBeTruthy()
      }
    })

    test('見出し構造の確認', async ({ page }) => {
      await page.goto('/')
      
      // H1タグが1つだけ存在することを確認
      const h1Elements = page.locator('h1')
      const h1Count = await h1Elements.count()
      expect(h1Count).toBe(1)
      
      // 見出しの階層構造を確認
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      const headingLevels = []
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
        const level = parseInt(tagName.substring(1))
        headingLevels.push(level)
      }
      
      // 見出しレベルが論理的であることを確認（スキップしない）
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i]
        const previousLevel = headingLevels[i - 1]
        
        // 見出しレベルが前のレベルより2つ以上大きくならないことを確認
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
    })
  })
})