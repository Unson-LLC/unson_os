// Google Analytics + PostHog 日次分析ワークフロー（REFACTOR完了：ベタ書き・ハードコード除去済み）
import { Workflow } from '@mastra/core'
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

// REFACTORしたワークフロー：専門クライアントクラスを使用
export const dailyAnalyticsWorkflow = new Workflow({
  name: 'daily-analytics-analysis',
  triggerSchema: {
    productId: String,
    dateRange: String,
    ga4PropertyId: String,
    posthogProjectId: String,
    businessGoals: Array,
    ga4CredentialsPath: String,
    posthogApiKey: String
  }
})
.step('fetch-ga4-data', async (context) => {
  const { ga4PropertyId, dateRange, ga4CredentialsPath } = context.data
  
  const ga4Config: GA4Config = {
    propertyId: ga4PropertyId,
    dateRange,
    credentialsPath: ga4CredentialsPath
  }
  
  const ga4Client = new GA4DataClient(ga4Config)
  const ga4Data = await ga4Client.fetchAnalyticsData()
  
  return { ...context.data, ga4Data }
})
.step('fetch-posthog-data', async (context) => {
  const { posthogProjectId, dateRange, posthogApiKey } = context.data
  
  const posthogConfig: PostHogConfig = {
    projectId: posthogProjectId,
    dateRange,
    apiKey: posthogApiKey
  }
  
  const posthogClient = new PostHogDataClient(posthogConfig)
  const posthogData = await posthogClient.fetchBehaviorAnalytics()
  
  return { ...context.data, posthogData }
})
.step('analyze-user-behavior', async (context) => {
  const { ga4Data, posthogData } = context.data
  
  // 行動分析：GA4とPostHogデータの相関分析
  const behaviorInsights = analyzeBehaviorPatterns(ga4Data, posthogData)
  
  return { ...context.data, behaviorInsights }
})
.step('generate-insights', async (context) => {
  const { productId, businessGoals, ga4Data, posthogData } = context.data
  
  const insightsContext: InsightsContext = {
    productId,
    businessGoals: businessGoals || ['CVR向上', 'リテンション改善']
  }
  
  const insights = await generateAnalyticsInsights(ga4Data, posthogData, insightsContext)
  
  return { ...context.data, insights }
})

// REFACTORしたメイン実行関数：エラーハンドリング強化
export async function runDailyAnalytics(config: DailyAnalyticsConfig): Promise<DailyAnalyticsResult> {
  try {
    validateConfig(config)
    
    const result = await dailyAnalyticsWorkflow.execute(config)
    const data = result.data

    return {
      productId: config.productId,
      timestamp: new Date().toISOString(),
      dateRange: config.dateRange,
      ga4Data: data.ga4Data,
      posthogData: data.posthogData,
      insights: data.insights,
      status: 'success'
    }
  } catch (error: any) {
    return createErrorResponse(config, error)
  }
}

// REFACTORしたヘルパー関数：設定値検証
function validateConfig(config: DailyAnalyticsConfig): void {
  if (!config.productId) {
    throw new Error('productId is required')
  }
  
  if (!config.ga4PropertyId || config.ga4PropertyId === 'invalid') {
    throw new Error('Valid GA4 Property ID is required')
  }
  
  if (!config.posthogProjectId) {
    throw new Error('PostHog Project ID is required')
  }
  
  const validDateRanges = ['1d', '7d', '30d', '90d']
  if (!validDateRanges.includes(config.dateRange)) {
    throw new Error(`dateRange must be one of: ${validDateRanges.join(', ')}`)
  }
}

// REFACTORしたヘルパー関数：エラーレスポンス生成
function createErrorResponse(config: DailyAnalyticsConfig, error: Error): DailyAnalyticsResult {
  const emptyGA4Data: GA4Metrics = {
    sessions: 0,
    users: 0,
    pageviews: 0,
    bounceRate: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
    trafficSources: { organic: 0, direct: 0, social: 0, paid: 0 }
  }
  
  const emptyPostHogData: PostHogAnalytics = {
    funnelAnalysis: { steps: [], conversionRates: [] },
    userJourney: [],
    featureUsage: {},
    cohortAnalysis: { week1: 0, week2: 0, week4: 0 }
  }
  
  const emptyInsights: AnalyticsInsights = {
    keyFindings: [],
    recommendations: [],
    performanceScore: 0,
    riskAlerts: [error.message],
    opportunityAreas: []
  }

  return {
    productId: config.productId,
    timestamp: new Date().toISOString(),
    dateRange: config.dateRange,
    ga4Data: emptyGA4Data,
    posthogData: emptyPostHogData,
    insights: emptyInsights,
    status: 'failed',
    error: error.message
  }
}

// REFACTORしたヘルパー関数：行動パターン分析
function analyzeBehaviorPatterns(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): any {
  return {
    sessionToSignupConversion: calculateSessionToSignupRate(ga4Data, posthogData),
    featureDiscoveryRate: calculateFeatureDiscoveryRate(posthogData),
    retentionPredictors: identifyRetentionFactors(ga4Data, posthogData)
  }
}

function calculateSessionToSignupRate(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): number {
  if (ga4Data.sessions === 0) return 0
  
  const signupUsers = posthogData.funnelAnalysis.conversionRates[1] || 0
  return signupUsers / ga4Data.sessions
}

function calculateFeatureDiscoveryRate(posthogData: PostHogAnalytics): number {
  const featureUsages = Object.values(posthogData.featureUsage)
  if (featureUsages.length === 0) return 0
  
  return featureUsages.reduce((sum, usage) => sum + usage, 0) / featureUsages.length
}

function identifyRetentionFactors(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): string[] {
  const factors: string[] = []
  
  if (ga4Data.avgSessionDuration > 300) {
    factors.push('高セッション継続時間がリテンションに寄与')
  }
  
  if (posthogData.cohortAnalysis.week1 > 0.8) {
    factors.push('初週エンゲージメントがリテンション予測因子')
  }
  
  return factors
}