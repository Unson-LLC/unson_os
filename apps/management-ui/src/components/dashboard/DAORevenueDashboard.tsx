import React from 'react'

interface Contributor {
  name: string
  points: number
  amount: number
}

interface DAORevenueData {
  totalRevenue: number
  operatingCost: number
  daoPool: number
  treasury: number
  treasuryChange: number
  contributors: Contributor[]
}

interface DAORevenueDashboardProps {
  data: DAORevenueData
  onDetailClick?: () => void
  onContributorClick?: (name: string) => void
}

export function DAORevenueDashboard({ 
  data,
  onDetailClick,
  onContributorClick
}: DAORevenueDashboardProps) {
  // Green Phase: ベタ書きで機能実装
  return (
    <div className="bg-white rounded-lg shadow" role="region" aria-label="収益分配">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">💰 収益分配ダッシュボード</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 収益分配情報 */}
          <div>
            <h3 className="font-semibold mb-4">今月の収益分配:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span>総売上:</span>
                <span className="ml-2 font-bold">
                  ¥{data.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <span>├─ 運営費(60%):</span>
                  <span className="ml-2">¥{data.operatingCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span>└─ DAOプール(40%):</span>
                  <span className="ml-2">¥{data.daoPool.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <span>DAOトレジャリー:</span>
                  <span className="ml-2 font-bold">
                    ¥{data.treasury.toLocaleString()}
                  </span>
                  <span className="ml-2 text-green-600">
                    ↗️+{data.treasuryChange}%
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={onDetailClick}
            >
              詳細を見る
            </button>
          </div>
          
          {/* 貢献者ランキング */}
          <div>
            <h3 className="font-semibold mb-4">🏆 貢献度TOP5:</h3>
            <div className="space-y-2 text-sm">
              {data.contributors.map((contributor, index) => (
                <div key={contributor.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span>{index + 1}.</span>
                    <button 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={() => onContributorClick?.(contributor.name)}
                    >
                      {contributor.name}
                    </button>
                    <span className="text-gray-500">
                      ({contributor.points.toLocaleString()} pts)
                    </span>
                  </div>
                  <span className="font-medium">
                    → ¥{contributor.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* グラフ表示（モック） */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
            <div 
              role="img" 
              aria-label="収益分配円グラフ"
              className="text-gray-400"
            >
              [収益分配円グラフ]
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
            <div 
              role="img" 
              aria-label="貢献度棒グラフ"
              className="text-gray-400"
            >
              [貢献度棒グラフ]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}