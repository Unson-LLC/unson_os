// t_wada式TDD: ポジション一覧コンパクトレイアウトテスト
// 設計書: docs/lp-suite/ui-design/pages/position-list.md から抽出

import { render, screen, fireEvent, within } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PositionsPage from '../page';

// モック設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// API レスポンスのモック
global.fetch = jest.fn();

const mockPositions = [
  {
    id: 'ai-bridge',
    name: '企業向けコミュニケーション改善ツール',
    lpUrl: 'https://ai-bridge.example.com',
    metrics: { cvr: 3.5, cpa: 1200, visitors: 500, conversions: 17, revenue: 34000 },
    campaigns: 3,
    hasRealData: true
  },
  {
    id: 'mywa', 
    name: '個人ブランディング支援プラットフォーム',
    lpUrl: 'https://mywa.example.com',
    metrics: { cvr: 4.1, cpa: 800, visitors: 300, conversions: 12, revenue: 24000 },
    campaigns: 2,
    hasRealData: true
  },
  {
    id: 'ai-coach',
    name: '個人向けヘルスケア最適化アプリ',  
    lpUrl: 'https://ai-coach.example.com',
    metrics: { cvr: 0, cpa: 0, visitors: 0, conversions: 0, revenue: 0 },
    campaigns: 1,
    hasRealData: false
  }
];

describe('PositionsPage リスト形式表示', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    // API モック設定
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/positions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ positions: mockPositions })
        });
      }
      if (url.includes('/api/all-services-ads')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            services: [
              { productId: 'ai-bridge', metrics: { cvr: 3.5, cpa: 1200, clicks: 500, conversions: 17 } },
              { productId: 'mywa', metrics: { cvr: 4.1, cpa: 800, clicks: 300, conversions: 12 } }
            ]
          })
        });
      }
      if (url.includes('/api/campaigns/counts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            campaignsByProduct: {
              'ai-bridge': { total: 3 },
              'mywa': { total: 2 },
              'ai-coach': { total: 1 }
            }
          })
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('🔴 RED: 設計書要件1 - 縦並びリスト形式で表示', async () => {
    render(<PositionsPage />);
    
    // データが読み込まれるまで待つ
    await screen.findByText('AI-BRIDGE');
    
    // リストコンテナを確認
    const listContainer = screen.getByTestId('positions-list');
    expect(listContainer).toHaveClass('space-y-2'); // 縦間隔
  });

  test('🔴 RED: 設計書要件2 - 各行が12カラムグリッド構成', async () => {
    render(<PositionsPage />);
    
    await screen.findByText('AI-BRIDGE');
    
    // AI-BRIDGEリスト項目を取得
    const positionItem = screen.getByTestId('position-item-ai-bridge');
    
    // 12カラムグリッド構成を確認
    const gridContainer = positionItem.querySelector('.grid-cols-12');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-12');
  });

  test('🔴 RED: 設計書要件3 - 全メトリクス(CVR,CPA,訪問者,CV,売上)を表示', async () => {
    render(<PositionsPage />);
    
    await screen.findByText('AI-BRIDGE');
    
    const positionItem = screen.getByTestId('position-item-ai-bridge');
    const metricsGrid = positionItem.querySelector('.grid-cols-5');
    
    expect(metricsGrid).toBeInTheDocument();
    expect(metricsGrid).toHaveClass('grid');
    expect(metricsGrid).toHaveClass('grid-cols-5');
    
    // 5つのメトリクスを確認
    expect(positionItem).toHaveTextContent('CVR');
    expect(positionItem).toHaveTextContent('CPA');
    expect(positionItem).toHaveTextContent('訪問者');
    expect(positionItem).toHaveTextContent('CV'); // コンバージョン
    expect(positionItem).toHaveTextContent('売上');
  });

  test('🔴 RED: 設計書要件4 - 基本情報（ポジション名、説明、ドメイン）表示', async () => {
    render(<PositionsPage />);
    
    await screen.findByText('AI-BRIDGE');
    
    const positionItem = screen.getByTestId('position-item-ai-bridge');
    
    // 基本情報を確認
    expect(positionItem).toHaveTextContent('AI-BRIDGE');
    expect(positionItem).toHaveTextContent('企業向けコミュニケーション改善ツール');
    expect(positionItem).toHaveTextContent('ai-bridge.example.com'); // ドメイン
  });

  test('🔴 RED: 設計書要件5 - 運用情報（キャンペーン数、更新日）とアクションボタン', async () => {
    render(<PositionsPage />);
    
    await screen.findByText('AI-BRIDGE');
    
    const positionItem = screen.getByTestId('position-item-ai-bridge');
    
    // 運用情報を確認
    expect(positionItem).toHaveTextContent('キャンペーン: 3');
    expect(positionItem).toHaveTextContent('更新:'); // 更新日
    
    // 詳細ボタンを確認
    const detailButton = positionItem.querySelector('button');
    expect(detailButton).toHaveTextContent('詳細');
    
    // ボタンをクリック
    fireEvent.click(detailButton);
    expect(mockPush).toHaveBeenCalledWith('/position/ai-bridge');
  });

  test('🔴 RED: 設計書要件6 - リスト項目全体がクリック可能', async () => {
    render(<PositionsPage />);
    
    await screen.findByText('AI-BRIDGE');
    
    const positionItem = screen.getByTestId('position-item-ai-bridge');
    
    // 行全体がクリック可能
    expect(positionItem).toHaveClass('cursor-pointer');
    
    // 行をクリックして詳細ページに遷移
    fireEvent.click(positionItem);
    
    expect(mockPush).toHaveBeenCalledWith('/position/ai-bridge');
  });
});
