// LP検証システム - イベント詳細
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Clock, Target, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle, XCircle, Brain, Activity,
  BarChart3, Users, DollarSign, Zap
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  // モックデータ（実際にはAPIから取得）
  const eventData = {
    id: eventId,
    time: '15:30',
    date: '2025/08/22',
    sessionId: 'ai-coach-001',
    positionName: 'AI-COACH',
    type: 'optimization',
    status: 'completed',
    metrics: {
      cvr: 15.2,
      previousCvr: 12.8,
      sessions: 89,
      cpl: 180,
      previousCpl: 205,
      leads: 15,
      revenue: 2700
    },
    optimization: {
      action: 'キーワード最適化',
      description: 'キーワード3件削除',
      impact: 'CPL-¥25',
      keywords: ['AIツール 料金', 'AI 無料 ツール', 'チャットボット 安い']
    },
    aiAnalysis: {
      summary: '最適化効果期待通り、トレンド継続推奨',
      confidence: 92,
      suggestions: [
        '競合の入札強化を検知、上限入札額の調整を推奨',
        'CTRが改善傾向、広告文のA/Bテスト継続推奨',
        '時間帯別パフォーマンスに基づく配信スケジュール最適化'
      ],
      risks: [
        'クリック単価の上昇傾向（+8%）',
        '競合の新規参入による影響の可能性'
      ]
    },
    userFlow: {
      entry: 89,
      hero: 84,
      value: 67,
      form: 15
    },
    timeline: [
      { time: '15:25', action: 'AI分析開始', status: 'completed' },
      { time: '15:27', action: '最適化案生成', status: 'completed' },
      { time: '15:28', action: '承認待ち', status: 'completed' },
      { time: '15:30', action: '実行完了', status: 'completed' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/position/${eventData.sessionId}`}>
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ポジション詳細へ戻る
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  イベント詳細
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {eventData.positionName} - {eventData.date} {eventData.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* イベント概要 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <Activity className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  イベント概要
                </h2>
              </div>
              {getStatusIcon(eventData.status)}
            </div>
          </div>
          <div className="p-6">
            {/* メトリクス */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">CVR</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">{eventData.metrics.cvr}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  前回: {eventData.metrics.previousCvr}% (+{(eventData.metrics.cvr - eventData.metrics.previousCvr).toFixed(1)}%)
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">CPL</span>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">¥{eventData.metrics.cpl}</div>
                <div className="text-xs text-gray-500 mt-1">
                  前回: ¥{eventData.metrics.previousCpl} (-¥{eventData.metrics.previousCpl - eventData.metrics.cpl})
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">リード数</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{eventData.metrics.leads}</div>
                <div className="text-xs text-gray-500 mt-1">
                  セッション数: {eventData.metrics.sessions}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">収益</span>
                  <DollarSign className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">¥{eventData.metrics.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">
                  ROI: {((eventData.metrics.revenue / (eventData.metrics.cpl * eventData.metrics.leads)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* 最適化内容 */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-blue-900 mb-1">実行された最適化</div>
                  <div className="text-sm text-blue-800 mb-2">
                    {eventData.optimization.action}: {eventData.optimization.description}
                  </div>
                  <div className="text-sm text-blue-700">
                    影響: {eventData.optimization.impact}
                  </div>
                  {eventData.optimization.keywords && (
                    <div className="mt-3">
                      <div className="text-xs text-blue-700 mb-1">削除されたキーワード:</div>
                      <div className="flex flex-wrap gap-2">
                        {eventData.optimization.keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-white text-blue-700 rounded border border-blue-300">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* タイムライン */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-600" />
                実行タイムライン
              </h3>
              <div className="space-y-2">
                {eventData.timeline.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    {getStatusIcon(item.status)}
                    <span className="text-gray-600">{item.time}</span>
                    <span className="font-medium text-gray-900">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI分析結果 */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    AI分析結果
                  </h2>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  信頼度: {eventData.aiAnalysis.confidence}%
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-800">{eventData.aiAnalysis.summary}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">推奨アクション</h4>
                  <ul className="space-y-2">
                    {eventData.aiAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">注意事項</h4>
                  <ul className="space-y-2">
                    {eventData.aiAnalysis.risks.map((risk, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ユーザーフロー分析 */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  ユーザーフロー（イベント時点）
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">エントリー</span>
                  <div className="text-right">
                    <div className="font-bold">{eventData.userFlow.entry}</div>
                    <div className="text-xs text-gray-500">100%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-gray-400">
                  ↓ -{eventData.userFlow.entry - eventData.userFlow.hero} (離脱{((1 - eventData.userFlow.hero/eventData.userFlow.entry) * 100).toFixed(1)}%)
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">ヒーロー</span>
                  <div className="text-right">
                    <div className="font-bold">{eventData.userFlow.hero}</div>
                    <div className="text-xs text-gray-500">{(eventData.userFlow.hero/eventData.userFlow.entry * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-red-500">
                  ↓ -{eventData.userFlow.hero - eventData.userFlow.value} (離脱{((1 - eventData.userFlow.value/eventData.userFlow.hero) * 100).toFixed(1)}%)
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">価値提案</span>
                  <div className="text-right">
                    <div className="font-bold">{eventData.userFlow.value}</div>
                    <div className="text-xs text-gray-500">{(eventData.userFlow.value/eventData.userFlow.entry * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-red-500">
                  ↓ -{eventData.userFlow.value - eventData.userFlow.form} (離脱{((1 - eventData.userFlow.form/eventData.userFlow.value) * 100).toFixed(1)}%)
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                  <span className="font-medium text-green-700">コンバージョン</span>
                  <div className="text-right">
                    <div className="font-bold text-green-700">{eventData.userFlow.form}</div>
                    <div className="text-xs text-green-600">CVR: {(eventData.userFlow.form/eventData.userFlow.entry * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>分析:</strong> 価値提案セクションでの離脱が最も多く、改善の余地があります。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}