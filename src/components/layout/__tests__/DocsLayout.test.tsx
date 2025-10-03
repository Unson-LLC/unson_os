import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { DocsLayout } from '../DocsLayout'

// Next.js のナビゲーションをモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// DocsSidebar コンポーネントをモック
jest.mock('../DocsSidebar', () => ({
  DocsSidebar: ({ className }: { className: string }) => (
    <div data-testid="docs-sidebar" className={className}>
      <nav>
        <a href="/docs/introduction">Introduction</a>
        <a href="/docs/platform-overview">Platform Overview</a>
      </nav>
    </div>
  ),
}))

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('DocsLayout', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('サイドバーとメインコンテンツを正しく表示する', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    // サイドバーが表示されていることを確認
    expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
    
    // メインコンテンツが表示されていることを確認
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('デスクトップ版でサイドバーが固定表示される', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    const sidebar = screen.getByTestId('docs-sidebar')
    
    // デスクトップ版では常に表示されている（lg:translate-x-0）
    expect(sidebar).toHaveClass('lg:translate-x-0')
    expect(sidebar).toHaveClass('fixed')
    expect(sidebar).toHaveClass('h-screen')
  })

  it('モバイル版でハンバーガーメニューが表示される', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    // モバイル用のハンバーガーメニューボタンが表示されていることを確認
    const hamburgerButton = screen.getByRole('button')
    expect(hamburgerButton).toBeInTheDocument()
    
    // ボタンにハンバーガーアイコンが含まれていることを確認
    const hamburgerIcon = hamburgerButton.querySelector('svg')
    expect(hamburgerIcon).toBeInTheDocument()
  })

  it('モバイルでハンバーガーメニューをタップするとサイドバーが開く', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    const hamburgerButton = screen.getByRole('button')
    const sidebar = screen.getByTestId('docs-sidebar')

    // 初期状態では閉じている
    expect(sidebar).toHaveClass('-translate-x-full')

    // ハンバーガーボタンをクリック
    fireEvent.click(hamburgerButton)

    // サイドバーが開く
    expect(sidebar).toHaveClass('translate-x-0')
  })

  it('モバイルでオーバーレイをタップするとサイドバーが閉じる', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    const hamburgerButton = screen.getByRole('button')
    
    // サイドバーを開く
    fireEvent.click(hamburgerButton)
    
    // オーバーレイが表示されていることを確認
    const overlay = document.querySelector('.bg-black.bg-opacity-50')
    expect(overlay).toBeInTheDocument()
    
    // オーバーレイをクリック
    fireEvent.click(overlay!)
    
    // サイドバーが閉じる
    const sidebar = screen.getByTestId('docs-sidebar')
    expect(sidebar).toHaveClass('-translate-x-full')
  })

  it('メインコンテンツエリアに適切なマージンが設定される', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    // メインコンテンツエリアにlg:ml-80のマージンが設定されていることを確認
    const mainContentArea = screen.getByText('Test content').closest('.lg\\:ml-80')
    expect(mainContentArea).toBeInTheDocument()
  })

  it('フッターにドキュメント関連のリンクが表示される', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    // フッターのリンクを確認
    expect(screen.getByText('ドキュメント一覧')).toBeInTheDocument()
    expect(screen.getByText('クイックスタート')).toBeInTheDocument()
    expect(screen.getAllByText('サポート').length).toBeGreaterThan(0)
    
    // GitHubリンクも確認
    expect(screen.getByText('GitHubで報告 →')).toBeInTheDocument()
  })

  it('モバイルヘッダーにタイトルが表示される', () => {
    render(
      <DocsLayout>
        <div>Test content</div>
      </DocsLayout>
    )

    // モバイル用ヘッダーのタイトル
    expect(screen.getByText('ドキュメント')).toBeInTheDocument()
  })

  it('子コンポーネントが正しくレンダリングされる', () => {
    const TestComponent = () => (
      <div>
        <h1>Test Page</h1>
        <p>This is a test page content</p>
      </div>
    )

    render(
      <DocsLayout>
        <TestComponent />
      </DocsLayout>
    )

    expect(screen.getByText('Test Page')).toBeInTheDocument()
    expect(screen.getByText('This is a test page content')).toBeInTheDocument()
  })
})