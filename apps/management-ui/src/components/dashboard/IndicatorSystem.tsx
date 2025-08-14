import React, { useState } from 'react'

// インジケーター基本定義
type IndicatorSymbol = '⬆️' | '↗️' | '→' | '↘️' | '⬇️'

interface IndicatorValue {
  timestamp: string
  rawValue: number
  symbol: IndicatorSymbol
  confidence: number // 0-1, データの信頼性
}

// 時間足ごとのインジケーター
interface TimeSeriesIndicator {
  metric: string // 'lp_cvr', 'ad_ctr', 'cpc', 'impression_share'
  timeframe: '1h' | '4h' | '1d' | '1w'
  values: IndicatorValue[] // 直近N期間
  pattern: IndicatorSymbol[] // 記号パターン
  trend: 'strengthening' | 'weakening' | 'stable' | 'volatile'
}

// SaaSごとのインジケーター統合
interface SaaSIndicatorState {
  saasId: string
  saasName: string
  phase: 'lp_validation' | 'mvp_dev' | 'monetization' | 'scale'
  lastUpdated: string
  
  // フェーズ別インジケーター
  indicators: {
    // LP検証フェーズ
    lp_cvr?: TimeSeriesIndicator
    ad_ctr?: TimeSeriesIndicator
    ad_cpc?: TimeSeriesIndicator
    impression_share?: TimeSeriesIndicator
    cost_per_conversion?: TimeSeriesIndicator
    
    // MVP/運用フェーズ  
    mrr?: TimeSeriesIndicator
    dau?: TimeSeriesIndicator
    retention_7d?: TimeSeriesIndicator
    nps?: TimeSeriesIndicator
    support_ticket_rate?: TimeSeriesIndicator
  }
  
  // AIによるパターン分析結果
  aiInsights: {
    dominantPattern: IndicatorSymbol[]
    patternConfidence: number
    recommendedAction: 'proceed' | 'optimize' | 'pivot' | 'pause'
    reasoning: string[]
    gateReadiness: number // 0-1, GATE通過の推奨度
  }
}

// GATE判断用のルールエンジン
interface GateRule {
  ruleId: string
  name: string
  phase: string
  conditions: {
    indicator: string
    pattern: IndicatorSymbol[]
    minLength: number
    confidence: number
  }[]
  action: 'approve' | 'reject' | 'review'
  weight: number
}

// 全システム統合：インジケーター中心データ管理
const mockIndicatorData: SaaSIndicatorState[] = [
  {
    saasId: 'ai-meeting-notes',
    saasName: 'AI議事録作成',
    phase: 'lp_validation',
    lastUpdated: '2025-01-15T14:30:00Z',
    
    indicators: {
      lp_cvr: {
        metric: 'lp_cvr',
        timeframe: '1h',
        values: [
          { timestamp: '13:00', rawValue: 15.2, symbol: '↗️', confidence: 0.9 },
          { timestamp: '14:00', rawValue: 16.8, symbol: '↗️', confidence: 0.92 },
          { timestamp: '15:00', rawValue: 18.1, symbol: '⬆️', confidence: 0.95 },
          { timestamp: '16:00', rawValue: 17.9, symbol: '→', confidence: 0.93 },
          { timestamp: '17:00', rawValue: 18.3, symbol: '↗️', confidence: 0.94 },
          { timestamp: '18:00', rawValue: 18.0, symbol: '→', confidence: 0.96 },
          { timestamp: '19:00', rawValue: 18.2, symbol: '↗️', confidence: 0.97 }
        ],
        pattern: ['↗️', '↗️', '⬆️', '→', '↗️', '→', '↗️'],
        trend: 'strengthening'
      },
      
      ad_ctr: {
        metric: 'ad_ctr', 
        timeframe: '1h',
        values: [
          { timestamp: '13:00', rawValue: 4.1, symbol: '→', confidence: 0.88 },
          { timestamp: '14:00', rawValue: 4.3, symbol: '↗️', confidence: 0.91 },
          { timestamp: '15:00', rawValue: 4.6, symbol: '↗️', confidence: 0.89 },
          { timestamp: '16:00', rawValue: 4.4, symbol: '→', confidence: 0.90 },
          { timestamp: '17:00', rawValue: 4.7, symbol: '↗️', confidence: 0.92 },
          { timestamp: '18:00', rawValue: 4.5, symbol: '→', confidence: 0.94 },
          { timestamp: '19:00', rawValue: 4.8, symbol: '↗️', confidence: 0.93 }
        ],
        pattern: ['→', '↗️', '↗️', '→', '↗️', '→', '↗️'],
        trend: 'stable'
      },
      
      cost_per_conversion: {
        metric: 'cost_per_conversion',
        timeframe: '1h', 
        values: [
          { timestamp: '13:00', rawValue: 280, symbol: '↘️', confidence: 0.85 },
          { timestamp: '14:00', rawValue: 275, symbol: '↘️', confidence: 0.87 },
          { timestamp: '15:00', rawValue: 265, symbol: '↘️', confidence: 0.90 },
          { timestamp: '16:00', rawValue: 270, symbol: '→', confidence: 0.88 },
          { timestamp: '17:00', rawValue: 268, symbol: '↘️', confidence: 0.91 },
          { timestamp: '18:00', rawValue: 269, symbol: '→', confidence: 0.93 },
          { timestamp: '19:00', rawValue: 264, symbol: '↘️', confidence: 0.94 }
        ],
        pattern: ['↘️', '↘️', '↘️', '→', '↘️', '→', '↘️'],
        trend: 'strengthening' // コスト下降は良い傾向
      }
    },
    
    aiInsights: {
      dominantPattern: ['↗️', '↗️', '⬆️'],
      patternConfidence: 0.92,
      recommendedAction: 'proceed',
      reasoning: [
        'CVRパターン[↗️,↗️,⬆️,→,↗️,→,↗️]: 持続的上昇トレンド検出',
        'CPC下降パターン[↘️,↘️,↘️]: コスト効率改善中',
        'CTRパターン[↗️,↗️,→,↗️]: 広告品質向上中',
        '過去類似パターン成功率: 87% (23件中20件)',
        '競合動向分析: 優位性維持中'
      ],
      gateReadiness: 0.89
    }
  },
  
  {
    saasId: 'contract-checker',
    saasName: '契約書チェッカー',
    phase: 'lp_validation', 
    lastUpdated: '2025-01-15T14:30:00Z',
    
    indicators: {
      lp_cvr: {
        metric: 'lp_cvr',
        timeframe: '1h',
        values: [
          { timestamp: '13:00', rawValue: 8.1, symbol: '→', confidence: 0.82 },
          { timestamp: '14:00', rawValue: 7.8, symbol: '↘️', confidence: 0.84 },
          { timestamp: '15:00', rawValue: 7.9, symbol: '→', confidence: 0.81 },
          { timestamp: '16:00', rawValue: 8.2, symbol: '↗️', confidence: 0.85 },
          { timestamp: '17:00', rawValue: 7.7, symbol: '↘️', confidence: 0.83 },
          { timestamp: '18:00', rawValue: 7.9, symbol: '→', confidence: 0.86 },
          { timestamp: '19:00', rawValue: 8.0, symbol: '→', confidence: 0.84 }
        ],
        pattern: ['→', '↘️', '→', '↗️', '↘️', '→', '→'],
        trend: 'volatile'
      },
      
      ad_ctr: {
        metric: 'ad_ctr',
        timeframe: '1h',
        values: [
          { timestamp: '13:00', rawValue: 3.1, symbol: '→', confidence: 0.78 },
          { timestamp: '14:00', rawValue: 3.0, symbol: '↘️', confidence: 0.80 },
          { timestamp: '15:00', rawValue: 3.2, symbol: '↗️', confidence: 0.77 },
          { timestamp: '16:00', rawValue: 3.1, symbol: '→', confidence: 0.81 },
          { timestamp: '17:00', rawValue: 2.9, symbol: '↘️', confidence: 0.79 },
          { timestamp: '18:00', rawValue: 3.1, symbol: '↗️', confidence: 0.82 },
          { timestamp: '19:00', rawValue: 3.0, symbol: '→', confidence: 0.80 }
        ],
        pattern: ['→', '↘️', '↗️', '→', '↘️', '↗️', '→'],
        trend: 'volatile'
      }
    },
    
    aiInsights: {
      dominantPattern: ['→', '↘️', '→'],
      patternConfidence: 0.67,
      recommendedAction: 'optimize',
      reasoning: [
        'CVRパターン[→,↘️,→,↗️,↘️,→,→]: 不安定、明確なトレンドなし',
        'CTRパターン[→,↘️,↗️,→,↘️,↗️,→]: 同様に不安定',
        '過去類似パターン改善率: 45% (継続最適化で改善可能)',
        'キーワード品質スコア低下傾向',
        'ターゲティング再調整推奨'
      ],
      gateReadiness: 0.23
    }
  },
  
  // 収益化フェーズのSaaS追加
  {
    saasId: 'household-budget',
    saasName: '家計簿アプリ',
    phase: 'monetization',
    lastUpdated: '2025-01-15T14:30:00Z',
    
    indicators: {
      mrr: {
        metric: 'mrr',
        timeframe: '1d',
        values: [
          { timestamp: '01-09', rawValue: 248000, symbol: '↗️', confidence: 0.95 },
          { timestamp: '01-10', rawValue: 250000, symbol: '↗️', confidence: 0.96 },
          { timestamp: '01-11', rawValue: 252000, symbol: '⬆️', confidence: 0.97 },
          { timestamp: '01-12', rawValue: 254000, symbol: '⬆️', confidence: 0.98 },
          { timestamp: '01-13', rawValue: 256000, symbol: '↗️', confidence: 0.97 },
          { timestamp: '01-14', rawValue: 258000, symbol: '↗️', confidence: 0.96 },
          { timestamp: '01-15', rawValue: 260000, symbol: '⬆️', confidence: 0.98 }
        ],
        pattern: ['↗️', '↗️', '⬆️', '⬆️', '↗️', '↗️', '⬆️'],
        trend: 'strengthening'
      },
      
      dau: {
        metric: 'dau',
        timeframe: '1d',
        values: [
          { timestamp: '01-09', rawValue: 425, symbol: '→', confidence: 0.92 },
          { timestamp: '01-10', rawValue: 430, symbol: '↗️', confidence: 0.94 },
          { timestamp: '01-11', rawValue: 445, symbol: '⬆️', confidence: 0.95 },
          { timestamp: '01-12', rawValue: 440, symbol: '→', confidence: 0.93 },
          { timestamp: '01-13', rawValue: 450, symbol: '↗️', confidence: 0.96 },
          { timestamp: '01-14', rawValue: 455, symbol: '↗️', confidence: 0.95 },
          { timestamp: '01-15', rawValue: 460, symbol: '↗️', confidence: 0.97 }
        ],
        pattern: ['→', '↗️', '⬆️', '→', '↗️', '↗️', '↗️'],
        trend: 'strengthening'
      }
    },
    
    aiInsights: {
      dominantPattern: ['↗️', '⬆️', '↗️'],
      patternConfidence: 0.95,
      recommendedAction: 'proceed',
      reasoning: [
        'MRRパターン[↗️,↗️,⬆️,⬆️,↗️,↗️,⬆️]: 安定した収益成長',
        'DAUパターン[→,↗️,⬆️,→,↗️,↗️,↗️]: ユーザー基盤拡大中',
        '過去類似パターン成功率: 94% (32件中30件)',
        'ARPUも同時向上: 最適化戦略有効',
        'スケールフェーズ移行推奨'
      ],
      gateReadiness: 0.94
    }
  },
  
  {
    saasId: 'cat-cafe-booking',
    saasName: '猫カフェ予約',
    phase: 'monetization',
    lastUpdated: '2025-01-15T14:30:00Z',
    
    indicators: {
      mrr: {
        metric: 'mrr',
        timeframe: '1d',
        values: [
          { timestamp: '01-09', rawValue: 42000, symbol: '→', confidence: 0.88 },
          { timestamp: '01-10', rawValue: 40000, symbol: '↘️', confidence: 0.90 },
          { timestamp: '01-11', rawValue: 38000, symbol: '↘️', confidence: 0.91 },
          { timestamp: '01-12', rawValue: 36000, symbol: '⬇️', confidence: 0.93 },
          { timestamp: '01-13', rawValue: 35000, symbol: '↘️', confidence: 0.92 },
          { timestamp: '01-14', rawValue: 34000, symbol: '↘️', confidence: 0.94 },
          { timestamp: '01-15', rawValue: 32000, symbol: '⬇️', confidence: 0.95 }
        ],
        pattern: ['→', '↘️', '↘️', '⬇️', '↘️', '↘️', '⬇️'],
        trend: 'weakening'
      },
      
      dau: {
        metric: 'dau',
        timeframe: '1d',
        values: [
          { timestamp: '01-09', rawValue: 125, symbol: '→', confidence: 0.85 },
          { timestamp: '01-10', rawValue: 120, symbol: '↘️', confidence: 0.87 },
          { timestamp: '01-11', rawValue: 115, symbol: '↘️', confidence: 0.88 },
          { timestamp: '01-12', rawValue: 110, symbol: '⬇️', confidence: 0.90 },
          { timestamp: '01-13', rawValue: 108, symbol: '↘️', confidence: 0.89 },
          { timestamp: '01-14', rawValue: 105, symbol: '↘️', confidence: 0.91 },
          { timestamp: '01-15', rawValue: 100, symbol: '⬇️', confidence: 0.93 }
        ],
        pattern: ['→', '↘️', '↘️', '⬇️', '↘️', '↘️', '⬇️'],
        trend: 'weakening'
      }
    },
    
    aiInsights: {
      dominantPattern: ['↘️', '⬇️', '↘️'],
      patternConfidence: 0.89,
      recommendedAction: 'pivot',
      reasoning: [
        'MRRパターン[→,↘️,↘️,⬇️,↘️,↘️,⬇️]: 深刻な収益低下',
        'DAUパターン[→,↘️,↘️,⬇️,↘️,↘️,⬇️]: ユーザー離脱加速',
        '過去類似パターン回復率: 15% (20件中3件)',
        '競合要因: 新規参入3社の影響',
        '緊急ピボット戦略実行推奨'
      ],
      gateReadiness: 0.05
    }
  }
]

// GATE判断ルール定義
const mockGateRules: GateRule[] = [
  {
    ruleId: 'lp_to_mvp_rule_1',
    name: 'LP→MVP基本ルール',
    phase: 'lp_validation',
    conditions: [
      {
        indicator: 'lp_cvr',
        pattern: ['↗️', '↗️'],
        minLength: 2,
        confidence: 0.8
      }
    ],
    action: 'approve',
    weight: 0.4
  },
  {
    ruleId: 'lp_to_mvp_rule_2', 
    name: 'コスト効率ルール',
    phase: 'lp_validation',
    conditions: [
      {
        indicator: 'cost_per_conversion',
        pattern: ['↘️', '↘️'],
        minLength: 2,
        confidence: 0.7
      }
    ],
    action: 'approve',
    weight: 0.3
  },
  {
    ruleId: 'volatility_warning',
    name: '不安定パターン警告',
    phase: 'lp_validation',
    conditions: [
      {
        indicator: 'lp_cvr',
        pattern: ['→', '↘️', '→'],
        minLength: 3,
        confidence: 0.6
      }
    ],
    action: 'review',
    weight: 0.5
  }
]

interface IndicatorSystemProps {
  onGateDecision?: (saasId: string, decision: 'approve' | 'reject' | 'review', insights: any) => void
}

// データエクスポート関数: 他のコンポーネントで使用
export function getIndicatorData(): SaaSIndicatorState[] {
  return mockIndicatorData
}

export function getSaaSByPhase(phase: string): SaaSIndicatorState[] {
  return mockIndicatorData.filter(saas => saas.phase === phase)
}

export function getSaaSIndicators(saasId: string): SaaSIndicatorState | undefined {
  return mockIndicatorData.find(saas => saas.saasId === saasId)
}

// 人間向けメトリクス表示用のデータ変換
export function convertToMetricsGridData(metric: string): any[] {
  const metricMapping: { [key: string]: { key: string, unit: string } } = {
    'MRR': { key: 'mrr', unit: 'K' },
    'DAU': { key: 'dau', unit: '' },
    'CVR': { key: 'lp_cvr', unit: '%' },
    'mrr': { key: 'mrr', unit: 'K' },
    'dau': { key: 'dau', unit: '' },
    'lp_cvr': { key: 'lp_cvr', unit: '%' }
  }
  
  const actualMetric = metricMapping[metric] || { key: 'mrr', unit: 'K' }
  
  return mockIndicatorData.map(saas => {
    const indicator = saas.indicators[actualMetric.key as keyof typeof saas.indicators]
    if (!indicator) return null
    
    const values = indicator.values.map(v => {
      if (actualMetric.unit === 'K') return Math.round(v.rawValue / 1000)
      return v.rawValue
    })
    
    const currentValue = values[values.length - 1] || 0
    const previousValue = values[values.length - 2] || currentValue
    const change = currentValue - previousValue
    const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0
    
    const trendSymbol = change > 0 ? '↗️' : change < 0 ? '↘️' : '→'
    const trendText = `${trendSymbol} ${change >= 0 ? '+' : ''}${change.toFixed(1)}${actualMetric.unit} (${changePercent.toFixed(1)}%)`
    
    return {
      name: saas.saasName,
      status: saas.aiInsights.gateReadiness >= 0.8 ? '🟢' : 
             saas.aiInsights.gateReadiness >= 0.4 ? '🟡' : '🔴',
      currentValue: currentValue,
      values: values,
      unit: actualMetric.unit,
      trend: trendText,
      sparkline: values
    }
  }).filter(Boolean)
}

// 旧SymbolMatrix互換（AI用記号データ - 人間向け表示では非推奨）
export function convertToSymbolMatrixData(metric: string): any[] {
  const metricMapping: { [key: string]: string } = {
    'MRR': 'mrr',
    'DAU': 'dau', 
    'CVR': 'lp_cvr',
    'mrr': 'mrr',
    'dau': 'dau',
    'lp_cvr': 'lp_cvr',
    'ad_ctr': 'ad_ctr',
    'cost_per_conversion': 'cost_per_conversion'
  }
  
  const actualMetric = metricMapping[metric] || 'mrr'
  
  return mockIndicatorData.map(saas => ({
    name: saas.saasName,
    status: saas.aiInsights.gateReadiness >= 0.8 ? '🟢' : 
           saas.aiInsights.gateReadiness >= 0.4 ? '🟡' : '🔴',
    symbols: saas.indicators[actualMetric as keyof typeof saas.indicators]?.pattern || ['→','→','→','→','→','→','→']
  }))
}

// TimeSeriesGrid用のデータ変換
export function convertToTimeSeriesData(): any[] {
  // 時系列データを生成（最新7日分）
  const timeLabels = ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
  
  return timeLabels.map((time, idx) => {
    // 猫カフェ予約のデータを参照例として使用
    const catCafeSaas = mockIndicatorData.find(s => s.saasId === 'cat-cafe-booking')
    const mrrData = catCafeSaas?.indicators.mrr?.values[idx]
    const dauData = catCafeSaas?.indicators.dau?.values[idx]
    
    // 家計簿アプリのデータも混合
    const budgetSaas = mockIndicatorData.find(s => s.saasId === 'household-budget')
    const budgetMrr = budgetSaas?.indicators.mrr?.values[idx]
    const budgetDau = budgetSaas?.indicators.dau?.values[idx]
    
    return {
      time: time,
      mrr: mrrData?.rawValue || 35000,
      delta: idx > 0 ? (mrrData?.rawValue || 35000) - 37000 : 0,
      symbol: mrrData?.symbol || '→',
      dau: dauData?.rawValue || 100,
      dauDelta: idx > 0 ? (dauData?.rawValue || 100) - 110 : 0,
      dauSymbol: dauData?.symbol || '→',
      cvr: 8.5 + Math.random() * 2
    }
  })
}

// SaaS別のTimeSeriesデータ取得
export function getTimeSeriesDataBySaaS(saasName: string): any[] {
  const saas = mockIndicatorData.find(s => s.saasName === saasName)
  if (!saas) return convertToTimeSeriesData()
  
  const timeLabels = ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
  
  return timeLabels.map((time, idx) => {
    const mrrData = saas.indicators.mrr?.values[idx]
    const dauData = saas.indicators.dau?.values[idx]
    const cvrData = saas.indicators.lp_cvr?.values[idx]
    
    return {
      time: time,
      mrr: mrrData?.rawValue || 0,
      delta: idx > 0 && mrrData ? mrrData.rawValue - (saas.indicators.mrr?.values[idx-1]?.rawValue || 0) : 0,
      symbol: mrrData?.symbol || '→',
      dau: dauData?.rawValue || 0,
      dauDelta: idx > 0 && dauData ? dauData.rawValue - (saas.indicators.dau?.values[idx-1]?.rawValue || 0) : 0,
      dauSymbol: dauData?.symbol || '→',
      cvr: cvrData?.rawValue || 0
    }
  })
}

export function IndicatorSystem({ onGateDecision }: IndicatorSystemProps) {
  const [selectedSaaS, setSelectedSaaS] = useState<SaaSIndicatorState>(mockIndicatorData[0])
  const [viewMode, setViewMode] = useState<'indicators' | 'patterns' | 'rules'>('indicators')

  const getSymbolColor = (symbol: IndicatorSymbol) => {
    switch (symbol) {
      case '⬆️': return 'text-green-600'
      case '↗️': return 'text-blue-600'
      case '→': return 'text-gray-600'
      case '↘️': return 'text-orange-600'
      case '⬇️': return 'text-red-600'
    }
  }

  const renderIndicatorTimeSeries = (indicator: TimeSeriesIndicator) => {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">{indicator.metric}</h4>
          <span className={`text-sm px-2 py-1 rounded ${
            indicator.trend === 'strengthening' ? 'bg-green-100 text-green-800' :
            indicator.trend === 'weakening' ? 'bg-red-100 text-red-800' :
            indicator.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {indicator.trend}
          </span>
        </div>
        
        {/* インジケーター記号系列 */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">記号パターン ({indicator.timeframe}足)</div>
          <div className="flex space-x-1">
            {indicator.pattern.map((symbol, idx) => (
              <span 
                key={idx} 
                className={`text-2xl ${getSymbolColor(symbol)}`}
                title={`${indicator.values[idx]?.timestamp}: ${indicator.values[idx]?.rawValue}`}
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
        
        {/* 生データ（参考） */}
        <div className="text-xs text-gray-500">
          <div className="grid grid-cols-7 gap-1">
            {indicator.values.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="font-mono">{value.rawValue}</div>
                <div>({(value.confidence * 100).toFixed(0)}%)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎯 インジケーターシステム</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('indicators')}
            className={`px-4 py-2 rounded ${viewMode === 'indicators' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            インジケーター
          </button>
          <button
            onClick={() => setViewMode('patterns')}
            className={`px-4 py-2 rounded ${viewMode === 'patterns' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            AIパターン分析
          </button>
          <button
            onClick={() => setViewMode('rules')}
            className={`px-4 py-2 rounded ${viewMode === 'rules' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            GATE判定ルール
          </button>
        </div>
      </div>

      {/* SaaS選択 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">対象SaaS:</span>
          <select
            className="border rounded px-3 py-1"
            value={selectedSaaS.saasId}
            onChange={(e) => {
              const saas = mockIndicatorData.find(s => s.saasId === e.target.value)
              if (saas) setSelectedSaaS(saas)
            }}
          >
            {mockIndicatorData.map(saas => (
              <option key={saas.saasId} value={saas.saasId}>
                {saas.saasName} ({saas.phase})
              </option>
            ))}
          </select>
          <div className="ml-auto">
            <span className="text-sm text-gray-500">最終更新: {selectedSaaS.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* インジケータービュー */}
      {viewMode === 'indicators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(selectedSaaS.indicators).map(([key, indicator]) => (
            <div key={key}>
              {indicator && renderIndicatorTimeSeries(indicator)}
            </div>
          ))}
        </div>
      )}

      {/* AIパターン分析ビュー */}
      {viewMode === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI分析結果 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">🤖 AI分析結果</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">支配的パターン</div>
                <div className="flex items-center space-x-2">
                  {selectedSaaS.aiInsights.dominantPattern.map((symbol, idx) => (
                    <span key={idx} className={`text-3xl ${getSymbolColor(symbol)}`}>
                      {symbol}
                    </span>
                  ))}
                  <span className="ml-4 text-sm text-gray-500">
                    信頼度: {(selectedSaaS.aiInsights.patternConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-2">推奨アクション</div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  selectedSaaS.aiInsights.recommendedAction === 'proceed' ? 'bg-green-100 text-green-800' :
                  selectedSaaS.aiInsights.recommendedAction === 'optimize' ? 'bg-yellow-100 text-yellow-800' :
                  selectedSaaS.aiInsights.recommendedAction === 'pivot' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSaaS.aiInsights.recommendedAction}
                </span>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-2">GATE通過推奨度</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      selectedSaaS.aiInsights.gateReadiness >= 0.8 ? 'bg-green-500' :
                      selectedSaaS.aiInsights.gateReadiness >= 0.6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${selectedSaaS.aiInsights.gateReadiness * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {(selectedSaaS.aiInsights.gateReadiness * 100).toFixed(0)}% 
                  {selectedSaaS.aiInsights.gateReadiness >= 0.8 ? ' (通過推奨)' :
                   selectedSaaS.aiInsights.gateReadiness >= 0.6 ? ' (要検討)' : ' (通過非推奨)'}
                </div>
              </div>
            </div>
          </div>

          {/* AI推論過程 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">🧠 AI推論過程</h3>
            <div className="space-y-2">
              {selectedSaaS.aiInsights.reasoning.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-sm">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => onGateDecision?.(
                  selectedSaaS.saasId, 
                  selectedSaaS.aiInsights.gateReadiness >= 0.8 ? 'approve' : 
                  selectedSaaS.aiInsights.gateReadiness >= 0.6 ? 'review' : 'reject',
                  selectedSaaS.aiInsights
                )}
                className={`w-full px-4 py-2 rounded font-medium ${
                  selectedSaaS.aiInsights.gateReadiness >= 0.8 ? 'bg-green-600 text-white hover:bg-green-700' :
                  selectedSaaS.aiInsights.gateReadiness >= 0.6 ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                  'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {selectedSaaS.aiInsights.gateReadiness >= 0.8 ? '🚀 GATE通過承認' :
                 selectedSaaS.aiInsights.gateReadiness >= 0.6 ? '🤔 人間レビュー要求' : '❌ GATE通過拒否'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GATE判定ルールビュー */}
      {viewMode === 'rules' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">⚖️ GATE判定ルールエンジン</h3>
          <div className="space-y-4">
            {mockGateRules.map(rule => (
              <div key={rule.ruleId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">重み: {rule.weight}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      rule.action === 'approve' ? 'bg-green-100 text-green-800' :
                      rule.action === 'reject' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rule.action}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {rule.conditions.map((condition, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                      <span className="font-mono">{condition.indicator}</span>
                      <span className="mx-2">パターン:</span>
                      {condition.pattern.map((symbol, sIdx) => (
                        <span key={sIdx} className={`mx-1 ${getSymbolColor(symbol)}`}>
                          {symbol}
                        </span>
                      ))}
                      <span className="mx-2">最小長: {condition.minLength}</span>
                      <span>信頼度: {(condition.confidence * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}