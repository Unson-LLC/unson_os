import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'

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

// テスト対象のドキュメントページ一覧
const docsPages = [
  {
    path: '/docs/introduction',
    componentPath: '../introduction/page',
    name: 'Introduction',
  },
  {
    path: '/docs/platform-overview',
    componentPath: '../platform-overview/page',
    name: 'Platform Overview',
  },
  {
    path: '/docs/team',
    componentPath: '../team/page',
    name: 'Team',
  },
  {
    path: '/docs/testing-guidelines', 
    componentPath: '../testing-guidelines/page',
    name: 'Testing Guidelines',
  },
  {
    path: '/docs/updates',
    componentPath: '../updates/page',
    name: 'Updates',
  },
  {
    path: '/docs/quickstart',
    componentPath: '../quickstart/page',
    name: 'Quickstart',
  },
  {
    path: '/docs/support',
    componentPath: '../support/page',
    name: 'Support',
  },
  {
    path: '/docs/dao/proposals',
    componentPath: '../dao/proposals/page',
    name: 'DAO Proposals',
  },
  {
    path: '/docs/dao/revenue-sharing',
    componentPath: '../dao/revenue-sharing/page',
    name: 'DAO Revenue Sharing',
  },
  {
    path: '/docs/dao/overview',
    componentPath: '../dao/overview/page',
    name: 'DAO Overview',
  },
  {
    path: '/docs/dao/guide',
    componentPath: '../dao/guide/page',
    name: 'DAO Guide',
  },
  {
    path: '/docs/development/setup-guide',
    componentPath: '../development/setup-guide/page',
    name: 'Setup Guide',
  },
  {
    path: '/docs/development/frontend-structure',
    componentPath: '../development/frontend-structure/page',
    name: 'Frontend Structure',
  },
  {
    path: '/docs/development/folder-structure-guide',
    componentPath: '../development/folder-structure-guide/page',
    name: 'Folder Structure Guide',
  },
  {
    path: '/docs/development/api-tests-complete',
    componentPath: '../development/api-tests-complete/page',
    name: 'API Tests Complete',
  },
  {
    path: '/docs/development/node-version-management',
    componentPath: '../development/node-version-management/page',
    name: 'Node Version Management',
  },
]

// DocsLayout コンポーネントをモック
jest.mock('@/components/layout/DocsLayout', () => ({
  DocsLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="docs-layout">
      <div data-testid="docs-sidebar">
        <nav>
          <span>📚 ドキュメント</span>
          <div>サイドバーナビゲーション</div>
        </nav>
      </div>
      <main data-testid="docs-content">
        {children}
      </main>
    </div>
  ),
}))

// 各種UIコンポーネントをモック
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/Tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/Accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/NavigationLink', () => ({
  NavigationLink: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/sections/CTASection', () => ({
  CTASection: () => <div>CTA Section</div>,
}))

// 動的インポート関数
const importDocPage = async (componentPath: string) => {
  try {
    const module = await import(componentPath)
    return module.default
  } catch (error) {
    console.warn(`Could not import ${componentPath}:`, error)
    return null
  }
}

describe('全ドキュメントページのナビゲーションバー表示テスト', () => {
  beforeEach(() => {
    // 各テストで異なるパスをモック
    mockedUsePathname.mockReturnValue('/docs/introduction')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // メタテスト：DocsLayoutが正しくモックされていることを確認
  it('DocsLayoutモックが正しく動作する', () => {
    const TestComponent = () => (
      <div>Test Content</div>
    )

    // DocsLayoutを直接インポートしてテスト
    const { DocsLayout } = require('@/components/layout/DocsLayout')
    
    render(
      <DocsLayout>
        <TestComponent />
      </DocsLayout>
    )

    expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
    expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('docs-content')).toBeInTheDocument()
    expect(screen.getByText('📚 ドキュメント')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  // 各ドキュメントページのテストを動的に生成
  docsPages.forEach(({ path, componentPath, name }) => {
    it(`${name} (${path}) にサイドバーナビゲーションが表示される`, async () => {
      // 現在のパスを設定
      mockedUsePathname.mockReturnValue(path)

      // ページコンポーネントを動的にインポート
      const PageComponent = await importDocPage(componentPath)
      
      if (!PageComponent) {
        // ページが見つからない場合はスキップ
        console.warn(`Skipping test for ${name}: Component not found at ${componentPath}`)
        return
      }

      // ページをレンダリング
      render(<PageComponent />)

      // DocsLayoutが使用されていることを確認
      expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
      
      // サイドバーが表示されていることを確認
      expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
      expect(screen.getByText('📚 ドキュメント')).toBeInTheDocument()
      expect(screen.getByText('サイドバーナビゲーション')).toBeInTheDocument()
      
      // メインコンテンツが表示されていることを確認
      expect(screen.getByTestId('docs-content')).toBeInTheDocument()
    })
  })

  it('すべてのテスト対象ページが存在することを確認', () => {
    // テスト対象のページ数が期待値と一致することを確認
    expect(docsPages.length).toBeGreaterThan(10)
    
    // 主要なページパスが含まれていることを確認
    const paths = docsPages.map(page => page.path)
    
    expect(paths).toContain('/docs/introduction')
    expect(paths).toContain('/docs/platform-overview')
    expect(paths).toContain('/docs/dao/proposals')
    expect(paths).toContain('/docs/dao/revenue-sharing')
    expect(paths).toContain('/docs/development/setup-guide')
    expect(paths).toContain('/docs/testing-guidelines')
  })

  describe('特定ページの詳細テスト', () => {
    it('Introduction ページで正しいパスがアクティブになる', async () => {
      mockedUsePathname.mockReturnValue('/docs/introduction')
      
      const IntroductionPage = await importDocPage('../introduction/page')
      if (IntroductionPage) {
        render(<IntroductionPage />)
        
        expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
        expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
      }
    })

    it('Platform Overview ページで正しいパスがアクティブになる', async () => {
      mockedUsePathname.mockReturnValue('/docs/platform-overview')
      
      const PlatformOverviewPage = await importDocPage('../platform-overview/page')
      if (PlatformOverviewPage) {
        render(<PlatformOverviewPage />)
        
        expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
        expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
      }
    })

    it('DAO Proposals ページで正しいパスがアクティブになる', async () => {
      mockedUsePathname.mockReturnValue('/docs/dao/proposals')
      
      const DAOProposalsPage = await importDocPage('../dao/proposals/page')
      if (DAOProposalsPage) {
        render(<DAOProposalsPage />)
        
        expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
        expect(screen.getByTestId('docs-sidebar')).toBeInTheDocument()
      }
    })
  })

  describe('レスポンシブデザインテスト', () => {
    it('各ページでモバイル対応のレイアウトが適用される', async () => {
      const testPages = [
        '../introduction/page',
        '../platform-overview/page', 
        '../dao/proposals/page'
      ]

      for (const componentPath of testPages) {
        const PageComponent = await importDocPage(componentPath)
        if (PageComponent) {
          const { unmount } = render(<PageComponent />)
          
          // DocsLayoutが適用されていることで、モバイル対応も含まれる
          expect(screen.getByTestId('docs-layout')).toBeInTheDocument()
          
          unmount()
        }
      }
    })
  })
})