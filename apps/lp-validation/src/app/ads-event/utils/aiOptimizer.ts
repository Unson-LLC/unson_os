// Google Ads AI分析・最適化（共通Mastraライブラリを使用）
import {
  analyzeAdsPerformance,
  generateOptimizationActions,
  executeOptimizations,
  createOptimizationRecord,
  executeFullOptimization
} from '../../../../../../mastra'

export type {
  AdsWindow,
  PerformanceAnalysis,
  OptimizationAction,
  OptimizationResult,
  OptimizationRecord
} from '../../../../../../mastra'

// これらの関数は共通Mastraライブラリに移行済み
// 必要に応じてここで再エクスポート
export {
  analyzeAdsPerformance,
  generateOptimizationActions,
  executeOptimizations,
  createOptimizationRecord,
  executeFullOptimization
}