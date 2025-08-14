import React, { useState } from 'react'

interface SaaSItem {
  id: string
  name: string
  status: '🟢' | '🟡' | '🔴'
  phase: '研究' | 'LP' | 'MVP' | '収益化' | 'スケール' | 'サンセット'
  mrr: number
  mrrChange: number
  dau: number
  dauChange: number
  cvr: number
  cvrChange: number
  currentPkg?: string
  launchDate: string
  lastUpdated: string
}

const mockSaaSData: SaaSItem[] = [
  {
    id: '1',
    name: '猫カフェ予約',
    status: '🔴',
    phase: '収益化',
    mrr: 38000,
    mrrChange: -3000,
    dau: 115,
    dauChange: -5,
    cvr: 6.5,
    cvrChange: -1.5,
    currentPkg: 'pkg_crisis_recovery',
    launchDate: '2024-10-15',
    lastUpdated: '2025-01-15 14:35'
  },
  {
    id: '2',
    name: '家計簿アプリ',
    status: '🟢',
    phase: 'スケール',
    mrr: 250000,
    mrrChange: 15000,
    dau: 450,
    dauChange: 25,
    cvr: 15.2,
    cvrChange: 2.1,
    currentPkg: 'pkg_fast_mvp',
    launchDate: '2024-08-01',
    lastUpdated: '2025-01-15 14:00'
  },
  {
    id: '3',
    name: '英会話マッチ',
    status: '🟡',
    phase: 'MVP',
    mrr: 45000,
    mrrChange: 0,
    dau: 89,
    dauChange: -2,
    cvr: 8.5,
    cvrChange: 0.5,
    currentPkg: 'pkg_optimization',
    launchDate: '2024-12-01',
    lastUpdated: '2025-01-15 13:45'
  },
  {
    id: '4',
    name: 'ペット管理',
    status: '🟢',
    phase: '収益化',
    mrr: 78000,
    mrrChange: 5000,
    dau: 234,
    dauChange: 12,
    cvr: 11.3,
    cvrChange: 1.2,
    currentPkg: 'pkg_standard_growth',
    launchDate: '2024-09-20',
    lastUpdated: '2025-01-15 14:20'
  },
  {
    id: '5',
    name: '在庫管理Pro',
    status: '🔴',
    phase: 'サンセット',
    mrr: 8500,
    mrrChange: -1500,
    dau: 8,
    dauChange: -3,
    cvr: 0.8,
    cvrChange: -0.5,
    currentPkg: 'pkg_sunset',
    launchDate: '2024-03-15',
    lastUpdated: '2025-01-15 12:00'
  },
  {
    id: '6',
    name: 'AI議事録作成',
    status: '🟢',
    phase: 'LP',
    mrr: 0,
    mrrChange: 0,
    dau: 45,
    dauChange: 45,
    cvr: 18.0,
    cvrChange: 18.0,
    currentPkg: 'pkg_lp_validation',
    launchDate: '2025-01-10',
    lastUpdated: '2025-01-15 14:30'
  },
  {
    id: '7',
    name: '契約書チェッカー',
    status: '🟢',
    phase: '研究',
    mrr: 0,
    mrrChange: 0,
    dau: 0,
    dauChange: 0,
    cvr: 0,
    cvrChange: 0,
    currentPkg: 'pkg_research',
    launchDate: '2025-01-14',
    lastUpdated: '2025-01-15 10:00'
  },
  {
    id: '8',
    name: '勤怠システム',
    status: '🔴',
    phase: 'サンセット',
    mrr: 12000,
    mrrChange: -2000,
    dau: 15,
    dauChange: -5,
    cvr: 0.9,
    cvrChange: -0.3,
    currentPkg: 'pkg_sunset',
    launchDate: '2024-04-01',
    lastUpdated: '2025-01-15 11:30'
  }
]

export function SaaSList() {
  const [sortBy, setSortBy] = useState<'name' | 'mrr' | 'dau' | 'cvr' | 'phase'>('mrr')
  const [filterPhase, setFilterPhase] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredData = mockSaaSData.filter(item => {
    if (filterPhase !== 'all' && item.phase !== filterPhase) return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'mrr':
        return b.mrr - a.mrr
      case 'dau':
        return b.dau - a.dau
      case 'cvr':
        return b.cvr - a.cvr
      case 'phase':
        return a.phase.localeCompare(b.phase)
      default:
        return 0
    }
  })

  const formatNumber = (num: number) => num.toLocaleString()
  const formatChange = (num: number) => {
    if (num === 0) return '→'
    return num > 0 ? `↗️ +${formatNumber(num)}` : `↘️ ${formatNumber(num)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 SaaS一覧</h2>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            + 新規SaaS追加
          </button>
        </div>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-sm text-gray-600 mr-2">フェーズ:</label>
            <select 
              className="border rounded px-3 py-1"
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="研究">研究</option>
              <option value="LP">LP</option>
              <option value="MVP">MVP</option>
              <option value="収益化">収益化</option>
              <option value="スケール">スケール</option>
              <option value="サンセット">サンセット</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">ステータス:</label>
            <select 
              className="border rounded px-3 py-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="🟢">🟢 正常</option>
              <option value="🟡">🟡 注意</option>
              <option value="🔴">🔴 危険</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">並び順:</label>
            <select 
              className="border rounded px-3 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="mrr">MRR順</option>
              <option value="dau">DAU順</option>
              <option value="cvr">CVR順</option>
              <option value="name">名前順</option>
              <option value="phase">フェーズ順</option>
            </select>
          </div>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">総SaaS数</div>
          <div className="text-2xl font-bold">{sortedData.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">総MRR</div>
          <div className="text-2xl font-bold">
            ¥{formatNumber(sortedData.reduce((sum, item) => sum + item.mrr, 0))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">総DAU</div>
          <div className="text-2xl font-bold">
            {formatNumber(sortedData.reduce((sum, item) => sum + item.dau, 0))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">平均CVR</div>
          <div className="text-2xl font-bold">
            {(sortedData.reduce((sum, item) => sum + item.cvr, 0) / sortedData.length).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SaaS名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  フェーズ
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DAU
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CVR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  実行中PKG
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-2xl">{item.status}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">開始: {item.launchDate}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.phase === 'サンセット' ? 'bg-red-100 text-red-800' :
                      item.phase === 'スケール' ? 'bg-green-100 text-green-800' :
                      item.phase === '収益化' ? 'bg-purple-100 text-purple-800' :
                      item.phase === 'MVP' ? 'bg-yellow-100 text-yellow-800' :
                      item.phase === 'LP' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.phase}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div>
                      <div className="text-sm font-medium">¥{formatNumber(item.mrr)}</div>
                      <div className="text-xs text-gray-500">{formatChange(item.mrrChange)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div>
                      <div className="text-sm font-medium">{formatNumber(item.dau)}</div>
                      <div className="text-xs text-gray-500">{formatChange(item.dauChange)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div>
                      <div className="text-sm font-medium">{item.cvr.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">
                        {item.cvrChange > 0 ? '↗️' : item.cvrChange < 0 ? '↘️' : '→'} {Math.abs(item.cvrChange).toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.currentPkg && (
                      <span className="text-xs text-blue-600">{item.currentPkg}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                      詳細
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}