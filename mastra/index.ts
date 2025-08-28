// Mastraエントリーポイント（全マイクロSaaS共通）

// 設定
export { mastraConfig } from './config'
export * from './config/constants'

// 型定義
export type * from './types'

// ツール
export { MetricsCalculator } from './tools/metrics-calculator'
export { IssueDetector } from './tools/issue-detector'
export { OptimizationActionGenerator } from './tools/optimization-action-generator'
export { OptimizationExecutor } from './tools/optimization-executor'

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

// エージェント
export { 
  adsOptimizerAgent, 
  generateOptimizationActions 
} from './agents/ads-optimizer'