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
  // eslint-disable-next-line react/display-name
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

  it('サイドバーのタイトルが表示される', () => {
    render(<DocsSidebar />)

    // タイトルテキストが表示される
    expect(screen.getByText('ドキュメント')).toBeInTheDocument()
    // アイコンのsvgが存在する
    const link = screen.getByRole('link', { name: /ドキュメント/ })
    expect(link.querySelector('svg')).toBeInTheDocument()
  })

  it('すべてのドキュメントセクションが表示される', () => {
    render(<DocsSidebar />)

    // メインセクションの確認
    expect(screen.getByText('今すぐできること')).toBeInTheDocument()
    expect(screen.getByText('はじめに')).toBeInTheDocument()
    expect(screen.getByText('プロダクト開発')).toBeInTheDocument()
    expect(screen.getByText('開発・技術')).toBeInTheDocument()
    expect(screen.getByText('戦略・企画')).toBeInTheDocument()
    expect(screen.getByText('DAOガバナンス')).toBeInTheDocument()
    expect(screen.getByText('チーム・組織')).toBeInTheDocument()
    // サポートは複数あるため、セクションタイトルの存在を確認
    const supportButtons = screen.getAllByText('サポート')
    expect(supportButtons.length).toBeGreaterThan(0)
  })

  it('セクションにアイコンが表示される', () => {
    render(<DocsSidebar />)

    // 各セクションにアイコン（SVG）が表示されることを確認
    const sectionButtons = screen.getAllByRole('button')
    sectionButtons.forEach(button => {
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  it('現在のページに対応するセクションが自動展開される', () => {
    mockedUsePathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar />)

    // /docs/introduction は「はじめに」セクションなので展開されている
    expect(screen.getByText('Unson OSとは')).toBeInTheDocument()
    // クイックスタートは複数あるためgetAllByTextを使用
    const quickstarts = screen.getAllByText('クイックスタート')
    expect(quickstarts.length).toBeGreaterThan(0)
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

  it('ステータスアイコンが表示される', () => {
    render(<DocsSidebar />)

    // 「今すぐできること」と「はじめに」セクションは自動展開されている
    // ステータスアイコン（SVG）が表示されることを確認
    const links = screen.getAllByRole('link')
    const statusIcons = links.filter(link => {
      const svg = link.querySelector('svg')
      return svg && svg.classList.contains('w-4') && svg.classList.contains('h-4')
    })
    expect(statusIcons.length).toBeGreaterThan(0)
  })

  it('フッターのクイックリンクが表示される', () => {
    render(<DocsSidebar />)

    // テキストとリンクが表示されることを確認（複数あるため getAllByText を使用）
    const quickstarts = screen.getAllByText('クイックスタート')
    expect(quickstarts.length).toBeGreaterThan(0)
    
    expect(screen.getByText('DAO参加ガイド')).toBeInTheDocument()
    
    const supports = screen.getAllByText('サポート')
    expect(supports.length).toBeGreaterThan(0)
    
    // フッターリンクにアイコンがあることを確認
    const footerSection = screen.getByText('DAO参加ガイド').closest('.border-t')
    const footerLinks = footerSection?.querySelectorAll('a')
    expect(footerLinks?.length).toBeGreaterThan(0)
    expect(footerLinks?.[0].querySelector('svg')).toBeInTheDocument()
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
    // チェブロンアイコンのsvgを探す（viewBox="0 0 24 24"のsvgの中でpath がd="M9 5l7 7-7 7"を持つもの）
    const svgs = developmentSection?.querySelectorAll('svg')
    const expandIcon = Array.from(svgs || []).find(svg => 
      svg.querySelector('path[d="M9 5l7 7-7 7"]')
    )

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
      
      // クイックスタートはアイテムリンクにあることを確認
      const allLinks = screen.getAllByRole('link')
      const quickstartLink = allLinks.find(link => link.textContent?.includes('クイックスタート') && link.getAttribute('href') === '/docs/quickstart')
      expect(quickstartLink).toBeTruthy()
      
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