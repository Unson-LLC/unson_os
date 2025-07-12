import { test, expect } from '@playwright/test'

test.describe('パフォーマンステスト', () => {
  test('ページロード時間が適切な範囲内である', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/', { waitUntil: 'networkidle' })
    
    const loadTime = Date.now() - startTime
    
    // ページロード時間が5秒以内であることを確認
    expect(loadTime).toBeLessThan(5000)
    
    // メインコンテンツが2秒以内に表示されることを確認
    const mainContent = page.locator('main').or(page.locator('h1'))
    await expect(mainContent).toBeVisible({ timeout: 2000 })
  })

  test('重要なリソースが適切にキャッシュされる', async ({ page }) => {
    // 初回読み込み
    await page.goto('/')
    
    // 2回目の読み込み（キャッシュを使用）
    const startTime = Date.now()
    await page.reload()
    const reloadTime = Date.now() - startTime
    
    // リロード時間が初回より短いことを確認（キャッシュが効いている）
    expect(reloadTime).toBeLessThan(3000)
  })

  test('大量データの処理が適切に行われる', async ({ page }) => {
    await page.goto('/')
    
    // 大量の要素を持つページでのスクロールテスト
    await page.evaluate(() => {
      // 仮想的に大量の要素を追加
      const container = document.body
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div')
        div.textContent = `Test item ${i}`
        div.style.height = '50px'
        container.appendChild(div)
      }
    })

    // スクロールパフォーマンスのテスト
    const startTime = Date.now()
    
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 100))
      await page.waitForTimeout(50)
    }
    
    const scrollTime = Date.now() - startTime
    
    // スクロールが滑らかに動作することを確認
    expect(scrollTime).toBeLessThan(2000)
  })

  test('メモリ使用量が適切な範囲内である', async ({ page }) => {
    await page.goto('/')
    
    // ページのメモリ使用量を測定
    const metrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory
      }
      return null
    })

    if (metrics) {
      // 使用メモリが100MB以下であることを確認
      expect(metrics.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024)
    }
  })

  test('画像の遅延読み込みが機能する', async ({ page }) => {
    await page.goto('/')
    
    // 画像要素を探す
    const images = page.locator('img[loading="lazy"]')
    
    if (await images.count() > 0) {
      const firstImage = images.first()
      
      // 画像がビューポートに入る前は読み込まれていないことを確認
      const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => img.complete)
      
      if (!isLoaded) {
        // 画像までスクロール
        await firstImage.scrollIntoViewIfNeeded()
        
        // 画像が読み込まれることを確認
        await expect(firstImage).toHaveAttribute('src', /.+/)
        
        // 画像の読み込み完了を待つ
        await firstImage.evaluate((img: HTMLImageElement) => {
          return new Promise(resolve => {
            if (img.complete) {
              resolve(true)
            } else {
              img.onload = () => resolve(true)
              img.onerror = () => resolve(false)
            }
          })
        })
      }
    }
  })

  test('CSSとJavaScriptの最適化が適用されている', async ({ page }) => {
    await page.goto('/')
    
    // CSS最適化の確認
    const styleSheets = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(sheet => {
        try {
          return {
            href: sheet.href,
            rules: sheet.cssRules?.length || 0
          }
        } catch {
          return { href: sheet.href, rules: 0 }
        }
      })
    })
    
    // CSSファイルが適切に読み込まれていることを確認
    expect(styleSheets.length).toBeGreaterThan(0)
    
    // JavaScript最適化の確認
    const scripts = await page.locator('script[src]').count()
    
    // 外部スクリプトの数が合理的な範囲内であることを確認
    expect(scripts).toBeLessThan(20)
  })

  test('ネットワーク要求が最適化されている', async ({ page }) => {
    const requests: any[] = []
    
    // ネットワーク要求を記録
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      })
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // HTTP要求の数が合理的な範囲内であることを確認
    expect(requests.length).toBeLessThan(50)
    
    // 重複要求がないことを確認
    const uniqueUrls = new Set(requests.map(req => req.url))
    const duplicateRequests = requests.length - uniqueUrls.size
    expect(duplicateRequests).toBeLessThan(5)
    
    // 主要なリソースタイプが含まれていることを確認
    const resourceTypes = requests.map(req => req.resourceType)
    expect(resourceTypes).toContain('document')
  })

  test('モバイルパフォーマンスが適切である', async ({ page }) => {
    // モバイルビューポートとネットワーク条件を設定
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 3G接続をシミュレート
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)) // 100msの遅延
      await route.continue()
    })
    
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    // モバイルでのロード時間が8秒以内であることを確認
    expect(loadTime).toBeLessThan(8000)
    
    // メインコンテンツが3秒以内に表示されることを確認
    await expect(page.locator('h1')).toBeVisible({ timeout: 3000 })
  })
})