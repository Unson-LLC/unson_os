// Google Ads AI分析・最適化の型定義（全プロダクト共通）

export interface AdsWindow {
  timestamp: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
}

export interface PerformanceAnalysis {
  ctr: { current: number, previous: number, change: number }
  cvr: { current: number, previous: number, change: number } 
  cpc: { current: number, previous: number, change: number }
  issues: string[]
}

export interface OptimizationAction {
  type: string
  description: string
  keywords?: string[]
  campaignId?: string
  adGroupId?: string
  adjustment?: number
}

export interface OptimizationResult {
  status: string
  message: string
  actionType: string
}

export interface OptimizationRecord {
  id: string
  timestamp: string
  type: string
  status: string
  actions: OptimizationAction[]
  impact: { estimated: string }
}