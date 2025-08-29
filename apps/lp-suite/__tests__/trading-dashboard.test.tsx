// FXトレーディング風ダッシュボードのテストケース
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TradingDashboard from '@/components/TradingDashboard';
import { mockPositions, mockTimeSeriesEvents } from '../__mocks__/trading-data';

// モックデータ
const mockTradingData = {
  totalLeads: 342,
  dailyGrowth: 45,
  positions: mockPositions,
  events: mockTimeSeriesEvents
};

describe('TradingDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ポジション一覧表示', () => {
    it('全ポジションが正しく表示される', () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      // ヘッダー情報の確認
      expect(screen.getByText('LP検証ポジション管理')).toBeInTheDocument();
      expect(screen.getByText('総リード: 342')).toBeInTheDocument();
      expect(screen.getByText('(+45/日)')).toBeInTheDocument();
      
      // ポジション行の確認
      expect(screen.getByText('じぶん lab')).toBeInTheDocument();
      expect(screen.getByText('15.2%')).toBeInTheDocument(); // CVR
      expect(screen.getByText('¥180')).toBeInTheDocument();  // CPL
      expect(screen.getByText('125')).toBeInTheDocument();   // リード数
      expect(screen.getByText('A+')).toBeInTheDocument();    // 品質グレード
    });

    it('ステータスアイコンが正しく表示される', () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      // 各ステータスのアイコン確認
      const runningPositions = screen.getAllByText('🟢');
      const warningPositions = screen.getAllByText('🟡');
      const errorPositions = screen.getAllByText('🔴');
      
      expect(runningPositions).toHaveLength(2); // じぶん lab, AI-WRITER
      expect(warningPositions).toHaveLength(1); // 世代bridge
      expect(errorPositions).toHaveLength(1);   // きこなし
    });

    it('AIコメントが各ポジションに表示される', () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      expect(screen.getByText(/🤖.*MVP移行を強く推奨/)).toBeInTheDocument();
      expect(screen.getByText(/🤖.*ユーザーインタビュー実施タイミング/)).toBeInTheDocument();
      expect(screen.getByText(/🤖.*価値提案の見直し必要/)).toBeInTheDocument();
      expect(screen.getByText(/🤖.*ピボット or 終了検討/)).toBeInTheDocument();
    });
  });

  describe('ソート・フィルター機能', () => {
    it('CVR順でソートができる', async () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      const sortButton = screen.getByText('CVR↓');
      fireEvent.click(sortButton);
      
      // ソート後の順序確認
      const positionRows = screen.getAllByTestId('position-row');
      expect(positionRows[0]).toHaveTextContent('じぶん lab'); // 15.2%
      expect(positionRows[1]).toHaveTextContent('AI-WRITER'); // 12.8%
      expect(positionRows[2]).toHaveTextContent('世代bridge'); // 8.2%
      expect(positionRows[3]).toHaveTextContent('きこなし'); // 3.4%
    });

    it('実行中のみフィルターができる', async () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      const filterButton = screen.getByText('実行中のみ');
      fireEvent.click(filterButton);
      
      // フィルター後の表示確認
      expect(screen.getByText('じぶん lab')).toBeInTheDocument();
      expect(screen.getByText('AI-WRITER')).toBeInTheDocument();
      expect(screen.queryByText('きこなし')).not.toBeInTheDocument(); // 停止中は非表示
    });
  });

  describe('リアルタイム更新', () => {
    it('データ更新時にUIが自動更新される', async () => {
      const { rerender } = render(<TradingDashboard data={mockTradingData} />);
      
      // 初期値確認
      expect(screen.getByText('15.2%')).toBeInTheDocument();
      
      // データ更新
      const updatedData = {
        ...mockTradingData,
        positions: [
          { ...mockPositions[0], cvr: 16.5 }
        ]
      };
      
      rerender(<TradingDashboard data={updatedData} />);
      
      // 更新後の値確認
      await waitFor(() => {
        expect(screen.getByText('16.5%')).toBeInTheDocument();
      });
    });

    it('新しいポジションが追加される', async () => {
      const { rerender } = render(<TradingDashboard data={mockTradingData} />);
      
      const newPosition = {
        id: 'ai-translator-001',
        symbol: 'AI-TRANSLATOR',
        status: 'RUNNING' as const,
        cvr: 11.2,
        cpl: 250,
        totalLeads: 67,
        qualityGrade: 'B' as const,
        aiComment: 'システム学習中。初期段階として良好',
        trend: 'up' as const
      };
      
      const updatedData = {
        ...mockTradingData,
        positions: [...mockPositions, newPosition]
      };
      
      rerender(<TradingDashboard data={updatedData} />);
      
      expect(screen.getByText('AI-TRANSLATOR')).toBeInTheDocument();
      expect(screen.getByText('11.2%')).toBeInTheDocument();
    });
  });

  describe('レスポンシブデザイン', () => {
    it('モバイル表示で縦スタック表示になる', () => {
      // モバイルサイズでレンダリング
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<TradingDashboard data={mockTradingData} />);
      
      const dashboard = screen.getByTestId('trading-dashboard');
      expect(dashboard).toHaveClass('mobile-layout');
    });

    it('タブレット表示で適切なレイアウトになる', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<TradingDashboard data={mockTradingData} />);
      
      const dashboard = screen.getByTestId('trading-dashboard');
      expect(dashboard).toHaveClass('tablet-layout');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIAラベルが設定されている', () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'LP検証ポジション一覧');
      expect(screen.getByRole('button', { name: /並替/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /フィルター/ })).toBeInTheDocument();
    });

    it('キーボードナビゲーションが機能する', () => {
      render(<TradingDashboard data={mockTradingData} />);
      
      const firstRow = screen.getAllByTestId('position-row')[0];
      firstRow.focus();
      expect(firstRow).toHaveFocus();
      
      // Enter キーでポジション詳細が開く
      fireEvent.keyDown(firstRow, { key: 'Enter' });
      expect(screen.getByTestId('position-detail-modal')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('データ取得エラー時にエラーメッセージを表示', () => {
      render(<TradingDashboard data={null} error="データ取得に失敗しました" />);
      
      expect(screen.getByText('データ取得に失敗しました')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
    });

    it('空データ時に適切なメッセージを表示', () => {
      const emptyData = { ...mockTradingData, positions: [] };
      render(<TradingDashboard data={emptyData} />);
      
      expect(screen.getByText('まだポジションがありません')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '新規ポジション追加' })).toBeInTheDocument();
    });
  });

  describe('パフォーマンス', () => {
    it('大量データでも遅延なく表示される', () => {
      const largeData = {
        ...mockTradingData,
        positions: Array.from({ length: 100 }, (_, i) => ({
          ...mockPositions[0],
          id: `position-${i}`,
          symbol: `TEST-${i.toString().padStart(3, '0')}`
        }))
      };
      
      const startTime = performance.now();
      render(<TradingDashboard data={largeData} />);
      const endTime = performance.now();
      
      // 100ms以内での描画完了を期待
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});