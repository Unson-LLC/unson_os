// モックデータの定義
export const mockKPIData = {
  revenue: {
    total: 142000,
    change: 18,
    trend: '↗️' as const,
    trendType: 'up' as const,
    subItems: [
      { label: '運営(60%)', value: '¥85,200' },
      { label: 'DAO(40%)', value: '¥56,800' }
    ]
  },
  saasStatus: {
    total: 87,
    green: 64,
    yellow: 18,
    red: 5
  },
  sunset: 3,
  gateApproval: 3
}

export const mockTimeSeriesData = [
  { time: '14:00', mrr: 45000, delta: 0, symbol: '→', dau: 125, dauDelta: 5, dauSymbol: '↗️', cvr: 8.5 },
  { time: '14:05', mrr: 45000, delta: 0, symbol: '→', dau: 128, dauDelta: 3, dauSymbol: '→', cvr: 8.5 },
  { time: '14:10', mrr: 45000, delta: 0, symbol: '→', dau: 132, dauDelta: 4, dauSymbol: '→', cvr: 8.3 },
  { time: '14:15', mrr: 44500, delta: -500, symbol: '→', dau: 130, dauDelta: -2, dauSymbol: '→', cvr: 8.1 },
  { time: '14:20', mrr: 43000, delta: -1500, symbol: '↘️', dau: 125, dauDelta: -5, dauSymbol: '↘️', cvr: 7.8 },
  { time: '14:25', mrr: 41000, delta: -2000, symbol: '↘️', dau: 120, dauDelta: -5, dauSymbol: '↘️', cvr: 7.2 },
  { time: '14:30', mrr: 38000, delta: -3000, symbol: '⬇️', dau: 115, dauDelta: -5, dauSymbol: '↘️', cvr: 6.5 },
  { time: '14:35', mrr: 35000, delta: -3000, symbol: '⬇️', dau: 110, dauDelta: -5, dauSymbol: '↘️', cvr: 5.8 },
  { time: '14:40', mrr: 34000, delta: -1000, symbol: '↘️', dau: 108, dauDelta: -2, dauSymbol: '→', cvr: 5.5 },
  { time: '14:45', mrr: 34000, delta: 0, symbol: '→', dau: 110, dauDelta: 2, dauSymbol: '→', cvr: 5.6 },
  { time: '14:50', mrr: 34500, delta: 500, symbol: '→', dau: 112, dauDelta: 2, dauSymbol: '→', cvr: 5.8 },
  { time: '14:55', mrr: 35000, delta: 500, symbol: '→', dau: 115, dauDelta: 3, dauSymbol: '↗️', cvr: 6.0 },
  { time: '15:00', mrr: 36000, delta: 1000, symbol: '↗️', dau: 118, dauDelta: 3, dauSymbol: '↗️', cvr: 6.2 },
]

export const mockSymbolMatrixData = [
  { 
    name: '猫カフェ予約',
    status: '🔴' as const,
    symbols: ['→', '→', '→', '↗️', '↗️', '→', '↘️', '↘️', '⬇️', '⬇️', '↘️', '→', '→', '↗️', '↗️', '→']
  },
  { 
    name: '英会話マッチ',
    status: '🔴' as const,
    symbols: ['→', '↘️', '↘️', '→', '→', '↗️', '↗️', '→', '↘️', '⬇️', '⬇️', '↘️', '→', '→', '↗️', '→']
  },
  { 
    name: 'ペット管理',
    status: '🟡' as const,
    symbols: ['↗️', '↗️', '→', '→', '→', '↗️', '↗️', '↗️', '→', '→', '↘️', '↘️', '→', '→', '→', '→']
  },
  { 
    name: '家計簿アプリ',
    status: '🟢' as const,
    symbols: ['↗️', '↗️', '↗️', '→', '→', '↗️', '⬆️', '⬆️', '↗️', '→', '→', '→', '↗️', '↗️', '→', '→']
  },
  { 
    name: '在庫管理Pro',
    status: '🟡' as const,
    symbols: ['→', '→', '↗️', '↗️', '→', '→', '→', '↘️', '→', '→', '→', '↗️', '→', '→', '→', '→']
  },
  { 
    name: 'AI議事録',
    status: '🟢' as const,
    symbols: ['⬆️', '↗️', '↗️', '↗️', '→', '→', '↗️', '↗️', '→', '→', '→', '→', '↗️', '→', '→', '→']
  },
  { 
    name: '契約書チェッカー',
    status: '🟢' as const,
    symbols: ['↗️', '↗️', '→', '→', '↗️', '↗️', '→', '→', '→', '↗️', '↗️', '→', '→', '→', '↗️', '↗️']
  },
  { 
    name: '勤怠システム',
    status: '🔴' as const,
    symbols: ['→', '→', '↘️', '↘️', '↘️', '⬇️', '⬇️', '↘️', '↘️', '→', '→', '→', '↘️', '↘️', '→', '→']
  }
]

export const mockPKGExecutionData = [
  {
    saasName: '猫カフェ予約',
    status: '🔴' as const,
    currentPkg: 'CRISIS_MRR_RECOVERY',
    progress: 35,
    trigger: 'MRR⬇️ (14:30検出)',
    nextPkg: 'CRISIS_PRODUCT_PIVOT'
  },
  {
    saasName: '家計簿アプリ',
    status: '🟢' as const,
    currentPkg: 'LAUNCH_MVP_STANDARD',
    progress: 78,
    trigger: 'CVR↗️ > 15%',
    nextPkg: 'GROWTH_MONETIZE_SETUP'
  },
  {
    saasName: '英会話マッチ',
    status: '🟡' as const,
    currentPkg: 'GROWTH_OPTIMIZE_UX',
    progress: 45,
    nextPkg: '[分岐待ち]'
  },
  {
    saasName: 'AI議事録',
    status: '🟢' as const,
    currentPkg: 'SCALE_FAST_GROWTH',
    progress: 92,
    trigger: 'DAU⬆️ 連続3日',
    nextPkg: 'SCALE_ENTERPRISE_SETUP'
  }
]

export const mockDAORevenueData = {
  totalRevenue: 12345678,
  operatingCost: 7407407,
  daoPool: 4938271,
  treasury: 25432100,
  treasuryChange: 18.5,
  contributors: [
    { name: '@yamada_dev', points: 2847, amount: 487234 },
    { name: '@suzuki_design', points: 2234, amount: 382156 },
    { name: '@tanaka_pm', points: 1892, amount: 323654 },
    { name: '@sato_marketing', points: 1543, amount: 263982 },
    { name: '@ito_qa', points: 1234, amount: 211123 }
  ]
}

export const mockPhaseDistribution = [
  { phase: '研究', count: 12, color: 'bg-blue-400' },
  { phase: 'LP', count: 23, color: 'bg-green-400' },
  { phase: 'MVP', count: 31, color: 'bg-yellow-400' },
  { phase: '収益化', count: 18, color: 'bg-purple-400' },
  { phase: 'スケール', count: 3, color: 'bg-indigo-400' }
]

export const mockKPISymbols = [
  { time: '14:00', symbols: ['↘️', '↗️', '→', '→'] },
  { time: '15:00', symbols: ['⬇️', '→', '↘️', '→'] },
  { time: '16:00', symbols: ['⬇️', '↘️', '⬇️', '↘️'] },
  { time: '17:00', symbols: ['→', '→', '↘️', '→'] },
  { time: 'NOW', symbols: ['↗️', '↗️', '→', '→'] }
]

// DAGアーキテクチャ用モックデータ
export const mockDAGExecutionData = {
  saasId: 'saas-123',
  saasName: '猫カフェ予約システム',
  dagStatus: {
    lastExecuted: '2025-01-15T10:30:00Z',
    nextScheduled: '2025-01-15T12:00:00Z',
    currentCycle: '24h' as const,
    status: 'running' as const
  },
  layer1: {
    symbolCount: 148,
    lastUpdated: '2025-01-15T10:30:00Z',
    symbols: {
      'B_MRR': {
        value: 0.45,
        normalized: true,
        source: 'stripe.monthly_recurring_revenue',
        timestamp: '2025-01-15T10:30:00Z'
      },
      'U_DAU_MAU': {
        value: 0.62,
        normalized: true,
        source: 'analytics.engagement_ratio',
        timestamp: '2025-01-15T10:30:00Z'
      },
      'M_TREND': {
        value: 0.78,
        normalized: true,
        source: 'google_trends.search_volume',
        timestamp: '2025-01-15T10:29:45Z'
      }
    },
    errors: []
  },
  layer2: {
    functionsEvaluated: 12,
    lastEvaluated: '2025-01-15T10:30:00Z',
    results: {
      'L2_PMF_CHECK': {
        result: true,
        confidence: 0.89,
        inputs: ['U_RETENTION_D7', 'B_GROWTH', 'U_DAU_MAU'],
        inputValues: [0.58, 0.23, 0.62],
        executionTime: 45
      },
      'L2_SCALE_READY': {
        result: true,
        confidence: 0.94,
        inputs: ['B_LTV_CAC', 'B_GROWTH', 'T_UPTIME'],
        inputValues: [0.84, 0.23, 0.998],
        executionTime: 32
      }
    },
    errors: []
  },
  layer3: {
    selectedPKG: 'GROWTH_VIRAL_SCALE',
    selectionConfidence: 0.91,
    alternatives: [
      {
        pkgId: 'GROWTH_ORGANIC_SCALE',
        confidence: 0.73,
        reason: 'Lower viral coefficient'
      }
    ]
  },
  emergencyTriggers: {
    active: [],
    recent: [
      {
        triggerId: 'emrg-789',
        metric: 'T_UPTIME',
        threshold: 0.90,
        actualValue: 0.89,
        triggeredAt: '2025-01-14T22:30:00Z',
        resolvedAt: '2025-01-14T22:45:00Z',
        pkgExecuted: 'CRISIS_UPTIME_RECOVERY'
      }
    ]
  }
}

export const mockPKGConflicts = [
  {
    saasId: 'saas-456',
    saasName: '英会話マッチングアプリ',
    conflictingPKGs: [
      {
        pkgId: 'CRISIS_MRR_RECOVERY',
        priority: 90,
        reason: 'MRR急減により緊急実行が必要',
        requiredResources: ['CPU: High', 'DB: Write Lock']
      },
      {
        pkgId: 'GROWTH_OPTIMIZE_UX',
        priority: 60,
        reason: 'UX改善によるユーザー体験向上',
        requiredResources: ['CPU: Medium', 'Cache: Refresh']
      }
    ],
    recommendedResolution: {
      execute: 'CRISIS_MRR_RECOVERY',
      defer: ['GROWTH_OPTIMIZE_UX'],
      cancel: []
    }
  }
]