'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Users,
  Activity,
  RefreshCw,
  Filter,
  Calendar,
  Download
} from 'lucide-react'
import { ClientOnlyIcon } from '@/components/shared/ClientOnlyIcon'

// モックデータ（実際にはConvexから取得）
const mockTradingData = {
  portfolio: {
    totalRevenue: 2456000,
    totalPositions: 12,
    avgCvr: 3.2,
    avgCpa: 4200,
    profitability: 15.3,
    riskScore: 2.1
  },
  positions: [
    {
      id: 42,
      name: 'AI対話支援',
      performance: 18.5,
      revenue: 168000,
      cvr: 3.2,
      cpa: 4200,
      trend: 'up',
      risk: 'low'
    },
    {
      id: 15,
      name: '健康管理',
      performance: 12.3,
      revenue: 95000,
      cvr: 2.8,
      cpa: 3800,
      trend: 'up',
      risk: 'medium'
    },
    {
      id: 28,
      name: 'EC最適化',
      performance: -5.2,
      revenue: 62400,
      cvr: 1.9,
      cpa: 5200,
      trend: 'down',
      risk: 'high'
    }
  ]
}

export default function TradingDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                トレーディングダッシュボード
              </h1>
              <p className="text-gray-600">ポートフォリオパフォーマンスと最適化分析</p>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              トレーディングダッシュボード
            </h1>
            <p className="text-gray-600">
              ポートフォリオ全体のパフォーマンス分析と最適化判断
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">1日</option>
              <option value="7d">7日</option>
              <option value="30d">30日</option>
              <option value="90d">90日</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              レポート
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              更新
            </button>
          </div>
        </div>
      </div>

      {/* ポートフォリオ概要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">総売上</p>
              <p className="text-2xl font-bold">¥{Math.round(mockTradingData.portfolio.totalRevenue / 1000000 * 10) / 10}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
            <span className="text-sm text-blue-100">+{mockTradingData.portfolio.profitability}%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">アクティブポジション</p>
              <p className="text-2xl font-bold text-gray-900">{mockTradingData.portfolio.totalPositions}</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 flex items-center">
            <Activity className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-500">稼働中</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">平均CVR</p>
              <p className="text-2xl font-bold text-gray-900">{mockTradingData.portfolio.avgCvr}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+2.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">リスクスコア</p>
              <p className="text-2xl font-bold text-gray-900">{mockTradingData.portfolio.riskScore}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">低リスク</span>
          </div>
        </div>
      </div>

      {/* ポジションパフォーマンス */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            ポジション別パフォーマンス
          </h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              パフォーマンス順
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              リスク順
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockTradingData.positions.map((position) => (
            <div key={position.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {position.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{position.name}</h3>
                  <p className="text-sm text-gray-500">Position #{position.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    position.performance > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {position.performance > 0 ? '+' : ''}{position.performance}%
                  </div>
                  <div className="text-xs text-gray-500">パフォーマンス</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ¥{Math.round(position.revenue / 1000)}k
                  </div>
                  <div className="text-xs text-gray-500">売上</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {position.cvr}%
                  </div>
                  <div className="text-xs text-gray-500">CVR</div>
                </div>

                <div className="text-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    position.risk === 'low' ? 'text-green-700 bg-green-100' :
                    position.risk === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100'
                  }`}>
                    {position.risk === 'low' ? '低リスク' :
                     position.risk === 'medium' ? '中リスク' : '高リスク'}
                  </div>
                </div>

                <div>
                  {position.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 推奨アクション */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 AI推奨アクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-green-700 mb-2">🟢 拡大推奨</h3>
            <p className="text-sm text-gray-600">Position #42 (AI対話支援) の予算を30%増額</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-yellow-700 mb-2">🟡 要監視</h3>
            <p className="text-sm text-gray-600">Position #15 の CPA が上昇傾向</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-red-700 mb-2">🔴 最適化必要</h3>
            <p className="text-sm text-gray-600">Position #28 の 最適化実行推奨</p>
          </div>
        </div>
      </div>
    </div>
  )
}
