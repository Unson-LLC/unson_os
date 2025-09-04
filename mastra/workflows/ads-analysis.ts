// Google Ads 4時間窓分析ワークフロー（最新Mastra API版）
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { AdsWindow, PerformanceAnalysis } from '../types'
import { MetricsCalculator } from '../tools/metrics-calculator'
import { IssueDetector } from '../tools/issue-detector'

// ステップ定義
const calculateMetricsStep = createStep({
  id: 'calculate-metrics',
  inputSchema: z.object({
    current: z.any(),
    previous: z.any()
  }),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { current, previous } = inputData
    return MetricsCalculator.calculateAllMetrics(current, previous)
  }
})

const detectIssuesStep = createStep({
  id: 'detect-issues', 
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const metrics = inputData
    const issues = IssueDetector.detectAllIssues(metrics)
    return { ...metrics, issues }
  }
})

// ワークフロー定義
export const adsAnalysisWorkflow = createWorkflow({
  id: 'ads-4h-analysis',
  inputSchema: z.object({
    current: z.any(),
    previous: z.any()
  }),
  outputSchema: z.any()
})
.then(calculateMetricsStep)
.then(detectIssuesStep)
.commit()

export async function analyzeAdsPerformance(current: AdsWindow, previous: AdsWindow): Promise<PerformanceAnalysis> {
  const result = await adsAnalysisWorkflow.execute({ 
    inputData: { current, previous }
  } as any)
  return result as PerformanceAnalysis
}