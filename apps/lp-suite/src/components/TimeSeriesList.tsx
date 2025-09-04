// 時系列分析リストコンポーネント
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { TimeSeriesEvent, TimeSeriesListProps } from '@/lib/types';
import { 
  getTrendArrow, 
  getTrendColor, 
  formatDateSeparator, 
  shouldShowDateSeparator,
  isNearBottom 
} from '@/lib/utils';
import { TIME_RANGES, TIME_RANGE_LABELS, SCROLL_THRESHOLD } from '@/lib/constants';
import { commonStyles, cn } from '@/lib/styles';

const TimeSeriesList: React.FC<TimeSeriesListProps> = ({
  sessionId,
  events,
  loading = false,
  error,
  selectedEventId,
  hasMore = false,
  onEventSelect,
  onLoadMore
}) => {
  const [timeRange, setTimeRange] = useState<typeof TIME_RANGES[keyof typeof TIME_RANGES]>(TIME_RANGES.FOUR_HOURS);
  const [isScrolling, setIsScrolling] = useState(false);


  // 無限スクロールのハンドリング
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
    
    if (nearBottom && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  // キーボードナビゲーション
  const handleKeyDown = useCallback((e: React.KeyboardEvent, event: TimeSeriesEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEventSelect?.(event);
    }
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = events.findIndex(evt => evt.id === event.id);
      const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
      
      if (nextIndex >= 0 && nextIndex < events.length) {
        const nextRow = document.querySelector(`[data-testid="event-row-${events[nextIndex].id}"]`) as HTMLElement;
        nextRow?.focus();
      }
    }
  }, [events, onEventSelect]);

  if (error) {
    return (
      <div className={cn(commonStyles.cardPadding, commonStyles.bgRed50, commonStyles.borderRed, "rounded-lg")}>
        <div className={cn(commonStyles.textError, "mb-4")}>{error}</div>
        <button className={commonStyles.buttonDanger}>
          再試行
        </button>
      </div>
    );
  }

  if (events.length === 0 && !loading) {
    return (
      <div className={cn(commonStyles.cardPadding, commonStyles.textCenter, commonStyles.textSecondary)}>
        表示するイベントがありません
      </div>
    );
  }

  return (
    <div className={commonStyles.card}>
      {/* ヘッダー */}
      <div className={cn(commonStyles.bgGray50, commonStyles.cardPadding, commonStyles.borderGray, "border-b")}>
        <div className={commonStyles.flexBetween}>
          <h2 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary)}>
            {sessionId.toUpperCase()} 行動ログ 📊
          </h2>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        {/* 時間範囲フィルター */}
        <div className="flex items-center gap-1 mt-3">
          {Object.values(TIME_RANGES).map((range) => (
            <button
              key={range}
              className={cn(
                "px-3 py-1 text-sm rounded",
                timeRange === range 
                  ? 'bg-blue-500 text-white active' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
              onClick={() => setTimeRange(range)}
            >
              {TIME_RANGE_LABELS[range]}
            </button>
          ))}
        </div>
      </div>

      {/* イベントリスト */}
      <div 
        data-testid="events-list"
        className="max-h-96 overflow-y-auto"
        onScroll={handleScroll}
        role="region"
        aria-label="時系列イベント一覧"
      >
        {loading && events.length === 0 ? (
          // 初期ローディング
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} data-testid="event-skeleton" className={commonStyles.skeleton.base}>
                <div className={cn(commonStyles.skeleton.longLine, "mb-2")}></div>
                <div className={commonStyles.skeleton.shortLine}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event, index) => (
              <React.Fragment key={event.id}>
                {/* 日付区切り */}
                {shouldShowDateSeparator(new Date(event.timestamp), events[index - 1] ? new Date(events[index - 1].timestamp) : null) && (
                  <div 
                    data-testid="date-separator"
                    className="bg-gray-100 px-6 py-2 text-sm text-gray-600 text-center border-t border-gray-300"
                  >
                    ─────────────── {formatDateSeparator(new Date(event.timestamp))} ───────────────
                  </div>
                )}
                
                {/* イベント行 */}
                <div
                  data-testid={`event-row-${event.id}`}
                  className={cn(
                    "event-row",
                    commonStyles.cardPadding,
                    commonStyles.hoverRow,
                    commonStyles.focusRing,
                    selectedEventId === event.id ? cn(commonStyles.selectedRow, "selected") : ''
                  )}
                  onClick={() => onEventSelect?.(event)}
                  onKeyDown={(e) => handleKeyDown(e, event)}
                  tabIndex={0}
                  role="button"
                >
                  {/* イベントヘッダー */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        🕐 {event.time}
                      </span>
                      <span className={cn(commonStyles.textSm, commonStyles.fontMedium, getTrendColor('down'))}>
                        CVR: {event.cvr}% {getTrendArrow('down')}
                      </span>
                      <span className="text-sm text-gray-600">
                        セッション: {event.sessions}
                      </span>
                      <span className="text-sm text-gray-600">
                        CPL: ¥{event.cpl}
                      </span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      詳細 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 最適化・異常情報 */}
                  <div className="space-y-1">
                    {event.optimizations.length > 0 ? (
                      <div className="text-sm text-gray-700">
                        最適化: {event.optimizations[0].description}
                      </div>
                    ) : event.anomalies.length > 0 ? (
                      <div className="text-sm text-red-600">
                        異常: {event.anomalies[0].description}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        最適化: なし
                      </div>
                    )}
                    
                    {/* AIコメント */}
                    <div className={commonStyles.aiComment}>
                      🤖 AI: {event.aiComment}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
            
            {/* 追加読み込み */}
            {loading && events.length > 0 && (
              <div className="p-4 text-center">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-sm text-gray-600">読み込み中...</span>
              </div>
            )}
            
            {/* もっと見るボタン */}
            {hasMore && !loading && (
              <div className="p-4 text-center">
                <button 
                  onClick={onLoadMore}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  もっと見る...
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSeriesList;