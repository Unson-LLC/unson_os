// 統合後のテスト用モックデータ
import { Position, TimeSeriesEvent, EventDetails, TradingData } from '@/lib/types';
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
  }
];

export const mockEventDetails: EventDetails = {
  eventId: 'event-2',
  timestamp: new Date('2025-08-21T11:30:00Z').toISOString(),
  
  aiSummary: {
    grade: 'C+',
    summary: '離脱率上昇とCPL悪化が確認されました',
    rootCause: '競合A社の新キャンペーン開始による価格競争',
    recommendations: [
      'LP価格セクション見直し',
      'モバイルフォーム最適化',
      '競合差別化コンテンツ強化'
    ],
    confidence: 89,
    nextOptimization: '価格優位性アピール強化'
  },
  
  metricsComparison: {
    cvr: {
      current: 12.8,
      previous: 14.5,
      change: -1.7,
      trend: TREND_TYPES.DOWN
    },
    sessions: {
      current: 156,
      previous: 145,
      change: 11,
      trend: TREND_TYPES.UP
    },
    bounceRate: {
      current: 45,
      previous: 32,
      change: 13,
      trend: TREND_TYPES.DOWN
    },
    timeOnPage: {
      current: 162,
      previous: 185,
      change: -23,
      trend: TREND_TYPES.DOWN
    }
  },
  
  userBehavior: [
    {
      time: '11:31',
      action: 'LP到達',
      section: 'ランディング',
      value: '45人',
      impact: '正常'
    },
    {
      time: '11:33',
      action: 'ヒーロー注視',
      section: 'メインビジュアル',
      value: '43人',
      impact: '良好な引き込み'
    },
    {
      time: '11:35',
      action: '課題セクション',
      section: '問題提起',
      value: '38人',
      impact: '⚠️離脱多発'
    },
    {
      time: '11:37',
      action: '解決策確認',
      section: 'ソリューション',
      value: '32人',
      impact: '通常レベル'
    },
    {
      time: '11:39',
      action: '価格FAQ閲覧',
      section: '価格詳細',
      value: '28人',
      impact: '🔴 価格懸念'
    },
    {
      time: '11:41',
      action: 'フォーム到達',
      section: 'アクション',
      value: '25人',
      impact: 'やや低い'
    },
    {
      time: '11:43',
      action: 'フォーム完了',
      section: 'コンバージョン',
      value: '20人',
      impact: '🔴 要改善'
    }
  ],
  
  suggestedActions: [
    {
      id: 'action-1',
      title: '競合対抗LP作成',
      description: '競合の価格攻勢に対抗するLP変更',
      priority: 'high',
      estimatedImpact: 'CVR+2.1%',
      executionTime: '今すぐ実行'
    },
    {
      id: 'action-2',
      title: 'モバイルフォーム修正',
      description: 'iPhone13以降の表示問題修正',
      priority: 'high',
      estimatedImpact: 'CVR+1.8%',
      executionTime: '3時間後'
    },
    {
      id: 'action-3',
      title: '価格セクション A/Bテスト開始',
      description: '価格訴求方法の最適化テスト',
      priority: 'medium',
      estimatedImpact: 'CVR+1.2%',
      executionTime: '明日'
    },
    {
      id: 'action-4',
      title: '競合監視アルゴリズム強化',
      description: '競合キャンペーン検知の精度向上',
      priority: 'low',
      estimatedImpact: '予防効果',
      executionTime: '1週間後'
    }
  ]
};

export const mockTradingData: TradingData = {
  totalLeads: 342,
  dailyGrowth: 45,
  positions: mockPositions
};