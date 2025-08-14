import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeSeriesGrid } from './TimeSeriesGrid'

const mockData = [
  { time: '14:00', mrr: 45000, delta: 0, symbol: '→', dau: 125, dauDelta: 5, dauSymbol: '↗️', cvr: 8.5 },
  { time: '14:05', mrr: 45000, delta: 0, symbol: '→', dau: 128, dauDelta: 3, dauSymbol: '→', cvr: 8.5 },
  { time: '14:30', mrr: 38000, delta: -3000, symbol: '⬇️', dau: 115, dauDelta: -5, dauSymbol: '↘️', cvr: 6.5 },
]

describe('TimeSeriesGrid', () => {
  describe('基本表示', () => {
    it('グリッドヘッダーを表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      expect(screen.getByText('Time')).toBeInTheDocument()
      expect(screen.getByText('MRR')).toBeInTheDocument()
      expect(screen.getAllByText('Δ')).toHaveLength(2) // MRRとDAUの2つ
      expect(screen.getAllByText('記号')).toHaveLength(2) // MRRとDAUの2つ
      expect(screen.getByText('DAU')).toBeInTheDocument()
      expect(screen.getByText('CVR')).toBeInTheDocument()
    })

    it('データ行を表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      expect(screen.getByText('14:00')).toBeInTheDocument()
      expect(screen.getAllByText('¥45,000')).toHaveLength(2) // 14:00と14:05の2つ
      expect(screen.getByText('125')).toBeInTheDocument()
      expect(screen.getAllByText('8.5%')).toHaveLength(2) // 14:00と14:05の2つ
    })

    it('選択されたSaaS名を表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      expect(screen.getByText('時系列グリッド - 猫カフェ予約')).toBeInTheDocument()
    })
  })

  describe('記号の強調表示', () => {
    it('急降下記号（⬇️）の行を赤背景で強調する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const rows = screen.getAllByRole('row')
      const dangerRow = rows.find(row => within(row).queryByText('⬇️'))
      
      expect(dangerRow).toHaveClass('bg-red-50')
    })

    it('急降下時のMRR値を強調表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const mrrElement = screen.getByText('¥38,000')
      expect(mrrElement).toHaveClass('bg-red-100')
    })
  })

  describe('フィルター機能', () => {
    it('SaaS選択ドロップダウンを表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const select = screen.getByRole('combobox', { name: /SaaS選択/i })
      expect(select).toBeInTheDocument()
      expect(select).toHaveValue('猫カフェ予約')
    })

    it('時間足選択ドロップダウンを表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const select = screen.getByRole('combobox', { name: /時間足/i })
      expect(select).toBeInTheDocument()
    })

    it('期間選択ドロップダウンを表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const select = screen.getByRole('combobox', { name: /期間/i })
      expect(select).toBeInTheDocument()
    })

    it('エクスポートボタンを表示する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const button = screen.getByRole('button', { name: /エクスポート/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('インタラクション', () => {
    it('SaaS選択時にonSaaSChangeを呼ぶ', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      
      render(
        <TimeSeriesGrid 
          data={mockData} 
          selectedSaaS="猫カフェ予約"
          onSaaSChange={handleChange}
        />
      )
      
      const select = screen.getByRole('combobox', { name: /SaaS選択/i })
      await user.selectOptions(select, '家計簿アプリ')
      
      expect(handleChange).toHaveBeenCalledWith('家計簿アプリ')
    })

    it('エクスポートボタンクリック時にonExportを呼ぶ', async () => {
      const handleExport = jest.fn()
      const user = userEvent.setup()
      
      render(
        <TimeSeriesGrid 
          data={mockData} 
          selectedSaaS="猫カフェ予約"
          onExport={handleExport}
        />
      )
      
      const button = screen.getByRole('button', { name: /エクスポート/i })
      await user.click(button)
      
      expect(handleExport).toHaveBeenCalled()
    })
  })

  describe('アクセシビリティ', () => {
    it('テーブルに適切なARIA属性を持つ', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const table = screen.getByRole('table')
      expect(table).toHaveAttribute('aria-label', '猫カフェ予約の時系列データ')
    })

    it('危険な値にはARIA警告を付与する', () => {
      render(<TimeSeriesGrid data={mockData} selectedSaaS="猫カフェ予約" />)
      
      const dangerCell = screen.getByText('⬇️').closest('td')
      expect(dangerCell).toHaveAttribute('aria-label', expect.stringContaining('急降下'))
    })
  })
})