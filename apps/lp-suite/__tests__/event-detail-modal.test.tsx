// 詳細分析モーダルのテストケース
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventDetailModal from '@/components/EventDetailModal';
import { mockEventDetails, mockAIAnalysis } from './__mocks__/trading-data';

describe('EventDetailModal', () => {
  const mockProps = {
    isOpen: true,
    eventId: 'event-1',
    details: mockEventDetails,
    onClose: vi.fn(),
    onActionApprove: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('モーダル基本動作', () => {
    it('モーダルが正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('2025/08/21 11:30 詳細分析')).toBeInTheDocument();
      
      // 戻るボタンの確認
      expect(screen.getByRole('button', { name: '戻る' })).toBeInTheDocument();
    });

    it('閉じるボタンクリックでモーダルが閉じる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const closeButton = screen.getByRole('button', { name: '戻る' });
      fireEvent.click(closeButton);
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('ESCキーでモーダルが閉じる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('背景クリックでモーダルが閉じる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe('AI総評セクション', () => {
    it('AI総評が正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('🤖 AI総評・推奨アクション')).toBeInTheDocument();
      expect(screen.getByText('📊 パフォーマンス評価: C+ (改善必要)')).toBeInTheDocument();
      
      // 主要懸念点
      expect(screen.getByText('【主要な懸念点】')).toBeInTheDocument();
      expect(screen.getByText(/離脱率13%上昇は競合の価格攻勢が原因/)).toBeInTheDocument();
      
      // 推奨対応策
      expect(screen.getByText('【推奨対応策】')).toBeInTheDocument();
      expect(screen.getByText(/🔴 緊急: LP価格セクション見直し/)).toBeInTheDocument();
      expect(screen.getByText(/🟡 中期: モバイルフォーム最適化/)).toBeInTheDocument();
      expect(screen.getByText(/🟢 長期: 競合差別化コンテンツ強化/)).toBeInTheDocument();
      
      // 信頼度
      expect(screen.getByText('【信頼度】 89% (高い)')).toBeInTheDocument();
    });

    it('グレード別に適切な色分けがされる', () => {
      const gradeTests = [
        { grade: 'S', expectedClass: 'grade-s', color: 'text-green-600' },
        { grade: 'A', expectedClass: 'grade-a', color: 'text-blue-600' },
        { grade: 'C', expectedClass: 'grade-c', color: 'text-yellow-600' },
        { grade: 'D', expectedClass: 'grade-d', color: 'text-red-600' }
      ];

      gradeTests.forEach(({ grade, expectedClass }) => {
        const details = { ...mockEventDetails, aiSummary: { ...mockEventDetails.aiSummary, grade } };
        const { rerender } = render(<EventDetailModal {...mockProps} details={details} />);
        
        const gradeElement = screen.getByTestId('performance-grade');
        expect(gradeElement).toHaveClass(expectedClass);
        
        rerender(<div />); // クリーンアップ
      });
    });
  });

  describe('基本指標セクション', () => {
    it('前回比較データが正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('📊 基本指標（前回比較）')).toBeInTheDocument();
      
      // メトリクス値の確認
      expect(screen.getByText('CVR: 12.8% (▼1.7%)')).toBeInTheDocument();
      expect(screen.getByText('CPL: ¥205 (▲¥10)')).toBeInTheDocument();
      expect(screen.getByText('訪問者: 156人 (▲23人)')).toBeInTheDocument();
      expect(screen.getByText('成約: 20人 (▼1人)')).toBeInTheDocument();
    });

    it('変化率の矢印が正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      // 下降（CVR）
      expect(screen.getByText('▼1.7%')).toHaveClass('text-red-500');
      // 上昇（CPL - 悪い変化）
      expect(screen.getByText('▲¥10')).toHaveClass('text-red-500');
      // 上昇（訪問者 - 良い変化）
      expect(screen.getByText('▲23人')).toHaveClass('text-green-500');
    });
  });

  describe('行動詳細テーブル', () => {
    it('ユーザー行動フローが正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('🔍 行動詳細')).toBeInTheDocument();
      
      // テーブルヘッダー
      expect(screen.getByText('時刻')).toBeInTheDocument();
      expect(screen.getByText('行動')).toBeInTheDocument();
      expect(screen.getByText('人数')).toBeInTheDocument();
      expect(screen.getByText('率')).toBeInTheDocument();
      expect(screen.getByText('AI分析')).toBeInTheDocument();
      
      // 行動データ
      expect(screen.getByText('LP到達')).toBeInTheDocument();
      expect(screen.getByText('45人')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('正常')).toBeInTheDocument();
    });

    it('AI分析コメントが各行に表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('良好な引き込み')).toBeInTheDocument();
      expect(screen.getByText('⚠️離脱多発')).toBeInTheDocument();
      expect(screen.getByText('🔴 価格懸念')).toBeInTheDocument();
      expect(screen.getByText('🔴 要改善')).toBeInTheDocument();
    });

    it('問題のある行がハイライトされる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const warningRows = screen.getAllByTestId(/behavior-row-.*-warning/);
      const errorRows = screen.getAllByTestId(/behavior-row-.*-error/);
      
      expect(warningRows.length).toBeGreaterThan(0);
      expect(errorRows.length).toBeGreaterThan(0);
    });
  });

  describe('異常検知セクション', () => {
    it('検出された異常が正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('🚨 AI異常検知・根本原因分析')).toBeInTheDocument();
      
      // 異常項目
      expect(screen.getByText('🔴 離脱率急増 (32% → 45%)')).toBeInTheDocument();
      expect(screen.getByText(/原因: 競合A社の新キャンペーン開始/)).toBeInTheDocument();
      expect(screen.getByText(/パターン: 過去3回の同様事例と98%一致/)).toBeInTheDocument();
      
      expect(screen.getByText('🟡 フォーム完了率低下 (50% → 44%)')).toBeInTheDocument();
      expect(screen.getByText(/原因: iPhone13以降でフォーム表示崩れ発生/)).toBeInTheDocument();
    });

    it('重要度別に色分けされる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const criticalIssue = screen.getByTestId('anomaly-critical');
      const warningIssue = screen.getByTestId('anomaly-warning');
      
      expect(criticalIssue).toHaveClass('border-red-500');
      expect(warningIssue).toHaveClass('border-yellow-500');
    });
  });

  describe('推奨アクションセクション', () => {
    it('実行可能アクションが表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('💡 AI推奨アクション（実行可能）')).toBeInTheDocument();
      
      // アクションボタン
      expect(screen.getByRole('button', { name: /🚀 今すぐ実行.*競合対抗LP作成/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /🔧 3時間後.*モバイルフォーム修正/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /📊 明日.*価格セクション.*A\/Bテスト開始/ })).toBeInTheDocument();
    });

    it('予想効果が表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByText('(予想効果: CVR+2.1%)')).toBeInTheDocument();
      expect(screen.getByText('(CVR+1.8%)')).toBeInTheDocument();
    });

    it('アクション実行時にコールバックが呼ばれる', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const urgentAction = screen.getByRole('button', { name: /🚀 今すぐ実行/ });
      fireEvent.click(urgentAction);
      
      expect(mockProps.onActionApprove).toHaveBeenCalledWith({
        type: 'urgent',
        action: 'competitor_counter_lp',
        expectedImpact: 'CVR+2.1%'
      });
    });
  });

  describe('フッターアクション', () => {
    it('フッターボタンが正しく表示される', () => {
      render(<EventDetailModal {...mockProps} />);
      
      expect(screen.getByRole('button', { name: '🤖 AI提案を承認' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '🔄 手動最適化' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '📋 課題を記録' })).toBeInTheDocument();
    });

    it('AI提案承認ボタンクリックで確認モーダルが表示される', async () => {
      render(<EventDetailModal {...mockProps} />);
      
      const approveButton = screen.getByRole('button', { name: '🤖 AI提案を承認' });
      fireEvent.click(approveButton);
      
      await waitFor(() => {
        expect(screen.getByText('AI提案の実行確認')).toBeInTheDocument();
        expect(screen.getByText('すべての推奨アクションを実行しますか？')).toBeInTheDocument();
      });
    });
  });

  describe('ローディング状態', () => {
    it('詳細データ取得中にローディングが表示される', () => {
      render(<EventDetailModal {...mockProps} details={null} loading={true} />);
      
      expect(screen.getByTestId('detail-loading')).toBeInTheDocument();
      expect(screen.getByText('詳細分析中...')).toBeInTheDocument();
    });

    it('AIアクション実行中にローディングが表示される', async () => {
      render(<EventDetailModal {...mockProps} />);
      
      const urgentAction = screen.getByRole('button', { name: /🚀 今すぐ実行/ });
      fireEvent.click(urgentAction);
      
      await waitFor(() => {
        expect(urgentAction).toBeDisabled();
        expect(screen.getByTestId('action-loading')).toBeInTheDocument();
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('詳細データ取得エラー時にエラーメッセージが表示される', () => {
      render(<EventDetailModal {...mockProps} details={null} error="詳細データの取得に失敗しました" />);
      
      expect(screen.getByText('詳細データの取得に失敗しました')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
    });

    it('アクション実行エラー時にエラーメッセージが表示される', async () => {
      const onActionApprove = vi.fn().mockRejectedValue(new Error('実行に失敗しました'));
      render(<EventDetailModal {...mockProps} onActionApprove={onActionApprove} />);
      
      const urgentAction = screen.getByRole('button', { name: /🚀 今すぐ実行/ });
      fireEvent.click(urgentAction);
      
      await waitFor(() => {
        expect(screen.getByText('アクションの実行に失敗しました')).toBeInTheDocument();
      });
    });
  });

  describe('レスポンシブデザイン', () => {
    it('モバイル表示で適切にレイアウトが調整される', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<EventDetailModal {...mockProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('mobile-modal');
    });

    it('タブレット表示で適切な幅になる', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<EventDetailModal {...mockProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveClass('tablet-modal');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なARIA属性が設定されている', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('フォーカストラップが機能する', () => {
      render(<EventDetailModal {...mockProps} />);
      
      const closeButton = screen.getByRole('button', { name: '戻る' });
      const firstActionButton = screen.getByRole('button', { name: /🚀 今すぐ実行/ });
      
      // 最初のフォーカス可能要素にフォーカス
      expect(closeButton).toHaveFocus();
      
      // Tab で次の要素に移動
      fireEvent.keyDown(closeButton, { key: 'Tab' });
      
      // モーダル内の要素がフォーカスされる
      expect(document.activeElement).not.toBe(document.body);
    });
  });
});