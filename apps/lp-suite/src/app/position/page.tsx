'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Eye,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import { ClientOnlyIcon } from '@/components/shared/ClientOnlyIcon'

// モックデータ（実際にはConvexから取得）
const mockPositions = [
  {
    id: 42,
    name: 'AI対話支援サービス',
    description: '企業向けコミュニケーション改善ツール',
    domain: 'ai-bridge.example.com',
    status: 'active',
    grade: 'A+',
    createdAt: '2025-08-29T10:30:00Z',
    metrics: {
      cvr: 3.2,
      cpa: 4200,
      visitors: 1247,
      conversions: 40,
      revenue: 168000,
      trend: 'up'
    },
    campaigns: 3,
    lastOptimized: '2025-08-29T11:45:00Z'
  },
  {
    id: 15,
    name: 'デジタル健康管理',
    description: '個人向けヘルスケア最適化アプリ',
    domain: 'health-optimize.example.com',
    status: 'active', 
    grade: 'A',
    createdAt: '2025-08-28T14:20:00Z',
    metrics: {
      cvr: 2.8,
      cpa: 3800,
      visitors: 892,
      conversions: 25,
      revenue: 95000,
      trend: 'up'
    },
    campaigns: 2,
    lastOptimized: '2025-08-29T09:15:00Z'
  },
  {
    id: 28,
    name: 'ECサイト最適化ツール',
    description: '中小企業向けEC売上向上支援',
    domain: 'ec-boost.example.com',
    status: 'warning',
    grade: 'B',
    createdAt: '2025-08-27T16:45:00Z',
    metrics: {
      cvr: 1.9,
      cpa: 5200,
      visitors: 634,
      conversions: 12,
      revenue: 62400,
      trend: 'down'
    },
    campaigns: 1,
    lastOptimized: '2025-08-28T13:30:00Z'
  },
  {
    id: 7,
    name: 'リモートワーク支援',
    description: 'チーム生産性向上プラットフォーム',
    domain: 'remote-boost.example.com',
    status: 'paused',
    grade: 'D',
    createdAt: '2025-08-26T11:15:00Z',
    metrics: {
      cvr: 0.8,
      cpa: 8900,
      visitors: 345,
      conversions: 3,
      revenue: 26700,
      trend: 'down'
    },
    campaigns: 1,
    lastOptimized: '2025-08-27T08:20:00Z'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case 'paused': return <Clock className="w-5 h-5 text-gray-500" />
    default: return <Activity className="w-5 h-5 text-blue-500" />
  }
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A+': return 'text-green-700 bg-green-100 border-green-300'
    case 'A': return 'text-green-600 bg-green-50 border-green-200'
    case 'B': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'D': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export default function PositionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  const filteredPositions = mockPositions.filter(position => {
    const matchesSearch = position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || position.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ポジション管理
            </h1>
            <p className="text-gray-600">
              検証中のランディングページとそのパフォーマンス管理
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/position/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              新しいポジション
            </Link>
          </div>
        </div>
      </div>

      {/* フィルター・検索 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ポジション名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全ステータス</option>
            <option value="active">アクティブ</option>
            <option value="warning">要注意</option>
            <option value="paused">一時停止</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="created">作成日順</option>
            <option value="cvr">CVR順</option>
            <option value="revenue">売上順</option>
            <option value="grade">グレード順</option>
          </select>
        </div>
      </div>

      {/* ポジション一覧 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPositions.map((position) => (
          <div key={position.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              {/* 基本情報 */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Link 
                    href={`/position/${position.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {position.name}
                  </Link>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getGradeColor(position.grade)}`}>
                    {position.grade}
                  </div>
                  
                  {getStatusIcon(position.status)}
                </div>
                
                <p className="text-gray-600 mb-2">{position.description}</p>
                <p className="text-sm text-gray-500">{position.domain}</p>
                
                {/* メトリクス */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-lg font-semibold text-blue-600">{position.metrics.cvr}%</span>
                      {position.metrics.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">CVR</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      ¥{position.metrics.cpa.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">CPA</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {position.metrics.visitors.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">訪問者</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {position.metrics.conversions}
                    </div>
                    <div className="text-xs text-gray-500">コンバージョン</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      ¥{Math.round(position.metrics.revenue / 1000)}k
                    </div>
                    <div className="text-xs text-gray-500">売上</div>
                  </div>
                </div>
              </div>
              
              {/* アクション */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/position/${position.id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  詳細
                </Link>
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* 追加情報 */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>キャンペーン数: {position.campaigns}</span>
                <span>作成日: {new Date(position.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
              <div>
                最終最適化: {new Date(position.lastOptimized).toLocaleString('ja-JP')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空の状態 */}
      {filteredPositions.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? '条件に一致するポジションが見つかりません'
              : 'まだポジションがありません'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/position/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              最初のポジションを作成
            </Link>
          )}
        </div>
      )}
    </div>
  )
}