// Google Ads 分析・最適化の定数定義
export const ADS_ANALYSIS_THRESHOLDS = {
  CTR_DROP_THRESHOLD: -10,    // CTR大幅低下の閾値（%）
  CVR_DROP_THRESHOLD: -20,    // CVR悪化の閾値（%）
  CPC_SPIKE_THRESHOLD: 50,    // CPC急上昇の閾値（%）
} as const

export const METRIC_PRECISION = {
  CTR_DECIMAL_PLACES: 1,      // CTRの小数点以下桁数
  CVR_DECIMAL_PLACES: 1,      // CVRの小数点以下桁数
  CPC_DECIMAL_PLACES: 0,      // CPCの小数点以下桁数（整数）
  CHANGE_DECIMAL_PLACES: 1,   // 変化率の小数点以下桁数
} as const

export const ISSUE_MESSAGES = {
  CTR_DROP: 'CTR大幅低下',
  CVR_DROP: 'CVR悪化',
  CPC_SPIKE: 'CPC急上昇',
} as const

export const OPTIMIZATION_SAFETY_LIMITS = {
  MAX_BID_CHANGE_PERCENT: 30,    // 最大入札変更率（%）
  COOLDOWN_HOURS: 24,            // クールダウン時間（時間）
  MIN_IMPRESSIONS_FOR_ACTION: 100, // アクション実行に必要な最小インプレッション数
} as const