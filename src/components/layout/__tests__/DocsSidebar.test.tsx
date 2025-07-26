import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { DocsSidebar } from '../DocsSidebar'

// Next.js のナビゲーションをモック
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Next.js の Link コンポーネントをモック
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
})

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('DocsSidebar', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('サイドバーのタイトルとロゴが表示される', () => {
    render(<DocsSidebar />)

    expect(screen.getByText('📚')).toBeInTheDocument()
    expect(screen.getByText('ドキュメント')).toBeInTheDocument()
  })

  it('すべてのドキュメントセクションが表示される', () => {
    render(<DocsSidebar />)

    // メインセクションの確認
    expect(screen.getByText('🟢 今すぐできること')).toBeInTheDocument()
    expect(screen.getByText('はじめに')).toBeInTheDocument()
    expect(screen.getByText('プロダクト開発')).toBeInTheDocument()
    expect(screen.getByText('開発・技術')).toBeInTheDocument()
    expect(screen.getByText('戦略・企画')).toBeInTheDocument()
    expect(screen.getByText('DAOガバナンス')).toBeInTheDocument()
    expect(screen.getByText('チーム・組織')).toBeInTheDocument()
    expect(screen.getByText('サポート')).toBeInTheDocument()
  })

  it('セクションアイコンが正しく表示される', () => {
    render(<DocsSidebar />)

    expect(screen.getByText('🚀')).toBeInTheDocument() // はじめに
    expect(screen.getAllByText('⚡').length).toBeGreaterThanOrEqual(2) // 今すぐできること + プロダクト開発
    expect(screen.getByText('🔧')).toBeInTheDocument() // 開発・技術
    expect(screen.getByText('🎯')).toBeInTheDocument() // 戦略・企画
    expect(screen.getByText('🗳️')).toBeInTheDocument() // DAOガバナンス
    expect(screen.getByText('👥')).toBeInTheDocument() // チーム・組織
    expect(screen.getByText('❓')).toBeInTheDocument() // サポート
  })

  it('現在のページに対応するセクションが自動展開される', () => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar />)

    // /docs/introduction は「はじめに」セクションなので展開されている
    expect(screen.getByText('Unson OSとは')).toBeInTheDocument()
    expect(screen.getByText('クイックスタート')).toBeInTheDocument()
    expect(screen.getByText('プラットフォーム概要')).toBeInTheDocument()
    
    // 「今すぐできること」セクションも常に展開されている（高優先度）
    expect(screen.getByText('Discord参加')).toBeInTheDocument()
  })

  it('セクションをクリックすると展開/折りたたみができる', () => {
    render(<DocsSidebar />)

    // 「戦略・企画」セクションのボタンを取得（初期状態で折りたたまれている）
    const strategySection = screen.getByText('戦略・企画').closest('button')
    expect(strategySection).toBeInTheDocument()

    // 初期状態では折りたたまれている
    expect(screen.queryByText('マイクロビジネス戦略')).not.toBeInTheDocument()

    // セクションをクリックして展開
    fireEvent.click(strategySection!)
    expect(screen.getByText('マイクロビジネス戦略')).toBeInTheDocument()
    expect(screen.getByText('MVP検証フレームワーク')).toBeInTheDocument()

    // 再度クリックして折りたたみ
    fireEvent.click(strategySection!)
    expect(screen.queryByText('マイクロビジネス戦略')).not.toBeInTheDocument()
  })

  it('アクティブなページがハイライト表示される', () => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar />)

    const activeLink = screen.getByText('Unson OSとは').closest('a')
    expect(activeLink).toHaveClass('bg-blue-100', 'text-blue-800', 'font-medium')
  })

  it('ページタイプに応じた色のインジケーターが表示される', () => {
    render(<DocsSidebar />)

    // 「今すぐできること」と「はじめに」セクションは自動展開されている
    // ステータスアイコンが表示されることを確認
    expect(screen.getAllByText('🟢').length).toBeGreaterThan(0) // 利用可能
    expect(screen.getAllByText('🟡').length).toBeGreaterThan(0) // 議論中
    expect(screen.getAllByText('🔴').length).toBeGreaterThan(0) // 構想段階
  })

  it('フッターのクイックリンクが表示される', () => {
    render(<DocsSidebar />)

    expect(screen.getByText('🚀 クイックスタート')).toBeInTheDocument()
    expect(screen.getByText('🏛️ DAO参加ガイド')).toBeInTheDocument()
    expect(screen.getByText('💬 サポート')).toBeInTheDocument()
  })

  it('サイドバーにoverflow-y-autoが設定されている', () => {
    render(<DocsSidebar />)

    const sidebar = document.querySelector('.overflow-y-auto')
    expect(sidebar).toBeInTheDocument()
  })

  it('アクティブなセクションがハイライト表示される', () => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar />)

    // アクティブなページを含むセクション（はじめに）がハイライト表示される
    const activeSection = screen.getByText('はじめに').closest('button')
    expect(activeSection).toHaveClass('bg-blue-50', 'text-blue-900')
  })

  it('カスタムクラス名が適用される', () => {
    const customClass = 'custom-test-class'
    render(<DocsSidebar className={customClass} />)

    const sidebar = document.querySelector(`.${customClass}`)
    expect(sidebar).toBeInTheDocument()
  })

  it('展開アイコンが正しく回転する', () => {
    render(<DocsSidebar />)

    const developmentSection = screen.getByText('開発・技術').closest('button')
    const expandIcon = developmentSection?.querySelector('svg')

    // 初期状態（折りたたみ）
    expect(expandIcon).toHaveClass('rotate-0')

    // クリックして展開
    fireEvent.click(developmentSection!)
    expect(expandIcon).toHaveClass('rotate-90')
  })

  describe('各セクションのリンク', () => {
    it('はじめにセクションの全リンクが表示される', () => {
      render(<DocsSidebar />)

      // はじめにセクションを展開（現在のページが含まれているので自動展開される）
      expect(screen.getByText('Unson OSとは')).toBeInTheDocument()
      expect(screen.getByText('クイックスタート')).toBeInTheDocument()
      expect(screen.getByText('プラットフォーム概要')).toBeInTheDocument()
      expect(screen.getByText('技術アーキテクチャ')).toBeInTheDocument()
    })

    it('DAOガバナンスセクションの全リンクが表示される', () => {
      render(<DocsSidebar />)

      // DAOガバナンスセクションを展開
      const daoSection = screen.getByText('DAOガバナンス').closest('button')
      fireEvent.click(daoSection!)

      expect(screen.getByText('はじめてのDAO（超初心者向け）')).toBeInTheDocument()
      expect(screen.getByText('DAO完全ガイド')).toBeInTheDocument()
      expect(screen.getByText('提案と投票')).toBeInTheDocument()
      expect(screen.getByText('収益分配')).toBeInTheDocument()
    })
  })
})