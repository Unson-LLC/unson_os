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
      
      expect(screen.getByText('🔔 3件')).toBeInTheDocument()
    })

    it('ユーザー情報を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('👤 佐藤太郎')).toBeInTheDocument()
    })
  })

  describe('サイドバーナビゲーション', () => {
    it('全てのナビゲーション項目を表示する', () => {
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      
      expect(within(nav).getByRole('button', { name: /🎯 コマンドセンター/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /📊 データ & インサイト/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /🎯 戦略 & 実行/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /💰 ポートフォリオ & ファイナンス/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /📋 SaaS一覧/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /🔄 ポートフォリオ/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /🤖 AI設定/ })).toBeInTheDocument()
      expect(within(nav).getByRole('button', { name: /⚙️ システム/ })).toBeInTheDocument()
    })

    it('デフォルトで概要タブがアクティブになっている', () => {
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const commandButton = within(nav).getByRole('button', { name: /🎯 コマンドセンター/ })
      expect(commandButton).toHaveClass('bg-blue-50', 'text-blue-600')
    })
  })

  describe('タブ切り替え', () => {
    it('概要タブがデフォルトで表示される', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('総収益')).toBeInTheDocument()
      expect(screen.getByText('SaaS状況')).toBeInTheDocument()
      expect(screen.getByText('要対応')).toBeInTheDocument()
    })

    it('データビュータブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const dataButton = within(nav).getByRole('button', { name: /📈 データビュー/ })
      await user.click(dataButton)
      
      expect(screen.getByRole('combobox', { name: /SaaS選択/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /エクスポート/ })).toBeInTheDocument()
    })

    it('プレイブックタブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const strategyButton = within(nav).getByRole('button', { name: /🎯 戦略 & 実行/ })
      await user.click(strategyButton)
      
      expect(screen.getByText('📝 プレイブックシステム')).toBeInTheDocument()
      expect(screen.getByText('PKGフロー可視化:')).toBeInTheDocument()
    })

    it('DAOタブに切り替えできる', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const portfolioButton = within(nav).getByRole('button', { name: /💰 ポートフォリオ & ファイナンス/ })
      await user.click(portfolioButton)
      
      expect(screen.getByText('💰 収益分配ダッシュボード')).toBeInTheDocument()
      expect(screen.getByText('🔄 ポートフォリオ進化')).toBeInTheDocument()
    })
  })

  describe('概要タブのコンテンツ', () => {
    it('KPIカードを表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('総収益')).toBeInTheDocument()
      expect(screen.getByText('¥142,000')).toBeInTheDocument()
      expect(screen.getByText('+18%')).toBeInTheDocument()
      
      expect(screen.getByText('SaaS状況')).toBeInTheDocument()
      expect(screen.getByText('87個')).toBeInTheDocument()
      
      expect(screen.getByText('要対応')).toBeInTheDocument()
      expect(screen.getByText('6件')).toBeInTheDocument()
    })

    it('KPI記号を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('KPI記号(1h足)')).toBeInTheDocument()
      expect(screen.getByText('NOW')).toBeInTheDocument()
    })

    it('フェーズ分布を表示する', () => {
      render(<Dashboard />)
      
      expect(screen.getByText('フェーズ分布')).toBeInTheDocument()
      expect(screen.getByText('研究')).toBeInTheDocument()
      expect(screen.getByText('LP')).toBeInTheDocument()
      expect(screen.getByText('MVP')).toBeInTheDocument()
      expect(screen.getByText('収益化')).toBeInTheDocument()
      expect(screen.getByText('スケール')).toBeInTheDocument()
    })

    it('記号マトリックスの簡略版を表示する', () => {
      render(<Dashboard />)
      
      // 記号マトリックスタイトルを確認
      expect(screen.getByText('記号マトリックス')).toBeInTheDocument()
    })
  })

  describe('データビュータブのコンテンツ', () => {
    it('TimeSeriesGridとSymbolMatrixを表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const dataButton = within(nav).getByRole('button', { name: /📈 データビュー/ })
      await user.click(dataButton)
      
      // TimeSeriesGrid
      expect(screen.getByRole('combobox', { name: /SaaS選択/ })).toBeInTheDocument()
      expect(screen.getByText('時系列グリッド - 猫カフェ予約')).toBeInTheDocument()
      
      // SymbolMatrix（全データ）
      expect(screen.getByText('記号マトリックス')).toBeInTheDocument()
    })
  })

  describe('プレイブックタブのコンテンツ', () => {
    it('PKG実行状況を表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const strategyButton = within(nav).getByRole('button', { name: /🎯 戦略 & 実行/ })
      await user.click(strategyButton)
      
      expect(screen.getByText('猫カフェ予約')).toBeInTheDocument()
      expect(screen.getByText('pkg_crisis_recovery')).toBeInTheDocument()
      expect(screen.getByText('35%')).toBeInTheDocument()
    })
  })

  describe('DAOタブのコンテンツ', () => {
    it('収益分配とポートフォリオ進化を表示する', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)
      
      const nav = screen.getByRole('navigation')
      const portfolioButton = within(nav).getByRole('button', { name: /💰 ポートフォリオ & ファイナンス/ })
      await user.click(portfolioButton)
      
      // 収益分配
      expect(screen.getByText('総売上:')).toBeInTheDocument()
      expect(screen.getByText('¥12,345,678')).toBeInTheDocument()
      
      // ポートフォリオ進化
      expect(screen.getByText('⚠️ サンセット予定')).toBeInTheDocument()
      expect(screen.getByText('🚀 新規パイプライン')).toBeInTheDocument()
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