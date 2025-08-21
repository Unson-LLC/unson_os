// テスト用モックデータ
import { Position, TimeSeriesEvent, EventDetails } from '@/lib/types';
import { POSITION_STATUS, QUALITY_GRADES, TREND_TYPES } from '@/lib/constants';
export const mockPositions: Position[] = [
  {
    id: 'ai-coach-001',
    symbol: 'AI-COACH',
    status: POSITION_STATUS.RUNNING,
    openDate: new Date('2025-08-15'),
    cvr: 15.2,
    previousCvr: 13.5,
    cpl: 180,
    totalLeads: 125,
    qualityGrade: QUALITY_GRADES.A_PLUS,
    validationScore: 92,
    aiConfidence: 95,
    nextAction: 'MVP移行推奨',
    aiComment: 'MVP移行を強く推奨。全指標が目標を上回る',
    trend: TREND_TYPES.UP
  },
  {
    id: 'ai-writer-001',
    symbol: 'AI-WRITER',
    status: POSITION_STATUS.RUNNING,
    openDate: new Date('2025-08-12'),
    cvr: 12.8,
    previousCvr: 12.5,
    cpl: 220,
    totalLeads: 89,
    qualityGrade: QUALITY_GRADES.A,
    validationScore: 85,
    aiConfidence: 88,
    nextAction: '継続検証',
    aiComment: 'ユーザーインタビュー実施タイミング。安定成長中',
    trend: TREND_TYPES.STABLE
  },
  {
    id: 'ai-bridge-001',
    symbol: 'AI-BRIDGE',
    status: POSITION_STATUS.OPTIMIZING,
    openDate: new Date('2025-08-10'),
    cvr: 8.2,
    previousCvr: 9.1,
    cpl: 380,
    totalLeads: 45,
    qualityGrade: QUALITY_GRADES.B,
    validationScore: 62,
    aiConfidence: 72,
    nextAction: '改善必要',
    aiComment: '価値提案の見直し必要。競合分析推奨',
    trend: TREND_TYPES.DOWN
  },
  {
    id: 'ai-stylist-001',
    symbol: 'AI-STYLIST',
    status: POSITION_STATUS.CLOSED,
    openDate: new Date('2025-08-08'),
    cvr: 3.4,
    previousCvr: 4.1,
    cpl: 850,
    totalLeads: 12,
    qualityGrade: QUALITY_GRADES.D,
    validationScore: 28,
    aiConfidence: 45,
    nextAction: '撤退推奨',
    aiComment: 'ピボット or 終了検討。市場適合性低い',
    trend: TREND_TYPES.DOWN
  }
];

export const mockTimeSeriesEvents: TimeSeriesEvent[] = [
  {
    id: 'event-1',
    sessionId: 'ai-coach-001',
    timestamp: new Date('2025-08-21T15:30:00Z').toISOString(),
    period: '15:30-19:30',
    time: '15:30',
    cvr: 15.2,
    previousCvr: 13.5,
    sessions: 89,
    conversions: 14,
    cpl: 180,
    bounceRate: 35,
    avgTimeOnPage: 185,
    optimizations: [
      {
        type: 'KEYWORD',
        description: 'キーワード3件調整 → CPL-¥25',
        executedAt: new Date('2025-08-21T15:31:00Z'),
        impact: 'CPL-¥25',
        confidence: 92
      }
    ],
    anomalies: [],
    aiComment: '最適化効果期待通り。トレンド継続推奨'
  },
  {
    id: 'event-2',
    sessionId: 'ai-coach-001',
    timestamp: new Date('2025-08-21T11:30:00Z').toISOString(),
    period: '11:30-15:30',
    time: '11:30',
    cvr: 12.8,
    previousCvr: 14.5,
    sessions: 156,
    conversions: 20,
    cpl: 205,
    bounceRate: 45,
    avgTimeOnPage: 162,
    optimizations: [
      {
        type: 'BID',
        description: '入札調整実行',
        executedAt: new Date('2025-08-21T11:35:00Z'),
        impact: 'CPA+¥10',
        confidence: 78
      }
    ],
    anomalies: [
      {
        type: 'BOUNCE_SPIKE',
        severity: 'MEDIUM',
        description: '離脱率急増 45% (前回32%)',
        detectedAt: new Date('2025-08-21T11:45:00Z')
      }
    ],
    aiComment: '競合影響の可能性大。価格訴求強化を推奨'
  },
  {
    id: 'event-3',
    sessionId: 'ai-coach-001',
    timestamp: new Date('2025-08-21T07:30:00Z').toISOString(),
    period: '07:30-11:30',
    time: '07:30',
    cvr: 14.5,
    previousCvr: 14.2,
    sessions: 67,
    conversions: 10,
    cpl: 195,
    bounceRate: 28,
    avgTimeOnPage: 195,
    optimizations: [],
    anomalies: [],
    aiComment: '朝の時間帯として良好。次回入札調整タイミング'
  },
  {
    id: 'event-4',
    sessionId: 'ai-coach-001',
    timestamp: new Date('2025-08-21T03:30:00Z').toISOString(),
    period: '03:30-07:30',
    time: '03:30',
    cvr: 14.2,
    previousCvr: 13.8,
    sessions: 23,
    conversions: 3,
    cpl: 210,
    bounceRate: 25,
    avgTimeOnPage: 210,
    optimizations: [
      {
        type: 'LP_CONTENT',
        description: 'LP見出し変更',
        executedAt: new Date('2025-08-21T03:35:00Z'),
        impact: 'CVR+0.4%',
        confidence: 85
      }
    ],
    anomalies: [],
    aiComment: '深夜高品質トラフィック確保。見出し効果検証中'
  }
];

export const mockEventDetails = {
  event: mockTimeSeriesEvents[1], // 11:30のイベント
  
  aiSummary: {
    grade: 'C+' as const,
    concerns: [
      '離脱率13%上昇は競合の価格攻勢が原因と推定',
      'フォーム完了率低下はモバイル最適化不足',
      'CPL上昇はキーワード競争激化による'
    ],
    actions: {
      urgent: [
        {
          title: 'LP価格セクション見直し',
          timeframe: '24h以内',
          priority: 'HIGH'
        }
      ],
      medium: [
        {
          title: 'モバイルフォーム最適化',
          timeframe: '3日以内',
          priority: 'MEDIUM'
        }
      ],
      longTerm: [
        {
          title: '競合差別化コンテンツ強化',
          timeframe: '1週間以内',
          priority: 'LOW'
        }
      ]
    },
    confidence: 89,
    reasoning: '過去同様パターン3件で同じ原因を確認'
  },
  
  userBehaviors: [
    {
      timestamp: new Date('2025-08-21T11:31:00Z'),
      action: 'LP到達',
      userCount: 45,
      conversionRate: 100,
      aiInsight: '正常'
    },
    {
      timestamp: new Date('2025-08-21T11:33:00Z'),
      action: 'ヒーロー注視',
      userCount: 43,
      conversionRate: 96,
      aiInsight: '良好な引き込み'
    },
    {
      timestamp: new Date('2025-08-21T11:35:00Z'),
      action: '課題セクション',
      userCount: 38,
      conversionRate: 84,
      aiInsight: '⚠️離脱多発'
    },
    {
      timestamp: new Date('2025-08-21T11:37:00Z'),
      action: '解決策確認',
      userCount: 32,
      conversionRate: 71,
      aiInsight: '通常レベル'
    },
    {
      timestamp: new Date('2025-08-21T11:39:00Z'),
      action: '価格FAQ閲覧',
      userCount: 28,
      conversionRate: 62,
      aiInsight: '🔴 価格懸念'
    },
    {
      timestamp: new Date('2025-08-21T11:41:00Z'),
      action: 'フォーム到達',
      userCount: 25,
      conversionRate: 56,
      aiInsight: 'やや低い'
    },
    {
      timestamp: new Date('2025-08-21T11:43:00Z'),
      action: 'フォーム完了',
      userCount: 20,
      conversionRate: 44,
      aiInsight: '🔴 要改善'
    }
  ],
  
  rootCauses: [
    {
      issue: '離脱率急増 (32% → 45%)',
      cause: '競合A社の新キャンペーン開始 (11:25確認)',
      evidence: 'パターン: 過去3回の同様事例と98%一致',
      pattern: 'competitor_price_war',
      solution: '価格優位性アピール強化 + 限定特典追加',
      priority: 'HIGH'
    },
    {
      issue: 'フォーム完了率低下 (50% → 44%)',
      cause: 'iPhone13以降でフォーム表示崩れ発生',
      evidence: '影響: モバイルユーザーの65%',
      pattern: 'mobile_ui_issue',
      solution: 'CSS修正 + 入力簡素化',
      priority: 'MEDIUM'
    }
  ],
  
  recommendedActions: [
    {
      title: '競合対抗LP作成',
      description: '競合の価格攻勢に対抗するLP変更',
      expectedImpact: 'CVR+2.1%',
      executionTime: '今すぐ実行',
      priority: 1,
      automated: true
    },
    {
      title: 'モバイルフォーム修正',
      description: 'iPhone13以降の表示問題修正',
      expectedImpact: 'CVR+1.8%',
      executionTime: '3時間後',
      priority: 2,
      automated: true
    },
    {
      title: '価格セクション A/Bテスト開始',
      description: '価格訴求方法の最適化テスト',
      expectedImpact: 'CVR+1.2%',
      executionTime: '明日',
      priority: 3,
      automated: false
    },
    {
      title: '競合監視アルゴリズム強化',
      description: '競合キャンペーン検知の精度向上',
      expectedImpact: '予防効果',
      executionTime: '1週間後',
      priority: 4,
      automated: false
    }
  ]
};

export const mockAIAnalysis = {
  comment: '最適化効果期待通り。トレンド継続推奨',
  confidence: 92,
  patterns: ['successful_optimization', 'trending_up'],
  recommendations: [
    'キーワード追加投資',
    '類似セグメント展開',
    '成功パターンの横展開'
  ]
};

// ユーザーフロー分析用のモックデータ
export const mockUserFlowData = {
  funnel: [
    {
      name: 'Google広告',
      users: 1247,
      rate: 100,
      dropOffRate: 0
    },
    {
      name: 'ヒーロー',
      users: 1189,
      rate: 95.3,
      dropOffRate: 4.7
    },
    {
      name: '価値提案',
      users: 892,
      rate: 71.5,
      dropOffRate: 23.8
    },
    {
      name: 'フォーム',
      users: 421,
      rate: 33.7,
      dropOffRate: 37.8
    }
  ],
  dropOffPoints: [
    {
      section: '価値提案セクション',
      users: 297,
      rate: 23.8
    },
    {
      section: 'フォーム入力画面',
      users: 471,
      rate: 37.8
    }
  ]
};

// 時間帯別パフォーマンス
export const mockHourlyPerformance = [
  { hour: 6, sessions: 145, cvr: 8.3, cpl: 320, features: '通勤時間・モバイル多' },
  { hour: 9, sessions: 523, cvr: 12.5, cpl: 180, features: '◆ベストタイム◆ PC多' },
  { hour: 12, sessions: 342, cvr: 10.2, cpl: 220, features: '昼休み・モバイル増' },
  { hour: 15, sessions: 456, cvr: 14.8, cpl: 150, features: '◆高CVR◆ 決裁者多' },
  { hour: 18, sessions: 234, cvr: 9.6, cpl: 280, features: '帰宅時間・離脱率高' },
  { hour: 21, sessions: 89, cvr: 6.2, cpl: 450, features: '深夜・質は高いが少数' }
];

// デバイス別分析
export const mockDeviceAnalysis = {
  desktop: {
    percentage: 45,
    cvr: 15.8,
    avgTime: 222, // 3:42
    bounceRate: 35
  },
  mobile: {
    percentage: 48,
    cvr: 8.9,
    avgTime: 88, // 1:28
    bounceRate: 58
  },
  tablet: {
    percentage: 7,
    cvr: 11.2,
    avgTime: 135, // 2:15
    bounceRate: 42
  }
};