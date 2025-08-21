// LP検証システム - 個別ポジションページ
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import TimeSeriesList from '@/components/TimeSeriesList';
import EventDetailModal from '@/components/EventDetailModal';
import { mockTradingData, mockTimeSeriesEvents, mockEventDetails } from '../../../../__mocks__/updated-trading-data';
import { MOCK_ACTION_DELAY } from '@/lib/constants';
import { commonStyles, cn } from '@/lib/styles';

export default function PositionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const positionId = params.id as string;
  
  const [position, setPosition] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  useEffect(() => {
    // IDからポジションを検索
    const foundPosition = mockTradingData.positions.find(p => p.id === positionId);
    if (foundPosition) {
      setPosition(foundPosition);
    } else {
      // ポジションが見つからない場合はダッシュボードへリダイレクト
      router.push('/');
    }
  }, [positionId, router]);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleActionApprove = async (action: any) => {
    console.log('Approved action:', action);
    return new Promise(resolve => setTimeout(resolve, MOCK_ACTION_DELAY));
  };

  // このポジションのイベントのみフィルタリング
  const positionEvents = mockTimeSeriesEvents.filter(event => event.sessionId === positionId);

  if (!position) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", commonStyles.bgGray50)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={cn(commonStyles.textSecondary, "mt-4")}>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", commonStyles.bgGray50)}>
      {/* ページヘッダー */}
      <div className={cn("bg-white shadow-sm border-b", commonStyles.borderGray, commonStyles.cardPadding)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← ダッシュボード
            </Link>
            <div className="text-gray-400">|</div>
            <div>
              <h1 className={cn(commonStyles.text2Xl, commonStyles.fontBold, commonStyles.textPrimary)}>
                {position.symbol} ポジション詳細
              </h1>
              <p className={cn(commonStyles.textSm, commonStyles.textSecondary, "mt-1")}>
                個別ポジション分析・時系列管理
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(commonStyles.cardPadding, commonStyles.spaceY6)}>
        {/* ポジション情報カード */}
        <section className={cn(commonStyles.card)}>
          <div className={cn(commonStyles.cardPadding)}>
            <h2 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>
              📊 ポジション概要
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">CVR</div>
                <div className="text-2xl font-bold text-green-600">{position.cvr}%</div>
                <div className="text-xs text-gray-500 mt-1">前日比 {((position.cvr - position.previousCvr) / position.previousCvr * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">CPL</div>
                <div className="text-2xl font-bold">¥{position.cpl}</div>
                <div className="text-xs text-gray-500 mt-1">コスト状況</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">リード数</div>
                <div className="text-2xl font-bold">{position.totalLeads}</div>
                <div className="text-xs text-gray-500 mt-1">総リード数</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">品質</div>
                <div className="text-2xl font-bold text-blue-600">{position.qualityGrade}</div>
                <div className="text-xs text-gray-500 mt-1">スコア: {position.validationScore}/100</div>
              </div>
            </div>
            
            {/* AI分析コメント */}
            <div className={cn("mt-6 p-4 rounded", commonStyles.bgPurple50)}>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-800 mb-1">AI分析</div>
                  <div className="text-sm text-purple-700">{position.aiComment}</div>
                </div>
              </div>
            </div>

            {/* トレンド情報 */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">トレンド</div>
                <div className={cn("text-sm font-semibold", 
                  position.trend === 'UP' ? 'text-green-600' : 
                  position.trend === 'DOWN' ? 'text-red-600' : 
                  'text-gray-600'
                )}>
                  {position.trend === 'UP' ? '上昇傾向 ↑' : 
                   position.trend === 'DOWN' ? '下降傾向 ↓' : 
                   '横ばい →'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">ステータス</div>
                <div className={cn("text-sm font-semibold",
                  position.status === 'RUNNING' ? 'text-green-600' :
                  position.status === 'OPTIMIZING' ? 'text-yellow-600' :
                  position.status === 'CLOSED' ? 'text-red-600' :
                  'text-gray-600'
                )}>
                  {position.status === 'RUNNING' ? '稼働中' :
                   position.status === 'OPTIMIZING' ? '最適化中' :
                   position.status === 'CLOSED' ? '停止' :
                   '監視中'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">最終更新</div>
                <div className="text-sm font-semibold text-gray-700">
                  {position.openDate ? new Date(position.openDate).toLocaleDateString('ja-JP') : '未設定'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 時系列イベント分析 */}
        <section>
          <h2 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>
            ⏰ 時系列イベント分析
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* イベントリスト */}
            <TimeSeriesList
              sessionId={positionId}
              events={positionEvents}
              selectedEventId={selectedEvent?.id}
              onEventSelect={handleEventSelect}
              hasMore={false}
              onLoadMore={() => console.log('Load more events')}
            />
            
            {/* ユーザーフロー分析 */}
            <div className={cn(commonStyles.card, commonStyles.cardPadding)}>
              <h3 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>
                👥 ユーザー行動フロー（本日）
              </h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">エントリー → 興味 → 検討 → アクション</div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Google広告</span>
                    <div className="text-right">
                      <div className="font-semibold">1,247</div>
                      <div className="text-sm text-gray-600">100%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-gray-400">
                    ↓ -58 (離脱4.7%)
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>ヒーロー</span>
                    <div className="text-right">
                      <div className="font-semibold">1,189</div>
                      <div className="text-sm text-gray-600">95.3%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-red-500">
                    ↓ -297 (離脱23.8%)
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>価値提案</span>
                    <div className="text-right">
                      <div className="font-semibold">892</div>
                      <div className="text-sm text-gray-600">71.5%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-red-500">
                    ↓ -471 (離脱37.8%)
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span>フォーム</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">421</div>
                      <div className="text-sm text-green-600">33.7%</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="text-sm font-medium text-yellow-800">📍 主要離脱ポイント:</div>
                  <div className="text-sm text-yellow-700 mt-1">
                    1. 価値提案セクション (297人/23.8%)<br />
                    2. フォーム入力画面 (471人/37.8%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* パフォーマンスサマリー */}
        <section className={cn(commonStyles.card, commonStyles.cardPadding)}>
          <h3 className={cn(commonStyles.textLg, commonStyles.fontSemibold, commonStyles.textPrimary, "mb-4")}>
            📈 パフォーマンスサマリー
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 rounded">
              <div className="text-xs text-green-700 mb-1">本日のCVR改善</div>
              <div className="text-lg font-bold text-green-700">+2.3%</div>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-xs text-blue-700 mb-1">週間平均CVR</div>
              <div className="text-lg font-bold text-blue-700">8.5%</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-xs text-purple-700 mb-1">月間リード数</div>
              <div className="text-lg font-bold text-purple-700">12,847</div>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <div className="text-xs text-orange-700 mb-1">ROI</div>
              <div className="text-lg font-bold text-orange-700">247%</div>
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