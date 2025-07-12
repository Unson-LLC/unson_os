import { test, expect } from '@playwright/test'

test.describe('基本テスト', () => {
  test('Playwrightが正常に動作する', async ({ page }) => {
    // Next.jsアプリではなく、シンプルなHTMLページをテスト
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unson OS テストページ</title>
        </head>
        <body>
          <h1>Unson OS</h1>
          <p>自動SaaS生成プラットフォーム</p>
          <form>
            <input type="email" placeholder="メールアドレス" />
            <input type="text" placeholder="お名前" />
            <button type="submit">登録</button>
          </form>
        </body>
      </html>
    `)

    // タイトルの確認
    await expect(page).toHaveTitle(/Unson OS/)
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toHaveText('Unson OS')
    
    // フォーム要素の確認
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('フォーム入力が正常に動作する', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <form id="test-form">
            <input type="email" id="email" placeholder="メールアドレス" />
            <input type="text" id="name" placeholder="お名前" />
            <button type="submit">登録</button>
          </form>
          <div id="result"></div>
          <script>
            document.getElementById('test-form').addEventListener('submit', (e) => {
              e.preventDefault();
              const email = document.getElementById('email').value;
              const name = document.getElementById('name').value;
              document.getElementById('result').textContent = 'フォーム送信: ' + email + ', ' + name;
            });
          </script>
        </body>
      </html>
    `)

    // フォーム入力
    await page.fill('#email', 'test@example.com')
    await page.fill('#name', 'テストユーザー')
    
    // フォーム送信
    await page.click('button[type="submit"]')
    
    // 結果の確認
    await expect(page.locator('#result')).toHaveText('フォーム送信: test@example.com, テストユーザー')
  })
})