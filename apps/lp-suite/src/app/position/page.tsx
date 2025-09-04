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

type Position = {
  id: string
  name: string
  description: string
  domain: string
  status: 'active' | 'warning' | 'paused'
  grade: string
  createdAt: string
  metrics: {
    cvr: number
    cpa: number
    visitors: number
    conversions: number
    revenue: number
    trend: 'down'
  }
  campaigns: number
  lastOptimized: string
}

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
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  // ConvexからデータとGoogle Ads実データを取得
  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true)
        const response = await fetch('/api/positions', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Failed to fetch positions: ${response.status}`)
        }
        const data = await response.json()
        
        // 全サービス統合Google Adsデータ取得
        console.log('全サービス実データ統合API呼び出し開始')
        let allServicesData = null
        
        try {
          const allServicesResponse = await fetch('/api/all-services-ads?timeRange=1d&sync=true', { cache: 'no-store' })
          if (allServicesResponse.ok) {
            allServicesData = await allServicesResponse.json()
            console.log('全サービス実データ取得成功:', allServicesData.services.length, 'サービス')
          }
        } catch (error) {
          console.warn('全サービス実データ取得エラー:', error)
        }

        // キャンペーン数データを取得
        console.log('全プロダクトのキャンペーン数取得中')
        let campaignCounts: Record<string, any> = {}
        
        try {
          const campaignResponse = await fetch('/api/campaigns/counts', { cache: 'no-store' })
          if (campaignResponse.ok) {
            const campaignData = await campaignResponse.json()
            campaignCounts = campaignData.campaignsByProduct || {}
            console.log('キャンペーン数取得成功:', campaignCounts)
          }
        } catch (error) {
          console.warn('キャンペーン数取得エラー:', error)
        }

        // 各プロダクトに対応するGoogle Adsデータをマッピング
        const positionsWithAdsData = data.positions.map((p: any) => {
          let adsMetrics = { cvr: 0, cpa: 0, visitors: 0, conversions: 0, revenue: 0, trend: 'down' as 'down' }
          
          // 全サービスAPIから該当データを検索
          const serviceData = allServicesData?.services?.find(s => s.productId === p.id)
          
          if (serviceData && serviceData.metrics) {
            const metrics = serviceData.metrics
            console.log(`${p.id} 実データ適用:`, metrics)
            
            adsMetrics = {
              cvr: metrics.cvr || 0,
              cpa: metrics.cpa || 0,
              visitors: metrics.clicks || 0,
              conversions: metrics.conversions || 0,
              revenue: metrics.conversions * 2000, // 推定単価
              trend: 'down' as const
            }
          } else {
            console.warn(`${p.id}: 実データなし、デフォルト値使用`)
          }
          
          // キャンペーン数を取得（Convexから）
          const campaignData = campaignCounts[p.id] || { total: 0, active: 0, paused: 0 }
          
          return {
            id: p.id,
            name: p.name,
            description: getDescriptionByProductId(p.id),
            domain: getDomainFromUrl(p.lpUrl),
            status: getStatusFromMetrics(adsMetrics.cvr, adsMetrics.cpa),
            grade: getGradeFromMetrics(adsMetrics.cvr, adsMetrics.cpa),
            createdAt: new Date().toISOString(),
            metrics: adsMetrics,
            campaigns: campaignData.total,
            lastOptimized: new Date().toISOString(),
            hasRealData: serviceData?.hasRealData || false // 実データフラグ追加
          }
        })
        
        setPositions(positionsWithAdsData)
      } catch (err: any) {
        setError(err.message || '読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPositions()
  }, [])

  // ヘルパー関数
  function getDescriptionByProductId(productId: string): string {
    const descriptions: Record<string, string> = {
      'ai-bridge': '企業向けコミュニケーション改善ツール',
      'ai-coach': '個人向けヘルスケア最適化アプリ',
      'ai-stylist': 'パーソナルスタイリングサービス',
      'watashi-compass': '自分らしさ発見支援サービス',
      'mywa': '個人ブランディング支援プラットフォーム',
      'ai-legacy-creator': 'デジタル遺産管理サービス'
    }
    return descriptions[productId] || 'LP検証中のプロダクト'
  }

  function getDomainFromUrl(url: string): string {
    try {
      return new URL(url).hostname
    } catch {
      return 'example.com'
    }
  }

  function getStatusFromMetrics(cvr: number, cpa: number): 'active' | 'warning' | 'paused' {
    // CVR 0%の現実を踏まえたステータス判定
    if (cvr > 0 && cpa > 0 && cpa < 5000) return 'active'  // コンバージョンありで安いCPA
    if (cvr === 0 && cpa > 0 && cpa < 100) return 'warning' // クリックはあるがコンバージョンなし
    return 'paused' // パフォーマンス悪い
  }

  function getGradeFromMetrics(cvr: number, cpa: number): string {
    // 実データに基づくグレード（CVR 0%が現実）
    if (cvr >= 2) return 'A+'  // 非常に良い
    if (cvr >= 1) return 'A'   // 良い
    if (cvr >= 0.5) return 'B' // 平均的
    if (cvr === 0 && cpa > 0 && cpa < 100) return 'C' // クリックはある
    return 'D' // 改善必要
  }

  function parseCpa(cpl: string): number {
    if (!cpl) return 0
    return parseInt(cpl.replace(/[¥,]/g, '')) || 0
  }

  const filteredPositions = positions.filter(position => {
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

      {/* ローディング状態 */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">読み込み中...</p>
        </div>
      )}

      {/* エラー状態 */}
      {error && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* ポジション一覧 */}
      {!loading && !error && (
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
                      <TrendingDown className="w-4 h-4 text-red-500" />
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
      )}

      {/* 空の状態 */}
      {!loading && !error && filteredPositions.length === 0 && (
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