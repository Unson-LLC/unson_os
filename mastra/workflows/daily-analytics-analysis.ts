// Google Analytics + PostHog 日次分析ワークフロー（REFACTOR完了：ベタ書き・ハードコード除去済み）
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { GA4DataClient, GA4Config, GA4Metrics } from '../tools/ga4-client'
import { PostHogDataClient, PostHogConfig, PostHogAnalytics } from '../tools/posthog-client'
import { generateAnalyticsInsights, AnalyticsInsights, InsightsContext } from '../agents/analytics-insights-agent'

export interface DailyAnalyticsConfig {
  productId: string
  dateRange: string
  ga4PropertyId: string
  posthogProjectId: string
  businessGoals?: string[]
  ga4CredentialsPath?: string
  posthogApiKey?: string
}

export interface DailyAnalyticsResult {
  productId: string
  timestamp: string
  dateRange: string
  ga4Data: GA4Metrics
  posthogData: PostHogAnalytics
  insights: AnalyticsInsights
  status: 'success' | 'failed'
  error?: string
}

const fetchGA4DataStep = createStep({
  id: 'fetch-ga4-data',
  inputSchema: z.object({
    productId: z.string(),
    dateRange: z.string(),
    ga4PropertyId: z.string(),
    posthogProjectId: z.string(),
    businessGoals: z.array(z.string()).optional(),
    ga4CredentialsPath: z.string().optional(),
    posthogApiKey: z.string().optional()
  }),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { ga4PropertyId, dateRange, ga4CredentialsPath } = inputData
    
    const ga4Config: GA4Config = {
      propertyId: ga4PropertyId,
      dateRange,
      credentialsPath: ga4CredentialsPath
    }
    
    const ga4Client = new GA4DataClient(ga4Config)
    const ga4Data = await ga4Client.fetchAnalyticsData()
    
    return { ...inputData, ga4Data }
  }
})

const fetchPostHogDataStep = createStep({
  id: 'fetch-posthog-data',
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const { posthogProjectId, dateRange, posthogApiKey } = inputData
    
    const posthogConfig: PostHogConfig = {
      projectId: posthogProjectId,
      apiKey: posthogApiKey,
      dateRange
    }
    
    const posthogClient = new PostHogDataClient(posthogConfig)
    const posthogData = await posthogClient.fetchBehaviorAnalytics()
    
    return { ...inputData, posthogData }
  }
})

// REFACTORしたワークフロー：専門クライアントクラスを使用
export const dailyAnalyticsWorkflow = createWorkflow({
  id: 'daily-analytics-analysis',
  inputSchema: z.object({
    productId: z.string(),
    dateRange: z.string(),
    ga4PropertyId: z.string(),
    posthogProjectId: z.string(),
    businessGoals: z.array(z.string()).optional(),
    ga4CredentialsPath: z.string().optional(),
    posthogApiKey: z.string().optional()
  }),
  outputSchema: z.any()
})
.then(fetchGA4DataStep)
.then(fetchPostHogDataStep)
.commit()

export async function runDailyAnalytics(config: DailyAnalyticsConfig): Promise<DailyAnalyticsResult> {
  try {
    const result = await dailyAnalyticsWorkflow.execute({ inputData: config } as any)
    const data = result
    
    // AI洞察生成
    const insightsContext: InsightsContext = {
      productId: config.productId,
      businessGoals: config.businessGoals || []
    }
    
    const insights = await generateAnalyticsInsights(
      data.ga4Data,
      data.posthogData,
      insightsContext
    )
    
    return {
      productId: config.productId,
      timestamp: new Date().toISOString(),
      dateRange: config.dateRange,
      ga4Data: data.ga4Data,
      posthogData: data.posthogData,
      insights,
      status: 'success'
    }
  } catch (error: any) {
    return {
      productId: config.productId,
      timestamp: new Date().toISOString(),
      dateRange: config.dateRange,
      ga4Data: {} as GA4Metrics,
      posthogData: {} as PostHogAnalytics,
      insights: {
        keyFindings: [],
        recommendations: [],
        performanceScore: 0,
        riskAlerts: [],
        opportunityAreas: []
      },
      status: 'failed',
      error: error.message
    }
  }
}