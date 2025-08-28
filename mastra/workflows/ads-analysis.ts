// Google Ads 4時間窓分析ワークフロー（リファクタリング済み）
import { Workflow } from '@mastra/core'
import { AdsWindow, PerformanceAnalysis } from '../types'
import { MetricsCalculator } from '../tools/metrics-calculator'
import { IssueDetector } from '../tools/issue-detector'

export const adsAnalysisWorkflow = new Workflow({
  name: 'ads-4h-analysis',
  triggerSchema: {
    current: Object,
    previous: Object
  }
})
.step('calculate-metrics', async (context) => {
  const { current, previous } = context.data
  return MetricsCalculator.calculateAllMetrics(current, previous)
})
.step('detect-issues', async (context) => {
  const metrics = context.data
  const issues = IssueDetector.detectAllIssues(metrics)
  return { ...metrics, issues }
})

export async function analyzeAdsPerformance(current: AdsWindow, previous: AdsWindow): Promise<PerformanceAnalysis> {
  const result = await adsAnalysisWorkflow.execute({ current, previous })
  return result.data as PerformanceAnalysis
}