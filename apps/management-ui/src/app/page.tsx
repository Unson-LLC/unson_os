'use client'

import { useState } from 'react'

interface KPIData {
  time: string
  mrr: number
  delta: number
  symbol: string
  dau: number
  dauDelta: number
  dauSymbol: string
  cvr: number
}

interface SaaSInfo {
  name: string
  status: '🟢' | '🟡' | '🔴'
  currentPkg: string
  progress: number
  trigger?: string
}

const Dashboard = () => {
  const [selectedSaaS, setSelectedSaaS] = useState<string>('猫カフェ予約')

  const kpiData: KPIData[] = [
    { time: '14:00', mrr: 45000, delta: 0, symbol: '→', dau: 125, dauDelta: 5, dauSymbol: '↗️', cvr: 8.5 },
    { time: '14:05', mrr: 45000, delta: 0, symbol: '→', dau: 128, dauDelta: 3, dauSymbol: '→', cvr: 8.5 },
    { time: '14:10', mrr: 45000, delta: 0, symbol: '→', dau: 132, dauDelta: 4, dauSymbol: '→', cvr: 8.3 },
    { time: '14:15', mrr: 44500, delta: -500, symbol: '→', dau: 130, dauDelta: -2, dauSymbol: '→', cvr: 8.1 },
    { time: '14:20', mrr: 43000, delta: -1500, symbol: '↘️', dau: 125, dauDelta: -5, dauSymbol: '↘️', cvr: 7.8 },
    { time: '14:25', mrr: 41000, delta: -2000, symbol: '↘️', dau: 120, dauDelta: -5, dauSymbol: '↘️', cvr: 7.2 },
    { time: '14:30', mrr: 38000, delta: -3000, symbol: '⬇️', dau: 115, dauDelta: -5, dauSymbol: '↘️', cvr: 6.5 },
    { time: '14:35', mrr: 35000, delta: -3000, symbol: '⬇️', dau: 110, dauDelta: -5, dauSymbol: '↘️', cvr: 5.8 },
  ]

  const saasPortfolio: SaaSInfo[] = [
    { name: '猫カフェ予約', status: '🔴', currentPkg: 'pkg_crisis_recovery', progress: 35, trigger: 'MRR⬇️ (14:30検出)' },
    { name: '家計簿アプリ', status: '🟢', currentPkg: 'pkg_fast_mvp', progress: 78, trigger: 'CVR↗️ > 15%' },
    { name: '英会話マッチ', status: '🟡', currentPkg: 'pkg_optimization', progress: 45 },
    { name: 'ペット管理', status: '🟢', currentPkg: 'pkg_standard_growth', progress: 67 },
  ]

  const symbolMatrixData = [
    { name: '🔴猫カフェ', symbols: ['→', '→', '→', '→', '→', '→', '↗️', '↗️', '↗️', '→', '→', '↘️', '↘️', '↘️', '⬇️', '⬇️'] },
    { name: '🔴英会話', symbols: ['→', '→', '↘️', '↘️', '↘️', '→', '→', '→', '↗️', '↗️', '→', '↘️', '↘️', '⬇️', '⬇️', '↘️'] },
    { name: '🟡ペット', symbols: ['↗️', '↗️', '→', '→', '→', '→', '→', '↗️', '↗️', '↗️', '→', '→', '→', '↘️', '↘️', '→'] },
    { name: '🟢家計簿', symbols: ['↗️', '↗️', '↗️', '→', '→', '→', '↗️', '↗️', '⬆️', '⬆️', '↗️', '→', '→', '→', '→', '↗️'] },
  ]

  const daoContributors = [
    { name: '@yamada_dev', points: 2847, amount: 487234 },
    { name: '@suzuki_design', points: 2234, amount: 382156 },
    { name: '@tanaka_pm', points: 1892, amount: 323654 },
    { name: '@sato_marketing', points: 1543, amount: 263982 },
    { name: '@ito_qa', points: 1234, amount: 211123 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">UnsonOS v2.4.1</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">🔔 3</span>
            </div>
            <span className="text-gray-600">💰 DAO</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">👤 佐藤太郎</span>
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <span>📊</span>
              <span className="font-medium text-gray-900">ホーム</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>📈</span>
              <span className="text-gray-600">データ</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>📋</span>
              <span className="text-gray-600">SaaS</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>📝</span>
              <span className="text-gray-600">プレイブック</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>💰</span>
              <span className="text-gray-600">DAO</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>🔄</span>
              <span className="text-gray-600">進化</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>🤖</span>
              <span className="text-gray-600">AI</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <span>⚙️</span>
              <span className="text-gray-600">システム</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 今日の概要 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">📊 今日の概要 - 2025年1月15日(水)</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-bold">総収益: ¥142,000 ↗️(+18%)</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>├─ 運営(60%): ¥85,200</div>
                    <div>└─ DAO(40%): ¥56,800</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>SaaS状況: 87個 (🟢64 🟡18 🔴5)</div>
                  <div>サンセット予定: 3個</div>
                  <div>Gate承認待ち: 3個</div>
                </div>
              </div>
            </div>

            {/* KPI記号とフェーズ分布 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">KPI記号(1h足)</h3>
                  <div className="space-y-1 text-sm font-mono">
                    <div>14:00 ↘️ ↗️ → →</div>
                    <div>15:00 ⬇️ → ↘️ →</div>
                    <div>16:00 ⬇️ ↘️ ⬇️ ↘️</div>
                    <div>17:00 → → ↘️ →</div>
                    <div className="font-bold">NOW  ↗️ ↗️ → →</div>
                  </div>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                    [詳細データ表示]
                  </button>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">フェーズ分布</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>研究</span>
                      <span className="flex items-center">
                        <div className="w-8 h-2 bg-blue-200 rounded mr-2"></div>
                        <span>12</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>LP</span>
                      <span className="flex items-center">
                        <div className="w-16 h-2 bg-green-200 rounded mr-2"></div>
                        <span>23</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MVP</span>
                      <span className="flex items-center">
                        <div className="w-20 h-2 bg-yellow-200 rounded mr-2"></div>
                        <span>31</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>収益化</span>
                      <span className="flex items-center">
                        <div className="w-12 h-2 bg-purple-200 rounded mr-2"></div>
                        <span>18</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>スケール</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-indigo-200 rounded mr-2"></div>
                        <span>3</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 時系列グリッド */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">時系列グリッド - {selectedSaaS}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <select 
                  className="border rounded px-3 py-1"
                  value={selectedSaaS}
                  onChange={(e) => setSelectedSaaS(e.target.value)}
                >
                  <option value="猫カフェ予約">猫カフェ予約</option>
                  <option value="家計簿アプリ">家計簿アプリ</option>
                  <option value="英会話マッチ">英会話マッチ</option>
                </select>
                <select className="border rounded px-3 py-1">
                  <option>5分</option>
                  <option>1時間</option>
                  <option>1日</option>
                </select>
                <select className="border rounded px-3 py-1">
                  <option>今日</option>
                  <option>昨日</option>
                  <option>今週</option>
                </select>
                <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">エクスポート</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-right">MRR</th>
                    <th className="px-4 py-2 text-right">Δ</th>
                    <th className="px-4 py-2 text-center">記号</th>
                    <th className="px-4 py-2 text-right">DAU</th>
                    <th className="px-4 py-2 text-right">Δ</th>
                    <th className="px-4 py-2 text-center">記号</th>
                    <th className="px-4 py-2 text-right">CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiData.map((row, index) => (
                    <tr key={index} className={row.symbol === '⬇️' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-2 font-mono">{row.time}</td>
                      <td className="px-4 py-2 text-right font-mono">
                        {row.symbol === '⬇️' ? 
                          <span className="bg-red-100 px-1">¥{row.mrr.toLocaleString()}</span> :
                          `¥${row.mrr.toLocaleString()}`
                        }
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{row.delta}</td>
                      <td className="px-4 py-2 text-center text-lg">
                        {row.symbol === '⬇️' ? 
                          <span className="bg-red-100 px-1">{row.symbol}</span> :
                          row.symbol
                        }
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{row.dau}</td>
                      <td className="px-4 py-2 text-right font-mono">{row.dauDelta > 0 ? '+' : ''}{row.dauDelta}</td>
                      <td className="px-4 py-2 text-center text-lg">{row.dauSymbol}</td>
                      <td className="px-4 py-2 text-right font-mono">{row.cvr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PKG実行状況 */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">プレイブック実行状況</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {saasPortfolio.map((saas, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{saas.status}</span>
                        <span className="font-medium">{saas.name}</span>
                        <span className="text-gray-600">│</span>
                        <span className="text-blue-600">{saas.currentPkg}</span>
                        <span className="text-gray-600">│</span>
                        <span className="font-mono">{saas.progress}%</span>
                      </div>
                    </div>
                    {saas.trigger && (
                      <div className="text-sm text-gray-500">└ トリガー: {saas.trigger}</div>
                    )}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${saas.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 記号マトリックス */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">記号マトリックス</h2>
              <div className="flex items-center space-x-4 mt-2">
                <label>メトリクス:</label>
                <select className="border rounded px-3 py-1">
                  <option>MRR</option>
                  <option>DAU</option>
                  <option>CVR</option>
                </select>
                <label>時間足:</label>
                <select className="border rounded px-3 py-1">
                  <option>1h</option>
                  <option>5分</option>
                  <option>1日</option>
                </select>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-gray-500 mb-2">
                    {'         ' + Array.from({length: 16}, (_, i) => String(i).padStart(2, '0')).join(' ')}
                  </div>
                  {symbolMatrixData.map((row, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <span className="w-12 text-right">{row.name}</span>
                      <span className="mx-2">│</span>
                      <div className="flex space-x-1">
                        {row.symbols.map((symbol, i) => (
                          <span 
                            key={i} 
                            className={`w-6 text-center ${
                              symbol === '⬇️' ? 'bg-red-100' : ''
                            }`}
                          >
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DAO収益分配 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">💰 収益分配ダッシュボード</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">今月の収益分配:</h3>
                  <div className="space-y-2 text-sm">
                    <div>総売上: ¥12,345,678</div>
                    <div>├─ 運営費(60%): ¥7,407,407</div>
                    <div>└─ DAOプール(40%): ¥4,938,271</div>
                    <div className="mt-4">DAOトレジャリー: ¥25,432,100 ↗️+18.5%</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">🏆 貢献度TOP5:</h3>
                  <div className="space-y-2 text-sm">
                    {daoContributors.map((contributor, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{index + 1}. {contributor.name} ({contributor.points.toLocaleString()} pts)</span>
                        <span>→ ¥{contributor.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard