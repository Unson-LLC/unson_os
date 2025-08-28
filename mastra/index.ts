// Mastraエントリーポイント（全マイクロSaaS共通）

// 設定
export { mastraConfig } from './config'
export * from './config/constants'
export * from './config/google-ads-constants'

// 型定義
export type * from './types'

// ツール
export { MetricsCalculator } from './tools/metrics-calculator'
export { IssueDetector } from './tools/issue-detector'
export { OptimizationActionGenerator } from './tools/optimization-action-generator'
export { OptimizationExecutor } from './tools/optimization-executor'
export { GoogleAdsMcpClient } from './tools/google-ads-mcp-client'
export type { GoogleAdsMetric, CampaignInfo, KeywordPerformance } from './tools/google-ads-mcp-client'
export { GoogleAdsQueryBuilder } from './tools/google-ads-query-builder'
export type { QueryOptions } from './tools/google-ads-query-builder'
export { GoogleAdsResponseTransformer } from './tools/google-ads-response-transformer'
export { GoogleAdsApiOperationBuilder } from './agents/google-ads-api-operations'
export type { ApiOperation } from './agents/google-ads-api-operations'

// ワークフロー
export { 
  adsAnalysisWorkflow, 
  analyzeAdsPerformance 
} from './workflows/ads-analysis'

export { 
  adsOptimizationWorkflow, 
  executeFullOptimization,
  executeOptimizations,
  createOptimizationRecord
} from './workflows/ads-optimization'

export { 
  adsDataFetcherWorkflow,
  fetchAndAnalyzeAds
} from './workflows/ads-data-fetcher'
export type { AdsAnalysisResult } from './workflows/ads-data-fetcher'

export {
  ads4hAutomationWorkflow,
  runAutomation
} from './workflows/ads-4h-automation'
export type { AutomationConfig, AutomationResult } from './workflows/ads-4h-automation'

export { AutomationScheduler } from './workflows/automation-scheduler'
export type { 
  SchedulerConfig, 
  ProductConfig, 
  ScheduleConfig, 
  NotificationConfig,
  ScheduledExecution 
} from './workflows/automation-scheduler'

// エージェント
export { 
  adsOptimizerAgent, 
  generateOptimizationActions 
} from './agents/ads-optimizer'

export { AdsApiExecutor } from './agents/ads-api-executor'
export type { ApiExecutionResult, AdsApiConfig } from './agents/ads-api-executor'