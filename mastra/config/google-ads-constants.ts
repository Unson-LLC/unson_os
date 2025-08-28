// Google Ads MCP & API 関連定数（ハードコード除去）
export const GOOGLE_ADS_CONFIG = {
  MCP_TOOL_NAME: 'mcp__googleads__execute-gaql-query',
  
  REPORT_AGGREGATION: {
    HOURLY: 'HOURLY',
    CAMPAIGN: 'CAMPAIGN',
    KEYWORD: 'KEYWORD',
  },
  
  QUERY_LIMITS: {
    MAX_4H_WINDOWS: 48,
    MAX_CAMPAIGNS: 100,
    MAX_KEYWORDS: 1000,
  },
  
  CONVERSION_RATES: {
    MICROS_TO_YEN: 1000000,
  },
  
  DATE_RANGES: {
    DEFAULT_LOOKBACK_DAYS: 2,
  },

  API_ENTITIES: {
    AD_GROUP_CRITERION: 'ad_group_criterion',
    AD_GROUP_AD: 'ad_group_ad',
    CAMPAIGN: 'campaign',
  },

  OPERATIONS: {
    CREATE: 'create',
    UPDATE: 'update',
    REMOVE: 'remove',
  },

  STATUS: {
    ENABLED: 'ENABLED',
    PAUSED: 'PAUSED',
    REMOVED: 'REMOVED',
  },

  UPDATE_MASKS: {
    STATUS: 'status',
    CPC_BID_MICROS: 'cpc_bid_micros',
    AD_TEXT: 'ad.responsive_search_ad',
  },

  AD_TYPES: {
    RESPONSIVE_SEARCH_AD: 'RESPONSIVE_SEARCH_AD',
  },

  ERROR_MESSAGES: {
    MCP_QUERY_FAILED: 'Google Ads MCP query failed',
    API_OPERATION_FAILED: 'Google Ads API operation failed',
    INSUFFICIENT_DATA: '分析に必要な過去データが不足しています。最低2つの4時間窓データが必要です。',
    MISSING_KEYWORD: 'キーワードが指定されていません',
    SAFETY_LIMIT_EXCEEDED: '安全制限を超えています',
    UNSUPPORTED_ACTION_TYPE: '未対応のアクションタイプ',
  },

  SUCCESS_MESSAGES: {
    KEYWORD_PAUSED: 'キーワード停止完了',
    BID_ADJUSTED: '入札調整完了', 
    AD_TEST_CREATED: '広告テスト開始完了',
  },

  DEFAULT_AD_CONTENT: {
    TEST_HEADLINES: [
      { text: 'AI最適化テスト見出し1' },
      { text: 'パフォーマンス向上テスト2' }
    ],
    TEST_DESCRIPTIONS: [
      { text: 'AI分析による自動最適化でCVR向上を実現' },
      { text: '4時間窓分析でリアルタイム改善' }
    ]
  }
} as const