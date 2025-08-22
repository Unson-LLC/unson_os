// 統合型定義
import { TREND_TYPES, QUALITY_GRADES, POSITION_STATUS, TIME_RANGES } from './constants';

// 基本型
export type TrendType = typeof TREND_TYPES[keyof typeof TREND_TYPES];
export type QualityGrade = typeof QUALITY_GRADES[keyof typeof QUALITY_GRADES];
export type PositionStatus = typeof POSITION_STATUS[keyof typeof POSITION_STATUS];
export type TimeRange = typeof TIME_RANGES[keyof typeof TIME_RANGES];

// ポジション関連
export interface Position {
  id: string;
  symbol: string;
  status: PositionStatus;
  openDate: Date;
  cvr: number;
  previousCvr: number;
  cpl: number;
  totalLeads: number;
  qualityGrade: QualityGrade;
  validationScore: number;
  aiConfidence: number;
  nextAction: string;
  aiComment: string;
  trend: TrendType;
}

export interface TradingData {
  totalLeads: number;
  dailyGrowth: number;
  positions: Position[];
}

// 時系列イベント関連
export interface OptimizationEvent {
  type: string;
  description: string;
  executedAt: Date;
  impact: string;
  confidence: number;
}

export interface AnomalyEvent {
  type: string;
  severity: string;
  description: string;
  detectedAt: Date;
}

export interface TimeSeriesEvent {
  id: string;
  sessionId: string;
  timestamp: string;
  period: string;
  time: string;
  cvr: number;
  previousCvr: number;
  sessions: number;
  conversions: number;
  cpl: number;
  bounceRate: number;
  avgTimeOnPage: number;
  optimizations: OptimizationEvent[];
  anomalies: AnomalyEvent[];
  aiComment: string;
}

// イベント詳細分析関連
export interface AIInsight {
  grade: string;
  summary: string;
  rootCause: string;
  recommendations: string[];
  confidence: number;
  nextOptimization: string;
}

export interface UserBehaviorEntry {
  time: string;
  action: string;
  section: string;
  value: string;
  impact: string;
}

export interface MetricsComparison {
  current: number;
  previous: number;
  change: number;
  trend: TrendType;
}

export interface EventDetails {
  eventId: string;
  timestamp: string;
  aiSummary: AIInsight;
  metricsComparison: {
    cvr: MetricsComparison;
    sessions: MetricsComparison;
    bounceRate: MetricsComparison;
    timeOnPage: MetricsComparison;
  };
  userBehavior: UserBehaviorEntry[];
  suggestedActions: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact: string;
    executionTime: string;
  }>;
}

// コンポーネントプロパティ関連
export interface TradingDashboardProps {
  data: TradingData | null;
  error?: string;
  loading?: boolean;
  onPositionClick?: (position: Position) => void;
}

export interface TimeSeriesListProps {
  sessionId: string;
  events: TimeSeriesEvent[];
  loading?: boolean;
  error?: string;
  selectedEventId?: string;
  hasMore?: boolean;
  onEventSelect?: (event: TimeSeriesEvent) => void;
  onLoadMore?: () => void;
}

export interface EventDetailModalProps {
  isOpen: boolean;
  eventId: string;
  details: EventDetails;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onActionApprove?: (action: any) => Promise<void>;
}