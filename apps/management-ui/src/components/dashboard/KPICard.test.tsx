import { render, screen } from '@testing-library/react'
import { KPICard } from './KPICard'

describe('KPICard', () => {
  describe('表示要件', () => {
    it('タイトルを表示する', () => {
      render(<KPICard title="総収益" value="¥142,000" />)
      expect(screen.getByText('総収益')).toBeInTheDocument()
    })

    it('値を表示する', () => {
      render(<KPICard title="総収益" value="¥142,000" />)
      expect(screen.getByText('¥142,000')).toBeInTheDocument()
    })

    it('変化記号を表示する', () => {
      render(<KPICard title="総収益" value="¥142,000" trend="↗️" />)
      expect(screen.getByText('↗️')).toBeInTheDocument()
    })

    it('変化率を表示する', () => {
      render(<KPICard title="総収益" value="¥142,000" trend="↗️" change="+18%" />)
      expect(screen.getByText('+18%')).toBeInTheDocument()
    })

    it('サブ項目を表示する', () => {
      const subItems = [
        { label: '運営(60%)', value: '¥85,200' },
        { label: 'DAO(40%)', value: '¥56,800' }
      ]
      render(<KPICard title="総収益" value="¥142,000" subItems={subItems} />)
      
      expect(screen.getByText('運営(60%)')).toBeInTheDocument()
      expect(screen.getByText('¥85,200')).toBeInTheDocument()
      expect(screen.getByText('DAO(40%)')).toBeInTheDocument()
      expect(screen.getByText('¥56,800')).toBeInTheDocument()
    })
  })

  describe('スタイル要件', () => {
    it('上昇トレンドの場合、緑色のスタイルを適用する', () => {
      const { container } = render(
        <KPICard title="総収益" value="¥142,000" trend="↗️" trendType="up" />
      )
      const trendElement = screen.getByText('↗️')
      expect(trendElement).toHaveClass('text-green-600')
    })

    it('下降トレンドの場合、赤色のスタイルを適用する', () => {
      const { container } = render(
        <KPICard title="MRR" value="¥38,000" trend="⬇️" trendType="down" />
      )
      const trendElement = screen.getByText('⬇️')
      expect(trendElement).toHaveClass('text-red-600')
    })

    it('横ばいトレンドの場合、グレー色のスタイルを適用する', () => {
      const { container } = render(
        <KPICard title="DAU" value="125" trend="→" trendType="neutral" />
      )
      const trendElement = screen.getByText('→')
      expect(trendElement).toHaveClass('text-gray-500')
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIA属性を持つ', () => {
      render(<KPICard title="総収益" value="¥142,000" trend="↗️" change="+18%" />)
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', '総収益: ¥142,000 (↗️ +18%)')
    })
  })
})