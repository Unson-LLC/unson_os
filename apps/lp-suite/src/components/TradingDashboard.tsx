// FXトレーディング風メインダッシュボード
'use client';

import React, { useState, useMemo } from 'react';
import { RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Position, TradingData, TradingDashboardProps } from '@/lib/types';
import { 
  getTrendIconClass, 
  getStatusIcon, 
  getGradeColor, 
  getActionColor, 
  isMobileDevice 
} from '@/lib/utils';
import { SORT_OPTIONS, FILTER_OPTIONS, MOBILE_BREAKPOINT } from '@/lib/constants';
import { commonStyles, cn, statusColorMap } from '@/lib/styles';

const TradingDashboard: React.FC<TradingDashboardProps> = ({
  data,
  error,
  loading = false,
  onPositionClick
}) => {
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]>(SORT_OPTIONS.CVR);
  const [filterStatus, setFilterStatus] = useState<typeof FILTER_OPTIONS[keyof typeof FILTER_OPTIONS]>(FILTER_OPTIONS.ALL);
  const [isMobile, setIsMobile] = useState(false);

  // トレンドアイコン取得
  const getTrendIcon = (trend: Position['trend']) => {
    const className = getTrendIconClass(trend);
    switch (trend) {
      case 'up': 
        return <TrendingUp className={className} />;
      case 'down': 
        return <TrendingDown className={className} />;
      case 'stable': 
        return <Minus className={className} />;
      default:
        return <Minus className={className} />;
    }
  };

  // レスポンシブ検知
  React.useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // ソート・フィルター済みポジション
  const sortedPositions = useMemo(() => {
    if (!data?.positions) return [];
    
    let filtered = data.positions;
    
    // フィルター適用
    if (filterStatus === FILTER_OPTIONS.ACTIVE) {
      filtered = filtered.filter(p => p.status === 'RUNNING');
    }
    
    // ソート適用
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.CVR:
          return b.cvr - a.cvr;
        case SORT_OPTIONS.CPL:
          return a.cpl - b.cpl;
        case SORT_OPTIONS.LEADS:
          return b.totalLeads - a.totalLeads;
        default:
          return 0;
      }
    });
  }, [data?.positions, sortBy, filterStatus]);


  // エラー状態
  if (error) {
    return (
      <div 
        data-testid="trading-dashboard"
        className={cn(commonStyles.cardPadding, commonStyles.bgRed50, commonStyles.borderRed, "rounded-lg")}
      >
        <div className={cn(commonStyles.textError, "mb-4")}>{error}</div>
        <button className={commonStyles.buttonDanger}>
          再試行
        </button>
      </div>
    );
  }

  // 空データ状態
  if (data && data.positions.length === 0) {
    return (
      <div 
        data-testid="trading-dashboard"
        className={cn(commonStyles.cardPadding, commonStyles.flexCenter, "flex-col")}
      >
        <div className={cn(commonStyles.textSecondary, "mb-4")}>まだポジションがありません</div>
        <button className={commonStyles.buttonPrimary}>
          新規ポジション追加
        </button>
      </div>
    );
  }

  return (
    <div 
      data-testid="trading-dashboard"
      className="bg-white rounded-lg shadow overflow-hidden"
    >
      {/* コンパクトヘッダー */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">📊 総リード: {data?.totalLeads || 0} (+{data?.dailyGrowth || 0}/日)</h3>
          </div>
          <button className="p-1 text-gray-500 hover:text-gray-700">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* フィルター・ソート */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">並替:</span>
            <button
              className={cn(
                "px-2 py-1 text-xs rounded",
                sortBy === SORT_OPTIONS.CVR ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              )}
              onClick={() => setSortBy(SORT_OPTIONS.CVR)}
            >
              CVR↓
            </button>
            <button
              className={cn(
                "px-2 py-1 text-xs rounded",
                sortBy === SORT_OPTIONS.CPL ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              )}
              onClick={() => setSortBy(SORT_OPTIONS.CPL)}
            >
              CPL↑
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">フィルター:</span>
            <button
              className={cn(
                "px-2 py-1 text-xs rounded",
                filterStatus === FILTER_OPTIONS.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              )}
              onClick={() => setFilterStatus(filterStatus === FILTER_OPTIONS.ACTIVE ? FILTER_OPTIONS.ALL : FILTER_OPTIONS.ACTIVE)}
            >
              実行中のみ
            </button>
          </div>
        </div>
      </div>

      {/* ポジション一覧 */}
      <div>
        <div 
          role="table" 
          aria-label="LP検証ポジション一覧"
        >
          {/* テーブルヘッダー（デスクトップのみ） */}
          {!isMobile && (
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-8 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>#</div>
                <div>銘柄</div>
                <div>状態</div>
                <div>CVR%</div>
                <div>CPL</div>
                <div>リード</div>
                <div>品質</div>
                <div>判定</div>
              </div>
            </div>
          )}

          {/* ポジション行 */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              // ローディング状態
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              sortedPositions.map((position, index) => (
                <div
                  key={position.id}
                  data-testid="position-row"
                  className={cn(
                    "position-row", 
                    commonStyles.cardPadding, 
                    commonStyles.hoverRow, 
                    commonStyles.focusRing,
                    "border-l-4 border-gray-200"
                  )}
                  style={{
                    borderLeftColor: statusColorMap[position.status]
                  }}
                  onClick={() => onPositionClick?.(position)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onPositionClick?.(position);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  {isMobile ? (
                    // モバイルレイアウト
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getStatusIcon(position.status)}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{position.symbol}</div>
                            <div className="text-sm text-gray-500">
                              CVR: {position.cvr}% {getTrendIcon(position.trend)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex px-2 py-1 text-xs rounded-full ${getGradeColor(position.qualityGrade)}`}>
                            {position.qualityGrade}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>リード: <span className="font-medium">{position.totalLeads}</span></div>
                        <div>CPL: <span className="font-medium">¥{position.cpl}</span></div>
                      </div>
                      
                      <div className={commonStyles.aiComment}>
                        🤖 {position.aiComment}
                      </div>
                    </div>
                  ) : (
                    // デスクトップレイアウト
                    <>
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                        <div className="font-semibold text-gray-900">{position.symbol}</div>
                        <div className="flex items-center gap-2">
                          <span>{getStatusIcon(position.status)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{position.cvr}%</span>
                          {getTrendIcon(position.trend)}
                        </div>
                        <div className="font-medium">¥{position.cpl}</div>
                        <div className="font-medium">{position.totalLeads}</div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getGradeColor(position.qualityGrade)}`}>
                            {position.qualityGrade}
                          </span>
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getActionColor(position.nextAction)}`}>
                            {position.nextAction}
                          </span>
                        </div>
                      </div>
                      
                      <div className={cn("mt-2", commonStyles.aiComment)}>
                        🤖 {position.aiComment}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;