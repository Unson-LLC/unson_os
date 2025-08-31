/**
 * Google Ads MCP統合関連の型定義
 */

export interface GoogleAdsAccount {
  customerId: string
  name: string
  currency: string
  timeZone?: string
}

export interface GoogleAdsMetrics {
  impressions: number
  clicks: number
  cost: number
  conversions: number
  cvr: number
  cpc: number
  cpa: number
  status: 'active' | 'warning' | 'paused'
}

export interface MCPQueryParams {
  customerId: number
  loginCustomerId: number
  reportAggregation?: string
}

export interface IntegrationFlowResult {
  step1_dataFetch: 'pending' | 'success' | 'failed'
  step2_convexSync: 'pending' | 'success' | 'failed'
  step3_uiUpdate: 'pending' | 'success' | 'failed'
  finalMetrics: GoogleAdsMetrics
  errors: string[]
}

export interface ConvexSyncData {
  productId: string
  metrics: GoogleAdsMetrics
  lastUpdated: string
}

export interface ConvexSyncResult {
  success: boolean
  productId: string
  syncedMetrics: GoogleAdsMetrics
  fallback?: boolean
  error?: string
}