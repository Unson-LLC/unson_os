import React, { useState } from 'react'

// 統合ダッシュボードの状態定義
interface SaaSStatus {
  id: string
  name: string
  phase: 'LP検証' | 'MVP開発' | '収益化' | 'スケール' | 'サンセット'
  currentAction: 'gate_waiting' | 'pkg_running' | 'monitoring' | 'optimizing' | 'crisis'
  priority: 'critical' | 'high' | 'medium' | 'low'
  
  // リアルタイム指標
  metrics: {
    mrr: number
    dau: number
    cvr: number
    trend: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
  }
  
  // アクション情報
  actionInfo: {
    type: 'gate_decision' | 'pkg_execution' | 'ad_optimization' | 'crisis_management'
    description: string
    progress?: number
    deadline?: string
    confidence?: number
  }
}

// コマンドセンター全体状況
interface CommandCenterState {
  portfolio: {
    totalMRR: number
    activeSaaS: number
    criticalCount: number
    newOpportunities: number
  }
  
  todaysDecisions: {
    gateWaiting: number
    pkgRunning: number
    alertsCount: number
    successCount: number
  }
  
  revenue: {
    thisMonth: number
    daoShare: number
    operatingShare: number
    growth: number
  }
  
  emergencyQueue: SaaSStatus[]
  growthOpportunities: SaaSStatus[]
  activeOperations: SaaSStatus[]
}

// モックデータ
const mockCommandState: CommandCenterState = {
  portfolio: {
    totalMRR: 2400000,
    activeSaaS: 45,
    criticalCount: 3,
    newOpportunities: 7
  },
  
  todaysDecisions: {
    gateWaiting: 3,
    pkgRunning: 7,
    alertsCount: 5,
    successCount: 12
  },
  
  revenue: {
    thisMonth: 480000,
    daoShare: 192000,
    operatingShare: 288000,
    growth: 18.5
  },
  
  emergencyQueue: [
    {
      id: 'emer-1',
      name: '猫カフェ予約',
      phase: '収益化',
      currentAction: 'crisis',
      priority: 'critical',
      metrics: { mrr: 38000, dau: 115, cvr: 6.5, trend: '⬇️' },
      actionInfo: {
        type: 'crisis_management',
        description: 'pkg_crisis_recovery実行中（35%完了）',
        progress: 35,
        deadline: '2025-01-18'
      }
    },
    {
      id: 'emer-2',
      name: '在庫管理Pro',
      phase: 'サンセット',
      currentAction: 'gate_waiting',
      priority: 'high',
      metrics: { mrr: 8500, dau: 8, cvr: 3.6, trend: '⬇️' },
      actionInfo: {
        type: 'gate_decision',
        description: 'サンセット最終判定（7日後実行予定）',
        deadline: '2025-01-22'
      }
    },
    {
      id: 'emer-3',
      name: '日報アプリ',
      phase: 'サンセット',
      currentAction: 'monitoring',
      priority: 'medium',
      metrics: { mrr: 12000, dau: 10, cvr: 0.9, trend: '↘️' },
      actionInfo: {
        type: 'crisis_management',
        description: '延命可能性評価中',
        progress: 60,
        deadline: '2025-01-25'
      }
    }
  ],
  
  growthOpportunities: [
    {
      id: 'growth-1',
      name: 'AI議事録作成',
      phase: 'LP検証',
      currentAction: 'gate_waiting',
      priority: 'critical',
      metrics: { mrr: 0, dau: 45, cvr: 18.0, trend: '⬆️' },
      actionInfo: {
        type: 'gate_decision',
        description: 'MVP開発開始判定（CVR 18%で推奨）',
        confidence: 92,
        deadline: '2025-01-16'
      }
    },
    {
      id: 'growth-2',
      name: '契約書チェッカー',
      phase: 'LP検証',
      currentAction: 'optimizing',
      priority: 'medium',
      metrics: { mrr: 0, dau: 28, cvr: 7.9, trend: '→' },
      actionInfo: {
        type: 'ad_optimization',
        description: 'LP最適化実行中（CVR改善目標: 12%）',
        progress: 40,
        deadline: '2025-01-20'
      }
    },
    {
      id: 'growth-3',
      name: '家計簿アプリ',
      phase: '収益化',
      currentAction: 'pkg_running',
      priority: 'high',
      metrics: { mrr: 250000, dau: 450, cvr: 15.2, trend: '⬆️' },
      actionInfo: {
        type: 'pkg_execution',
        description: 'pkg_aggressive_scale実行中（78%完了）',
        progress: 78,
        deadline: '2025-01-17'
      }
    }
  ],
  
  activeOperations: [
    {
      id: 'active-1',
      name: 'ペット管理',
      phase: '収益化',
      currentAction: 'monitoring',
      priority: 'low',
      metrics: { mrr: 78000, dau: 234, cvr: 11.3, trend: '↗️' },
      actionInfo: {
        type: 'pkg_execution',
        description: 'pkg_standard_growth継続中',
        progress: 100
      }
    }
  ]
}

interface CommandCenterProps {
  onDrillDown?: (view: 'data' | 'strategy' | 'portfolio', context?: any) => void
  onTakeAction?: (saasId: string, action: string) => void
}

export function CommandCenter({ onDrillDown, onTakeAction }: CommandCenterProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'gate_decision': return '🚪'
      case 'pkg_execution': return '📦'
      case 'ad_optimization': return '📢'
      case 'crisis_management': return '🚨'
      default: return '⚙️'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'LP検証': return 'bg-blue-100 text-blue-800'
      case 'MVP開発': return 'bg-purple-100 text-purple-800'
      case '収益化': return 'bg-green-100 text-green-800'
      case 'スケール': return 'bg-indigo-100 text-indigo-800'
      case 'サンセット': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* ヘッダー - コマンドセンタータイトル */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎯 UnsonOS コマンドセンター</h1>
          <p className="text-gray-600 mt-1">100-200個のSaaS自動運営統合画面</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTimeframe('today')}
            className={`px-4 py-2 rounded ${selectedTimeframe === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            今日
          </button>
          <button
            onClick={() => setSelectedTimeframe('week')}
            className={`px-4 py-2 rounded ${selectedTimeframe === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            今週
          </button>
          <button
            onClick={() => setSelectedTimeframe('month')}
            className={`px-4 py-2 rounded ${selectedTimeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            今月
          </button>
        </div>
      </div>

      {/* レベル1: 統合概要ダッシュボード */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ポートフォリオ概要 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">📊</span>
            ポートフォリオ概要
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">総MRR</span>
              <button
                onClick={() => onDrillDown?.('portfolio', { metric: 'mrr' })}
                className="text-2xl font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded"
              >
                ¥{(mockCommandState.portfolio.totalMRR / 1000000).toFixed(1)}M
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">アクティブSaaS</span>
              <button
                onClick={() => onDrillDown?.('portfolio', { view: 'active' })}
                className="text-xl font-bold hover:bg-gray-50 px-2 py-1 rounded"
              >
                {mockCommandState.portfolio.activeSaaS}個
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">危険状態</span>
              <button
                onClick={() => onDrillDown?.('portfolio', { view: 'critical' })}
                className="text-xl font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                {mockCommandState.portfolio.criticalCount}個
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">新規機会</span>
              <span className="text-xl font-bold text-blue-600">{mockCommandState.portfolio.newOpportunities}個</span>
            </div>
          </div>
        </div>

        {/* 今日の意思決定 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">🎯</span>
            今日の意思決定
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GATE待ち</span>
              <button
                onClick={() => onDrillDown?.('strategy', { view: 'gate_queue' })}
                className="text-xl font-bold text-orange-600 hover:bg-orange-50 px-2 py-1 rounded"
              >
                {mockCommandState.todaysDecisions.gateWaiting}件
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PKG実行中</span>
              <button
                onClick={() => onDrillDown?.('strategy', { view: 'pkg_running' })}
                className="text-xl font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
              >
                {mockCommandState.todaysDecisions.pkgRunning}件
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">要注意</span>
              <button
                onClick={() => onDrillDown?.('data', { view: 'alerts' })}
                className="text-xl font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                {mockCommandState.todaysDecisions.alertsCount}件
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">成功実行</span>
              <span className="text-xl font-bold text-green-600">{mockCommandState.todaysDecisions.successCount}件</span>
            </div>
          </div>
        </div>

        {/* 収益分配 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">💰</span>
            収益分配
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">今月収益</span>
              <button
                onClick={() => onDrillDown?.('portfolio', { view: 'revenue' })}
                className="text-xl font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded"
              >
                ¥{(mockCommandState.revenue.thisMonth / 1000).toFixed(0)}K
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">DAO (40%)</span>
              <span className="text-lg font-bold text-blue-600">¥{(mockCommandState.revenue.daoShare / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">運営 (60%)</span>
              <span className="text-lg font-bold">¥{(mockCommandState.revenue.operatingShare / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">成長率</span>
              <span className="text-lg font-bold text-green-600">+{mockCommandState.revenue.growth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* メイン操作エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 緊急対応キュー */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">🔥</span>
              緊急対応キュー
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {mockCommandState.emergencyQueue.map(saas => (
              <div key={saas.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(saas.priority)}`} />
                    <span className="font-medium">{saas.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getPhaseColor(saas.phase)}`}>
                      {saas.phase}
                    </span>
                  </div>
                  <span className="text-2xl">{saas.metrics.trend}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <span className={getActionIcon(saas.actionInfo.type)}></span>
                  <span className="ml-1">{saas.actionInfo.description}</span>
                </div>
                
                {saas.actionInfo.progress && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${saas.actionInfo.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {saas.actionInfo.progress}% 完了
                      {saas.actionInfo.deadline && ` • 期限: ${saas.actionInfo.deadline}`}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onTakeAction?.(saas.id, 'detail')}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
                  >
                    詳細
                  </button>
                  <button
                    onClick={() => onTakeAction?.(saas.id, 'deep-analysis')}
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-700"
                  >
                    📋 詳しく見る
                  </button>
                  <button
                    onClick={() => onDrillDown?.('data', { saas: saas.name, metric: 'all' })}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    📊 データ
                  </button>
                  <button
                    onClick={() => onTakeAction?.(saas.id, 'action')}
                    className="text-xs px-3 py-1 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    🚀 実行
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成長機会パイプライン */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">🚀</span>
              成長機会パイプライン
            </h3>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {mockCommandState.growthOpportunities.map(saas => (
              <div key={saas.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(saas.priority)}`} />
                    <span className="font-medium">{saas.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getPhaseColor(saas.phase)}`}>
                      {saas.phase}
                    </span>
                  </div>
                  <span className="text-2xl">{saas.metrics.trend}</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <span className={getActionIcon(saas.actionInfo.type)}></span>
                  <span className="ml-1">{saas.actionInfo.description}</span>
                  {saas.actionInfo.confidence && (
                    <span className="ml-2 text-green-600 font-medium">
                      (信頼度: {saas.actionInfo.confidence}%)
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold">¥{(saas.metrics.mrr / 1000).toFixed(0)}K</div>
                    <div className="text-gray-500">MRR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{saas.metrics.dau}</div>
                    <div className="text-gray-500">DAU</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      saas.metrics.cvr >= 15 ? 'text-green-600' :
                      saas.metrics.cvr >= 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {saas.metrics.cvr.toFixed(1)}%
                    </div>
                    <div className="text-gray-500">CVR</div>
                  </div>
                </div>
                
                {saas.actionInfo.progress && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${saas.actionInfo.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {saas.actionInfo.progress}% 完了
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDrillDown?.('strategy', { saas: saas.name, action: 'gate' })}
                    className="text-xs px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded hover:bg-green-200 dark:hover:bg-green-700"
                  >
                    🚪 GATE判断
                  </button>
                  <button
                    onClick={() => onTakeAction?.(saas.id, 'deep-analysis')}
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded hover:bg-purple-200 dark:hover:bg-purple-700"
                  >
                    📋 詳しく見る
                  </button>
                  <button
                    onClick={() => onDrillDown?.('data', { saas: saas.name, metric: 'cvr' })}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-700"
                  >
                    📊 広告データ
                  </button>
                  <button
                    onClick={() => onTakeAction?.(saas.id, 'execute')}
                    className="text-xs px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded hover:bg-orange-200 dark:hover:bg-orange-700"
                  >
                    🚀 実行
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* RAG推奨セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* RAGによる類似ケース推奨 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">🤖</span>
            RAG推奨（類似ケースから学習）
          </h3>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-indigo-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">AI議事録のMVP開始を推奨</span>
                  <div className="text-xs text-gray-600 mt-1">
                    類似ケース: 「AI翻訳サービス」 CVR 18% → MVP成功
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                  信頼度 92%
                </span>
              </div>
              <div className="text-xs text-gray-700">
                💡 根拠: LP検証CVR 18%超えパターンでの成功率は89%
              </div>
              <button className="mt-2 text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                詳細を見る
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-indigo-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">猫カフェ予約のリテンション戦略</span>
                  <div className="text-xs text-gray-600 mt-1">
                    類似ケース: 「ペットサロン予約」 チャーン率改善
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                  信頼度 78%
                </span>
              </div>
              <div className="text-xs text-gray-700">
                💡 提案: プッシュ通知最適化、ロイヤリティプログラム
              </div>
              <button className="mt-2 text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                適用する
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-indigo-200 text-xs text-indigo-700">
            📚 CaseBook: 2,847件の事例から学習 | Vector DB活用
          </div>
        </div>
        
        {/* 現在の状況サマリー */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">📈</span>
            現在のポートフォリオ状況
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12件</div>
              <div className="text-xs text-gray-600">順調な成長</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">8件</div>
              <div className="text-xs text-gray-600">改善余地あり</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3件</div>
              <div className="text-xs text-gray-600">危険状態</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7件</div>
              <div className="text-xs text-gray-600">新規機会</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">今日のGATE判定</span>
              <span className="font-medium">3件待機中</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">実行中PKG</span>
              <span className="font-medium">7件進行中</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">予測精度</span>
              <span className="font-medium text-green-600">82.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* クイックアクションバー */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">🎯 推奨アクション</h3>
            <p className="text-blue-100 text-sm">AIが分析した優先度の高いアクション</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onTakeAction?.('ai_decision_1', 'gate')}
              className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              🚪 AI議事録のMVP開始
            </button>
            <button
              onClick={() => onTakeAction?.('ai_decision_2', 'crisis')}
              className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              🚨 猫カフェ危機対応
            </button>
            <button
              onClick={() => onDrillDown?.('strategy', { view: 'ai_recommendations' })}
              className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              すべて表示 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}