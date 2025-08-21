// LP検証システム - ダッシュボード（全ポジション・全イベント表示）
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TradingDashboard from '@/components/TradingDashboard';
import TimeSeriesList from '@/components/TimeSeriesList';
import EventDetailModal from '@/components/EventDetailModal';
import { mockTradingData, mockTimeSeriesEvents, mockEventDetails } from '../../__mocks__/updated-trading-data';
import { MOCK_ACTION_DELAY } from '@/lib/constants';
import { commonStyles, cn } from '@/lib/styles';

export default function LPValidationDashboard() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const handlePositionClick = (position: any) => {
    console.log('Navigating to position:', position);
    // 個別ポジションページへ遷移
    router.push(`/position/${position.id}`);
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleActionApprove = async (action: any) => {
    console.log('Approved action:', action);
    return new Promise(resolve => setTimeout(resolve, MOCK_ACTION_DELAY));
  };

  return (
    <div className={cn("min-h-screen", commonStyles.bgGray50)}>
      {/* ページヘッダー */}
      <div className={cn("bg-white shadow-sm border-b", commonStyles.borderGray, commonStyles.cardPadding)}>
        <h1 className={cn(commonStyles.text2Xl, commonStyles.fontBold, commonStyles.textPrimary)}>LP検証システム ダッシュボード</h1>
        <p className={cn(commonStyles.textSm, commonStyles.textSecondary, "mt-1")}>全ポジション統合管理・リアルタイム分析</p>
      </div>

      <div className={cn(commonStyles.cardPadding, commonStyles.spaceY6)}>
        {/* メインダッシュボード */}
        <section>
          <h2 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>📊 ポジション管理</h2>
          <p className={cn(commonStyles.textSm, commonStyles.textSecondary, "mb-4")}>
            ポジションをクリックすると、個別の詳細ページへ移動します
          </p>
          <TradingDashboard 
            data={mockTradingData}
            onPositionClick={handlePositionClick}
          />
        </section>

        {/* 全ポジションの時系列イベント一覧 */}
        <section>
          <h2 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>
            ⏰ 全ポジション時系列イベント
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 全イベントリスト */}
            <div>
              <div className={cn("mb-3 p-3 rounded", commonStyles.bgBlue50)}>
                <p className={cn(commonStyles.textSm, "text-blue-700")}>
                  📋 全ポジションのイベントを時系列で表示しています
                </p>
              </div>
              <TimeSeriesList
                sessionId="all"
                events={mockTimeSeriesEvents}
                selectedEventId={selectedEvent?.id}
                onEventSelect={handleEventSelect}
                hasMore={false}
                onLoadMore={() => console.log('Load more events')}
              />
            </div>
            
            {/* サマリー統計 */}
            <div className={cn(commonStyles.card, commonStyles.cardPadding)}>
              <h3 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>📊 全体統計サマリー</h3>
              
              {/* 本日のパフォーマンス */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">本日のパフォーマンス</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-xs text-green-700 mb-1">総CVR</div>
                    <div className="text-xl font-bold text-green-700">7.8%</div>
                    <div className="text-xs text-green-600">前日比 +0.3%</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-xs text-blue-700 mb-1">総リード数</div>
                    <div className="text-xl font-bold text-blue-700">2,847</div>
                    <div className="text-xs text-blue-600">前日比 +127</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-xs text-purple-700 mb-1">平均CPL</div>
                    <div className="text-xl font-bold text-purple-700">¥1,234</div>
                    <div className="text-xs text-purple-600">前日比 -¥56</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <div className="text-xs text-orange-700 mb-1">総広告費</div>
                    <div className="text-xl font-bold text-orange-700">¥3.5M</div>
                    <div className="text-xs text-orange-600">予算進捗 68%</div>
                  </div>
                </div>
              </div>
              
              {/* イベント種別分布 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">イベント種別分布（24時間）</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">🎯 CVR改善</span>
                    <span className="text-sm font-medium">45件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">⚠️ 異常検知</span>
                    <span className="text-sm font-medium">12件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">👥 ユーザー行動</span>
                    <span className="text-sm font-medium">89件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">💰 コスト最適化</span>
                    <span className="text-sm font-medium">23件</span>
                  </div>
                </div>
              </div>
              
              {/* アクティブなアラート */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">🚨 アクティブなアラート</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <div className="text-xs font-medium text-red-700">重要</div>
                    <div className="text-sm text-red-600">Gemini AIのCVRが3%以下に低下</div>
                  </div>
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-xs font-medium text-yellow-700">警告</div>
                    <div className="text-sm text-yellow-600">Claude LPのCPLが目標値を20%超過</div>
                  </div>
                </div>
              </div>
              
              {/* クイックアクション */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">⚡ クイックアクション</h4>
                <div className="space-y-2">
                  <button className="w-full p-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    全ポジションの日次レポート生成
                  </button>
                  <button className="w-full p-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    アラート設定を確認
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* イベント詳細モーダル */}
      <EventDetailModal
        isOpen={showEventDetail}
        eventId={selectedEvent?.id || ''}
        details={mockEventDetails}
        onClose={() => setShowEventDetail(false)}
        onActionApprove={handleActionApprove}
      />
    </div>
  );
}