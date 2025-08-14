import React, { useState } from 'react'

interface SaaSLifecycle {
  id: string
  name: string
  phase: '新規' | '成長' | '成熟' | '衰退' | 'サンセット'
  mrr: number
  dau: number
  cvr: number
  daysUntilSunset?: number
  sunsetReason?: string
  replacementCandidate?: string
  monthlyTrend: '⬆️' | '↗️' | '→' | '↘️' | '⬇️'
}

const mockPortfolioData: SaaSLifecycle[] = [
  // サンセット予定
  {
    id: '1',
    name: '在庫管理Pro',
    phase: 'サンセット',
    mrr: 8500,
    dau: 8,
    cvr: 0.8,
    daysUntilSunset: 7,
    sunsetReason: 'MRR < ¥10,000',
    replacementCandidate: 'AI在庫最適化',
    monthlyTrend: '⬇️'
  },
  {
    id: '2',
    name: '日報アプリ',
    phase: 'サンセット',
    mrr: 12000,
    dau: 10,
    cvr: 0.9,
    daysUntilSunset: 10,
    sunsetReason: 'DAU < 10',
    replacementCandidate: 'チーム日報AI',
    monthlyTrend: '⬇️'
  },
  {
    id: '3',
    name: '勤怠システム',
    phase: 'サンセット',
    mrr: 15000,
    dau: 15,
    cvr: 0.9,
    daysUntilSunset: 15,
    sunsetReason: 'CVR < 1%',
    replacementCandidate: 'スマート勤怠',
    monthlyTrend: '↘️'
  },
  // 成長フェーズ
  {
    id: '4',
    name: 'AI議事録作成',
    phase: '新規',
    mrr: 0,
    dau: 45,
    cvr: 18.0,
    monthlyTrend: '⬆️'
  },
  {
    id: '5',
    name: '契約書チェッカー',
    phase: '新規',
    mrr: 0,
    dau: 0,
    cvr: 0,
    monthlyTrend: '→'
  },
  {
    id: '6',
    name: '家計簿アプリ',
    phase: '成長',
    mrr: 250000,
    dau: 450,
    cvr: 15.2,
    monthlyTrend: '⬆️'
  },
  {
    id: '7',
    name: 'ペット管理',
    phase: '成熟',
    mrr: 78000,
    dau: 234,
    cvr: 11.3,
    monthlyTrend: '↗️'
  },
  {
    id: '8',
    name: '猫カフェ予約',
    phase: '衰退',
    mrr: 38000,
    dau: 115,
    cvr: 6.5,
    monthlyTrend: '⬇️'
  }
]

const pipelineData = [
  {
    id: '1',
    name: 'AI在庫最適化',
    status: '市場調査',
    marketSize: '¥120B',
    estimatedCVR: 22,
    launchDate: '2025-02-01'
  },
  {
    id: '2',
    name: 'チーム日報AI',
    status: 'LP作成中',
    marketSize: '¥45B',
    estimatedCVR: 15,
    launchDate: '2025-02-15'
  },
  {
    id: '3',
    name: 'スマート勤怠',
    status: 'アイデア',
    marketSize: '¥80B',
    estimatedCVR: 12,
    launchDate: '2025-03-01'
  },
  {
    id: '4',
    name: '請求書自動化',
    status: 'MVP開発',
    marketSize: '¥200B',
    estimatedCVR: 25,
    launchDate: '2025-01-25'
  }
]

export function PortfolioEvolution() {
  const [selectedPhase, setSelectedPhase] = useState<string>('all')
  const [showSunsetOnly, setShowSunsetOnly] = useState(false)

  const phaseDistribution = {
    '新規': mockPortfolioData.filter(s => s.phase === '新規').length,
    '成長': mockPortfolioData.filter(s => s.phase === '成長').length,
    '成熟': mockPortfolioData.filter(s => s.phase === '成熟').length,
    '衰退': mockPortfolioData.filter(s => s.phase === '衰退').length,
    'サンセット': mockPortfolioData.filter(s => s.phase === 'サンセット').length
  }

  const filteredData = mockPortfolioData.filter(item => {
    if (showSunsetOnly && item.phase !== 'サンセット') return false
    if (selectedPhase !== 'all' && item.phase !== selectedPhase) return false
    return true
  })

  const totalResourceSaving = mockPortfolioData
    .filter(s => s.phase === 'サンセット')
    .reduce((sum, s) => sum + s.mrr, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🔄 ポートフォリオ進化</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showSunsetOnly}
              onChange={(e) => setShowSunsetOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">サンセット予定のみ</span>
          </label>
          <select
            className="border rounded px-3 py-1"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <option value="all">全フェーズ</option>
            <option value="新規">新規</option>
            <option value="成長">成長</option>
            <option value="成熟">成熟</option>
            <option value="衰退">衰退</option>
            <option value="サンセット">サンセット</option>
          </select>
        </div>
      </div>

      {/* ライフサイクル分布 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">ライフサイクル分布</h3>
        <div className="flex items-center justify-between space-x-2 mb-4">
          {Object.entries(phaseDistribution).map(([phase, count]) => (
            <div key={phase} className="text-center flex-1">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-gray-600">{phase}</div>
            </div>
          ))}
        </div>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div className="bg-blue-500" style={{ width: `${(phaseDistribution['新規'] / mockPortfolioData.length) * 100}%` }} />
          <div className="bg-green-500" style={{ width: `${(phaseDistribution['成長'] / mockPortfolioData.length) * 100}%` }} />
          <div className="bg-yellow-500" style={{ width: `${(phaseDistribution['成熟'] / mockPortfolioData.length) * 100}%` }} />
          <div className="bg-orange-500" style={{ width: `${(phaseDistribution['衰退'] / mockPortfolioData.length) * 100}%` }} />
          <div className="bg-red-500" style={{ width: `${(phaseDistribution['サンセット'] / mockPortfolioData.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* サンセット予定 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center justify-between">
              ⚠️ サンセット予定
              <span className="text-sm text-gray-500">リソース削減: ¥{totalResourceSaving.toLocaleString()}/月</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {mockPortfolioData.filter(s => s.phase === 'サンセット').map(saas => (
              <div key={saas.id} className="border rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{saas.name}</span>
                    <span className="ml-2 text-red-600 text-sm">
                      ({saas.daysUntilSunset}日後)
                    </span>
                  </div>
                  <span className="text-2xl">{saas.monthlyTrend}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>理由: {saas.sunsetReason}</div>
                  <div>MRR: ¥{saas.mrr.toLocaleString()} | DAU: {saas.dau} | CVR: {saas.cvr}%</div>
                  {saas.replacementCandidate && (
                    <div className="mt-2 text-blue-600">
                      → 代替候補: {saas.replacementCandidate}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
                    延命検討
                  </button>
                  <button className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                    サンセット実行
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新規パイプライン */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold">🚀 新規パイプライン</h3>
          </div>
          <div className="p-6 space-y-4">
            {pipelineData.map(item => (
              <div key={item.id} className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded">
                    {item.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>市場規模: {item.marketSize}</div>
                  <div>予想CVR: {item.estimatedCVR}% 🔥</div>
                  <div>ローンチ予定: {item.launchDate}</div>
                </div>
                <div className="mt-3">
                  <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    詳細を見る
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* リソース再配分サマリー */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">📊 リソース再配分サマリー</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">削減リソース</div>
            <div className="text-xl font-bold text-red-600">
              ¥{totalResourceSaving.toLocaleString()}/月
            </div>
            <div className="text-xs text-gray-500">サンセット3個分</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">新規投資</div>
            <div className="text-xl font-bold text-green-600">
              ¥{Math.floor(totalResourceSaving * 0.8).toLocaleString()}/月
            </div>
            <div className="text-xs text-gray-500">新規2個へ投資</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">効率改善</div>
            <div className="text-xl font-bold text-blue-600">
              +{Math.floor((totalResourceSaving * 0.2 / totalResourceSaving) * 100)}%
            </div>
            <div className="text-xs text-gray-500">リソース効率</div>
          </div>
        </div>
      </div>

      {/* 現在のSaaSリスト */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="font-semibold">現在のポートフォリオ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SaaS名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">フェーズ</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">MRR</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">DAU</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">CVR</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">トレンド</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{item.name}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.phase === 'サンセット' ? 'bg-red-100 text-red-800' :
                      item.phase === '衰退' ? 'bg-orange-100 text-orange-800' :
                      item.phase === '成熟' ? 'bg-yellow-100 text-yellow-800' :
                      item.phase === '成長' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.phase}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-right">¥{item.mrr.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-right">{item.dau}</td>
                  <td className="px-4 py-4 text-sm text-right">{item.cvr}%</td>
                  <td className="px-4 py-4 text-center text-2xl">{item.monthlyTrend}</td>
                  <td className="px-4 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      詳細
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