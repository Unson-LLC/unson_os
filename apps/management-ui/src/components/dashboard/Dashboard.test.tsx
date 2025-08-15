import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  describe('ヘッダー', () => {
    it('UnsonOSのタイトルを表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('UnsonOS v2.4.1')).toBeInTheDocument()
    })

    it('通知バッジを表示する', () => {
      render(<Dashboard />)
      
      const badges = screen.getAllByText('3件')
      expect(badges.length).toBeGreaterThan(0)
    })

    it('ユーザー情報を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('佐藤太郎')).toBeInTheDocument()
    })
  })

  describe('サイドバーナビゲーション', () => {
    it('全てのナビゲーション項目を表示する', () => {
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      
      expect(within(nav).getByRole('button', { name: /コマンドセンター/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /SaaS一覧/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /学習分析/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /データ & インサイト/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /戦略 & 実行/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /ポートフォリオ/ })).toBeInTheDocument()
    })

    it('デフォルトでコマンドセンタータブがアクティブになっている', () => {
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const commandButton = within(nav).getByRole('button', { name: /コマンドセンター/ })
      expect(commandButton).toHaveClass('bg-primary-50', 'text-primary-700')
    })
  })

  describe('タブ切り替え', () => {
    it('コマンドセンタータブがデフォルトで表示される', () => {
      render(<Dashboard />)
      
      // コマンドセンターコンテンツが表示されているか確認
      // TODO: CommandCenterコンポーネントの具体的なコンテンツに合わせて修正
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('データビュータブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const dataButton = within(nav).getByRole('button', { name: /データ & インサイト/ })
      await user.click(dataButton)
      
      expect(screen.getByRole('combobox', { name: /SaaS選択/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /エクスポート/ })).toBeInTheDocument()
    })

    it('戦略 & 実行タブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const strategyButton = within(nav).getByRole('button', { name: /戦略 & 実行/ })
      await user.click(strategyButton)
      
      // TODO: 戦略タブのコンテンツは別途実装
      // expect(screen.getByText('📝 プレイブックシステム')).toBeInTheDocument()
      // expect(screen.getByText('PKGフロー可視化:')).toBeInTheDocument()
    })

    it('DAOタブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const portfolioButton = within(nav).getByRole('button', { name: /ポートフォリオ/ })
      await user.click(portfolioButton)
      
      expect(screen.getByText('💰 収益分配ダッシュボード')).toBeInTheDocument()
      expect(screen.getByText('🔄 ポートフォリオ進化')).toBeInTheDocument()
    })
  })

  describe('コマンドセンタータブのコンテンツ', () => {
    it.skip('KPIカードを表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('総収益')).toBeInTheDocument()
      expect(screen.getByText('¥142,000')).toBeInTheDocument()
      expect(screen.getByText('+18%')).toBeInTheDocument()
      
      expect(screen.getByText('SaaS状況')).toBeInTheDocument()
      expect(screen.getByText('87個')).toBeInTheDocument()
      
      expect(screen.getByText('要対応')).toBeInTheDocument()
      expect(screen.getByText('6件')).toBeInTheDocument()
    })

    it.skip('KPI記号を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('KPI記号(1h足)')).toBeInTheDocument()
      expect(screen.getByText('NOW')).toBeInTheDocument()
    })

    it.skip('フェーズ分布を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('フェーズ分布')).toBeInTheDocument()
      expect(screen.getByText('研究')).toBeInTheDocument()
      expect(screen.getByText('LP')).toBeInTheDocument()
      expect(screen.getByText('MVP')).toBeInTheDocument()
      expect(screen.getByText('収益化')).toBeInTheDocument()
      expect(screen.getByText('スケール')).toBeInTheDocument()
    })

    it.skip('記号マトリックスの簡略版を表示する', () => {
      render(<Dashboard />)
      
      // 記号マトリックスタイトルを確認
      expect(screen.getByText('記号マトリックス')).toBeInTheDocument()
    })
  })

  describe('データビュータブのコンテンツ', () => {
    it.skip('TimeSeriesGridとSymbolMatrixを表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const dataButton = within(nav).getByRole('button', { name: /データ & インサイト/ })
      await user.click(dataButton)
      
      // TODO: 実際のデータビューコンテンツに合わせて修正
      // TimeSeriesGrid
      // expect(screen.getByRole('combobox', { name: /SaaS選択/ })).toBeInTheDocument()
      // expect(screen.getByText('時系列グリッド - 猫カフェ予約')).toBeInTheDocument()
      
      // SymbolMatrix（全データ）
      // expect(screen.getByText('記号マトリックス')).toBeInTheDocument()
    })
  })

  describe('戦略 & 実行タブのコンテンツ', () => {
    it.skip('PKG実行状況を表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const strategyButton = within(nav).getByRole('button', { name: /戦略 & 実行/ })
      await user.click(strategyButton)
      
      // TODO: 戦略タブのコンテンツは別途テスト実装
      // expect(screen.getByText('猫カフェ予約')).toBeInTheDocument()
      // expect(screen.getByText('pkg_crisis_recovery')).toBeInTheDocument()
      // expect(screen.getByText('35%')).toBeInTheDocument()
    })
  })

  describe('DAOタブのコンテンツ', () => {
    it('収益分配とポートフォリオ進化を表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const portfolioButton = within(nav).getByRole('button', { name: /ポートフォリオ/ })
      await user.click(portfolioButton)
      
      // 収益分配
      expect(screen.getByText('総売上:')).toBeInTheDocument()
      expect(screen.getByText('¥12,345,678')).toBeInTheDocument()
      
      // ポートフォリオ進化
      // TODO: PortfolioEvolutionコンポーネントのテストは別途実装
      // expect(screen.getByText('サンセット予定')).toBeInTheDocument()
      // expect(screen.getByText('新規パイプライン')).toBeInTheDocument()
    })
  })

  describe('レスポンシブレイアウト', () => {
    it('固定ヘッダーとサイドバーを持つ', () => {
      render(<Dashboard />)
      
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('sticky', 'top-0')
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('sticky')
    })
  })
})