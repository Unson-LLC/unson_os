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
    expect(screen.getByText('⚡')).toBeInTheDocument() // プロダクト開発
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
  })

  it('セクションをクリックすると展開/折りたたみができる', () => {
    render(<DocsSidebar />)

    // 「開発・技術」セクションのボタンを取得
    const developmentSection = screen.getByText('開発・技術').closest('button')
    expect(developmentSection).toBeInTheDocument()

    // 初期状態では折りたたまれている（現在のページが含まれていないため）
    expect(screen.queryByText('セットアップガイド')).not.toBeInTheDocument()

    // セクションをクリックして展開
    fireEvent.click(developmentSection!)
    expect(screen.getByText('セットアップガイド')).toBeInTheDocument()
    expect(screen.getByText('フロントエンド構造')).toBeInTheDocument()

    // 再度クリックして折りたたみ
    fireEvent.click(developmentSection!)
    expect(screen.queryByText('セットアップガイド')).not.toBeInTheDocument()
  })

  it('アクティブなページがハイライト表示される', () => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar />)

    const activeLink = screen.getByText('Unson OSとは').closest('a')
    expect(activeLink).toHaveClass('bg-blue-100', 'text-blue-800', 'font-medium')
  })

  it('ページタイプに応じた色のインジケーターが表示される', () => {
    render(<DocsSidebar />)

    // 「はじめに」セクションは自動展開されているので、インジケーターを確認
    // ガイド（青）と技術文書（紫）のインジケーターを確認
    const indicators = document.querySelectorAll('.w-2.h-2.rounded-full')
    expect(indicators.length).toBeGreaterThan(0)
    
    // ガイド文書（青）のインジケーター - はじめにセクションにある
    const guideIndicators = document.querySelectorAll('.bg-blue-400')
    expect(guideIndicators.length).toBeGreaterThan(0)

    // 技術文書（紫）のインジケーター - はじめにセクションの技術アーキテクチャ
    const technicalIndicators = document.querySelectorAll('.bg-purple-400')
    expect(technicalIndicators.length).toBeGreaterThan(0)
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