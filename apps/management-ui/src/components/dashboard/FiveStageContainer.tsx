import React, { useState } from 'react'

// 5段階ドリルダウンの型定義
type DrillDownLevel = 'unsonos' | 'saas' | 'playbook' | 'node_pkg' | 'indicator'

// ナビゲーション状態の型定義
interface NavigationState {
  level: DrillDownLevel
  selectedSaaS?: string
  selectedPlaybook?: string
  selectedNode?: string
  selectedPKG?: string
  selectedIndicator?: string
}

// ブレッドクラムアイテムの型定義
interface BreadcrumbItem {
  level: DrillDownLevel
  label: string
  metadata?: string
  status?: '✅' | '🔄' | '⏳' | '❌'
  trend?: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
}

// SaaS情報の型定義
interface SaaSInfo {
  id: string
  name: string
  phase: 'LP検証' | 'MVP開発' | '収益化' | 'スケール' | 'サンセット'
  status: 'active' | 'critical' | 'monitoring'
  playbooks: PlaybookInfo[]
}

// プレイブック情報の型定義
interface PlaybookInfo {
  id: string
  name: string
  version: string
  status: 'running' | 'waiting' | 'completed' | 'failed'
  currentNode: string
  nodes: PlaybookNode[]
  progress: number
  estimatedCompletion: string
}

// プレイブックノードの型定義
interface PlaybookNode {
  id: string
  type: 'Start' | 'Guard' | 'Action' | 'Gate' | 'Outcome'
  name: string
  status: '✅' | '🔄' | '⏳' | '❌'
  pkgs?: PKGExecution[]
  condition?: string
  result?: string
}

// PKG実行の型定義
interface PKGExecution {
  id: string
  name: string
  type: string
  status: 'completed' | 'running' | 'pending' | 'failed'
  progress: number
  startTime: string
  estimatedDuration: number
  indicators: IndicatorRecord[]
}

// インジケーター記録の型定義
interface IndicatorRecord {
  id: string
  metric: string
  value: number
  symbol: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
  timestamp: string
  confidence: number
  reason: string
}

// モックデータ
const mockSaaSData: SaaSInfo[] = [
  {
    id: 'ai-minutes',
    name: 'AI議事録作成',
    phase: 'LP検証',
    status: 'active',
    playbooks: [
      {
        id: 'lp-optimization-v2.1',
        name: 'LP最適化プレイブック',
        version: 'v2.1',
        status: 'running',
        currentNode: 'action-ad-adjustment',
        progress: 67,
        estimatedCompletion: '14:35',
        nodes: [
          {
            id: 'start',
            type: 'Start',
            name: '最適化開始',
            status: '✅'
          },
          {
            id: 'guard-data-check',
            type: 'Guard',
            name: 'データ充分性確認',
            status: '✅',
            condition: 'CVR >= 5% AND サンプル >= 100'
          },
          {
            id: 'action-ad-adjustment',
            type: 'Action',
            name: '広告調整',
            status: '🔄',
            pkgs: [
              {
                id: 'GROWTH_KEYWORD_OPTIMIZE',
                name: 'GROWTH_KEYWORD_OPTIMIZE',
                type: 'キーワード最適化',
                status: 'completed',
                progress: 100,
                startTime: '14:23',
                estimatedDuration: 5,
                indicators: [
                  {
                    id: 'cvr-1',
                    metric: 'CVR',
                    value: 18.3,
                    symbol: '↗️',
                    timestamp: '14:23',
                    confidence: 95,
                    reason: 'キーワード精度向上により品質スコア改善'
                  }
                ]
              },
              {
                id: 'GROWTH_AD_COPY_TEST',
                name: 'GROWTH_AD_COPY_TEST',
                type: 'コピーA/Bテスト',
                status: 'completed',
                progress: 100,
                startTime: '14:25',
                estimatedDuration: 8,
                indicators: [
                  {
                    id: 'cvr-2',
                    metric: 'CVR',
                    value: 19.1,
                    symbol: '↗️',
                    timestamp: '14:28',
                    confidence: 88,
                    reason: 'コピーパターンB採用でCTR向上'
                  }
                ]
              },
              {
                id: 'GROWTH_TARGET_ADJUST',
                name: 'GROWTH_TARGET_ADJUST',
                type: 'ターゲティング調整',
                status: 'running',
                progress: 45,
                startTime: '14:32',
                estimatedDuration: 12,
                indicators: []
              }
            ]
          },
          {
            id: 'gate-cvr-check',
            type: 'Gate',
            name: 'CVR判定',
            status: '⏳',
            condition: 'CVR >= 20%'
          },
          {
            id: 'outcome-mvp-decision',
            type: 'Outcome',
            name: 'MVP開発判断',
            status: '⏳'
          }
        ]
      }
    ]
  },
  {
    id: 'contract-checker',
    name: '契約書チェッカー',
    phase: 'LP検証',
    status: 'monitoring',
    playbooks: [
      {
        id: 'lp-validation-v1.3',
        name: 'LP検証プレイブック',
        version: 'v1.3',
        status: 'waiting',
        currentNode: 'guard-traffic-check',
        progress: 25,
        estimatedCompletion: '16:00',
        nodes: [
          {
            id: 'start',
            type: 'Start',
            name: 'LP検証開始',
            status: '✅'
          },
          {
            id: 'guard-traffic-check',
            type: 'Guard',
            name: 'トラフィック確認',
            status: '⏳',
            condition: 'DAU >= 50 AND 滞在時間 >= 30秒'
          },
          {
            id: 'action-user-research',
            type: 'Action',
            name: 'ユーザー調査',
            status: '⏳',
            pkgs: [
              {
                id: 'RESEARCH_SURVEY_DEPLOY',
                name: 'RESEARCH_SURVEY_DEPLOY',
                type: 'アンケート配信',
                status: 'pending',
                progress: 0,
                startTime: '15:30',
                estimatedDuration: 15,
                indicators: []
              }
            ]
          },
          {
            id: 'gate-product-fit',
            type: 'Gate',
            name: 'プロダクトフィット判定',
            status: '⏳',
            condition: '課題共感度 >= 70%'
          },
          {
            id: 'outcome-mvp-or-pivot',
            type: 'Outcome',
            name: 'MVP開発orピボット',
            status: '⏳'
          }
        ]
      }
    ]
  },
  {
    id: 'pet-management',
    name: 'ペット管理',
    phase: '収益化',
    status: 'active',
    playbooks: [
      {
        id: 'growth-optimization-v3.2',
        name: '成長最適化プレイブック',
        version: 'v3.2',
        status: 'running',
        currentNode: 'action-retention-improvement',
        progress: 78,
        estimatedCompletion: '15:45',
        nodes: [
          {
            id: 'start',
            type: 'Start',
            name: '成長施策開始',
            status: '✅'
          },
          {
            id: 'guard-metrics-check',
            type: 'Guard',
            name: 'メトリクス確認',
            status: '✅',
            condition: 'MRR >= 50K AND チャーン率 <= 5%'
          },
          {
            id: 'action-retention-improvement',
            type: 'Action',
            name: 'リテンション改善',
            status: '🔄',
            pkgs: [
              {
                id: 'GROWTH_FEATURE_ANALYZE',
                name: 'GROWTH_FEATURE_ANALYZE',
                type: '機能利用分析',
                status: 'completed',
                progress: 100,
                startTime: '13:15',
                estimatedDuration: 20,
                indicators: [
                  {
                    id: 'retention-1',
                    metric: 'リテンション率',
                    value: 82.5,
                    symbol: '↗️',
                    timestamp: '13:35',
                    confidence: 91,
                    reason: 'プッシュ通知最適化により継続利用率向上'
                  }
                ]
              },
              {
                id: 'GROWTH_NOTIFY_OPTIMIZE',
                name: 'GROWTH_NOTIFY_OPTIMIZE',
                type: '通知最適化',
                status: 'running',
                progress: 65,
                startTime: '14:20',
                estimatedDuration: 25,
                indicators: []
              }
            ]
          },
          {
            id: 'gate-growth-metrics',
            type: 'Gate',
            name: '成長指標確認',
            status: '⏳',
            condition: 'DAU成長率 >= 15% AND リテンション >= 80%'
          },
          {
            id: 'outcome-scale-decision',
            type: 'Outcome',
            name: 'スケール判断',
            status: '⏳'
          }
        ]
      }
    ]
  },
  {
    id: 'household-budget',
    name: '家計簿アプリ',
    phase: '収益化',
    status: 'active',
    playbooks: [
      {
        id: 'revenue-expansion-v2.8',
        name: '収益拡大プレイブック',
        version: 'v2.8',
        status: 'running',
        currentNode: 'action-premium-conversion',
        progress: 89,
        estimatedCompletion: '15:20',
        nodes: [
          {
            id: 'start',
            type: 'Start',
            name: '収益拡大開始',
            status: '✅'
          },
          {
            id: 'guard-user-base-check',
            type: 'Guard',
            name: 'ユーザーベース確認',
            status: '✅',
            condition: 'アクティブユーザー >= 400'
          },
          {
            id: 'action-premium-conversion',
            type: 'Action',
            name: 'プレミアム転換',
            status: '🔄',
            pkgs: [
              {
                id: 'GROWTH_PRICE_OPTIMIZE',
                name: 'GROWTH_PRICE_OPTIMIZE',
                type: '価格最適化',
                status: 'completed',
                progress: 100,
                startTime: '12:45',
                estimatedDuration: 30,
                indicators: [
                  {
                    id: 'conversion-1',
                    metric: 'プレミアム転換率',
                    value: 15.2,
                    symbol: '→',
                    timestamp: '13:15',
                    confidence: 87,
                    reason: '価格帯最適化により転換率安定'
                  }
                ]
              },
              {
                id: 'GROWTH_FEATURE_UPSELL',
                name: 'GROWTH_FEATURE_UPSELL',
                type: '機能アップセル',
                status: 'completed',
                progress: 100,
                startTime: '13:30',
                estimatedDuration: 40,
                indicators: [
                  {
                    id: 'arpu-1',
                    metric: 'ARPU',
                    value: 556,
                    symbol: '↗️',
                    timestamp: '14:10',
                    confidence: 93,
                    reason: '高付加価値機能によりARPU向上'
                  }
                ]
              }
            ]
          },
          {
            id: 'gate-revenue-target',
            type: 'Gate',
            name: '収益目標確認',
            status: '✅',
            condition: 'MRR >= 200K'
          },
          {
            id: 'outcome-scale-preparation',
            type: 'Outcome',
            name: 'スケール準備',
            status: '🔄'
          }
        ]
      }
    ]
  },
  {
    id: 'cat-cafe',
    name: '猫カフェ予約',
    phase: '収益化',
    status: 'critical',
    playbooks: [
      {
        id: 'crisis-recovery-v1.5',
        name: '危機回復プレイブック',
        version: 'v1.5',
        status: 'running',
        currentNode: 'action-emergency-measures',
        progress: 35,
        estimatedCompletion: '17:30',
        nodes: [
          {
            id: 'start',
            type: 'Start',
            name: '危機対応開始',
            status: '✅'
          },
          {
            id: 'guard-crisis-assessment',
            type: 'Guard',
            name: '危機状況評価',
            status: '✅',
            condition: 'CVR < 8% AND DAU減少率 >= 20%'
          },
          {
            id: 'action-emergency-measures',
            type: 'Action',
            name: '緊急対策',
            status: '🔄',
            pkgs: [
              {
                id: 'RESEARCH_FEEDBACK_ANALYZE',
                name: 'RESEARCH_FEEDBACK_ANALYZE',
                type: 'ユーザーフィードバック分析',
                status: 'completed',
                progress: 100,
                startTime: '13:00',
                estimatedDuration: 45,
                indicators: [
                  {
                    id: 'satisfaction-1',
                    metric: 'ユーザー満足度',
                    value: 45.2,
                    symbol: '⬇️',
                    timestamp: '13:45',
                    confidence: 96,
                    reason: 'UI改悪による操作性低下が主要因'
                  }
                ]
              },
              {
                id: 'CRISIS_UI_ROLLBACK',
                name: 'CRISIS_UI_ROLLBACK',
                type: 'UI緊急ロールバック',
                status: 'running',
                progress: 70,
                startTime: '14:15',
                estimatedDuration: 60,
                indicators: []
              }
            ]
          },
          {
            id: 'gate-recovery-check',
            type: 'Gate',
            name: '回復確認',
            status: '⏳',
            condition: 'CVR >= 8% AND DAU安定化'
          },
          {
            id: 'outcome-recovery-or-sunset',
            type: 'Outcome',
            name: '回復確認orサンセット',
            status: '⏳'
          }
        ]
      }
    ]
  }
]

interface FiveStageContainerProps {
  initialLevel?: DrillDownLevel
  initialSaaS?: string
}

export function FiveStageContainer({ 
  initialLevel = 'unsonos', 
  initialSaaS 
}: FiveStageContainerProps) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    level: initialLevel,
    selectedSaaS: initialSaaS
  })

  // ブレッドクラム生成
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { level: 'unsonos', label: 'UnsonOS' }
    ]

    if (navigationState.selectedSaaS) {
      const saas = mockSaaSData.find(s => s.id === navigationState.selectedSaaS)
      if (saas) {
        breadcrumbs.push({
          level: 'saas',
          label: saas.name,
          metadata: `[${saas.phase}]`,
          status: saas.status === 'active' ? '🔄' : saas.status === 'critical' ? '❌' : '⏳'
        })
      }
    }

    if (navigationState.selectedPlaybook) {
      const saas = mockSaaSData.find(s => s.id === navigationState.selectedSaaS)
      const playbook = saas?.playbooks.find(p => p.id === navigationState.selectedPlaybook)
      if (playbook) {
        breadcrumbs.push({
          level: 'playbook',
          label: playbook.name,
          metadata: playbook.version,
          status: playbook.status === 'running' ? '🔄' : '⏳'
        })
      }
    }

    if (navigationState.selectedNode) {
      const saas = mockSaaSData.find(s => s.id === navigationState.selectedSaaS)
      const playbook = saas?.playbooks.find(p => p.id === navigationState.selectedPlaybook)
      const node = playbook?.nodes.find(n => n.id === navigationState.selectedNode)
      if (node) {
        breadcrumbs.push({
          level: 'node_pkg',
          label: `${node.type}:${node.name}`,
          status: node.status
        })
      }
    }

    if (navigationState.selectedPKG) {
      const saas = mockSaaSData.find(s => s.id === navigationState.selectedSaaS)
      const playbook = saas?.playbooks.find(p => p.id === navigationState.selectedPlaybook)
      const node = playbook?.nodes.find(n => n.id === navigationState.selectedNode)
      const pkg = node?.pkgs?.find(p => p.id === navigationState.selectedPKG)
      if (pkg) {
        breadcrumbs.push({
          level: 'node_pkg',
          label: pkg.name
        })
      }
    }

    if (navigationState.selectedIndicator) {
      breadcrumbs.push({
        level: 'indicator',
        label: 'CVR記号化',
        trend: '↗️'
      })
    }

    return breadcrumbs
  }

  // ナビゲーション処理
  const handleNavigation = (level: DrillDownLevel, id?: string) => {
    switch (level) {
      case 'unsonos':
        setNavigationState({ level: 'unsonos' })
        break
      case 'saas':
        setNavigationState({
          level: 'saas',
          selectedSaaS: id
        })
        break
      case 'playbook':
        setNavigationState({
          ...navigationState,
          level: 'playbook',
          selectedPlaybook: id
        })
        break
      case 'node_pkg':
        setNavigationState({
          ...navigationState,
          level: 'node_pkg',
          selectedNode: id
        })
        break
      case 'indicator':
        setNavigationState({
          ...navigationState,
          level: 'indicator',
          selectedIndicator: id
        })
        break
    }
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ブレッドクラムナビゲーション */}
      <div className="bg-white border-b px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.level}>
              {index > 0 && <span className="text-gray-400">›</span>}
              <button
                onClick={() => handleNavigation(crumb.level, 
                  crumb.level === 'saas' ? navigationState.selectedSaaS :
                  crumb.level === 'playbook' ? navigationState.selectedPlaybook :
                  crumb.level === 'node_pkg' ? navigationState.selectedNode :
                  undefined
                )}
                className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${
                  index === breadcrumbs.length - 1 ? 'font-semibold text-blue-600' : 'text-gray-600'
                }`}
              >
                {crumb.status && <span>{crumb.status}</span>}
                <span>{crumb.label}</span>
                {crumb.metadata && <span className="text-gray-500">{crumb.metadata}</span>}
                {crumb.trend && <span>{crumb.trend}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* メインコンテンツエリア */}
      <div className="p-6">
        {navigationState.level === 'unsonos' && (
          <UnsonOSPortfolioView onSelectSaaS={(id) => handleNavigation('saas', id)} />
        )}
        
        {navigationState.level === 'saas' && navigationState.selectedSaaS && (
          <SaaSPhaseView 
            saasId={navigationState.selectedSaaS}
            onSelectPlaybook={(id) => handleNavigation('playbook', id)}
          />
        )}
        
        {navigationState.level === 'playbook' && navigationState.selectedPlaybook && (
          <PlaybookExecutionView 
            saasId={navigationState.selectedSaaS!}
            playbookId={navigationState.selectedPlaybook}
            onSelectNode={(id) => handleNavigation('node_pkg', id)}
          />
        )}
        
        {navigationState.level === 'node_pkg' && navigationState.selectedNode && (
          <NodePKGView 
            saasId={navigationState.selectedSaaS!}
            playbookId={navigationState.selectedPlaybook!}
            nodeId={navigationState.selectedNode}
            onSelectIndicator={(id) => handleNavigation('indicator', id)}
          />
        )}
        
        {navigationState.level === 'indicator' && navigationState.selectedIndicator && (
          <IndicatorRecordView 
            indicatorId={navigationState.selectedIndicator}
          />
        )}
      </div>
    </div>
  )
}

// レベル1: UnsonOSポートフォリオ概要（リスト形式）
function UnsonOSPortfolioView({ onSelectSaaS }: { onSelectSaaS: (id: string) => void }) {
  // 拡張モックデータ（グラフ用データ含む）
  const extendedMockData = [
    {
      ...mockSaaSData[0],
      metrics: {
        mrr: 0,
        dau: 45,
        cvr: 18.3,
        trend: [16.5, 16.8, 17.2, 17.9, 18.1, 18.3] // 過去6時点のCVRデータ
      }
    },
    {
      id: 'contract-checker',
      name: '契約書チェッカー',
      phase: 'LP検証' as const,
      status: 'monitoring' as const,
      playbooks: [],
      metrics: {
        mrr: 0,
        dau: 28,
        cvr: 7.9,
        trend: [8.2, 8.0, 7.8, 7.5, 7.7, 7.9]
      }
    },
    {
      id: 'pet-management',
      name: 'ペット管理',
      phase: '収益化' as const,
      status: 'active' as const,
      playbooks: [],
      metrics: {
        mrr: 78000,
        dau: 234,
        cvr: 11.3,
        trend: [10.8, 11.0, 11.2, 11.5, 11.4, 11.3]
      }
    },
    {
      id: 'household-budget',
      name: '家計簿アプリ',
      phase: '収益化' as const,
      status: 'active' as const,
      playbooks: [],
      metrics: {
        mrr: 250000,
        dau: 450,
        cvr: 15.2,
        trend: [14.8, 15.0, 15.1, 15.3, 15.2, 15.2]
      }
    },
    {
      id: 'cat-cafe',
      name: '猫カフェ予約',
      phase: '収益化' as const,
      status: 'critical' as const,
      playbooks: [],
      metrics: {
        mrr: 38000,
        dau: 115,
        cvr: 6.5,
        trend: [8.2, 7.8, 7.2, 6.8, 6.6, 6.5]
      }
    }
  ]

  // ミニグラフコンポーネント
  const MiniSparkline = ({ data, color = 'blue' }: { data: number[], color?: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    return (
      <div className="flex items-end h-8 w-20 space-x-1">
        {data.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t ${
              color === 'green' ? 'bg-green-500' :
              color === 'red' ? 'bg-red-500' :
              color === 'orange' ? 'bg-orange-500' :
              'bg-blue-500'
            }`}
            style={{
              height: `${Math.max(4, ((value - min) / range) * 100)}%`
            }}
          />
        ))}
      </div>
    )
  }
  
  // 学習インジケーターコンポーネント（第2優先実装）
  const LearningIndicator = ({ confidence, consensusRate }: { confidence: number, consensusRate: number }) => {
    const getConfidenceColor = () => {
      if (confidence >= 80) return 'text-green-600'
      if (confidence >= 60) return 'text-yellow-600'
      return 'text-red-600'
    }
    
    const getConsensusLabel = () => {
      if (consensusRate >= 0.75) return { text: '高一致', color: 'bg-green-100 text-green-700' }
      if (consensusRate >= 0.5) return { text: '中一致', color: 'bg-yellow-100 text-yellow-700' }
      return { text: '低一致', color: 'bg-red-100 text-red-700' }
    }
    
    const consensus = getConsensusLabel()
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-gray-500">予測:</span>
          <span className={`font-bold ${getConfidenceColor()}`}>
            {confidence}%
          </span>
        </div>
        {consensusRate >= 0.75 && (
          <span className={`px-1.5 py-0.5 text-xs rounded ${consensus.color}`}>
            {consensus.text}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🎯 UnsonOS ポートフォリオ</h1>
        <div className="text-sm text-gray-600">
          全体管理 • 45個のSaaS自動運営
        </div>
      </div>

      {/* 概要統計 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">¥366K</div>
          <div className="text-sm text-gray-600">月次収益（MRR）</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">872</div>
          <div className="text-sm text-gray-600">総DAU</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-sm text-gray-600">要注意SaaS</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600">アクティブ</div>
        </div>
      </div>
      
      {/* SaaSリスト */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">SaaS一覧</h2>
        </div>
        
        <div className="divide-y">
          {extendedMockData.map(saas => (
            <button
              key={saas.id}
              onClick={() => onSelectSaaS(saas.id)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* 状態インジケーター */}
                  <div className={`w-3 h-3 rounded-full ${
                    saas.status === 'active' ? 'bg-green-500' :
                    saas.status === 'critical' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  
                  {/* SaaS名とフェーズ */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{saas.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        saas.phase === 'LP検証' ? 'bg-blue-100 text-blue-800' :
                        saas.phase === 'MVP開発' ? 'bg-purple-100 text-purple-800' :
                        saas.phase === '収益化' ? 'bg-green-100 text-green-800' :
                        saas.phase === 'スケール' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {saas.phase}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {saas.playbooks.length > 0 ? (
                        `${saas.playbooks[0]?.name} ${saas.playbooks[0]?.version}`
                      ) : (
                        'プレイブック待機中'
                      )}
                    </div>
                  </div>
                </div>

                {/* メトリクス */}
                <div className="flex items-center space-x-8">
                  {/* MRR */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {saas.metrics.mrr > 0 ? `¥${(saas.metrics.mrr / 1000).toFixed(0)}K` : '-'}
                    </div>
                    <div className="text-xs text-gray-500">MRR</div>
                  </div>

                  {/* DAU */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{saas.metrics.dau}</div>
                    <div className="text-xs text-gray-500">DAU</div>
                  </div>

                  {/* CVR */}
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      saas.metrics.cvr >= 15 ? 'text-green-600' :
                      saas.metrics.cvr >= 10 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {saas.metrics.cvr.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">CVR</div>
                  </div>

                  {/* トレンドグラフ */}
                  <div className="text-right">
                    <MiniSparkline 
                      data={saas.metrics.trend} 
                      color={
                        saas.metrics.trend[saas.metrics.trend.length - 1] > saas.metrics.trend[0] ? 'green' :
                        saas.metrics.trend[saas.metrics.trend.length - 1] < saas.metrics.trend[0] ? 'red' :
                        'orange'
                      }
                    />
                    <div className="text-xs text-gray-500">6期間</div>
                  </div>
                  
                  {/* 学習インジケーター追加 */}
                  <LearningIndicator 
                    confidence={
                      saas.name === 'AI議事録作成' ? 88 :
                      saas.name === '契約書チェッカー' ? 72 :
                      saas.name === 'ペット管理' ? 81 :
                      saas.name === '家計簿アプリ' ? 85 :
                      saas.name === '猫カフェ予約' ? 45 : 75
                    } 
                    consensusRate={
                      saas.name === 'AI議事録作成' ? 0.85 :
                      saas.name === '契約書チェッカー' ? 0.60 :
                      saas.name === 'ペット管理' ? 0.78 :
                      saas.name === '家計簿アプリ' ? 0.82 :
                      saas.name === '猫カフェ亙約' ? 0.40 : 0.65
                    }
                  />

                  {/* アクション */}
                  <div className="text-right">
                    <div className="text-sm">
                      {saas.playbooks.find(p => p.status === 'running') ? '🔄' :
                       saas.status === 'critical' ? '🚨' :
                       saas.status === 'active' ? '✅' : '⏳'}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// レベル2: 個別SaaSフェーズ確認（詳細版）
function SaaSPhaseView({ saasId, onSelectPlaybook }: { 
  saasId: string
  onSelectPlaybook: (id: string) => void 
}) {
  const saas = mockSaaSData.find(s => s.id === saasId)
  if (!saas) return <div>SaaS not found</div>

  // 拡張メトリクスデータ（各SaaS専用）
  const extendedMetrics = {
    'ai-minutes': {
      mrr: 0, dau: 45, cvr: 18.3, cac: 850, ltv: 0, churn: 0,
      trend: { mrr: [0,0,0,0,0,0], dau: [38,41,43,44,45,45], cvr: [16.5,16.8,17.2,17.9,18.1,18.3] },
      kpis: { signups: 156, trials: 45, conversions: 8, retention_d7: 67 }
    },
    'contract-checker': {
      mrr: 0, dau: 28, cvr: 7.9, cac: 1200, ltv: 0, churn: 0,
      trend: { mrr: [0,0,0,0,0,0], dau: [22,24,26,27,28,28], cvr: [8.2,8.0,7.8,7.5,7.7,7.9] },
      kpis: { signups: 89, trials: 28, conversions: 2, retention_d7: 45 }
    },
    'pet-management': {
      mrr: 78000, dau: 234, cvr: 11.3, cac: 450, ltv: 1890, churn: 3.2,
      trend: { mrr: [70,72,74,76,77,78], dau: [210,218,225,230,233,234], cvr: [10.8,11.0,11.2,11.5,11.4,11.3] },
      kpis: { signups: 67, trials: 234, conversions: 26, retention_d7: 85 }
    },
    'household-budget': {
      mrr: 250000, dau: 450, cvr: 15.2, cac: 380, ltv: 2340, churn: 2.8,
      trend: { mrr: [230,235,240,245,248,250], dau: [420,430,440,445,448,450], cvr: [14.8,15.0,15.1,15.3,15.2,15.2] },
      kpis: { signups: 89, trials: 450, conversions: 68, retention_d7: 89 }
    },
    'cat-cafe': {
      mrr: 38000, dau: 115, cvr: 6.5, cac: 750, ltv: 890, churn: 8.5,
      trend: { mrr: [45,43,41,39,38,38], dau: [145,135,125,120,117,115], cvr: [8.2,7.8,7.2,6.8,6.6,6.5] },
      kpis: { signups: 23, trials: 115, conversions: 7, retention_d7: 52 }
    }
  }

  const metrics = extendedMetrics[saasId as keyof typeof extendedMetrics] || extendedMetrics['ai-minutes']

  // 最近のアクティビティ（モック）
  const recentActivity = [
    { time: '14:32', type: 'pkg_complete', message: 'GROWTH_FEATURE_ANALYZE 完了', status: 'success' },
    { time: '14:15', type: 'gate_waiting', message: 'Gate「成長指標確認」待ち', status: 'pending' },
    { time: '13:45', type: 'indicator_update', message: 'リテンション率 82.5%↗️ 記録', status: 'info' },
    { time: '13:20', type: 'pkg_start', message: 'GROWTH_NOTIFY_OPTIMIZE 開始', status: 'info' },
    { time: '13:00', type: 'alert', message: 'DAU目標達成: 234名', status: 'success' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'monitoring': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const MiniChart = ({ data, color = 'blue' }: { data: number[], color?: string }) => (
    <div className="flex items-end h-12 w-24 space-x-1">
      {data.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-t ${
            color === 'green' ? 'bg-green-500' :
            color === 'red' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
          style={{
            height: `${Math.max(4, (value / Math.max(...data)) * 100)}%`
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      {/* SaaS概要ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${
              saas.status === 'active' ? 'bg-green-500' :
              saas.status === 'critical' ? 'bg-red-500' :
              'bg-yellow-500'
            }`} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{saas.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  saas.phase === 'LP検証' ? 'bg-blue-100 text-blue-800' :
                  saas.phase === 'MVP開発' ? 'bg-purple-100 text-purple-800' :
                  saas.phase === '収益化' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {saas.phase}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(saas.status)}`}>
                  {saas.status === 'active' ? '正常稼働' :
                   saas.status === 'critical' ? '要注意' : '監視中'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">最終更新</div>
            <div className="font-medium">15:32</div>
          </div>
        </div>

        {/* 主要KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.mrr > 0 ? `¥${(metrics.mrr / 1000).toFixed(0)}K` : '-'}
            </div>
            <div className="text-sm text-gray-600">月次収益 (MRR)</div>
            <MiniChart data={metrics.trend.mrr} color="green" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.dau}</div>
            <div className="text-sm text-gray-600">デイリーアクティブユーザー</div>
            <MiniChart data={metrics.trend.dau} color="blue" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              metrics.cvr >= 15 ? 'text-green-600' :
              metrics.cvr >= 10 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.cvr.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">コンバージョン率</div>
            <MiniChart data={metrics.trend.cvr} color={
              metrics.cvr >= 15 ? 'green' :
              metrics.cvr >= 10 ? 'blue' : 'red'
            } />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              metrics.churn <= 3 ? 'text-green-600' :
              metrics.churn <= 5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.churn > 0 ? `${metrics.churn.toFixed(1)}%` : '-'}
            </div>
            <div className="text-sm text-gray-600">チャーン率</div>
          </div>
        </div>
      </div>

      {/* 詳細メトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ビジネスメトリクス */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">📊 ビジネスメトリクス</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">顧客獲得単価 (CAC)</span>
              <span className="font-medium">¥{metrics.cac.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">顧客生涯価値 (LTV)</span>
              <span className="font-medium">
                {metrics.ltv > 0 ? `¥${metrics.ltv.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">新規登録 (今日)</span>
              <span className="font-medium">{metrics.kpis.signups}名</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">トライアル中</span>
              <span className="font-medium">{metrics.kpis.trials}名</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">7日後継続率</span>
              <span className={`font-medium ${
                metrics.kpis.retention_d7 >= 70 ? 'text-green-600' :
                metrics.kpis.retention_d7 >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.kpis.retention_d7}%
              </span>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">📝 最近のアクティビティ</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'pending' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.message}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* プレイブック一覧 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg">🎯 実行中プレイブック</h3>
        </div>
        <div className="p-6 space-y-4">
          {saas.playbooks.map(playbook => (
            <button
              key={playbook.id}
              onClick={() => onSelectPlaybook(playbook.id)}
              className="w-full bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {playbook.status === 'running' ? '🔄' :
                     playbook.status === 'waiting' ? '⏳' :
                     playbook.status === 'completed' ? '✅' : '❌'}
                  </span>
                  <div>
                    <div className="font-medium">{playbook.name} {playbook.version}</div>
                    <div className="text-sm text-gray-600">
                      現在のノード: {playbook.nodes.find(n => n.id === playbook.currentNode)?.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{playbook.progress}%</div>
                  <div className="text-sm text-gray-500">完了予定: {playbook.estimatedCompletion}</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${playbook.progress}%` }}
                />
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  ノード進行: {playbook.nodes.filter(n => n.status === '✅').length}/{playbook.nodes.length}
                </span>
                <span className="text-blue-600 font-medium">詳細を見る →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 次のアクション */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">🎯 次のアクション</h3>
        <div className="space-y-2">
          {saas.phase === 'LP検証' && (
            <div className="text-sm">
              • CVR 20%達成でMVP開発フェーズに移行
              • ユーザーインタビュー 15件完了で課題検証
            </div>
          )}
          {saas.phase === '収益化' && saas.status === 'active' && (
            <div className="text-sm">
              • リテンション率 85%達成でスケールフェーズ検討
              • ARPU向上施策の効果測定（あと3日）
            </div>
          )}
          {saas.status === 'critical' && (
            <div className="text-sm text-red-700">
              • 緊急: CVR 8%回復でサンセット回避
              • UI改善完了後48時間での効果確認必須
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// レベル3: プレイブック実行詳細 - 「動いてます感」の核心
function PlaybookExecutionView({ 
  saasId, 
  playbookId, 
  onSelectNode 
}: { 
  saasId: string
  playbookId: string
  onSelectNode: (nodeId: string) => void 
}) {
  const saas = mockSaaSData.find(s => s.id === saasId)
  const playbook = saas?.playbooks.find(p => p.id === playbookId)
  
  if (!playbook || !saas) return <div>Playbook not found</div>

  const currentTime = new Date()
  const [currentMinute, setCurrentMinute] = React.useState(currentTime.getMinutes())

  // リアルタイム時刻更新（実行中感の演出）
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinute(new Date().getMinutes())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 次のGate条件チェック
  const gateNode = playbook.nodes.find(n => n.type === 'Gate')
  const currentActionNode = playbook.nodes.find(n => n.id === playbook.currentNode)
  const runningPKGs = currentActionNode?.pkgs?.filter(p => p.status === 'running') || []
  const completedPKGs = currentActionNode?.pkgs?.filter(p => p.status === 'completed') || []

  // CVR進捗計算（Gate条件に向けて）
  const latestCVR = completedPKGs
    .flatMap(pkg => pkg.indicators)
    .filter(ind => ind.metric === 'CVR')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

  const gateThreshold = 20.0 // CVR >= 20%
  const currentCVR = latestCVR?.value || 0
  const progressToGate = Math.min((currentCVR / gateThreshold) * 100, 100)

  return (
    <div className="space-y-6">
      {/* プレイブック実行ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📝</span>
              <div>
                <h2 className="text-2xl font-bold">{playbook.name} {playbook.version}</h2>
                <div className="text-blue-100 text-sm mt-1">
                  {saas.name} [{saas.phase}] で実行中...
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{playbook.progress}% 完了</div>
            <div className="text-blue-100 text-sm">予想完了: {playbook.estimatedCompletion}</div>
          </div>
        </div>

        {/* 実行進捗バー */}
        <div className="mt-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${playbook.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* プレイブックフロー可視化 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <span className="text-xl mr-2">🔄</span>
          プレイブック実行フロー
        </h3>
        
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {playbook.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <button
                onClick={() => onSelectNode(node.id)}
                className={`flex-shrink-0 bg-white border-2 rounded-lg p-4 text-center min-w-[120px] transition-all ${
                  node.status === '✅' ? 'border-green-500 bg-green-50' :
                  node.status === '🔄' ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' :
                  node.status === '⏳' ? 'border-gray-300 bg-gray-50' :
                  'border-red-500 bg-red-50'
                } hover:shadow-md`}
              >
                <div className="text-2xl mb-2">{node.status}</div>
                <div className="font-semibold text-sm">{node.type}</div>
                <div className="text-xs text-gray-600 mt-1">{node.name}</div>
                
                {/* 実行中ノードの詳細表示 */}
                {node.status === '🔄' && (
                  <div className="mt-2">
                    <div className="text-xs text-blue-600 font-medium">
                      実行中 ({Math.floor(Math.random() * 5) + 2}分経過)
                    </div>
                  </div>
                )}
              </button>
              
              {index < playbook.nodes.length - 1 && (
                <div className="flex-shrink-0 text-gray-400 text-xl">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action内PKG詳細（実行中ノードの場合） */}
      {currentActionNode && currentActionNode.type === 'Action' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">📦</span>
              Action内PKG詳細: {currentActionNode.name}
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {currentActionNode.pkgs?.map(pkg => (
              <div 
                key={pkg.id} 
                className={`border rounded-lg p-4 ${
                  pkg.status === 'running' ? 'border-blue-500 bg-blue-50' : 
                  pkg.status === 'completed' ? 'border-green-500 bg-green-50' :
                  'border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {pkg.status === 'completed' ? '✅' : 
                       pkg.status === 'running' ? '🔄' : '⏳'}
                    </span>
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-gray-600">{pkg.type}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {pkg.status === 'completed' ? (
                      <span className="text-green-600 font-medium">完了 ({pkg.startTime})</span>
                    ) : pkg.status === 'running' ? (
                      <span className="text-blue-600 font-medium">
                        実行中 ({Math.floor((currentMinute % 5) + 2)}分経過)
                      </span>
                    ) : (
                      <span className="text-gray-500">待機中</span>
                    )}
                  </div>
                </div>

                {/* 実行進捗 */}
                {pkg.status === 'running' && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${pkg.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {pkg.progress}% 完了 • 残り約{Math.ceil((100 - pkg.progress) / 10)}分
                    </div>
                  </div>
                )}

                {/* インジケーター更新 */}
                {pkg.indicators.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 font-medium">記号化更新:</div>
                    {pkg.indicators.map(indicator => (
                      <div key={indicator.id} className="text-sm flex items-center space-x-2">
                        <span className="font-medium">{indicator.metric}</span>
                        <span>{indicator.value}%</span>
                        <span className="text-lg">{indicator.symbol}</span>
                        <span className="text-xs text-gray-500">({indicator.timestamp})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 次のGate条件と進捗 */}
      {gateNode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">🚪</span>
            次のGate条件
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{gateNode.condition}</div>
                <div className="text-sm text-gray-600">
                  現在のCVR: {currentCVR.toFixed(1)}% / 目標: {gateThreshold}%
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  currentCVR >= gateThreshold ? 'text-green-600' : 'text-orange-600'
                }`}>
                  あと{(gateThreshold - currentCVR).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {currentCVR >= gateThreshold ? '条件達成！' : '条件まで'}
                </div>
              </div>
            </div>

            <div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    progressToGate >= 100 ? 'bg-green-600' : 'bg-orange-500'
                  }`}
                  style={{ width: `${progressToGate}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                Gate条件進捗: {progressToGate.toFixed(1)}%
              </div>
            </div>

            {currentCVR >= gateThreshold && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="text-green-800 font-medium">🎉 Gate条件達成！</div>
                <div className="text-green-600 text-sm">
                  MVP開発フェーズへの移行が推奨されます
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* リアルタイム監視パネル */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>🔄 リアルタイム監視中</span>
            <span>最終更新: 14:{String(currentMinute).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>システム正常稼働</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// レベル4: ノード/PKG実行詳細
function NodePKGView({ 
  saasId, 
  playbookId, 
  nodeId, 
  onSelectIndicator 
}: { 
  saasId: string
  playbookId: string
  nodeId: string
  onSelectIndicator: (indicatorId: string) => void 
}) {
  const saas = mockSaaSData.find(s => s.id === saasId)
  const playbook = saas?.playbooks.find(p => p.id === playbookId)
  const node = playbook?.nodes.find(n => n.id === nodeId)
  
  if (!node || !playbook || !saas) return <div>Node not found</div>

  const [selectedPKG, setSelectedPKG] = useState<string | null>(
    node.pkgs && node.pkgs.length > 0 ? node.pkgs[0].id : null
  )

  const currentPKG = node.pkgs?.find(p => p.id === selectedPKG)

  // PKG実行ログの生成（モック）
  const generatePKGLog = (pkg: PKGExecution) => {
    const logs = [
      { time: pkg.startTime, level: 'info', message: `PKG ${pkg.name} 実行開始` },
      { time: `${pkg.startTime}:30`, level: 'info', message: '入力データ検証完了' },
      { time: `${pkg.startTime}:45`, level: 'info', message: 'Google Ads API 接続確立' },
    ]

    if (pkg.status === 'completed') {
      logs.push(
        { time: `${pkg.startTime}:${String(60 + pkg.estimatedDuration).padStart(2, '0')}`, level: 'success', message: 'キーワード最適化完了' },
        { time: `${pkg.startTime}:${String(62 + pkg.estimatedDuration).padStart(2, '0')}`, level: 'success', message: 'インジケーター記号化完了' }
      )
    } else if (pkg.status === 'running') {
      logs.push(
        { time: `${pkg.startTime}:${String(60 + Math.floor(pkg.progress / 20)).padStart(2, '0')}`, level: 'info', message: `進捗 ${pkg.progress}% - キーワード分析中...` }
      )
    }

    return logs
  }

  return (
    <div className="space-y-6">
      {/* ノード詳細ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{node.status}</div>
            <div>
              <h2 className="text-2xl font-bold">{node.type}: {node.name}</h2>
              <div className="text-gray-600">
                {playbook.name} {playbook.version} 内のノード
              </div>
            </div>
          </div>
          <div className="text-right">
            {node.type === 'Guard' && node.condition && (
              <div className="bg-blue-50 px-3 py-2 rounded">
                <div className="text-sm text-gray-600">条件</div>
                <div className="font-medium">{node.condition}</div>
              </div>
            )}
            {node.type === 'Gate' && node.condition && (
              <div className="bg-orange-50 px-3 py-2 rounded">
                <div className="text-sm text-gray-600">Gate条件</div>
                <div className="font-medium">{node.condition}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PKG一覧（Actionノードの場合） */}
      {node.type === 'Action' && node.pkgs && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">📦</span>
              Action内PKG実行一覧
            </h3>
          </div>
          
          <div className="flex">
            {/* PKG選択サイドバー */}
            <div className="w-80 border-r">
              <div className="p-4 space-y-2">
                {node.pkgs.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPKG(pkg.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPKG === pkg.id ? 'bg-blue-50 border-blue-200 border' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{pkg.name}</span>
                      <span className="text-lg">
                        {pkg.status === 'completed' ? '✅' : 
                         pkg.status === 'running' ? '🔄' : 
                         pkg.status === 'failed' ? '❌' : '⏳'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{pkg.type}</div>
                    {pkg.status === 'running' && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${pkg.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{pkg.progress}%</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PKG詳細表示 */}
            <div className="flex-1">
              {currentPKG && (
                <div className="p-6 space-y-6">
                  {/* PKG実行情報 */}
                  <div>
                    <h4 className="font-semibold mb-3">📋 実行情報</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">PKG名:</span>
                        <span className="ml-2 font-medium">{currentPKG.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">タイプ:</span>
                        <span className="ml-2">{currentPKG.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">開始時刻:</span>
                        <span className="ml-2">{currentPKG.startTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">予想時間:</span>
                        <span className="ml-2">{currentPKG.estimatedDuration}分</span>
                      </div>
                      <div>
                        <span className="text-gray-600">状態:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          currentPKG.status === 'completed' ? 'bg-green-100 text-green-800' :
                          currentPKG.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          currentPKG.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {currentPKG.status === 'completed' ? '完了' :
                           currentPKG.status === 'running' ? '実行中' :
                           currentPKG.status === 'failed' ? '失敗' : '待機中'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">進捗:</span>
                        <span className="ml-2">{currentPKG.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 実行ログ */}
                  <div>
                    <h4 className="font-semibold mb-3">📝 実行ログ</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                      {generatePKGLog(currentPKG).map((log, index) => (
                        <div key={index} className="flex space-x-2">
                          <span className="text-gray-500">[{log.time}]</span>
                          <span className={
                            log.level === 'error' ? 'text-red-400' :
                            log.level === 'success' ? 'text-green-400' :
                            log.level === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }>
                            {log.level.toUpperCase()}
                          </span>
                          <span>{log.message}</span>
                        </div>
                      ))}
                      {currentPKG.status === 'running' && (
                        <div className="flex space-x-2 animate-pulse">
                          <span className="text-gray-500">[14:3{Math.floor(Math.random() * 10)}]</span>
                          <span className="text-blue-400">INFO</span>
                          <span>処理中...</span>
                          <span className="animate-spin">⚙️</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 生成されたインジケーター */}
                  {currentPKG.indicators.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">🎯 生成インジケーター</h4>
                      <div className="space-y-3">
                        {currentPKG.indicators.map(indicator => (
                          <button
                            key={indicator.id}
                            onClick={() => onSelectIndicator(indicator.id)}
                            className="w-full bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{indicator.symbol}</span>
                                <div>
                                  <div className="font-medium">{indicator.metric}</div>
                                  <div className="text-sm text-gray-600">
                                    {indicator.value}% (信頼度: {indicator.confidence}%)
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {indicator.timestamp}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              {indicator.reason}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PKG設定詳細 */}
                  <div>
                    <h4 className="font-semibold mb-3">⚙️ PKG設定</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">対象キャンペーン:</span>
                          <span className="ml-2">AI議事録作成_LP最適化_v1</span>
                        </div>
                        <div>
                          <span className="text-gray-600">最適化手法:</span>
                          <span className="ml-2">キーワード品質スコア改善 + 入札戦略調整</span>
                        </div>
                        <div>
                          <span className="text-gray-600">目標指標:</span>
                          <span className="ml-2">CVR改善 (目標: +2%)</span>
                        </div>
                        <div>
                          <span className="text-gray-600">リスク制御:</span>
                          <span className="ml-2">日予算上限: ¥10,000 | CPCmax: ¥200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 非Actionノードの場合の詳細 */}
      {node.type !== 'Action' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">ノード詳細</h3>
          <div className="space-y-4">
            {node.type === 'Start' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-medium text-green-800">プレイブック開始</div>
                <div className="text-green-600 text-sm mt-1">
                  {playbook.name} {playbook.version} の実行を開始しました
                </div>
              </div>
            )}
            
            {node.type === 'Guard' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-medium text-blue-800">Guard条件チェック</div>
                <div className="text-blue-600 text-sm mt-1">
                  条件: {node.condition}
                </div>
                <div className="text-blue-600 text-sm">
                  結果: {node.result || '条件チェック完了 - 通過'}
                </div>
              </div>
            )}
            
            {node.type === 'Gate' && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="font-medium text-orange-800">Gate判定待ち</div>
                <div className="text-orange-600 text-sm mt-1">
                  判定条件: {node.condition}
                </div>
                <div className="text-orange-600 text-sm">
                  現在の状況: CVR 19.1% (目標: 20%以上)
                </div>
              </div>
            )}
            
            {node.type === 'Outcome' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="font-medium text-purple-800">最終結果</div>
                <div className="text-purple-600 text-sm mt-1">
                  プレイブック実行の最終結果が確定します
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// レベル5: インジケーター記録詳細 - 記号化データと自動判定根拠
function IndicatorRecordView({ indicatorId }: { indicatorId: string }) {
  // モックインジケーターデータ（詳細版）
  const mockIndicatorDetail = {
    id: 'cvr-1',
    metric: 'CVR',
    symbol: '↗️',
    value: 18.3,
    timestamp: '14:23',
    confidence: 95,
    reason: 'キーワード精度向上により品質スコア改善',
    
    // 記号化プロセス詳細
    symbolizationProcess: {
      rawData: {
        conversions: 18,
        impressions: 1247,
        clicks: 98,
        previousCVR: 16.8,
        hourlyData: [
          { time: '14:00', cvr: 16.8, clicks: 12 },
          { time: '14:05', cvr: 17.2, clicks: 15 },
          { time: '14:10', cvr: 17.9, clicks: 18 },
          { time: '14:15', cvr: 18.1, clicks: 16 },
          { time: '14:20', cvr: 18.3, clicks: 19 },
          { time: '14:23', cvr: 18.3, clicks: 18 }
        ]
      },
      
      aiAnalysis: {
        trendDirection: 'upward',
        magnitude: 'moderate',
        volatility: 'low',
        sustainability: 'high',
        
        decisionTree: [
          { condition: 'CVR > 前回値', result: true, weight: 0.4 },
          { condition: '連続上昇 >= 3回', result: true, weight: 0.3 },
          { condition: '変動率 < 10%', result: true, weight: 0.2 },
          { condition: 'サンプル数 >= 15', result: true, weight: 0.1 }
        ],
        
        symbolMapping: {
          '⬆️': { range: '+5%以上', confidence: '90%以上' },
          '↗️': { range: '+1〜5%', confidence: '80%以上' },
          '→': { range: '±1%以内', confidence: '70%以上' },
          '↘️': { range: '-1〜-5%', confidence: '80%以上' },
          '⬇️': { range: '-5%以下', confidence: '90%以上' }
        }
      },
      
      contextualFactors: [
        { factor: 'キーワード品質スコア', impact: '+12%', confidence: 95 },
        { factor: '時間帯効果', impact: '+3%', confidence: 78 },
        { factor: '競合入札状況', impact: '-2%', confidence: 82 },
        { factor: '季節性要因', impact: '+1%', confidence: 65 }
      ]
    },
    
    // システム活用状況
    systemUsage: {
      currentSystems: [
        { system: 'LP最適化プレイブック', usage: 'Gate条件判定', frequency: 'リアルタイム' },
        { system: 'リスク監視システム', usage: 'アラート閾値', frequency: '5分間隔' },
        { system: 'ポートフォリオ分析', usage: 'パフォーマンス指標', frequency: '1時間間隔' }
      ],
      
      patternRecognition: {
        similarPatterns: [
          { saas: '契約書チェッカー', pattern: '↗️→↗️', correlation: 0.87 },
          { saas: 'ペット管理', pattern: '→↗️↗️', correlation: 0.74 },
          { saas: '家計簿アプリ', pattern: '↗️↗️→', correlation: 0.69 }
        ],
        
        aiLearning: {
          trainingData: '2,847件のCVR記号パターン',
          accuracy: '94.2%',
          lastTrained: '2025-01-14 12:00',
          modelVersion: 'v2.1.3'
        }
      }
    }
  }

  const detail = mockIndicatorDetail

  return (
    <div className="space-y-6">
      {/* インジケーター概要 */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{detail.symbol}</div>
            <div>
              <h2 className="text-2xl font-bold">{detail.metric} インジケーター記録</h2>
              <div className="text-green-100 text-sm mt-1">
                AI専用記号化データ - パターン認識と自動判定に使用
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{detail.value}%</div>
            <div className="text-green-100 text-sm">信頼度: {detail.confidence}%</div>
            <div className="text-green-100 text-xs">{detail.timestamp}</div>
          </div>
        </div>
      </div>

      {/* 記号化プロセス詳細 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer1: 生データ → Symbol 変換過程 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">🔄</span>
              Symbol化変換プロセス
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Layer1: 生データ収集 */}
            <div>
              <h4 className="font-medium mb-2">📊 Layer1: 生データ収集</h4>
              <div className="bg-gray-50 rounded p-3 text-sm space-y-1">
                <div>コンバージョン: {detail.symbolizationProcess.rawData.conversions}件</div>
                <div>インプレッション: {detail.symbolizationProcess.rawData.impressions.toLocaleString()}回</div>
                <div>クリック: {detail.symbolizationProcess.rawData.clicks}回</div>
                <div>前回CVR: {detail.symbolizationProcess.rawData.previousCVR}%</div>
              </div>
            </div>

            {/* 時系列チャート */}
            <div>
              <h4 className="font-medium mb-2">📈 Symbol時系列推移</h4>
              <div className="bg-gray-50 rounded p-3">
                <div className="flex items-end space-x-1 h-20">
                  {detail.symbolizationProcess.rawData.hourlyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-blue-500 w-full rounded-t"
                        style={{ height: `${(data.cvr / 20) * 100}%` }}
                      />
                      <div className="text-xs text-gray-600 mt-1">{data.time.slice(-2)}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  時刻別CVR推移 (14:00-14:23)
                </div>
              </div>
            </div>

            {/* Layer2判定関数 */}
            <div>
              <h4 className="font-medium mb-2">🤖 Layer2判定関数</h4>
              <div className="space-y-2">
                {detail.symbolizationProcess.aiAnalysis.decisionTree.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2 text-sm">
                    <span>{rule.condition}</span>
                    <div className="flex items-center space-x-2">
                      <span className={rule.result ? 'text-green-600' : 'text-red-600'}>
                        {rule.result ? '✓' : '✗'}
                      </span>
                      <span className="text-gray-500">重み: {(rule.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Symbol選択理由 */}
            <div>
              <h4 className="font-medium mb-2">🎯 Symbol選択根拠</h4>
              <div className="bg-blue-50 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{detail.symbol}</span>
                  <span className="font-medium">選択理由</span>
                </div>
                <div className="text-sm text-blue-800">{detail.reason}</div>
                <div className="text-xs text-blue-600 mt-1">
                  範囲: {detail.symbolizationProcess.aiAnalysis.symbolMapping['↗️'].range} | 
                  必要信頼度: {detail.symbolizationProcess.aiAnalysis.symbolMapping['↗️'].confidence}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI学習・パターン認識 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center">
              <span className="text-xl mr-2">🧠</span>
              DAG学習・パターン認識
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Layer3: PKG選択要因 */}
            <div>
              <h4 className="font-medium mb-2">🌐 Layer3: PKG選択要因</h4>
              <div className="space-y-2">
                {detail.symbolizationProcess.contextualFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2 text-sm">
                    <span>{factor.factor}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        factor.impact.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {factor.impact}
                      </span>
                      <span className="text-gray-500">信頼度: {factor.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 類似パターン */}
            <div>
              <h4 className="font-medium mb-2">🔍 類似パターン発見</h4>
              <div className="space-y-2">
                {detail.systemUsage.patternRecognition.similarPatterns.map((pattern, index) => (
                  <div key={index} className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{pattern.saas}</span>
                      <span className="text-sm text-gray-600">
                        相関度: {(pattern.correlation * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      パターン: {pattern.pattern.split('').join(' → ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DAG学習状況 */}
            <div>
              <h4 className="font-medium mb-2">📚 DAG学習状況</h4>
              <div className="bg-purple-50 rounded p-3 space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">学習データ:</span>
                  <span className="ml-2 font-medium">
                    {detail.systemUsage.patternRecognition.aiLearning.trainingData}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">精度:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {detail.systemUsage.patternRecognition.aiLearning.accuracy}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">モデル:</span>
                  <span className="ml-2 font-medium">
                    {detail.systemUsage.patternRecognition.aiLearning.modelVersion}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">最終学習:</span>
                  <span className="ml-2">
                    {detail.systemUsage.patternRecognition.aiLearning.lastTrained}
                  </span>
                </div>
              </div>
            </div>

            {/* 記号マッピング表 */}
            <div>
              <h4 className="font-medium mb-2">📋 記号マッピング規則</h4>
              <div className="space-y-1 text-xs">
                {Object.entries(detail.symbolizationProcess.aiAnalysis.symbolMapping).map(([symbol, info]) => (
                  <div key={symbol} className="flex items-center justify-between bg-gray-50 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{symbol}</span>
                      <span>{info.range}</span>
                    </div>
                    <span className="text-gray-600">{info.confidence}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* システム活用状況 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="font-semibold flex items-center">
            <span className="text-xl mr-2">⚙️</span>
            システム活用状況
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {detail.systemUsage.currentSystems.map((system, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium mb-2">{system.system}</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>用途: {system.usage}</div>
                  <div>頻度: {system.frequency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 重要な注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">
              AI専用データについて
            </h3>
            <div className="text-yellow-700 text-sm space-y-2">
              <p>
                このインジケーターはAIシステムのパターン認識と自動判定のために最適化された記号化データです。
              </p>
              <p>
                人間が見て理解するためのデータではなく、機械学習アルゴリズムが高速で処理し、
                複雑なパターンを重ね合わせて分析するために設計されています。
              </p>
              <p>
                人間向けの可視化データは、MetricsGridコンポーネントで数値・グラフ形式で提供されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}