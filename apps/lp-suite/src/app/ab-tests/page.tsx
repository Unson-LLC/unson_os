'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TestTube, 
  Play,
  Pause,
  BarChart3,
  Target,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  Eye,
  MoreVertical
} from 'lucide-react'
import { ClientOnlyIcon } from '@/components/shared/ClientOnlyIcon'

// モックデータ（実際にはConvex + PostHogから取得）
const mockAbTests = [
  {
    id: 'ab-001',
    name: 'AI対話支援 ヒーローセクション',
    positionId: 42,
    positionName: 'AI対話支援サービス',
    status: 'running',
    createdAt: '2025-08-25T10:00:00Z',
    duration: 7,
    progress: {
      daysRunning: 4,
      totalVisitors: 1247,
      controlVisitors: 623,
      variantVisitors: 624,
      significance: 0.87
    },
    variants: [
      {
        name: 'Control',
        description: 'オリジナルLP',
        visitors: 623,
        conversions: 20,
        cvr: 3.21,
        isWinning: false
      },
      {
        name: 'Variant A',
        description: 'AI最適化版（より具体的なベネフィット）',
        visitors: 624,
        conversions: 28,
        cvr: 4.49,
        isWinning: true
      }
    ],
    metrics: {
      improvement: 39.9,
      confidence: 87,
      minSampleSize: 100,
      recommendation: '統計的有意性まであと2日継続推奨'
    }
  },
  {
    id: 'ab-002',
    name: '健康管理アプリ 価格表示',
    positionId: 15,
    positionName: 'デジタル健康管理',
    status: 'completed',
    createdAt: '2025-08-20T14:30:00Z',
    duration: 14,
    progress: {
      daysRunning: 14,
      totalVisitors: 2156,
      controlVisitors: 1078,
      variantVisitors: 1078,
      significance: 0.95
    },
    variants: [
      {
        name: 'Control',
        description: '月額制表示',
        visitors: 1078,
        conversions: 32,
        cvr: 2.97,
        isWinning: false
      },
      {
        name: 'Variant A', 
        description: '年額制（月額換算）表示',
        visitors: 1078,
        conversions: 41,
        cvr: 3.80,
        isWinning: true
      }
    ],
    metrics: {
      improvement: 27.9,
      confidence: 95,
      minSampleSize: 100,
      recommendation: '統計的有意性達成！Variant A の採用を推奨'
    }
  },
  {
    id: 'ab-003',
    name: 'EC最適化 CTAボタン',
    positionId: 28,
    positionName: 'ECサイト最適化ツール',
    status: 'paused',
    createdAt: '2025-08-27T09:15:00Z',
    duration: 7,
    progress: {
      daysRunning: 2,
      totalVisitors: 234,
      controlVisitors: 117,
      variantVisitors: 117,
      significance: 0.23
    },
    variants: [
      {
        name: 'Control',
        description: '青色CTAボタン',
        visitors: 117,
        conversions: 2,
        cvr: 1.71,
        isWinning: true
      },
      {
        name: 'Variant A',
        description: 'オレンジ色CTAボタン',
        visitors: 117,
        conversions: 1,
        cvr: 0.85,
        isWinning: false
      }
    ],
    metrics: {
      improvement: -50.3,
      confidence: 23,
      minSampleSize: 100,
      recommendation: 'サンプルサイズ不足。トラフィック増加または継続期間延長が必要'
    }
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <Play className="w-5 h-5 text-green-500" />
    case 'completed': return <CheckCircle className="w-5 h-5 text-blue-500" />
    case 'paused': return <Pause className="w-5 h-5 text-gray-500" />
    default: return <Clock className="w-5 h-5 text-yellow-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'text-green-600 bg-green-50 border-green-200'
    case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200'  
    case 'paused': return 'text-gray-600 bg-gray-50 border-gray-200'
    default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }
}

export default function ABTestsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  
  const filteredTests = mockAbTests.filter(test => 
    statusFilter === 'all' || test.status === statusFilter
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              A/Bテスト管理
            </h1>
            <p className="text-gray-600">
              PostHog Feature Flags統合による同一URL A/Bテスト管理
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/integration"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              統合ワークフローから開始
            </Link>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              新しいA/Bテスト
            </button>
          </div>
        </div>
      </div>

      {/* サマリー統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">実行中テスト</p>
              <p className="text-2xl font-bold text-green-600">
                {mockAbTests.filter(t => t.status === 'running').length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">完了テスト</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockAbTests.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均改善率</p>
              <p className="text-2xl font-bold text-purple-600">+32%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">総参加者</p>
              <p className="text-2xl font-bold text-gray-900">3.6K</p>
            </div>
            <Users className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全ステータス</option>
            <option value="running">実行中</option>
            <option value="completed">完了</option>
            <option value="paused">一時停止</option>
          </select>
        </div>
      </div>

      {/* A/Bテスト一覧 */}
      <div className="space-y-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white rounded-lg border border-gray-200 p-6">
            {/* ヘッダー */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.positionName} (Position #{test.positionId})</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                      {test.status === 'running' && '実行中'}
                      {test.status === 'completed' && '完了'}
                      {test.status === 'paused' && '一時停止'}
                    </div>
                    <span className="text-xs text-gray-500">
                      {test.progress.daysRunning}/{test.duration}日経過
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>進捗状況</span>
                <span>{test.progress.totalVisitors.toLocaleString()} 参加者</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((test.progress.daysRunning / test.duration) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* バリアント比較 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {test.variants.map((variant, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  variant.isWinning ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{variant.name}</h4>
                    {variant.isWinning && (
                      <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        勝利中
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{variant.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {variant.visitors.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">訪問者</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-600">
                        {variant.conversions}
                      </div>
                      <div className="text-xs text-gray-500">コンバージョン</div>
                    </div>
                    <div>
                      <div className={`text-lg font-semibold ${
                        variant.isWinning ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {variant.cvr}%
                      </div>
                      <div className="text-xs text-gray-500">CVR</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 統計・推奨事項 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    test.metrics.improvement > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.metrics.improvement > 0 ? '+' : ''}{test.metrics.improvement}%
                  </div>
                  <div className="text-xs text-gray-500">改善率</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    test.metrics.confidence >= 95 ? 'text-green-600' : 
                    test.metrics.confidence >= 80 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {test.metrics.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">統計的信頼度</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {test.progress.significance * 100}%
                  </div>
                  <div className="text-xs text-gray-500">統計的有意性</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-start space-x-2">
                  {test.metrics.confidence >= 95 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : test.metrics.confidence >= 80 ? (
                    <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI推奨</p>
                    <p className="text-sm text-gray-600">{test.metrics.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空の状態 */}
      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {statusFilter !== 'all' 
              ? `${statusFilter}のA/Bテストが見つかりません`
              : 'まだA/Bテストがありません'
            }
          </p>
        </div>
      )}
    </div>
  )
}