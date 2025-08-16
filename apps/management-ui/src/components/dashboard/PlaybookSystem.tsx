import React, { useState } from 'react'
import { Search, Zap, Megaphone, Target, TestTube, BarChart3, Settings, Rocket } from 'lucide-react'
import { PlaybookVisualizer } from './PlaybookVisualizer'

// PKGタイプ定義
interface PKGDefinition {
  id: string
  name: string
  description: string
  category: 'standard' | 'fast-track' | 'crisis' | 'optimization' | 'sunset'
  conditions: {
    when: string
    indicators: string[]
  }
  steps: PKGStep[]
  transitions: PKGTransition[]
  estimatedDuration: string
  successRate: number
  usage: number
}

interface PKGStep {
  id: string
  name: string
  type: 'analysis' | 'action' | 'notification' | 'decision' | 'test'
  description: string
  automated: boolean
  required: boolean
}

interface PKGTransition {
  condition: string
  target: string
  probability: number
}

interface PKGExecution {
  id: string
  saasName: string
  pkgId: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  progress: number
  startTime: string
  currentStep: string
  metrics: {
    before: Record<string, number>
    current: Record<string, number>
  }
  logs: PKGLog[]
}

interface PKGLog {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  data?: any
}

// モックデータ：PKGライブラリ
const mockPKGLibrary: PKGDefinition[] = [
  // Crisis Management PKGs
  {
    id: 'CRISIS_MRR_RECOVERY',
    name: '危機回復PKG',
    description: 'MRRまたはDAUが急降下した際の緊急対応',
    category: 'crisis',
    conditions: {
      when: "mrr_symbol == '⬇️' OR dau_symbol == '⬇️'",
      indicators: ['churn_rate', 'customer_sentiment', 'competitor_activity']
    },
    steps: [
      { id: 's1', name: '異常検知', type: 'analysis', description: 'メトリクス異常値を検出', automated: true, required: true },
      { id: 's2', name: '原因分析', type: 'analysis', description: 'チャーン理由、競合動向、市場変化を分析', automated: true, required: true },
      { id: 's3', name: '対策立案', type: 'decision', description: 'AI/人間によるリカバリープラン作成', automated: false, required: true },
      { id: 's4', name: 'A/Bテスト実行', type: 'test', description: '複数の対策案をテスト', automated: true, required: true },
      { id: 's5', name: '結果評価', type: 'analysis', description: 'テスト結果を評価', automated: true, required: true },
      { id: 's6', name: 'スケール/ピボット判定', type: 'decision', description: '次のアクションを決定', automated: false, required: true }
    ],
    transitions: [
      { condition: 'churn_rate < 5%', target: 'CRISIS_RECOVERY_SUCCESS', probability: 0.3 },
      { condition: 'churn_rate >= 10%', target: 'CRISIS_PRODUCT_PIVOT', probability: 0.5 },
      { condition: 'no_improvement_3days', target: 'LIFECYCLE_END_CLEANUP', probability: 0.2 }
    ],
    estimatedDuration: '3-7日',
    successRate: 65,
    usage: 142
  },
  {
    id: 'CRISIS_PRODUCT_PIVOT',
    name: '緊急ピボット',
    description: '連続的な指標悪化時の方向転換',
    category: 'crisis',
    conditions: {
      when: "pattern == ['→', '↘️', '⬇️', '⬇️']",
      indicators: ['market_fit', 'user_feedback', 'competitor_analysis']
    },
    steps: [
      { id: 's1', name: '市場再調査', type: 'analysis', description: '新たなニーズを探索', automated: true, required: true },
      { id: 's2', name: 'ピボット案生成', type: 'decision', description: '3つのピボット方向を提案', automated: true, required: true },
      { id: 's3', name: 'LP再作成', type: 'action', description: '新しいLPを生成', automated: true, required: true },
      { id: 's4', name: '高速検証', type: 'test', description: '24時間で検証', automated: true, required: true }
    ],
    transitions: [
      { condition: 'new_cvr > 10%', target: 'LAUNCH_MVP_STANDARD', probability: 0.4 },
      { condition: 'new_cvr < 5%', target: 'LIFECYCLE_END_CLEANUP', probability: 0.6 }
    ],
    estimatedDuration: '24-48時間',
    successRate: 45,
    usage: 38
  },

  // Fast Track PKGs
  {
    id: 'LAUNCH_MVP_STANDARD',
    name: '高速MVP構築',
    description: 'LP検証成功後の迅速なMVP開発',
    category: 'fast-track',
    conditions: {
      when: "lp.cvr > 15% AND market.competition < 3",
      indicators: ['development_velocity', 'resource_availability']
    },
    steps: [
      { id: 's1', name: 'インフラ自動構築', type: 'action', description: 'AWS/Vercel環境セットアップ', automated: true, required: true },
      { id: 's2', name: 'コア機能実装', type: 'action', description: 'MVP必須機能を実装', automated: true, required: true },
      { id: 's3', name: '分析ツール設定', type: 'action', description: 'Mixpanel/GA4セットアップ', automated: true, required: true },
      { id: 's4', name: 'ベータローンチ', type: 'action', description: '限定ユーザーに公開', automated: true, required: true }
    ],
    transitions: [
      { condition: 'beta.retention > 50%', target: 'SCALE_FAST_GROWTH', probability: 0.7 },
      { condition: 'beta.retention < 30%', target: 'GROWTH_OPTIMIZE_UX', probability: 0.3 }
    ],
    estimatedDuration: '5-7日',
    successRate: 78,
    usage: 89
  },
  {
    id: 'SCALE_FAST_GROWTH',
    name: 'アグレッシブスケール',
    description: '好調な指標を示すSaaSの急速拡大',
    category: 'fast-track',
    conditions: {
      when: "pattern == ['↗️', '↗️', '⬆️']",
      indicators: ['cac', 'ltv', 'viral_coefficient']
    },
    steps: [
      { id: 's1', name: 'インフラスケール', type: 'action', description: 'オートスケーリング設定', automated: true, required: true },
      { id: 's2', name: '広告展開', type: 'action', description: 'Google/FB広告開始', automated: true, required: true },
      { id: 's3', name: 'アフィリエイト開始', type: 'action', description: 'パートナープログラム', automated: false, required: false },
      { id: 's4', name: 'グロースハック', type: 'test', description: 'バイラル施策実行', automated: true, required: true }
    ],
    transitions: [
      { condition: 'mrr > 1000000', target: 'SCALE_ENTERPRISE_EXPANSION', probability: 0.5 },
      { condition: 'growth_rate < 10%', target: 'GROWTH_OPTIMIZE_UX', probability: 0.5 }
    ],
    estimatedDuration: '14-30日',
    successRate: 82,
    usage: 56
  },

  // Standard PKGs
  {
    id: 'GROWTH_STANDARD_CYCLE',
    name: '標準成長PKG',
    description: '安定したSaaSの継続的成長',
    category: 'standard',
    conditions: {
      when: "status == 'stable' AND growth_rate > 5%",
      indicators: ['nps', 'feature_adoption', 'support_tickets']
    },
    steps: [
      { id: 's1', name: '機能改善', type: 'action', description: 'ユーザーフィードバック反映', automated: false, required: true },
      { id: 's2', name: 'UX最適化', type: 'test', description: 'UIのA/Bテスト', automated: true, required: false },
      { id: 's3', name: 'コンテンツマーケティング', type: 'action', description: 'SEO記事作成', automated: true, required: false }
    ],
    transitions: [
      { condition: 'always', target: 'GROWTH_STANDARD_CYCLE', probability: 1.0 }
    ],
    estimatedDuration: '継続的',
    successRate: 72,
    usage: 234
  },

  // Optimization PKGs
  {
    id: 'GROWTH_OPTIMIZE_UX',
    name: '最適化PKG',
    description: 'パフォーマンス改善と効率化',
    category: 'optimization',
    conditions: {
      when: "days_since_last_optimization > 30",
      indicators: ['conversion_funnel', 'page_speed', 'error_rate']
    },
    steps: [
      { id: 's1', name: 'パフォーマンス監査', type: 'analysis', description: 'ボトルネック特定', automated: true, required: true },
      { id: 's2', name: 'コスト最適化', type: 'action', description: 'インフラコスト削減', automated: true, required: false },
      { id: 's3', name: 'コンバージョン改善', type: 'test', description: 'ファネル最適化', automated: true, required: true }
    ],
    transitions: [
      { condition: 'improvement > 20%', target: 'GROWTH_STANDARD_CYCLE', probability: 0.8 },
      { condition: 'improvement < 5%', target: 'CRISIS_PRODUCT_PIVOT', probability: 0.2 }
    ],
    estimatedDuration: '3-5日',
    successRate: 68,
    usage: 178
  },

  // Sunset PKGs
  {
    id: 'LIFECYCLE_END_CLEANUP',
    name: 'サンセット評価',
    description: 'サービス終了の判定と実行',
    category: 'sunset',
    conditions: {
      when: "mrr < 10000 OR dau < 10 OR cvr < 1%",
      indicators: ['resource_cost', 'opportunity_cost', 'migration_readiness']
    },
    steps: [
      { id: 's1', name: '延命可能性評価', type: 'analysis', description: '改善余地を分析', automated: true, required: true },
      { id: 's2', name: 'データエクスポート', type: 'action', description: 'ユーザーデータ保護', automated: true, required: true },
      { id: 's3', name: '移行先提案', type: 'notification', description: '代替サービス案内', automated: true, required: true },
      { id: 's4', name: 'サービス停止', type: 'action', description: '段階的シャットダウン', automated: false, required: true }
    ],
    transitions: [
      { condition: 'completed', target: 'end', probability: 1.0 }
    ],
    estimatedDuration: '7-14日',
    successRate: 95,
    usage: 28
  }
]

// モックデータ：実行中のPKG
const mockExecutions: PKGExecution[] = [
  {
    id: 'exec-001',
    saasName: '猫カフェ予約',
    pkgId: 'CRISIS_MRR_RECOVERY',
    status: 'running',
    progress: 35,
    startTime: '2025-01-15 14:30',
    currentStep: 's3',
    metrics: {
      before: { mrr: 45000, dau: 120, cvr: 8.5 },
      current: { mrr: 38000, dau: 115, cvr: 6.5 }
    },
    logs: [
      { timestamp: '14:30:00', level: 'info', message: '異常検知: MRR急降下を検出' },
      { timestamp: '14:30:15', level: 'info', message: '分析開始: 過去24時間のデータを取得' },
      { timestamp: '14:45:00', level: 'warning', message: '原因特定: CVR低下が主要因' },
      { timestamp: '15:00:00', level: 'info', message: '対策立案中: A/Bテスト準備...' }
    ]
  },
  {
    id: 'exec-002',
    saasName: '家計簿アプリ',
    pkgId: 'LAUNCH_MVP_STANDARD',
    status: 'running',
    progress: 78,
    startTime: '2025-01-14 10:00',
    currentStep: 's4',
    metrics: {
      before: { mrr: 180000, dau: 380, cvr: 12.3 },
      current: { mrr: 250000, dau: 450, cvr: 15.2 }
    },
    logs: [
      { timestamp: '10:00:00', level: 'success', message: 'インフラ構築完了' },
      { timestamp: '12:30:00', level: 'success', message: 'コア機能実装完了' },
      { timestamp: '15:00:00', level: 'success', message: '分析ツール設定完了' },
      { timestamp: '18:00:00', level: 'info', message: 'ベータ版公開中...' }
    ]
  }
]

interface PlaybookSystemProps {
  onViewDataSeries?: (saasName: string, metric: string) => void
}

export function PlaybookSystem({ onViewDataSeries }: PlaybookSystemProps) {
  const [selectedTab, setSelectedTab] = useState<'visualizer' | 'library' | 'executions' | 'editor'>('visualizer')
  const [selectedPKG, setSelectedPKG] = useState<PKGDefinition | null>(null)
  const [selectedExecution, setSelectedExecution] = useState<PKGExecution | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredPKGs = filterCategory === 'all' 
    ? mockPKGLibrary 
    : mockPKGLibrary.filter(pkg => pkg.category === filterCategory)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crisis': return 'bg-red-100 text-red-800'
      case 'fast-track': return 'bg-green-100 text-green-800'
      case 'standard': return 'bg-blue-100 text-blue-800'
      case 'optimization': return 'bg-yellow-100 text-yellow-800'
      case 'sunset': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <Search className="w-4 h-4" />
      case 'action': return <Zap className="w-4 h-4" />
      case 'notification': return <Megaphone className="w-4 h-4" />
      case 'decision': return <Target className="w-4 h-4" />
      case 'test': return <TestTube className="w-4 h-4" />
      default: return '📝'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📝 PKGシステム</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab('visualizer')}
            className={`px-4 py-2 rounded ${selectedTab === 'visualizer' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            分岐ビジュアライザー
          </button>
          <button
            onClick={() => setSelectedTab('library')}
            className={`px-4 py-2 rounded ${selectedTab === 'library' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            ライブラリ
          </button>
          <button
            onClick={() => setSelectedTab('executions')}
            className={`px-4 py-2 rounded ${selectedTab === 'executions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            実行状況
          </button>
          <button
            onClick={() => setSelectedTab('editor')}
            className={`px-4 py-2 rounded ${selectedTab === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            エディタ
          </button>
        </div>
      </div>

      {/* 分岐ビジュアライザータブ */}
      {selectedTab === 'visualizer' && (
        <PlaybookVisualizer onViewDataSeries={onViewDataSeries} />
      )}

      {/* PKGライブラリタブ */}
      {selectedTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：PKGリスト */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <select
                className="w-full border rounded px-3 py-2"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">すべてのカテゴリ</option>
                <option value="crisis">危機対応</option>
                <option value="fast-track">高速トラック</option>
                <option value="standard">標準フロー</option>
                <option value="optimization">最適化</option>
                <option value="sunset">サンセット</option>
              </select>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredPKGs.map(pkg => (
                <div
                  key={pkg.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedPKG?.id === pkg.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPKG(pkg)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{pkg.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(pkg.category)}`}>
                          {pkg.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>⏱ {pkg.estimatedDuration}</span>
                        <span>✅ {pkg.successRate}%成功</span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {pkg.usage}回使用
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右側：PKG詳細 */}
          {selectedPKG && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{selectedPKG.name}</h3>
              
              {/* 実行条件 */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">実行条件</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  {selectedPKG.conditions.when}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">監視指標: </span>
                  {selectedPKG.conditions.indicators.map((ind, i) => (
                    <span key={i} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-1">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* 実行ステップ */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">実行ステップ</h4>
                <div className="space-y-2">
                  {selectedPKG.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStepIcon(step.type)}</span>
                          <span className="font-medium">{step.name}</span>
                          {step.automated && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">自動</span>
                          )}
                          {step.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">必須</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 遷移条件 */}
              <div>
                <h4 className="font-medium mb-2">次のPKGへの遷移</h4>
                <div className="space-y-2">
                  {selectedPKG.transitions.map((trans, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="text-sm">
                        <span className="font-mono">{trans.condition}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium text-blue-600">{trans.target}</span>
                      </div>
                      <span className="text-xs text-gray-500">{(trans.probability * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                このPKGを実行
              </button>
            </div>
          )}
        </div>
      )}

      {/* 実行状況タブ */}
      {selectedTab === 'executions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：実行リスト */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-medium">実行中のPKG</h3>
            </div>
            <div className="divide-y">
              {mockExecutions.map(exec => (
                <div
                  key={exec.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedExecution?.id === exec.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedExecution(exec)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exec.saasName}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exec.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      exec.status === 'completed' ? 'bg-green-100 text-green-800' :
                      exec.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exec.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{exec.pkgId}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${exec.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>開始: {exec.startTime}</span>
                    <span>{exec.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右側：実行詳細 */}
          {selectedExecution && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedExecution.saasName} - PKG実行詳細
              </h3>

              {/* メトリクス変化 */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">メトリクス変化</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">MRR</div>
                    <div className="text-sm">
                      ¥{selectedExecution.metrics.before.mrr.toLocaleString()}
                      <span className="mx-1">→</span>
                      ¥{selectedExecution.metrics.current.mrr.toLocaleString()}
                    </div>
                    {selectedExecution.metrics.current.mrr < selectedExecution.metrics.before.mrr && (
                      <span className="text-xs text-red-600">⬇️</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">DAU</div>
                    <div className="text-sm">
                      {selectedExecution.metrics.before.dau}
                      <span className="mx-1">→</span>
                      {selectedExecution.metrics.current.dau}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">CVR</div>
                    <div className="text-sm">
                      {selectedExecution.metrics.before.cvr}%
                      <span className="mx-1">→</span>
                      {selectedExecution.metrics.current.cvr}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 実行ログ */}
              <div>
                <h4 className="font-medium mb-2">実行ログ</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs max-h-[400px] overflow-y-auto">
                  {selectedExecution.logs.map((log, index) => (
                    <div key={index} className={`mb-1 ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warning' ? 'text-yellow-400' :
                      log.level === 'success' ? 'text-green-400' :
                      'text-gray-400'
                    }`}>
                      [{log.timestamp}] {log.message}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                  一時停止
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  中止
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* エディタタブ */}
      {selectedTab === 'editor' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">PKGエディタ（YAMLモード）</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">YAML定義</h4>
              <textarea
                className="w-full h-[500px] p-4 bg-gray-900 text-green-400 font-mono text-sm rounded"
                defaultValue={`playbook: SAAS_LIFECYCLE
packages:
  GROWTH_CUSTOM_EXPANSION:
    when: "mrr > 100000 AND growth_rate > 20%"
    
    indicators:
      - user_satisfaction
      - feature_usage
      - support_quality
    
    steps:
      - id: analyze_growth_drivers
        type: analysis
        automated: true
      - id: expand_features
        type: action
        automated: false
      - id: increase_pricing
        type: decision
        automated: false
    
    transitions:
      - condition: "nps > 50"
        target: "SCALE_ENTERPRISE_EXPANSION"
      - condition: "default"
        target: "GROWTH_STANDARD_CYCLE"`}
              />
            </div>
            <div>
              <h4 className="font-medium mb-2">プレビュー</h4>
              <div className="border rounded p-4 h-[500px] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">PKG名:</span>
                    <div className="font-medium">GROWTH_CUSTOM_EXPANSION</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">実行条件:</span>
                    <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                      mrr &gt; 100000 AND growth_rate &gt; 20%
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">ステップ:</span>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                      <li>成長要因分析（自動）</li>
                      <li>機能拡張（手動）</li>
                      <li>価格改定（手動）</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              検証
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              保存
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              テスト実行
            </button>
          </div>
        </div>
      )}
    </div>
  )
}