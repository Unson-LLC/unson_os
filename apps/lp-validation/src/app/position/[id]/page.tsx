// LP検証システム - ポジション詳細
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, RefreshCw, 
  Calendar, Users, Target, AlertTriangle, Brain, ChevronDown, 
  ExternalLink, Sparkles, Activity 
} from 'lucide-react';

export default function PositionDetailPage() {
  const params = useParams();
  const [activeTimeRange, setActiveTimeRange] = useState('4h');
  
  // ポジションIDに基づいて異なるデータを表示（実際はAPIから取得）
  const positionId = params.id as string;
  const positionMap: any = {
    'ai-coach-001': {
      name: "AI-COACH",
      cvr: 15.2,
      cvrPrevious: 12.6,
      cpl: 180,
      leads: 125,
      grade: "A+",
      gradeNote: "スコア: 92/100",
      aiRecommendation: "MVP移行を強く推奨、全指標が目標を上回る",
      status: "active",
      trend: "up"
    },
    'ai-writer-001': {
      name: "AI-WRITER",
      cvr: 12.8,
      cvrPrevious: 11.2,
      cpl: 220,
      leads: 89,
      grade: "A",
      gradeNote: "スコア: 85/100",
      aiRecommendation: "ユーザーインタビュー実施タイミング、安定成長中",
      status: "active",
      trend: "up"
    },
    'ai-bridge-001': {
      name: "AI-BRIDGE",
      cvr: 8.2,
      cvrPrevious: 9.1,
      cpl: 380,
      leads: 45,
      grade: "B",
      gradeNote: "スコア: 68/100",
      aiRecommendation: "価値提案の見直し必要、競合分析推奨",
      status: "warning",
      trend: "down"
    },
    'ai-stylist-001': {
      name: "AI-STYLIST",
      cvr: 3.4,
      cvrPrevious: 5.2,
      cpl: 850,
      leads: 12,
      grade: "D",
      gradeNote: "スコア: 35/100",
      aiRecommendation: "ピボット or 終了検討、市場適合性低い",
      status: "danger",
      trend: "down"
    }
  };

  const positionData = positionMap[positionId] || positionMap['ai-coach-001'];
  
  const actionLogs = [
    {
      time: "15:30",
      cvr: positionData.cvr,
      sessions: 89,
      cpl: positionData.cpl,
      optimization: `最適化: キーワード3件削除 → CPL-¥25`,
      ai: "AI: 最適化改善項目登録済み、トレンド継続調査"
    },
    {
      time: "11:30",
      cvr: positionData.cvrPrevious,
      sessions: 156,
      cpl: positionData.cpl + 25,
      optimization: "最適化: 入札調整実行",
      ai: "AI: 競合影響の可能性大、価格訴求強化を推奨"
    },
    {
      time: "08:15",
      cvr: positionData.cvrPrevious - 0.5,
      sessions: 203,
      cpl: positionData.cpl + 40,
      optimization: "最適化: 広告文A/Bテスト開始",
      ai: "AI: クリック率改善の兆候あり、継続観察"
    }
  ];

  const userFlow = [
    {
      stage: "Google広告",
      count: 1247,
      percentage: 100,
      change: -58,
      changePercentage: -4.7
    },
    {
      stage: "ヒーロー",
      count: 1189,
      percentage: 95.3,
      change: -297,
      changePercentage: -23.8
    },
    {
      stage: "価値提案",
      count: 892,
      percentage: 71.5,
      change: -471,
      changePercentage: -37.8
    },
    {
      stage: "フォーム",
      count: 421,
      percentage: 33.7,
      change: null,
      changePercentage: null,
      isConversion: true
    }
  ];

  const performanceSummary = [
    {
      title: "本日のCVR改善",
      value: "+2.3%",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "週間平均CVR",
      value: "8.5%",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "月間リード数",
      value: "12,847",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "ROI",
      value: "247%",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeStyle = (grade: string) => {
    switch(grade) {
      case 'A+': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
      case 'A': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'B': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-gradient-to-r from-rose-50 to-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ダッシュボード
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {positionData.name} ポジション詳細
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  個別ポジション分析・時系列管理
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-200 rounded-lg hover:border-gray-300">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ポジション概要 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                ポジション概要
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* CVR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CVR</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{positionData.cvr}%</div>
                <div className="text-xs text-gray-500">前日比: {positionData.cvrPrevious}%</div>
              </div>

              {/* CPL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPL</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">¥{positionData.cpl}</div>
                <div className="text-xs text-gray-500">コスト良好</div>
              </div>

              {/* リード数 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">リード数</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{positionData.leads}</div>
                <div className="text-xs text-gray-500">累計リード数</div>
              </div>

              {/* 品質 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">品質</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{positionData.grade}</div>
                <div className="text-xs text-gray-500">{positionData.gradeNote}</div>
              </div>
            </div>

            {/* AI分析 */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-blue-900 mb-1">AI分析</div>
                  <div className="text-sm text-blue-800">{positionData.aiRecommendation}</div>
                </div>
              </div>
            </div>

            {/* ステータス情報 */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">トレンド</div>
                <div className="flex items-center justify-center text-green-600 font-medium">
                  {positionData.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      順調↑
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                      <span className="text-red-600">下降↓</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">ステータス</div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  positionData.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                  positionData.status === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-red-100 text-red-800 border-red-200'
                } border`}>
                  {positionData.status === 'active' ? '稼働中' :
                   positionData.status === 'warning' ? '要注意' : '危険'}
                </span>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">最終更新</div>
                <div className="text-sm font-medium text-gray-900">2025/8/22</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 時系列イベント分析 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      時系列イベント分析
                    </h2>
                  </div>
                  <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                {/* 時間範囲タブ */}
                <div className="flex items-center space-x-2 mb-6">
                  {['4時間', '1日', '1週間'].map((range, index) => {
                    const value = ['4h', '1d', '1w'][index];
                    return (
                      <button
                        key={range}
                        onClick={() => setActiveTimeRange(value)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${
                          activeTimeRange === value 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>

                {/* イベントログ */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    {positionData.name}-001 イベントログ
                    <BarChart3 className="w-4 h-4 ml-2 text-gray-400" />
                  </h3>
                  
                  {actionLogs.map((log, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {log.time}
                          </div>
                          <div className="text-green-600 font-medium">CVR: {log.cvr}%</div>
                          <div className="text-gray-600">セッション: {log.sessions}</div>
                          <div className="text-gray-600">CPL: ¥{log.cpl}</div>
                        </div>
                        <Link href={`/event/${index + 1}`}>
                          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center">
                            詳細
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </button>
                        </Link>
                      </div>
                      <div className="text-sm text-gray-800 mb-1">{log.optimization}</div>
                      <div className="flex items-start text-sm text-blue-700">
                        <Brain className="w-3 h-3 mr-1 mt-0.5 text-blue-600" />
                        {log.ai}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* ユーザー行動フロー */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ユーザー行動フロー（本日）
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">エントリー → 興味 → 検討 → アクション</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userFlow.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{stage.stage}</div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{stage.count.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{stage.percentage}%</div>
                        </div>
                      </div>
                      {stage.change !== null && (
                        <div className="flex items-center text-sm text-red-600">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {stage.change} (前回比{stage.changePercentage}%)
                        </div>
                      )}
                      {index < userFlow.length - 1 && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                          <div 
                            className={`h-1 rounded-full ${stage.isConversion ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* フロー分析インサイト */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800 mb-1">主要脱落ポイント</div>
                      <div className="text-yellow-700">
                        1. 価値提案セクション (297人/23.8%)<br />
                        2. フォーム入力画面 (471人/37.8%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* パフォーマンスサマリー */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    パフォーマンスサマリー
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {performanceSummary.map((metric, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${metric.bgColor} border-gray-200`}
                    >
                      <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}