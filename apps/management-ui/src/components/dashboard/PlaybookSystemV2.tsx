import React, { useState } from 'react'

// プレイブック = インジケーター判断の統合システム
interface Playbook {
  id: string
  name: string
  description: string
  scope: string[]  // 適用対象 ['saas:*', 'market:JP']
  decisionFlow: DecisionNode[]  // 判断フロー
  packages: PKGReference[]  // 使用するPKG一覧
}

// 判断ノード = インジケーターによる分岐点
interface DecisionNode {
  id: string
  type: 'indicator' | 'action' | 'pkg_execution'
  label: string
  condition?: string  // 'MRR:⬇️ AND DAU:↘️'
  branches?: {
    pattern: string  // '⬇️'
    condition: string  // 'MRR < -20%'
    action: string  // 'call_pkg:crisis_recovery' or 'goto:next_node'
    probability: number
  }[]
}

// PKG参照 = プレイブック内で呼び出されるPKG
interface PKGReference {
  pkgId: string
  triggerConditions: string[]  // このPKGが呼ばれる条件
  expectedDuration: string
}

// PKG = 判断をグルーピングした実行パッケージ
interface PKG {
  id: string
  name: string
  description: string
  category: 'crisis' | 'growth' | 'optimization' | 'lifecycle'
  inputs: {
    required: string[]  // ['mrr_trend', 'dau_trend']
    optional: string[]
  }
  steps: PKGStep[]
  outputs: {
    metrics: string[]  // ['recovery_probability', 'estimated_impact']
    nextActions: string[]  // ['continue_monitoring', 'escalate', 'pivot']
  }
}

interface PKGStep {
  id: string
  name: string
  type: 'analysis' | 'action' | 'decision' | 'api_call'
  automated: boolean
  implementation: string  // 実際の処理内容
}

// モックデータ：メインプレイブック
const mainPlaybook: Playbook = {
  id: 'main_saas_lifecycle',
  name: 'SaaSライフサイクル管理プレイブック',
  description: '100-200個のSaaSを統合的に管理する判断システム',
  scope: ['saas:*', 'market:JP', 'market:EN'],
  decisionFlow: [
    {
      id: 'entry_point',
      type: 'indicator',
      label: '初期状態評価',
      condition: 'ENTRY',
      branches: [
        {
          pattern: 'NEW',
          condition: 'phase == "idea" OR phase == "lp"',
          action: 'goto:lp_evaluation',
          probability: 1.0
        },
        {
          pattern: 'EXISTING',
          condition: 'phase == "mvp" OR phase == "scale"',
          action: 'goto:health_check',
          probability: 1.0
        }
      ]
    },
    {
      id: 'lp_evaluation',
      type: 'indicator',
      label: 'LP評価',
      condition: 'LP.CVR',
      branches: [
        {
          pattern: '⬆️',
          condition: 'CVR > 15%',
          action: 'call_pkg:fast_track_mvp',
          probability: 0.2
        },
        {
          pattern: '↗️',
          condition: 'CVR 10-15%',
          action: 'call_pkg:standard_mvp',
          probability: 0.5
        },
        {
          pattern: '→',
          condition: 'CVR 5-10%',
          action: 'call_pkg:lp_optimization',
          probability: 0.2
        },
        {
          pattern: '⬇️',
          condition: 'CVR < 5%',
          action: 'call_pkg:pivot_or_kill',
          probability: 0.1
        }
      ]
    },
    {
      id: 'health_check',
      type: 'indicator',
      label: '健康状態チェック',
      condition: 'MRR AND DAU AND CVR',
      branches: [
        {
          pattern: '⬆️⬆️⬆️',
          condition: 'ALL_METRICS_UP',
          action: 'call_pkg:aggressive_growth',
          probability: 0.1
        },
        {
          pattern: '↗️↗️→',
          condition: 'MOSTLY_POSITIVE',
          action: 'call_pkg:steady_growth',
          probability: 0.4
        },
        {
          pattern: '→→→',
          condition: 'ALL_FLAT',
          action: 'call_pkg:optimization_cycle',
          probability: 0.3
        },
        {
          pattern: '↘️',
          condition: 'ANY_DECLINING',
          action: 'call_pkg:early_intervention',
          probability: 0.15
        },
        {
          pattern: '⬇️',
          condition: 'ANY_CRITICAL',
          action: 'call_pkg:crisis_management',
          probability: 0.05
        }
      ]
    }
  ],
  packages: [
    { pkgId: 'fast_track_mvp', triggerConditions: ['LP.CVR > 15%'], expectedDuration: '48h' },
    { pkgId: 'standard_mvp', triggerConditions: ['LP.CVR 10-15%'], expectedDuration: '7d' },
    { pkgId: 'crisis_management', triggerConditions: ['MRR⬇️ OR DAU⬇️'], expectedDuration: '3-7d' },
    { pkgId: 'aggressive_growth', triggerConditions: ['ALL_METRICS_UP'], expectedDuration: '14-30d' }
  ]
}

// モックPKG定義
const mockPKGs: PKG[] = [
  {
    id: 'crisis_management',
    name: '危機管理PKG',
    description: '急激な指標悪化時の対応をカプセル化',
    category: 'crisis',
    inputs: {
      required: ['mrr_trend', 'dau_trend', 'churn_rate'],
      optional: ['customer_feedback', 'competitor_activity']
    },
    steps: [
      {
        id: 'detect_root_cause',
        name: '根本原因分析',
        type: 'analysis',
        automated: true,
        implementation: 'analyze_metrics_correlation() + check_external_factors()'
      },
      {
        id: 'generate_hypotheses',
        name: '仮説生成',
        type: 'analysis',
        automated: true,
        implementation: 'ai_hypothesis_generator(context, historical_data)'
      },
      {
        id: 'select_intervention',
        name: '介入策選択',
        type: 'decision',
        automated: false,
        implementation: 'human_review(hypotheses) + risk_assessment()'
      },
      {
        id: 'execute_ab_test',
        name: 'A/Bテスト実行',
        type: 'action',
        automated: true,
        implementation: 'setup_ab_test() + monitor_results()'
      }
    ],
    outputs: {
      metrics: ['recovery_probability', 'time_to_recovery', 'intervention_impact'],
      nextActions: ['continue_monitoring', 'escalate_to_pivot', 'success_to_growth']
    }
  },
  {
    id: 'fast_track_mvp',
    name: '高速MVP構築PKG',
    description: '優秀なLP指標を活用した48時間MVP',
    category: 'growth',
    inputs: {
      required: ['lp_cvr', 'user_feedback', 'market_size'],
      optional: ['competitor_analysis']
    },
    steps: [
      {
        id: 'validate_assumptions',
        name: '前提条件確認',
        type: 'analysis',
        automated: true,
        implementation: 'validate_market_fit() + check_technical_feasibility()'
      },
      {
        id: 'generate_mvp',
        name: 'MVP自動生成',
        type: 'action',
        automated: true,
        implementation: 'ai_code_generator() + auto_deployment()'
      },
      {
        id: 'setup_analytics',
        name: '分析環境構築',
        type: 'action',
        automated: true,
        implementation: 'setup_mixpanel() + configure_funnels()'
      }
    ],
    outputs: {
      metrics: ['mvp_completion_time', 'initial_user_engagement'],
      nextActions: ['monitor_early_metrics', 'prepare_scaling']
    }
  }
]

// 実行状態
interface PlaybookExecution {
  playbookId: string
  saasName: string
  currentNode: string
  executionHistory: {
    timestamp: string
    nodeId: string
    decision: string
    indicators: Record<string, string>
    pkgCalled?: string
  }[]
  activePKGs: {
    pkgId: string
    status: 'running' | 'completed' | 'failed'
    progress: number
    startTime: string
  }[]
}

const mockExecutions: PlaybookExecution[] = [
  {
    playbookId: 'main_saas_lifecycle',
    saasName: '猫カフェ予約',
    currentNode: 'health_check',
    executionHistory: [
      {
        timestamp: '2025-01-15 09:00',
        nodeId: 'entry_point',
        decision: 'EXISTING',
        indicators: { phase: 'mvp' }
      },
      {
        timestamp: '2025-01-15 14:30',
        nodeId: 'health_check',
        decision: 'ANY_CRITICAL',
        indicators: { mrr: '⬇️', dau: '↘️', cvr: '↘️' },
        pkgCalled: 'crisis_management'
      }
    ],
    activePKGs: [
      {
        pkgId: 'crisis_management',
        status: 'running',
        progress: 35,
        startTime: '2025-01-15 14:30'
      }
    ]
  }
]

interface PlaybookSystemV2Props {
  onViewDataSeries?: (saasName: string, metric: string) => void
}

export function PlaybookSystemV2({ onViewDataSeries }: PlaybookSystemV2Props) {
  const [selectedView, setSelectedView] = useState<'playbook' | 'pkg' | 'execution'>('playbook')
  const [selectedPKG, setSelectedPKG] = useState<PKG | null>(null)
  const [selectedExecution, setSelectedExecution] = useState<PlaybookExecution>(mockExecutions[0])

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 PKGシステム</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('playbook')}
            className={`px-4 py-2 rounded ${selectedView === 'playbook' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            PKG設計
          </button>
          <button
            onClick={() => setSelectedView('pkg')}
            className={`px-4 py-2 rounded ${selectedView === 'pkg' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            PKGライブラリ
          </button>
          <button
            onClick={() => setSelectedView('execution')}
            className={`px-4 py-2 rounded ${selectedView === 'execution' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            実行状況
          </button>
        </div>
      </div>

      {/* プレイブック設計ビュー */}
      {selectedView === 'playbook' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：決定フロー */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">🔀 判断フロー設計</h3>
            <div className="space-y-6">
              {mainPlaybook.decisionFlow.map(node => (
                <div key={node.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg">
                      {node.type === 'indicator' ? '📊' : node.type === 'pkg_execution' ? '📦' : '⚡'}
                    </span>
                    <h4 className="font-medium">{node.label}</h4>
                  </div>
                  
                  {node.condition && (
                    <div className="mb-3 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      評価条件: {node.condition}
                    </div>
                  )}

                  {node.branches && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">分岐パターン:</div>
                      {node.branches.map((branch, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 group">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                const metricMatch = branch.condition.match(/(MRR|DAU|CVR)/i)
                                if (metricMatch) {
                                  onViewDataSeries?.(selectedExecution.saasName, metricMatch[1].toLowerCase())
                                }
                              }}
                              className={`text-xl ${getSymbolColor(branch.pattern)} hover:bg-white px-1 rounded transition-colors cursor-pointer`}
                              title="該当メトリクスの時系列データを表示"
                            >
                              {branch.pattern}
                            </button>
                            <span className="text-sm font-mono">{branch.condition}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600">{branch.action}</span>
                            <span className="text-xs text-gray-400">
                              {(branch.probability * 100).toFixed(0)}%
                            </span>
                            <button
                              onClick={() => {
                                const metricMatch = branch.condition.match(/(MRR|DAU|CVR)/i)
                                if (metricMatch) {
                                  onViewDataSeries?.(selectedExecution.saasName, metricMatch[1].toLowerCase())
                                }
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              📊 データ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右側：PKG関係図 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">📦 PKG関係図</h3>
            <div className="space-y-4">
              {mainPlaybook.packages.map(pkgRef => {
                const pkg = mockPKGs.find(p => p.id === pkgRef.pkgId)
                return (
                  <div
                    key={pkgRef.pkgId}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPKG(pkg || null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{pkg?.name}</h4>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {pkg?.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{pkg?.description}</div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">呼び出し条件:</span>
                      </div>
                      {pkgRef.triggerConditions.map((condition, idx) => (
                        <div key={idx} className="text-xs font-mono bg-blue-50 px-2 py-1 rounded">
                          {condition}
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-2">
                        想定実行時間: {pkgRef.expectedDuration}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* PKGライブラリビュー */}
      {selectedView === 'pkg' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PKGリスト */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-medium">PKGライブラリ</h3>
              <p className="text-sm text-gray-600">判断をカプセル化した実行パッケージ</p>
            </div>
            <div className="divide-y">
              {mockPKGs.map(pkg => (
                <div
                  key={pkg.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedPKG?.id === pkg.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedPKG(pkg)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{pkg.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      pkg.category === 'crisis' ? 'bg-red-100 text-red-800' :
                      pkg.category === 'growth' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {pkg.steps.length}ステップ | {pkg.inputs.required.length}必須入力
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PKG詳細 */}
          {selectedPKG && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{selectedPKG.name}</h3>
              
              {/* 入力 */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">📥 入力</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">必須:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPKG.inputs.required.map(input => (
                        <span key={input} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {input}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">オプション:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPKG.inputs.optional.map(input => (
                        <span key={input} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {input}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ステップ */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">⚙️ 実行ステップ</h4>
                <div className="space-y-2">
                  {selectedPKG.steps.map((step, idx) => (
                    <div key={step.id} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{idx + 1}. {step.name}</span>
                        <div className="flex space-x-1">
                          {step.automated && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">自動</span>
                          )}
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {step.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        {step.implementation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 出力 */}
              <div>
                <h4 className="font-medium mb-2">📤 出力</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">メトリクス:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPKG.outputs.metrics.map(metric => (
                        <span key={metric} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">次のアクション:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPKG.outputs.nextActions.map(action => (
                        <span key={action} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 実行状況ビュー */}
      {selectedView === 'execution' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">🔄 実行状況: {selectedExecution.saasName}</h3>
          
          {/* 実行履歴 */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">実行履歴</h4>
            <div className="space-y-3">
              {selectedExecution.executionHistory.map((event, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">{event.timestamp}</div>
                  <div className="flex-1">
                    <div className="font-medium">{event.nodeId}</div>
                    <div className="text-sm">判定: {event.decision}</div>
                    <div className="flex space-x-2 mt-1">
                      {Object.entries(event.indicators).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => onViewDataSeries?.(selectedExecution.saasName, key)}
                          className={`text-sm ${getSymbolColor(value)} hover:bg-white px-1 rounded cursor-pointer`}
                        >
                          {key}:{value}
                        </button>
                      ))}
                    </div>
                    {event.pkgCalled && (
                      <div className="text-sm text-blue-600 mt-1">
                        → PKG実行: {event.pkgCalled}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アクティブPKG */}
          <div>
            <h4 className="font-medium mb-2">実行中PKG</h4>
            <div className="space-y-2">
              {selectedExecution.activePKGs.map(pkg => (
                <div key={pkg.pkgId} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{pkg.pkgId}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      pkg.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      pkg.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${pkg.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>開始: {pkg.startTime}</span>
                    <span>{pkg.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}