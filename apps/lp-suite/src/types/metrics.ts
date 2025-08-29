// メトリクス・レポート型定義
export interface SessionMetrics {
  sessionId: string;
  sessionName: string;
  date: string;
  cvr: number;
  cpa: number;
  sessions: number;
  conversions: number;
  totalRevenue: number;
  clicks: number;
  impressions: number;
  ctr: number;
  roas: number;
}

export interface ReportConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  sessionIds: string[];
  includeCharts?: boolean;
  format: 'json' | 'csv' | 'pdf';
}

export interface MetricsReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  period: {
    start: string;
    end: string;
  };
  generatedAt: string;
  summary: {
    totalSessions: number;
    totalConversions: number;
    totalRevenue: number;
    averageCVR: number;
    averageCPA: number;
  };
  sessionDetails: SessionMetrics[];
  trends?: {
    cvrTrend: 'increasing' | 'decreasing' | 'stable';
    cpaTrend: 'increasing' | 'decreasing' | 'stable';
    cvrGrowthRate?: number;
    cpaImprovementRate?: number;
  };
  charts?: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
  };
}

export interface TrendAnalysis {
  cvrTrend: 'increasing' | 'decreasing' | 'stable';
  cpaTrend: 'increasing' | 'decreasing' | 'stable';
  cvrGrowthRate: number;
  cpaImprovementRate: number;
}

export interface Anomaly {
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  reason: string;
}

export interface SignificanceTest {
  isSignificant: boolean;
  confidenceLevel: number;
  pValue: number;
  testType: string;
}

export interface RealTimeMetrics {
  currentSessions: number;
  activeCampaigns: number;
  totalRevenue24h: number;
  averageCVR24h: number;
  topPerformingSession: {
    id: string;
    name: string;
    cvr: number;
  };
}

export interface Alert {
  type: 'cvr_below_threshold' | 'cpa_above_threshold' | 'revenue_drop' | 'anomaly_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  sessionId?: string;
}

export interface ScheduleConfig {
  type: 'daily' | 'weekly' | 'monthly';
  time?: string;
  timezone?: string;
  recipients: string[];
  sessionIds: string[];
}

export interface ScheduledReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}