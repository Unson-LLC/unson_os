import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DAORevenueDashboard } from './DAORevenueDashboard'

const mockData = {
  totalRevenue: 12345678,
  operatingCost: 7407407,
  daoPool: 4938271,
  treasury: 25432100,
  treasuryChange: 18.5,
  contributors: [
    { name: '@yamada_dev', points: 2847, amount: 487234 },
    { name: '@suzuki_design', points: 2234, amount: 382156 },
    { name: '@tanaka_pm', points: 1892, amount: 323654 },
    { name: '@sato_marketing', points: 1543, amount: 263982 },
    { name: '@ito_qa', points: 1234, amount: 211123 }
  ]
}

describe('DAORevenueDashboard', () => {
  describe('基本表示', () => {
    it('タイトルを表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      expect(screen.getByText('収益分配ダッシュボード')).toBeInTheDocument()
    })

    it('総売上を表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      expect(screen.getByText('総売上:')).toBeInTheDocument()
      expect(screen.getByText('¥12,345,678')).toBeInTheDocument()
    })

    it('運営費とDAOプールの内訳を表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      expect(screen.getByText(/運営費\(60%\)/)).toBeInTheDocument()
      expect(screen.getByText('¥7,407,407')).toBeInTheDocument()
      
      expect(screen.getByText(/DAOプール\(40%\)/)).toBeInTheDocument()
      expect(screen.getByText('¥4,938,271')).toBeInTheDocument()
    })

    it('DAOトレジャリーの情報を表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      expect(screen.getByText(/DAOトレジャリー/)).toBeInTheDocument()
      expect(screen.getByText('¥25,432,100')).toBeInTheDocument()
      expect(screen.getByText('↗️+18.5%')).toBeInTheDocument()
    })
  })

  describe('貢献者ランキング', () => {
    it('貢献者TOP5のタイトルを表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      expect(screen.getByText('貢献度TOP5:')).toBeInTheDocument()
    })

    it('各貢献者の情報を表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      // 1位
      expect(screen.getByText('1.')).toBeInTheDocument()
      expect(screen.getByText('@yamada_dev')).toBeInTheDocument()
      expect(screen.getByText('(2,847 pts)')).toBeInTheDocument()
      expect(screen.getByText('→ ¥487,234')).toBeInTheDocument()
      
      // 5位
      expect(screen.getByText('5.')).toBeInTheDocument()
      expect(screen.getByText('@ito_qa')).toBeInTheDocument()
      expect(screen.getByText('(1,234 pts)')).toBeInTheDocument()
      expect(screen.getByText('→ ¥211,123')).toBeInTheDocument()
    })

    it('ランキング順位を正しく表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      const rankings = screen.getAllByText(/^\d+\./);
      expect(rankings).toHaveLength(5)
      expect(rankings[0]).toHaveTextContent('1.')
      expect(rankings[4]).toHaveTextContent('5.')
    })
  })

  describe('グラフ表示', () => {
    it('収益分配の円グラフを表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      const chart = screen.getByRole('img', { name: /収益分配円グラフ/i })
      expect(chart).toBeInTheDocument()
    })

    it('貢献度の棒グラフを表示する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      const chart = screen.getByRole('img', { name: /貢献度棒グラフ/i })
      expect(chart).toBeInTheDocument()
    })
  })

  describe('インタラクション', () => {
    it('詳細ボタンクリック時にonDetailClickを呼ぶ', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DAORevenueDashboard 
          data={mockData}
          onDetailClick={handleClick}
        />
      )
      
      const button = screen.getByRole('button', { name: /詳細を見る/i })
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalled()
    })

    it('貢献者名クリック時にonContributorClickを呼ぶ', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <DAORevenueDashboard 
          data={mockData}
          onContributorClick={handleClick}
        />
      )
      
      const contributor = screen.getByRole('button', { name: /@yamada_dev/i })
      await user.click(contributor)
      
      expect(handleClick).toHaveBeenCalledWith('@yamada_dev')
    })
  })

  describe('アクセシビリティ', () => {
    it('セクションに適切なARIA属性を持つ', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      const section = screen.getByRole('region', { name: /収益分配/i })
      expect(section).toBeInTheDocument()
    })

    it('数値に適切なフォーマットを適用する', () => {
      render(<DAORevenueDashboard data={mockData} />)
      
      // 千単位のカンマ区切り
      expect(screen.getByText('¥12,345,678')).toBeInTheDocument()
      expect(screen.getByText('(2,847 pts)')).toBeInTheDocument()
    })
  })
})