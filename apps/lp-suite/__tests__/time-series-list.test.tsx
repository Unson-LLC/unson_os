// 時系列分析リストのテストケース
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimeSeriesList from '@/components/TimeSeriesList';
import { mockTimeSeriesEvents, mockEventDetails } from '../__mocks__/trading-data';

describe('TimeSeriesList', () => {
  const mockProps = {
    sessionId: 'ai-coach-001',
    events: mockTimeSeriesEvents,
    onEventSelect: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('イベントリスト表示', () => {
    it('時系列イベントが正しく表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      // ヘッダー確認
      expect(screen.getByText('じぶん lab 行動ログ')).toBeInTheDocument();
      
      // 時間範囲フィルター確認
      expect(screen.getByText('4時間')).toBeInTheDocument();
      expect(screen.getByText('1日')).toBeInTheDocument();
      expect(screen.getByText('1週間')).toBeInTheDocument();
      
      // イベント行確認
      expect(screen.getByText('🕐 15:30')).toBeInTheDocument();
      expect(screen.getByText('CVR: 15.2% ↗')).toBeInTheDocument();
      expect(screen.getByText('セッション: 89')).toBeInTheDocument();
      expect(screen.getByText('CPL: ¥180')).toBeInTheDocument();
    });

    it('最適化実行情報が表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      expect(screen.getByText('最適化: キーワード3件調整 → CPL-¥25')).toBeInTheDocument();
      expect(screen.getByText('最適化: なし')).toBeInTheDocument();
    });

    it('AIコメントが各イベントに表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      expect(screen.getByText(/🤖 AI: 最適化効果期待通り/)).toBeInTheDocument();
      expect(screen.getByText(/🤖 AI: 競合影響の可能性大/)).toBeInTheDocument();
      expect(screen.getByText(/🤖 AI: 朝の時間帯として良好/)).toBeInTheDocument();
    });

    it('異常検知結果が表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      expect(screen.getByText('異常: 離脱率急増 45% (前回32%)')).toBeInTheDocument();
      expect(screen.getByText('異常: なし')).toBeInTheDocument();
    });

    it('トレンド矢印が正しく表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      // 上昇トレンド
      expect(screen.getAllByText('↗')).toHaveLength(2);
      // 下降トレンド
      expect(screen.getAllByText('↘')).toHaveLength(1);
      // 横ばい
      expect(screen.getAllByText('→')).toHaveLength(1);
    });
  });

  describe('フィルター機能', () => {
    it('時間範囲フィルターが機能する', async () => {
      render(<TimeSeriesList {...mockProps} />);
      
      // 1日フィルターをクリック
      const oneDayFilter = screen.getByText('1日');
      fireEvent.click(oneDayFilter);
      
      // アクティブクラスが適用される
      await waitFor(() => {
        expect(oneDayFilter).toHaveClass('active');
      });
      
      // 4時間フィルターのアクティブ状態が解除される
      expect(screen.getByText('4時間')).not.toHaveClass('active');
    });

    it('期間別にイベントが絞り込まれる', async () => {
      const { rerender } = render(<TimeSeriesList {...mockProps} />);
      
      // 週間フィルター用のデータ
      const weeklyEvents = mockTimeSeriesEvents.slice(0, 2);
      rerender(<TimeSeriesList {...mockProps} events={weeklyEvents} />);
      
      expect(screen.getAllByTestId('event-row')).toHaveLength(2);
    });
  });

  describe('イベント選択', () => {
    it('イベント行クリックで詳細が開く', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      const eventRow = screen.getAllByTestId('event-row')[0];
      fireEvent.click(eventRow);
      
      expect(mockProps.onEventSelect).toHaveBeenCalledWith(mockTimeSeriesEvents[0]);
    });

    it('詳細ボタンクリックで詳細が開く', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      const detailButton = screen.getAllByText('詳細')[0];
      fireEvent.click(detailButton);
      
      expect(mockProps.onEventSelect).toHaveBeenCalledWith(mockTimeSeriesEvents[0]);
    });

    it('選択されたイベントがハイライトされる', () => {
      render(<TimeSeriesList {...mockProps} selectedEventId="event-1" />);
      
      const selectedRow = screen.getByTestId('event-row-event-1');
      expect(selectedRow).toHaveClass('selected');
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中にスケルトンが表示される', () => {
      render(<TimeSeriesList {...mockProps} loading={true} />);
      
      expect(screen.getAllByTestId('event-skeleton')).toHaveLength(5);
    });

    it('データ取得後にローディングが解除される', async () => {
      const { rerender } = render(<TimeSeriesList {...mockProps} loading={true} />);
      
      rerender(<TimeSeriesList {...mockProps} loading={false} />);
      
      await waitFor(() => {
        expect(screen.queryByTestId('event-skeleton')).not.toBeInTheDocument();
      });
    });
  });

  describe('無限スクロール', () => {
    it('スクロール底部で追加データが読み込まれる', async () => {
      const onLoadMore = vi.fn();
      render(<TimeSeriesList {...mockProps} onLoadMore={onLoadMore} hasMore={true} />);
      
      const listContainer = screen.getByTestId('events-list');
      
      // 底部までスクロール
      fireEvent.scroll(listContainer, {
        target: { scrollTop: listContainer.scrollHeight }
      });
      
      await waitFor(() => {
        expect(onLoadMore).toHaveBeenCalled();
      });
    });

    it('全データ読み込み済み時は追加読み込みしない', () => {
      const onLoadMore = vi.fn();
      render(<TimeSeriesList {...mockProps} onLoadMore={onLoadMore} hasMore={false} />);
      
      const listContainer = screen.getByTestId('events-list');
      fireEvent.scroll(listContainer, {
        target: { scrollTop: listContainer.scrollHeight }
      });
      
      expect(onLoadMore).not.toHaveBeenCalled();
    });
  });

  describe('日付区切り', () => {
    it('日付が変わる箇所に区切り線が表示される', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      expect(screen.getByText('2025/08/20')).toBeInTheDocument();
      expect(screen.getByTestId('date-separator')).toBeInTheDocument();
    });
  });

  describe('エラーハンドリング', () => {
    it('エラー時にエラーメッセージが表示される', () => {
      render(<TimeSeriesList {...mockProps} error="データ取得エラー" />);
      
      expect(screen.getByText('データ取得エラー')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
    });

    it('空データ時に適切なメッセージが表示される', () => {
      render(<TimeSeriesList {...mockProps} events={[]} />);
      
      expect(screen.getByText('表示するイベントがありません')).toBeInTheDocument();
    });
  });

  describe('リアルタイム更新', () => {
    it('新しいイベントが先頭に追加される', async () => {
      const { rerender } = render(<TimeSeriesList {...mockProps} />);
      
      const newEvent = {
        id: 'event-new',
        timestamp: new Date().toISOString(),
        time: '16:30',
        cvr: 16.0,
        previousCvr: 15.2,
        sessions: 95,
        cpl: 175,
        optimizations: [],
        anomalies: [],
        aiComment: '新しいイベントです'
      };
      
      const updatedEvents = [newEvent, ...mockTimeSeriesEvents];
      rerender(<TimeSeriesList {...mockProps} events={updatedEvents} />);
      
      const firstRow = screen.getAllByTestId('event-row')[0];
      expect(firstRow).toHaveTextContent('16:30');
      expect(firstRow).toHaveTextContent('16.0%');
    });

    it('既存イベントが更新される', async () => {
      const { rerender } = render(<TimeSeriesList {...mockProps} />);
      
      const updatedEvents = mockTimeSeriesEvents.map(event =>
        event.id === 'event-1'
          ? { ...event, cvr: 16.5, aiComment: '更新されたコメント' }
          : event
      );
      
      rerender(<TimeSeriesList {...mockProps} events={updatedEvents} />);
      
      await waitFor(() => {
        expect(screen.getByText('16.5%')).toBeInTheDocument();
        expect(screen.getByText(/更新されたコメント/)).toBeInTheDocument();
      });
    });
  });

  describe('パフォーマンス', () => {
    it('大量イベントでも遅延なく描画される', () => {
      const largeEvents = Array.from({ length: 1000 }, (_, i) => ({
        ...mockTimeSeriesEvents[0],
        id: `event-${i}`,
        time: `${String(Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`
      }));
      
      const startTime = performance.now();
      render(<TimeSeriesList {...mockProps} events={largeEvents} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('仮想化が有効になっている', () => {
      const largeEvents = Array.from({ length: 100 }, (_, i) => ({
        ...mockTimeSeriesEvents[0],
        id: `event-${i}`
      }));
      
      render(<TimeSeriesList {...mockProps} events={largeEvents} />);
      
      // 実際にDOMに存在する行数は限定される（仮想化）
      const visibleRows = screen.getAllByTestId('event-row');
      expect(visibleRows.length).toBeLessThan(20);
    });
  });

  describe('アクセシビリティ', () => {
    it('スクリーンリーダー対応のラベルが設定されている', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', '時系列イベント一覧');
      
      const eventRows = screen.getAllByTestId('event-row');
      eventRows.forEach(row => {
        expect(row).toHaveAttribute('tabIndex', '0');
        expect(row).toHaveAttribute('role', 'button');
      });
    });

    it('キーボードナビゲーションが機能する', () => {
      render(<TimeSeriesList {...mockProps} />);
      
      const firstRow = screen.getAllByTestId('event-row')[0];
      firstRow.focus();
      
      // Arrow Down で次の行に移動
      fireEvent.keyDown(firstRow, { key: 'ArrowDown' });
      
      const secondRow = screen.getAllByTestId('event-row')[1];
      expect(secondRow).toHaveFocus();
    });
  });
});