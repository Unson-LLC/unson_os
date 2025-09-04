// Google Ads完全自動最適化パイプライン（最新Mastra API版）
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { analyzeAdsPerformance } from './ads-analysis'
import { adsOptimizerAgent, generateOptimizationActions } from '../agents/ads-optimizer'
import { OptimizationExecutor } from '../tools/optimization-executor'
import { AdsWindow, OptimizationAction, OptimizationResult, OptimizationRecord } from '../types'

// ステップ定義
const analyzeStep = createStep({
  id: 'analyze',
  inputSchema: z.object({
    currentWindow: z.any(),
    previousWindow: z.any(),
    productId: z.string()
  }),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { currentWindow, previousWindow } = inputData
    const analysis = await analyzeAdsPerformance(currentWindow, previousWindow)
    return { analysis }
  }
})

const generateActionsStep = createStep({
  id: 'generate-actions',
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { analysis } = inputData
    const actions = await generateOptimizationActions(analysis)
    return { analysis, actions }
  }
})

const executeOptimizationsStep = createStep({
  id: 'execute-optimizations',
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { actions } = inputData
    const results = await OptimizationExecutor.executeOptimizations(actions, { 
      dryRun: true, 
      logExecution: true 
    })
    return { results }
  }
})

// ワークフロー定義
export const adsOptimizationWorkflow = createWorkflow({
  id: 'ads-optimization-pipeline',
  inputSchema: z.object({
    currentWindow: z.any(),
    previousWindow: z.any(),
    productId: z.string()
  }),
  outputSchema: z.any()
})
.then(analyzeStep)
.then(generateActionsStep)
.then(executeOptimizationsStep)
.commit()

export async function executeFullOptimization(
  currentWindow: AdsWindow, 
  previousWindow: AdsWindow, 
  productId: string
) {
  const result = await adsOptimizationWorkflow.execute({
    inputData: {
      currentWindow,
      previousWindow,
      productId
    }
  } as any)
  
  return result as OptimizationRecord
}