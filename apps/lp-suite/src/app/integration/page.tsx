'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  FileText, 
  Target, 
  TestTube, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { ClientOnlyIcon } from '@/components/shared/ClientOnlyIcon'

interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  duration?: string
  icon: any
}

const mockWorkflows = [
  {
    id: 'wf-001',
    name: 'AI対話支援サービス',
    description: '企業向けコミュニケーション改善ツール',
    status: 'completed' as const,
    createdAt: '2025-08-29T10:30:00Z',
    completedAt: '2025-08-29T11:45:00Z',
    steps: [
      { id: 'gen', name: 'LP生成', description: 'AI支援LP作成完了', status: 'completed', duration: '45秒', icon: FileText },
      { id: 'val', name: '検証開始', description: 'Position ID 42で検証中', status: 'completed', duration: '30秒', icon: Target },
      { id: 'ab', name: 'A/Bテスト', description: 'PostHog統合テスト実行中', status: 'in_progress', icon: TestTube },
      { id: 'opt', name: '最適化', description: 'AI自動最適化待機', status: 'pending', icon: TrendingUp }
    ] as WorkflowStep[],
    metrics: {
      currentCvr: 3.2,
      targetCvr: 5.0,
      improvement: 15.3,
      visitors: 245
    }
  },
  {
    id: 'wf-002', 
    name: 'デジタル健康管理',
    description: '個人向けヘルスケア最適化アプリ',
    status: 'in_progress' as const,
    createdAt: '2025-08-29T12:00:00Z',
    steps: [
      { id: 'gen', name: 'LP生成', description: 'コピーライティング完了', status: 'completed', duration: '38秒', icon: FileText },
      { id: 'val', name: '検証開始', description: 'ドメイン設定中', status: 'in_progress', icon: Target },
      { id: 'ab', name: 'A/Bテスト', description: '検証完了後開始予定', status: 'pending', icon: TestTube },
      { id: 'opt', name: '最適化', description: 'AI最適化待機', status: 'pending', icon: TrendingUp }
    ] as WorkflowStep[]
  }
]

export default function IntegrationPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              統合ワークフロー管理
            </h1>
            <p className="text-gray-600">
              LP生成→検証→A/Bテスト→最適化の完全自動化プロセス
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/generator"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Zap className="w-4 h-4 mr-2" />
              新しいワークフロー開始
            </Link>
          </div>
        </div>
      </div>

      {/* ワークフロー一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ワークフロー リスト */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">
            アクティブワークフロー
          </h2>
          
          {mockWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                selectedWorkflow === workflow.id 
                  ? 'border-blue-300 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {workflow.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {workflow.description}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                  {workflow.status === 'completed' && '完了'}
                  {workflow.status === 'in_progress' && '実行中'}
                  {workflow.status === 'error' && 'エラー'}
                </div>
              </div>

              {/* プログレスバー */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>進捗状況</span>
                  <span>{workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length} 完了</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(workflow.steps.filter(s => s.status === 'completed').length / workflow.steps.length) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* メトリクス（完了済みワークフローのみ） */}
              {workflow.metrics && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">現在CVR:</span>
                    <span className="ml-1 font-medium text-blue-600">{workflow.metrics.currentCvr}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">改善率:</span>
                    <span className="ml-1 font-medium text-green-600">+{workflow.metrics.improvement}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">訪問者:</span>
                    <span className="ml-1 font-medium">{workflow.metrics.visitors}人</span>
                  </div>
                  <div>
                    <span className="text-gray-500">目標CVR:</span>
                    <span className="ml-1 font-medium text-purple-600">{workflow.metrics.targetCvr}%</span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  開始: {new Date(workflow.createdAt).toLocaleString('ja-JP')}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-yellow-600">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ワークフロー詳細 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            ワークフロー詳細
          </h2>
          
          {selectedWorkflow ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {(() => {
                const workflow = mockWorkflows.find(w => w.id === selectedWorkflow)
                if (!workflow) return null

                return (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {workflow.name}
                      </h3>
                      <p className="text-gray-600">
                        {workflow.description}
                      </p>
                    </div>

                    {/* ステップ詳細 */}
                    <div className="space-y-4">
                      {workflow.steps.map((step, index) => {
                        const StepIcon = step.icon
                        return (
                          <div key={step.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="flex-shrink-0">
                              {getStatusIcon(step.status)}
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                <StepIcon className="w-5 h-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {step.name}
                                </h4>
                                {step.duration && (
                                  <span className="text-xs text-gray-500">
                                    {step.duration}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {step.description}
                              </p>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <div className="flex-shrink-0">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* アクション */}
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/position/42`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          検証ページを見る →
                        </Link>
                        <Link
                          href={`/trading`}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          分析ダッシュボード →
                        </Link>
                      </div>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        再実行
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                ワークフローを選択して詳細を表示
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}