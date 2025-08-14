import React, { useState } from 'react'

// インジケーターベースの分岐ルール
interface PlaybookNode {
  id: string
  type: 'start' | 'indicator' | 'action' | 'decision' | 'end'
  label: string
  description?: string
  condition?: string
  branches?: PlaybookBranch[]
  metrics?: {
    mrr?: string
    dau?: string
    cvr?: string
    nps?: string
  }
}

interface PlaybookBranch {
  condition: string
  symbol: string
  target: string
  probability?: number
  color: string
}

interface SaaSPlaybookState {
  saasName: string
  currentNode: string
  history: {
    timestamp: string
    node: string
    decision: string
    metrics: Record<string, any>
  }[]
  indicators: {
    mrr: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
    dau: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
    cvr: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
    nps: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
  }
}

// プレイブックフロー定義
const playbookFlow: PlaybookNode[] = [
  {
    id: 'start',
    type: 'start',
    label: '開始',
    branches: [
      { condition: 'always', symbol: '→', target: 'check_lp_cvr', color: 'bg-gray-500' }
    ]
  },
  {
    id: 'check_lp_cvr',
    type: 'indicator',
    label: 'LP CVR評価',
    description: 'ランディングページの転換率を評価',
    condition: 'LP.CVR',
    branches: [
      { condition: 'CVR > 15%', symbol: '⬆️', target: 'fast_mvp', probability: 0.2, color: 'bg-green-500' },
      { condition: 'CVR 10-15%', symbol: '↗️', target: 'standard_mvp', probability: 0.5, color: 'bg-blue-500' },
      { condition: 'CVR 5-10%', symbol: '→', target: 'improve_lp', probability: 0.2, color: 'bg-yellow-500' },
      { condition: 'CVR < 5%', symbol: '⬇️', target: 'pivot_or_kill', probability: 0.1, color: 'bg-red-500' }
    ]
  },
  {
    id: 'fast_mvp',
    type: 'action',
    label: '高速MVP構築',
    description: '48時間でMVPを自動生成',
    branches: [
      { condition: 'complete', symbol: '→', target: 'check_mvp_metrics', color: 'bg-gray-500' }
    ]
  },
  {
    id: 'standard_mvp',
    type: 'action',
    label: '標準MVP構築',
    description: '7日間でMVPを構築',
    branches: [
      { condition: 'complete', symbol: '→', target: 'check_mvp_metrics', color: 'bg-gray-500' }
    ]
  },
  {
    id: 'improve_lp',
    type: 'action',
    label: 'LP改善',
    description: 'A/Bテストで最適化',
    branches: [
      { condition: 'improved', symbol: '↗️', target: 'check_lp_cvr', color: 'bg-green-500' },
      { condition: 'no_improvement', symbol: '↘️', target: 'pivot_or_kill', color: 'bg-red-500' }
    ]
  },
  {
    id: 'check_mvp_metrics',
    type: 'indicator',
    label: 'MVP指標評価',
    description: 'MRR/DAU/CVRを総合評価',
    condition: 'MVP.ALL_METRICS',
    branches: [
      { condition: 'MRR⬆️ DAU⬆️', symbol: '⬆️', target: 'aggressive_scale', probability: 0.15, color: 'bg-green-500' },
      { condition: 'MRR↗️ DAU↗️', symbol: '↗️', target: 'standard_scale', probability: 0.35, color: 'bg-blue-500' },
      { condition: 'MRR→ DAU→', symbol: '→', target: 'optimization', probability: 0.30, color: 'bg-yellow-500' },
      { condition: 'MRR↘️ OR DAU↘️', symbol: '↘️', target: 'crisis_recovery', probability: 0.15, color: 'bg-orange-500' },
      { condition: 'MRR⬇️ OR DAU⬇️', symbol: '⬇️', target: 'emergency_pivot', probability: 0.05, color: 'bg-red-500' }
    ]
  },
  {
    id: 'aggressive_scale',
    type: 'action',
    label: 'アグレッシブスケール',
    description: '広告投資を3倍に増加',
    branches: [
      { condition: 'success', symbol: '⬆️', target: 'monitor_scale', color: 'bg-green-500' }
    ]
  },
  {
    id: 'standard_scale',
    type: 'action',
    label: '標準スケール',
    description: '段階的に規模拡大',
    branches: [
      { condition: 'complete', symbol: '→', target: 'monitor_scale', color: 'bg-gray-500' }
    ]
  },
  {
    id: 'optimization',
    type: 'action',
    label: '最適化',
    description: 'UX改善とコスト削減',
    branches: [
      { condition: 'optimized', symbol: '↗️', target: 'check_mvp_metrics', color: 'bg-blue-500' }
    ]
  },
  {
    id: 'crisis_recovery',
    type: 'action',
    label: '危機回復',
    description: '原因分析と緊急対策',
    branches: [
      { condition: 'recovered', symbol: '↗️', target: 'check_mvp_metrics', color: 'bg-green-500' },
      { condition: 'not_recovered', symbol: '⬇️', target: 'pivot_or_kill', color: 'bg-red-500' }
    ]
  },
  {
    id: 'emergency_pivot',
    type: 'action',
    label: '緊急ピボット',
    description: '方向性を大幅変更',
    branches: [
      { condition: 'pivot_success', symbol: '↗️', target: 'check_lp_cvr', color: 'bg-blue-500' },
      { condition: 'pivot_fail', symbol: '⬇️', target: 'sunset', color: 'bg-red-500' }
    ]
  },
  {
    id: 'monitor_scale',
    type: 'indicator',
    label: 'スケール監視',
    description: '成長指標を継続監視',
    condition: 'SCALE.GROWTH_RATE',
    branches: [
      { condition: 'growth > 20%', symbol: '⬆️', target: 'monitor_scale', color: 'bg-green-500' },
      { condition: 'growth 10-20%', symbol: '↗️', target: 'monitor_scale', color: 'bg-blue-500' },
      { condition: 'growth < 10%', symbol: '↘️', target: 'optimization', color: 'bg-yellow-500' }
    ]
  },
  {
    id: 'pivot_or_kill',
    type: 'decision',
    label: 'ピボット/終了判定',
    description: 'サービス継続を判断',
    branches: [
      { condition: 'pivot', symbol: '🔄', target: 'check_lp_cvr', color: 'bg-purple-500' },
      { condition: 'kill', symbol: '💀', target: 'sunset', color: 'bg-gray-500' }
    ]
  },
  {
    id: 'sunset',
    type: 'end',
    label: 'サンセット',
    description: 'サービス終了処理'
  }
]

// 実行中のSaaS状態
const mockSaaSStates: SaaSPlaybookState[] = [
  {
    saasName: '猫カフェ予約',
    currentNode: 'crisis_recovery',
    indicators: { mrr: '⬇️', dau: '↘️', cvr: '↘️', nps: '→' },
    history: [
      { timestamp: '2025-01-10', node: 'check_mvp_metrics', decision: 'MRR↘️ OR DAU↘️', metrics: { mrr: 45000, dau: 120 } },
      { timestamp: '2025-01-12', node: 'crisis_recovery', decision: 'executing', metrics: { mrr: 38000, dau: 115 } }
    ]
  },
  {
    saasName: '家計簿アプリ',
    currentNode: 'aggressive_scale',
    indicators: { mrr: '⬆️', dau: '⬆️', cvr: '↗️', nps: '⬆️' },
    history: [
      { timestamp: '2025-01-08', node: 'check_mvp_metrics', decision: 'MRR⬆️ DAU⬆️', metrics: { mrr: 180000, dau: 380 } },
      { timestamp: '2025-01-10', node: 'aggressive_scale', decision: 'scaling', metrics: { mrr: 250000, dau: 450 } }
    ]
  },
  {
    saasName: 'AI議事録作成',
    currentNode: 'fast_mvp',
    indicators: { mrr: '→', dau: '⬆️', cvr: '⬆️', nps: '→' },
    history: [
      { timestamp: '2025-01-14', node: 'check_lp_cvr', decision: 'CVR > 15%', metrics: { cvr: 18.0 } },
      { timestamp: '2025-01-15', node: 'fast_mvp', decision: 'building', metrics: {} }
    ]
  }
]

interface PlaybookVisualizerProps {
  onViewDataSeries?: (saasName: string, metric: string) => void
}

export function PlaybookVisualizer({ onViewDataSeries }: PlaybookVisualizerProps) {
  const [selectedSaaS, setSelectedSaaS] = useState<SaaSPlaybookState>(mockSaaSStates[0])
  const [viewMode, setViewMode] = useState<'flow' | 'matrix' | 'timeline'>('flow')
  
  const getNodeById = (id: string) => playbookFlow.find(node => node.id === id)
  
  const getSymbolColor = (symbol: string) => {
    switch (symbol) {
      case '⬆️': return 'text-green-600'
      case '↗️': return 'text-blue-600'
      case '→': return 'text-gray-600'
      case '↘️': return 'text-orange-600'
      case '⬇️': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀'
      case 'indicator': return '📊'
      case 'action': return '⚡'
      case 'decision': return '🎯'
      case 'end': return '🏁'
      default: return '📝'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🔀 プレイブック分岐ビジュアライザー</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('flow')}
            className={`px-4 py-2 rounded ${viewMode === 'flow' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            フロー図
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded ${viewMode === 'matrix' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            判定マトリックス
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            実行タイムライン
          </button>
        </div>
      </div>

      {/* SaaS選択 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">対象SaaS:</span>
          <select
            className="border rounded px-3 py-1"
            value={selectedSaaS.saasName}
            onChange={(e) => setSelectedSaaS(mockSaaSStates.find(s => s.saasName === e.target.value) || mockSaaSStates[0])}
          >
            {mockSaaSStates.map(state => (
              <option key={state.saasName} value={state.saasName}>{state.saasName}</option>
            ))}
          </select>
          <div className="flex items-center space-x-3 ml-auto">
            <span className="text-sm">現在のインジケーター:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewDataSeries?.(selectedSaaS.saasName, 'mrr')}
                className={`text-2xl ${getSymbolColor(selectedSaaS.indicators.mrr)} hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors`}
                title="MRRの時系列データを表示"
              >
                MRR:{selectedSaaS.indicators.mrr}
              </button>
              <button
                onClick={() => onViewDataSeries?.(selectedSaaS.saasName, 'dau')}
                className={`text-2xl ${getSymbolColor(selectedSaaS.indicators.dau)} hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors`}
                title="DAUの時系列データを表示"
              >
                DAU:{selectedSaaS.indicators.dau}
              </button>
              <button
                onClick={() => onViewDataSeries?.(selectedSaaS.saasName, 'cvr')}
                className={`text-2xl ${getSymbolColor(selectedSaaS.indicators.cvr)} hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors`}
                title="CVRの時系列データを表示"
              >
                CVR:{selectedSaaS.indicators.cvr}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* フロー図ビュー */}
      {viewMode === 'flow' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">インジケーターベース分岐フロー</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] space-y-8">
              {playbookFlow.map(node => {
                const isCurrentNode = node.id === selectedSaaS.currentNode
                const wasVisited = selectedSaaS.history.some(h => h.node === node.id)
                
                return (
                  <div key={node.id} className="relative">
                    <div className={`
                      flex items-start p-4 rounded-lg border-2
                      ${isCurrentNode ? 'border-blue-500 bg-blue-50' : 
                        wasVisited ? 'border-gray-300 bg-gray-50' : 
                        'border-gray-200'}
                    `}>
                      <div className="flex-shrink-0 text-2xl mr-4">
                        {getNodeTypeIcon(node.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{node.label}</h4>
                          {isCurrentNode && (
                            <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded animate-pulse">
                              現在地
                            </span>
                          )}
                        </div>
                        {node.description && (
                          <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                        )}
                        {node.condition && (
                          <div className="mt-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                            評価: {node.condition}
                          </div>
                        )}
                      </div>
                      
                      {/* 分岐表示 */}
                      {node.branches && node.branches.length > 0 && (
                        <div className="ml-8">
                          <div className="space-y-2">
                            {node.branches.map((branch, idx) => (
                              <div key={idx} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded group">
                                <div className={`w-2 h-2 rounded-full ${branch.color}`} />
                                <span className="text-sm font-mono">{branch.condition}</span>
                                <button
                                  onClick={() => {
                                    // 条件から関連するメトリクスを抽出
                                    const metrics = ['mrr', 'dau', 'cvr', 'nps']
                                    const relatedMetric = metrics.find(m => 
                                      branch.condition.toLowerCase().includes(m)
                                    )
                                    if (relatedMetric) {
                                      onViewDataSeries?.(selectedSaaS.saasName, relatedMetric)
                                    }
                                  }}
                                  className={`text-2xl ${getSymbolColor(branch.symbol)} hover:bg-white px-1 rounded transition-colors group-hover:bg-white`}
                                  title={`${branch.condition}の時系列データを表示`}
                                >
                                  {branch.symbol}
                                </button>
                                <span className="text-sm text-gray-600">→ {branch.target}</span>
                                {branch.probability && (
                                  <span className="text-xs text-gray-400">
                                    ({(branch.probability * 100).toFixed(0)}%)
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    const metrics = ['mrr', 'dau', 'cvr', 'nps']
                                    const relatedMetric = metrics.find(m => 
                                      branch.condition.toLowerCase().includes(m)
                                    )
                                    if (relatedMetric) {
                                      onViewDataSeries?.(selectedSaaS.saasName, relatedMetric)
                                    }
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  📊 データを見る
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 判定マトリックスビュー */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">インジケーター判定マトリックス</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ノード</th>
                  <th className="px-4 py-2 text-center">条件</th>
                  <th className="px-4 py-2 text-center">MRR</th>
                  <th className="px-4 py-2 text-center">DAU</th>
                  <th className="px-4 py-2 text-center">CVR</th>
                  <th className="px-4 py-2 text-center">次のアクション</th>
                  <th className="px-4 py-2 text-center">確率</th>
                </tr>
              </thead>
              <tbody>
                {playbookFlow
                  .filter(node => node.type === 'indicator')
                  .map(node => (
                    node.branches?.map((branch, idx) => (
                      <tr key={`${node.id}-${idx}`} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <span>{getNodeTypeIcon(node.type)}</span>
                            <span className="font-medium">{node.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-mono text-sm">{branch.condition}</td>
                        <td className="px-4 py-2 text-center">
                          {branch.condition.includes('MRR') && (
                            <span className={`text-2xl ${getSymbolColor(branch.symbol)}`}>
                              {branch.symbol}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {branch.condition.includes('DAU') && (
                            <span className={`text-2xl ${getSymbolColor(branch.symbol)}`}>
                              {branch.symbol}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {branch.condition.includes('CVR') && (
                            <span className={`text-2xl ${getSymbolColor(branch.symbol)}`}>
                              {branch.symbol}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className="font-medium text-blue-600">{branch.target}</span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {branch.probability && (
                            <span className="text-sm">{(branch.probability * 100).toFixed(0)}%</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* タイムラインビュー */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">{selectedSaaS.saasName}の実行履歴</h3>
          <div className="space-y-4">
            {selectedSaaS.history.map((event, idx) => {
              const node = getNodeById(event.node)
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {node && getNodeTypeIcon(node.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{node?.label}</span>
                      <span className="text-xs text-gray-500">{event.timestamp}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-sm text-gray-600">判定: </span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {event.decision}
                      </span>
                    </div>
                    {Object.keys(event.metrics).length > 0 && (
                      <div className="mt-2 flex space-x-4 text-sm">
                        {event.metrics.mrr && <span>MRR: ¥{event.metrics.mrr.toLocaleString()}</span>}
                        {event.metrics.dau && <span>DAU: {event.metrics.dau}</span>}
                        {event.metrics.cvr && <span>CVR: {event.metrics.cvr}%</span>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            {/* 現在のノード */}
            <div className="flex items-start space-x-4 border-t pt-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white">→</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-600">
                  現在: {getNodeById(selectedSaaS.currentNode)?.label}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">次の分岐候補:</span>
                  <div className="mt-1 space-y-1">
                    {getNodeById(selectedSaaS.currentNode)?.branches?.map((branch, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <span className={`text-lg ${getSymbolColor(branch.symbol)}`}>
                          {branch.symbol}
                        </span>
                        <span className="font-mono">{branch.condition}</span>
                        <span>→</span>
                        <span className="text-blue-600">{branch.target}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* インジケーター凡例 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">インジケーター記号の意味</h4>
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-green-600">⬆️</span>
            <span>急上昇（+20%以上）</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-blue-600">↗️</span>
            <span>上昇（+5〜20%）</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-gray-600">→</span>
            <span>横ばい（±5%）</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-orange-600">↘️</span>
            <span>下降（-5〜-20%）</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl text-red-600">⬇️</span>
            <span>急降下（-20%以上）</span>
          </div>
        </div>
      </div>
    </div>
  )
}