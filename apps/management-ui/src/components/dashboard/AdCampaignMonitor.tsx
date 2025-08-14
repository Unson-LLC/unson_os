import React, { useState } from 'react'

// 広告キャンペーン情報
interface AdCampaign {
  id: string
  saasName: string
  phase: 'LP検証' | 'MVP準備' | '運用中'
  platform: 'Google Ads' | 'Facebook Ads' | 'Yahoo Ads'
  
  // 広告指標
  metrics: {
    impressions: number
    clicks: number
    cost: number
    conversions: number
    ctr: number        // Click Through Rate
    cpc: number        // Cost Per Click  
    cvr: number        // Conversion Rate
    cpa: number        // Cost Per Acquisition
  }
  
  // 時系列データ（直近7日）
  dailyMetrics: {
    date: string
    impressions: number
    clicks: number
    conversions: number
    cost: number
  }[]
  
  // GATE判断用データ
  gateDecision: {
    cvr: number
    totalConversions: number
    costEfficiency: number
    marketViability: 'high' | 'medium' | 'low'
    competitionLevel: 'low' | 'medium' | 'high'
    recommendedAction: 'proceed_to_mvp' | 'optimize_lp' | 'pivot' | 'kill'
    confidence: number
  }
  
  // A/Bテスト状況
  abTests: {
    testName: string
    status: 'running' | 'completed'
    variants: {
      name: string
      cvr: number
      confidence: number
    }[]
  }[]
  
  // キーワード分析
  keywords: {
    keyword: string
    impressions: number
    clicks: number
    ctr: number
    cvr: number
    cost: number
    quality_score: number
  }[]
}

// モック広告データ
const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'ad-001',
    saasName: 'AI議事録作成',
    phase: 'LP検証',
    platform: 'Google Ads',
    
    metrics: {
      impressions: 45230,
      clicks: 1850,
      cost: 89500,
      conversions: 333,
      ctr: 4.09,
      cpc: 48.4,
      cvr: 18.0,
      cpa: 268.8
    },
    
    dailyMetrics: [
      { date: '01/15', impressions: 6890, clicks: 285, conversions: 52, cost: 13800 },
      { date: '01/14', impressions: 6450, clicks: 260, conversions: 45, cost: 12600 },
      { date: '01/13', impressions: 6120, clicks: 248, conversions: 41, cost: 12000 },
      { date: '01/12', impressions: 7200, clicks: 295, conversions: 58, cost: 14300 },
      { date: '01/11', impressions: 6800, clicks: 275, conversions: 48, cost: 13300 },
      { date: '01/10', impressions: 5950, clicks: 242, conversions: 44, cost: 11700 },
      { date: '01/09', impressions: 5820, clicks: 245, conversions: 45, cost: 11800 }
    ],
    
    gateDecision: {
      cvr: 18.0,
      totalConversions: 333,
      costEfficiency: 85,
      marketViability: 'high',
      competitionLevel: 'medium',
      recommendedAction: 'proceed_to_mvp',
      confidence: 92
    },
    
    abTests: [
      {
        testName: 'LP見出しテスト',
        status: 'running',
        variants: [
          { name: 'A: AI自動議事録', cvr: 16.5, confidence: 85 },
          { name: 'B: 1分で議事録完成', cvr: 19.2, confidence: 88 },
          { name: 'C: 音声を自動文字起こし', cvr: 17.8, confidence: 82 }
        ]
      }
    ],
    
    keywords: [
      { keyword: '議事録 自動', impressions: 12500, clicks: 580, ctr: 4.64, cvr: 19.3, cost: 28000, quality_score: 8 },
      { keyword: 'AI 文字起こし', impressions: 8900, clicks: 425, ctr: 4.78, cvr: 17.2, cost: 20500, quality_score: 7 },
      { keyword: '会議 記録', impressions: 6800, clicks: 310, ctr: 4.56, cvr: 16.8, cost: 15000, quality_score: 6 },
      { keyword: '音声認識 ツール', impressions: 4200, clicks: 185, ctr: 4.40, cvr: 15.1, cost: 8900, quality_score: 7 }
    ]
  },
  
  {
    id: 'ad-002',
    saasName: '契約書チェッカー',
    phase: 'LP検証',
    platform: 'Google Ads',
    
    metrics: {
      impressions: 28400,
      clicks: 890,
      cost: 67200,
      conversions: 71,
      ctr: 3.13,
      cpc: 75.5,
      cvr: 7.98,
      cpa: 946.5
    },
    
    dailyMetrics: [
      { date: '01/15', impressions: 4200, clicks: 135, conversions: 12, cost: 10200 },
      { date: '01/14', impressions: 4050, clicks: 125, conversions: 9, cost: 9400 },
      { date: '01/13', impressions: 3980, clicks: 120, conversions: 8, cost: 9100 },
      { date: '01/12', impressions: 4150, clicks: 130, conversions: 11, cost: 9800 },
      { date: '01/11', impressions: 4100, clicks: 128, conversions: 10, cost: 9650 },
      { date: '01/10', impressions: 3950, clicks: 122, conversions: 11, cost: 9200 },
      { date: '01/09', impressions: 3970, clicks: 130, conversions: 10, cost: 9850 }
    ],
    
    gateDecision: {
      cvr: 7.98,
      totalConversions: 71,
      costEfficiency: 45,
      marketViability: 'medium',
      competitionLevel: 'high',
      recommendedAction: 'optimize_lp',
      confidence: 68
    },
    
    abTests: [
      {
        testName: 'ターゲティング最適化',
        status: 'running',
        variants: [
          { name: 'A: 法務部門', cvr: 9.2, confidence: 75 },
          { name: 'B: 中小企業経営者', cvr: 6.8, confidence: 70 },
          { name: 'C: スタートアップ', cvr: 8.1, confidence: 72 }
        ]
      }
    ],
    
    keywords: [
      { keyword: '契約書 チェック', impressions: 8500, clicks: 285, ctr: 3.35, cvr: 8.8, cost: 21500, quality_score: 6 },
      { keyword: '法務 ツール', impressions: 6200, clicks: 195, ctr: 3.15, cvr: 7.2, cost: 14700, quality_score: 5 },
      { keyword: '契約書 AI', impressions: 4800, clicks: 155, ctr: 3.23, cvr: 8.4, cost: 11700, quality_score: 7 },
      { keyword: '法的リスク チェック', impressions: 3200, clicks: 98, ctr: 3.06, cvr: 6.1, cost: 7400, quality_score: 5 }
    ]
  },
  
  {
    id: 'ad-003',
    saasName: '在庫管理Pro',
    phase: 'LP検証',
    platform: 'Yahoo Ads',
    
    metrics: {
      impressions: 18900,
      clicks: 420,
      cost: 45600,
      conversions: 15,
      ctr: 2.22,
      cpc: 108.6,
      cvr: 3.57,
      cpa: 3040
    },
    
    dailyMetrics: [
      { date: '01/15', impressions: 2800, clicks: 65, conversions: 2, cost: 7050 },
      { date: '01/14', impressions: 2650, clicks: 58, conversions: 2, cost: 6300 },
      { date: '01/13', impressions: 2720, clicks: 62, conversions: 1, cost: 6730 },
      { date: '01/12', impressions: 2900, clicks: 68, conversions: 3, cost: 7380 },
      { date: '01/11', impressions: 2750, clicks: 60, conversions: 2, cost: 6520 },
      { date: '01/10', impressions: 2580, clicks: 55, conversions: 2, cost: 5970 },
      { date: '01/09', impressions: 2500, clicks: 52, conversions: 3, cost: 5650 }
    ],
    
    gateDecision: {
      cvr: 3.57,
      totalConversions: 15,
      costEfficiency: 25,
      marketViability: 'low',
      competitionLevel: 'high',
      recommendedAction: 'pivot',
      confidence: 78
    },
    
    abTests: [
      {
        testName: '最終改善テスト',
        status: 'running',
        variants: [
          { name: 'A: 無料トライアル強調', cvr: 4.1, confidence: 65 },
          { name: 'B: ROI計算機', cvr: 3.2, confidence: 62 },
          { name: 'C: 事例中心', cvr: 3.8, confidence: 68 }
        ]
      }
    ],
    
    keywords: [
      { keyword: '在庫管理 システム', impressions: 5800, clicks: 128, ctr: 2.21, cvr: 3.9, cost: 13900, quality_score: 4 },
      { keyword: '在庫 ソフト', impressions: 4200, clicks: 95, ctr: 2.26, cvr: 3.2, cost: 10300, quality_score: 5 },
      { keyword: '倉庫管理 アプリ', impressions: 3500, clicks: 82, ctr: 2.34, cvr: 3.7, cost: 8900, quality_score: 4 },
      { keyword: '在庫最適化', impressions: 2800, clicks: 58, ctr: 2.07, cvr: 3.4, cost: 6300, quality_score: 4 }
    ]
  }
]

interface AdCampaignMonitorProps {
  onViewDataSeries?: (saasName: string, metric: string) => void
  onGateDecision?: (saasName: string, decision: string) => void
}

export function AdCampaignMonitor({ onViewDataSeries, onGateDecision }: AdCampaignMonitorProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign>(mockAdCampaigns[0])
  const [viewMode, setViewMode] = useState<'overview' | 'keywords' | 'abtests' | 'gate'>('overview')

  const getDecisionColor = (action: string) => {
    switch (action) {
      case 'proceed_to_mvp': return 'bg-green-100 text-green-800'
      case 'optimize_lp': return 'bg-yellow-100 text-yellow-800'
      case 'pivot': return 'bg-orange-100 text-orange-800'
      case 'kill': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'proceed_to_mvp': return '🚀 MVP開発開始'
      case 'optimize_lp': return '⚙️ LP最適化継続'
      case 'pivot': return '🔄 ピボット検討'
      case 'kill': return '❌ 開発中止'
      default: return action
    }
  }

  const getViabilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📢 リスティング広告モニター</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded ${viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            概要
          </button>
          <button
            onClick={() => setViewMode('keywords')}
            className={`px-4 py-2 rounded ${viewMode === 'keywords' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            キーワード分析
          </button>
          <button
            onClick={() => setViewMode('abtests')}
            className={`px-4 py-2 rounded ${viewMode === 'abtests' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            A/Bテスト
          </button>
          <button
            onClick={() => setViewMode('gate')}
            className={`px-4 py-2 rounded ${viewMode === 'gate' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            🚪 GATE判断
          </button>
        </div>
      </div>

      {/* キャンペーン選択 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">対象キャンペーン:</span>
          <select
            className="border rounded px-3 py-1"
            value={selectedCampaign.saasName}
            onChange={(e) => {
              const campaign = mockAdCampaigns.find(c => c.saasName === e.target.value)
              if (campaign) setSelectedCampaign(campaign)
            }}
          >
            {mockAdCampaigns.map(campaign => (
              <option key={campaign.id} value={campaign.saasName}>
                {campaign.saasName} ({campaign.platform})
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-3 ml-auto">
            <span className="text-sm">フェーズ:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {selectedCampaign.phase}
            </span>
          </div>
        </div>
      </div>

      {/* 概要ビュー */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：主要指標 */}
          <div className="space-y-6">
            {/* 広告パフォーマンス */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">📊 広告パフォーマンス</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedCampaign.metrics.impressions.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">インプレッション</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedCampaign.metrics.clicks.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">クリック</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">¥{selectedCampaign.metrics.cost.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">広告費</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedCampaign.metrics.conversions}</div>
                  <div className="text-sm text-gray-600">コンバージョン</div>
                </div>
              </div>
            </div>

            {/* コンバージョン指標 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">🎯 コンバージョン指標</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CTR (クリック率)</span>
                  <button
                    onClick={() => onViewDataSeries?.(selectedCampaign.saasName, 'ctr')}
                    className="text-lg font-bold hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                  >
                    {selectedCampaign.metrics.ctr.toFixed(2)}%
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CVR (転換率)</span>
                  <button
                    onClick={() => onViewDataSeries?.(selectedCampaign.saasName, 'cvr')}
                    className={`text-lg font-bold px-2 py-1 rounded cursor-pointer ${
                      selectedCampaign.metrics.cvr >= 15 ? 'text-green-600 hover:bg-green-50' :
                      selectedCampaign.metrics.cvr >= 10 ? 'text-yellow-600 hover:bg-yellow-50' :
                      'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {selectedCampaign.metrics.cvr.toFixed(1)}%
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPC (クリック単価)</span>
                  <span className="text-lg font-bold">¥{selectedCampaign.metrics.cpc.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPA (獲得単価)</span>
                  <span className="text-lg font-bold">¥{selectedCampaign.metrics.cpa.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：時系列グラフ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">📈 7日間の推移</h3>
            <div className="space-y-4">
              {/* 簡易チャート */}
              <div>
                <div className="text-sm text-gray-600 mb-2">コンバージョン数</div>
                <div className="flex items-end space-x-2 h-20">
                  {selectedCampaign.dailyMetrics.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 w-full rounded-t"
                        style={{ height: `${(day.conversions / 60) * 100}%` }}
                        title={`${day.date}: ${day.conversions}件`}
                      />
                      <div className="text-xs mt-1">{day.date.slice(-2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">広告費 (¥)</div>
                <div className="flex items-end space-x-2 h-20">
                  {selectedCampaign.dailyMetrics.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-red-500 w-full rounded-t"
                        style={{ height: `${(day.cost / 15000) * 100}%` }}
                        title={`${day.date}: ¥${day.cost.toLocaleString()}`}
                      />
                      <div className="text-xs mt-1">{day.date.slice(-2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GATE判断ビュー */}
      {viewMode === 'gate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 判断指標 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">🚪 GATE判断指標</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">CVR (転換率)</span>
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    selectedCampaign.gateDecision.cvr >= 15 ? 'text-green-600' :
                    selectedCampaign.gateDecision.cvr >= 10 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedCampaign.gateDecision.cvr.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedCampaign.gateDecision.cvr >= 15 ? '✅ 優秀' :
                     selectedCampaign.gateDecision.cvr >= 10 ? '⚠️ 標準' : '❌ 要改善'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">総コンバージョン数</span>
                <div className="text-right">
                  <div className="text-xl font-bold">{selectedCampaign.gateDecision.totalConversions}</div>
                  <div className="text-xs text-gray-500">
                    {selectedCampaign.gateDecision.totalConversions >= 100 ? '✅ 十分' : '⚠️ 要確認'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">コスト効率</span>
                <div className="text-right">
                  <div className="text-xl font-bold">{selectedCampaign.gateDecision.costEfficiency}/100</div>
                  <div className="text-xs text-gray-500">
                    {selectedCampaign.gateDecision.costEfficiency >= 80 ? '✅ 高効率' :
                     selectedCampaign.gateDecision.costEfficiency >= 60 ? '⚠️ 標準' : '❌ 非効率'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">市場性</span>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getViabilityColor(selectedCampaign.gateDecision.marketViability)}`}>
                    {selectedCampaign.gateDecision.marketViability.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">TAM/競合分析</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">競合レベル</span>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getViabilityColor(
                    selectedCampaign.gateDecision.competitionLevel === 'low' ? 'high' :
                    selectedCampaign.gateDecision.competitionLevel === 'high' ? 'low' : 'medium'
                  )}`}>
                    {selectedCampaign.gateDecision.competitionLevel.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">CPCとシェア分析</div>
                </div>
              </div>
            </div>
          </div>

          {/* 推奨アクション */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">🎯 AI推奨アクション</h3>
            
            <div className="mb-6">
              <div className={`p-4 rounded-lg ${getDecisionColor(selectedCampaign.gateDecision.recommendedAction)}`}>
                <div className="text-xl font-bold mb-2">
                  {getActionText(selectedCampaign.gateDecision.recommendedAction)}
                </div>
                <div className="text-sm">
                  信頼度: {selectedCampaign.gateDecision.confidence}%
                </div>
              </div>
            </div>

            {/* 判断理由 */}
            <div className="space-y-3">
              <h4 className="font-medium">判断理由:</h4>
              
              {selectedCampaign.gateDecision.recommendedAction === 'proceed_to_mvp' && (
                <ul className="text-sm space-y-1">
                  <li>• CVR {selectedCampaign.gateDecision.cvr}%は業界平均を大幅上回り</li>
                  <li>• 十分なコンバージョン数({selectedCampaign.gateDecision.totalConversions}件)で統計的有意性確保</li>
                  <li>• コスト効率も{selectedCampaign.gateDecision.costEfficiency}%と高水準</li>
                  <li>• 市場性「{selectedCampaign.gateDecision.marketViability}」でスケール見込み良好</li>
                </ul>
              )}
              
              {selectedCampaign.gateDecision.recommendedAction === 'optimize_lp' && (
                <ul className="text-sm space-y-1">
                  <li>• CVR {selectedCampaign.gateDecision.cvr}%は改善余地あり</li>
                  <li>• LP最適化により10-15%は達成可能</li>
                  <li>• A/Bテストを継続して改善点を特定</li>
                  <li>• コスト効率を{selectedCampaign.gateDecision.costEfficiency}%から80%以上に向上させる</li>
                </ul>
              )}
              
              {selectedCampaign.gateDecision.recommendedAction === 'pivot' && (
                <ul className="text-sm space-y-1">
                  <li>• CVR {selectedCampaign.gateDecision.cvr}%は目標値を大幅下回り</li>
                  <li>• コンバージョン数{selectedCampaign.gateDecision.totalConversions}件では統計的信頼性不足</li>
                  <li>• 市場性「{selectedCampaign.gateDecision.marketViability}」でスケール困難</li>
                  <li>• ターゲット変更または機能ピボットを検討</li>
                </ul>
              )}
            </div>

            {/* アクションボタン */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => onGateDecision?.(selectedCampaign.saasName, selectedCampaign.gateDecision.recommendedAction)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                推奨アクションを実行
              </button>
              <button
                onClick={() => onViewDataSeries?.(selectedCampaign.saasName, 'cvr')}
                className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                📊 詳細データを確認
              </button>
            </div>
          </div>
        </div>
      )}

      {/* キーワード分析ビュー */}
      {viewMode === 'keywords' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold">🔍 キーワード分析</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">キーワード</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">インプレッション</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CTR</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CVR</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">広告費</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">品質スコア</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedCampaign.keywords.map((keyword, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{keyword.keyword}</td>
                    <td className="px-6 py-4 text-right">{keyword.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{keyword.ctr.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-right">
                      <span className={
                        keyword.cvr >= 15 ? 'text-green-600 font-bold' :
                        keyword.cvr >= 10 ? 'text-yellow-600' : 'text-red-600'
                      }>
                        {keyword.cvr.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">¥{keyword.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        keyword.quality_score >= 7 ? 'bg-green-100 text-green-800' :
                        keyword.quality_score >= 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.quality_score}/10
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* A/Bテストビュー */}
      {viewMode === 'abtests' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">🧪 A/Bテスト結果</h3>
          {selectedCampaign.abTests.map((test, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{test.testName}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  test.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {test.status === 'running' ? '実行中' : '完了'}
                </span>
              </div>
              <div className="space-y-3">
                {test.variants.map((variant, vIdx) => (
                  <div key={vIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">{variant.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className={`font-bold ${
                        variant.cvr === Math.max(...test.variants.map(v => v.cvr)) ? 'text-green-600' : ''
                      }`}>
                        CVR: {variant.cvr.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        信頼度: {variant.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}