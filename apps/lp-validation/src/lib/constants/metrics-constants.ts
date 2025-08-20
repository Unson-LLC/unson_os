// メトリクス・レポート定数定義
export const METRICS_CONSTANTS = {
  REPORT_TYPES: {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    CUSTOM: 'custom'
  } as const,

  OUTPUT_FORMATS: {
    JSON: 'json',
    CSV: 'csv',
    PDF: 'pdf'
  } as const,

  CHART_TYPES: {
    LINE: 'line',
    BAR: 'bar',
    PIE: 'pie'
  } as const,

  ALERT_TYPES: {
    CVR_BELOW_THRESHOLD: 'cvr_below_threshold',
    CPA_ABOVE_THRESHOLD: 'cpa_above_threshold',
    REVENUE_DROP: 'revenue_drop',
    ANOMALY_DETECTED: 'anomaly_detected'
  } as const,

  ALERT_SEVERITY: {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  } as const,

  TREND_DIRECTIONS: {
    INCREASING: 'increasing',
    DECREASING: 'decreasing',
    STABLE: 'stable'
  } as const,

  STATISTICAL_THRESHOLDS: {
    TREND_CHANGE_PERCENT: 5,
    ANOMALY_STANDARD_DEVIATIONS: 2,
    SIGNIFICANCE_P_VALUE: 0.1,
    MINIMUM_SAMPLE_SIZE: 30
  },

  TIME_PERIODS: {
    MINUTES_PER_HOUR: 60,
    HOURS_PER_DAY: 24,
    DAYS_PER_WEEK: 7,
    MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
    MILLISECONDS_PER_HOUR: 60 * 60 * 1000,
    MILLISECONDS_PER_MINUTE: 60 * 1000
  },

  PERFORMANCE_METRICS: {
    DEFAULT_CTR: 14.0,
    DEFAULT_ROAS: 3.2,
    CLICK_TO_SESSION_RATIO: 2.1,
    IMPRESSION_TO_SESSION_RATIO: 15,
    CONFIDENCE_LEVEL_95: 95,
    CONFIDENCE_LEVEL_99: 99
  },

  REPORT_LIMITS: {
    MAX_SESSIONS_PER_REPORT: 50,
    MAX_DATA_POINTS_PER_CHART: 100,
    DEFAULT_REPORT_HISTORY_LIMIT: 10,
    MAX_EXPORT_ROWS: 10000
  },

  CSV_CONFIG: {
    DELIMITER: ',',
    LINE_ENDING: '\n',
    HEADERS: [
      'Session ID',
      'Session Name',
      'CVR',
      'CPA',
      'Sessions',
      'Conversions',
      'Revenue'
    ]
  },

  CHART_CONFIG: {
    DEFAULT_COLORS: [
      '#3B82F6', // Blue
      '#10B981', // Green  
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#EC4899'  // Pink
    ],
    DEFAULT_HEIGHT: 64, // 16rem in pixels
    DEFAULT_WIDTH: 48   // 12rem in pixels
  },

  CONVEX_QUERIES: {
    GET_SESSIONS_BY_STATUS: 'lpValidation:getSessionsByStatus',
    GET_METRICS_BY_DATE_RANGE: 'lpValidation:getMetricsByDateRange',
    GET_MONTHLY_AGGREGATED_METRICS: 'lpValidation:getMonthlyAggregatedMetrics',
    GET_REAL_TIME_METRICS: 'metrics:getRealTimeMetrics',
    GET_REPORT: 'metrics:getReport',
    GET_REPORT_HISTORY: 'metrics:getReportHistory'
  },

  CONVEX_MUTATIONS: {
    SAVE_REPORT: 'metrics:saveReport'
  },

  EMAIL_CONFIG: {
    INVALID_EMAIL_PATTERN: 'invalid@email',
    DEFAULT_SUBJECT_PREFIX: 'LP検証システム レポート',
    DEFAULT_FROM: 'noreply@unson-os.com'
  },

  ERROR_MESSAGES: {
    DATABASE_CONNECTION_FAILED: 'Database connection failed',
    EMAIL_DELIVERY_FAILED: 'Email delivery failed',
    INSUFFICIENT_DATA_FOR_ANALYSIS: 'データが不十分です',
    REPORT_GENERATION_FAILED: 'レポート生成に失敗しました',
    INVALID_DATE_RANGE: '日付範囲が無効です',
    INVALID_SESSION_IDS: 'セッションIDが無効です'
  },

  ALERT_MESSAGES: {
    CVR_BELOW_THRESHOLD: (cvr: number, threshold: number) => 
      `CVR ${cvr}% が目標値 ${threshold}% を下回っています`,
    CPA_ABOVE_THRESHOLD: (cpa: number, threshold: number) => 
      `CPA ¥${cpa} が目標値 ¥${threshold} を上回っています`,
    SESSIONS_BELOW_MINIMUM: (sessions: number, minimum: number) => 
      `セッション数 ${sessions} が最小値 ${minimum} を下回っています`,
    ANOMALY_DETECTED: (deviation: number) => 
      `異常な変動を検出: 過去平均の ${deviation.toFixed(1)}標準偏差を超えています`,
    REVENUE_DROP: (percentage: number) => 
      `過去24時間で収益が ${percentage}% 減少しました`
  },

  DATE_FORMAT: {
    ISO_DATE: 'YYYY-MM-DD',
    JAPANESE_LOCALE: 'ja-JP',
    TIMEZONE_TOKYO: 'Asia/Tokyo'
  },

  PRECISION: {
    PERCENTAGE_DECIMAL_PLACES: 1,
    CURRENCY_DECIMAL_PLACES: 0,
    STATISTICAL_DECIMAL_PLACES: 3,
    CHART_VALUE_DECIMAL_PLACES: 1
  }
} as const;

export const METRIC_FIELD_NAMES = {
  SESSION_ID: 'sessionId',
  SESSION_NAME: 'sessionName',
  CVR: 'cvr',
  CPA: 'cpa',
  SESSIONS: 'sessions',
  CONVERSIONS: 'conversions',
  REVENUE: 'revenue',
  CLICKS: 'clicks',
  IMPRESSIONS: 'impressions',
  CTR: 'ctr',
  ROAS: 'roas',
  DATE: 'date',
  TIMESTAMP: 'timestamp'
} as const;

export const SCHEDULE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
} as const;