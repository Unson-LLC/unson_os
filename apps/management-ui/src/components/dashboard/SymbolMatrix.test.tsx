import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SymbolMatrix } from './SymbolMatrix'

const mockData = [
  { 
    name: '猫カフェ予約',
    status: '🔴' as const,
    symbols: ['→', '→', '→', '↗️', '↗️', '→', '↘️', '↘️', '⬇️', '⬇️', '↘️', '→', '→', '↗️', '↗️', '→']
  },
  { 
    name: '英会話マッチ',
    status: '🔴' as const,
    symbols: ['→', '↘️', '↘️', '→', '→', '↗️', '↗️', '→', '↘️', '⬇️', '⬇️', '↘️', '→', '→', '↗️', '→']
  },
  { 
    name: 'ペット管理',
    status: '🟡' as const,
    symbols: ['↗️', '↗️', '→', '→', '→', '↗️', '↗️', '↗️', '→', '→', '↘️', '↘️', '→', '→', '→', '→']
  },
  { 
    name: '家計簿アプリ',
    status: '🟢' as const,
    symbols: ['↗️', '↗️', '↗️', '→', '→', '↗️', '⬆️', '⬆️', '↗️', '→', '→', '→', '↗️', '↗️', '→', '→']
  }
]

describe('SymbolMatrix', () => {
  describe('基本表示', () => {
    it('ヘッダーに時間を表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      // 00から15までの時間が表示されること
      expect(screen.getByText('00')).toBeInTheDocument()
      expect(screen.getByText('08')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('SaaS名とステータスを表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      expect(screen.getByText('🔴猫カフェ予約')).toBeInTheDocument()
      expect(screen.getByText('🟡ペット管理')).toBeInTheDocument()
      expect(screen.getByText('🟢家計簿アプリ')).toBeInTheDocument()
    })

    it('記号を時系列で表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      // 各行に16個の記号が表示されることを確認
      const rows = screen.getAllByRole('row')
      // ヘッダー行を除く
      const dataRows = rows.slice(1)
      
      dataRows.forEach(row => {
        const symbols = within(row).getAllByText(/^(⬆️|↗️|→|↘️|⬇️)$/)
        expect(symbols).toHaveLength(16)
      })
    })

    it('選択されたメトリクスを表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      expect(screen.getByText('Symbolマトリックス')).toBeInTheDocument()
      expect(screen.getByDisplayValue('MRR')).toBeInTheDocument()
    })
  })

  describe('記号のスタイル', () => {
    it('急降下記号（⬇️）を赤背景で強調する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const dangerSymbols = screen.getAllByText('⬇️')
      dangerSymbols.forEach(symbol => {
        expect(symbol).toHaveClass('bg-red-100')
      })
    })

    it('急上昇記号（⬆️）を緑背景で強調する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const successSymbols = screen.getAllByText('⬆️')
      successSymbols.forEach(symbol => {
        expect(symbol).toHaveClass('bg-green-100')
      })
    })

    it('横ばい記号（→）はデフォルトスタイルで表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const neutralSymbols = screen.getAllByText('→')
      neutralSymbols.forEach(symbol => {
        expect(symbol).not.toHaveClass('bg-red-100')
        expect(symbol).not.toHaveClass('bg-green-100')
      })
    })
  })

  describe('フィルター機能', () => {
    it('メトリクス選択ドロップダウンを表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const select = screen.getByRole('combobox', { name: /メトリクス/i })
      expect(select).toBeInTheDocument()
      expect(select).toHaveValue('MRR')
    })

    it('時間足選択ドロップダウンを表示する', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const select = screen.getByRole('combobox', { name: /時間足/i })
      expect(select).toBeInTheDocument()
    })

    it('メトリクス変更時にonMetricChangeを呼ぶ', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <SymbolMatrix 
          data={mockData} 
          metric="MRR"
          onMetricChange={handleChange}
        />
      )
      
      const select = screen.getByRole('combobox', { name: /メトリクス/i })
      await user.selectOptions(select, 'DAU')
      
      expect(handleChange).toHaveBeenCalledWith('DAU')
    })
  })

  describe('ステータス表示', () => {
    it('ステータスに応じて行の背景色を変える', () => {
      const { container } = render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      // 🔴ステータスの行は薄い赤背景
      const redRows = container.querySelectorAll('.bg-red-50')
      expect(redRows.length).toBeGreaterThan(0)
      
      // 🟡ステータスの行は薄い黄背景  
      const yellowRows = container.querySelectorAll('.bg-yellow-50')
      expect(yellowRows.length).toBeGreaterThan(0)
      
      // 🟢ステータスの行は薄い緑背景
      const greenRows = container.querySelectorAll('.bg-green-50')
      expect(greenRows.length).toBeGreaterThan(0)
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIA属性を持つ', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const table = screen.getByRole('table')
      expect(table).toHaveAttribute('aria-label', 'MRRのSymbolマトリックス')
    })

    it('各記号にツールチップ用のtitle属性を持つ', () => {
      render(<SymbolMatrix data={mockData} metric="MRR" />)
      
      const symbols = screen.getAllByText('⬇️')
      symbols.forEach(symbol => {
        expect(symbol).toHaveAttribute('title', expect.stringContaining('急降下'))
      })
    })
  })
})