import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PKGExecutionStatus } from './PKGExecutionStatus'

const mockData = [
  {
    saasName: '猫カフェ予約',
    status: '🔴' as const,
    currentPkg: 'pkg_crisis_recovery',
    progress: 35,
    trigger: 'MRR⬇️ (14:30検出)',
    nextPkg: 'pkg_pivot'
  },
  {
    saasName: '家計簿アプリ',
    status: '🟢' as const,
    currentPkg: 'pkg_fast_mvp',
    progress: 78,
    trigger: 'CVR↗️ > 15%',
    nextPkg: 'pkg_monetize'
  },
  {
    saasName: '英会話マッチ',
    status: '🟡' as const,
    currentPkg: 'pkg_optimization',
    progress: 45,
    nextPkg: '[分岐待ち]'
  }
]

describe('PKGExecutionStatus', () => {
  describe('基本表示', () => {
    it('タイトルを表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      expect(screen.getByText('プレイブック実行状況')).toBeInTheDocument()
    })

    it('各SaaSの情報を表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      // SaaS名とステータス
      expect(screen.getByText('🔴')).toBeInTheDocument()
      expect(screen.getByText('猫カフェ予約')).toBeInTheDocument()
      expect(screen.getByText('🟢')).toBeInTheDocument()
      expect(screen.getByText('家計簿アプリ')).toBeInTheDocument()
      
      // 現在のPKG
      expect(screen.getByText('pkg_crisis_recovery')).toBeInTheDocument()
      expect(screen.getByText('pkg_fast_mvp')).toBeInTheDocument()
      
      // 進捗
      expect(screen.getByText('35%')).toBeInTheDocument()
      expect(screen.getByText('78%')).toBeInTheDocument()
      
      // 次のPKG
      expect(screen.getByText(/pkg_pivot/)).toBeInTheDocument()
      expect(screen.getByText(/pkg_monetize/)).toBeInTheDocument()
    })

    it('トリガー情報を表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      expect(screen.getByText('└ トリガー: MRR⬇️ (14:30検出)')).toBeInTheDocument()
      expect(screen.getByText('└ トリガー: CVR↗️ > 15%')).toBeInTheDocument()
    })

    it('トリガーがない場合は表示しない', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      // 英会話マッチにはトリガーがない
      const cards = screen.getAllByRole('article')
      const englishCard = cards[2]
      
      expect(within(englishCard).queryByText(/トリガー/)).not.toBeInTheDocument()
    })
  })

  describe('プログレスバー', () => {
    it('進捗に応じたプログレスバーを表示する', () => {
      const { container } = render(<PKGExecutionStatus data={mockData} />)
      
      // 35%のプログレスバー
      const progressBar35 = container.querySelector('[style*="width: 35%"]')
      expect(progressBar35).toBeInTheDocument()
      
      // 78%のプログレスバー
      const progressBar78 = container.querySelector('[style*="width: 78%"]')
      expect(progressBar78).toBeInTheDocument()
    })

    it('ステータスに応じてプログレスバーの色を変える', () => {
      const { container } = render(<PKGExecutionStatus data={mockData} />)
      
      const articles = screen.getAllByRole('article')
      
      // 🔴ステータスは赤色
      const redProgress = articles[0].querySelector('.bg-red-600')
      expect(redProgress).toBeInTheDocument()
      
      // 🟢ステータスは緑色
      const greenProgress = articles[1].querySelector('.bg-green-600')
      expect(greenProgress).toBeInTheDocument()
      
      // 🟡ステータスは黄色
      const yellowProgress = articles[2].querySelector('.bg-yellow-600')
      expect(yellowProgress).toBeInTheDocument()
    })
  })

  describe('PKGフロー可視化', () => {
    it('フロー図を表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      // フロー図のタイトル
      expect(screen.getByText('PKGフロー可視化:')).toBeInTheDocument()
    })

    it('現在実行中のPKGを強調表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      const currentPkg = screen.getByText('[pkg_crisis_recovery]')
      expect(currentPkg).toHaveClass('text-blue-600')
      expect(currentPkg).toHaveClass('font-bold')
    })

    it('完了ステータスを表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      expect(screen.getByText('✓完了')).toBeInTheDocument()
    })

    it('実行中の進捗を表示する', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      expect(screen.getByText('実行中(35%)')).toBeInTheDocument()
    })
  })

  describe('インタラクション', () => {
    it('詳細ボタンクリック時にonDetailClickを呼ぶ', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(
        <PKGExecutionStatus 
          data={mockData}
          onDetailClick={handleClick}
        />
      )
      
      const buttons = screen.getAllByRole('button', { name: /詳細/i })
      await user.click(buttons[0])
      
      expect(handleClick).toHaveBeenCalledWith('猫カフェ予約')
    })

    it('一時停止ボタンクリック時にonPauseClickを呼ぶ', async () => {
      const handlePause = jest.fn()
      const user = userEvent.setup()
      
      render(
        <PKGExecutionStatus 
          data={mockData}
          onPauseClick={handlePause}
        />
      )
      
      const buttons = screen.getAllByRole('button', { name: /一時停止/i })
      await user.click(buttons[0])
      
      expect(handlePause).toHaveBeenCalledWith('猫カフェ予約')
    })
  })

  describe('アクセシビリティ', () => {
    it('各カードに適切なARIA属性を持つ', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      const cards = screen.getAllByRole('article')
      expect(cards[0]).toHaveAttribute('aria-label', '猫カフェ予約のPKG実行状況')
      expect(cards[1]).toHaveAttribute('aria-label', '家計簿アプリのPKG実行状況')
    })

    it('プログレスバーに適切なARIA属性を持つ', () => {
      render(<PKGExecutionStatus data={mockData} />)
      
      const progressBars = screen.getAllByRole('progressbar')
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '35')
      expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0')
      expect(progressBars[0]).toHaveAttribute('aria-valuemax', '100')
    })
  })
})