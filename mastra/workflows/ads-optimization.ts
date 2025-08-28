// Google Ads完全自動最適化パイプライン（リファクタリング済み）
import { Workflow } from '@mastra/core'
import { analyzeAdsPerformance } from './ads-analysis'
import { adsOptimizerAgent, generateOptimizationActions } from '../agents/ads-optimizer'
import { OptimizationExecutor } from '../tools/optimization-executor'
import { AdsWindow, OptimizationAction, OptimizationResult, OptimizationRecord } from '../types'

export const adsOptimizationWorkflow = new Workflow({
  name: 'ads-optimization-pipeline',
  triggerSchema: {
    currentWindow: Object,
    previousWindow: Object,
    productId: String
  }
})
.step('analyze', async (context) => {
  const { currentWindow, previousWindow } = context.data
  const analysis = await analyzeAdsPerformance(currentWindow, previousWindow)
  return { analysis }
})
.step('generate-actions', async (context) => {
  const { analysis } = context.data
  const actions = await generateOptimizationActions(analysis)
  return { analysis, actions }
})
.step('execute-optimizations', async (context) => {
  const { actions } = context.data
  const results = await OptimizationExecutor.executeOptimizations(actions, { 
    dryRun: true, 
    logExecution: true 
  })
  return { results }
})

export async function executeFullOptimization(
  currentWindow: AdsWindow, 
  previousWindow: AdsWindow, 
  productId: string
) {
  const result = await adsOptimizationWorkflow.execute({
    currentWindow,
    previousWindow,
    productId
  })
  
  return result.data
}

export async function executeOptimizations(optimizations: OptimizationAction[]): Promise<OptimizationResult[]> {
  return OptimizationExecutor.executeOptimizations(optimizations)
}

export function createOptimizationRecord(
  windowData: AdsWindow,
  actions: OptimizationAction[],
  results: OptimizationResult[]
): OptimizationRecord {
  return OptimizationExecutor.createOptimizationRecord(windowData, actions, results)
}