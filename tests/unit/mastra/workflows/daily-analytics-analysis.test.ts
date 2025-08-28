// Google Analytics + PostHog 日次分析ワークフローのテスト
import { dailyAnalyticsWorkflow, runDailyAnalytics } from '../daily-analytics-analysis'

describe('Google Analytics + PostHog 日次分析', () => {
  describe('dailyAnalyticsWorkflow', () => {
    it('日次分析ワークフローが正しく定義されている', () => {
      expect(dailyAnalyticsWorkflow.name).toBe('daily-analytics-analysis')
      expect(dailyAnalyticsWorkflow.triggerSchema).toBeDefined()
    })

    it('必要なステップが定義されている', () => {
      const steps = dailyAnalyticsWorkflow.steps
      expect(steps).toContain('fetch-ga4-data')
      expect(steps).toContain('fetch-posthog-data')  
      expect(steps).toContain('analyze-user-behavior')
      expect(steps).toContain('generate-insights')
    })
  })

  describe('runDailyAnalytics', () => {
    const mockConfig = {
      productId: 'WATASHI-COMPASS',
      dateRange: '7d',
      ga4PropertyId: '123456789',
      posthogProjectId: 'abc123'
    }

    it('GA4とPostHogからデータを取得する', async () => {
      const result = await runDailyAnalytics(mockConfig)
      
      expect(result.ga4Data).toBeDefined()
      expect(result.ga4Data.sessions).toBeGreaterThan(0)
      expect(result.ga4Data.users).toBeGreaterThan(0)
      expect(result.ga4Data.conversionRate).toBeGreaterThan(0)
    })

    it('PostHogユーザー行動分析が含まれる', async () => {
      const result = await runDailyAnalytics(mockConfig)
      
      expect(result.posthogData).toBeDefined()
      expect(result.posthogData.funnelAnalysis).toBeDefined()
      expect(result.posthogData.userJourney).toBeDefined()
      expect(result.posthogData.featureUsage).toBeDefined()
    })

    it('統合分析レポートを生成する', async () => {
      const result = await runDailyAnalytics(mockConfig)
      
      expect(result.insights).toBeDefined()
      expect(result.insights.keyFindings).toHaveLength(3)
      expect(result.insights.recommendations).toHaveLength(2)
      expect(result.insights.performanceScore).toBeGreaterThan(0)
    })

    it('日次レポートの構造が正しい', async () => {
      const result = await runDailyAnalytics(mockConfig)
      
      expect(result).toEqual({
        productId: 'WATASHI-COMPASS',
        timestamp: expect.any(String),
        dateRange: '7d',
        ga4Data: expect.any(Object),
        posthogData: expect.any(Object),
        insights: expect.objectContaining({
          keyFindings: expect.any(Array),
          recommendations: expect.any(Array),
          performanceScore: expect.any(Number)
        }),
        status: 'success'
      })
    })

    it('データ取得エラー時にfailedステータスを返す', async () => {
      const errorConfig = { ...mockConfig, ga4PropertyId: 'invalid' }
      const result = await runDailyAnalytics(errorConfig)
      
      expect(result.status).toBe('failed')
      expect(result.error).toBeDefined()
    })
  })

  describe('GA4データ形式', () => {
    it('必要なメトリクスが含まれる', async () => {
      const result = await runDailyAnalytics({
        productId: 'TEST',
        dateRange: '1d',
        ga4PropertyId: '123456789',
        posthogProjectId: 'abc123'
      })
      
      const ga4 = result.ga4Data
      expect(ga4).toEqual({
        sessions: expect.any(Number),
        users: expect.any(Number),
        pageviews: expect.any(Number),
        bounceRate: expect.any(Number),
        conversionRate: expect.any(Number),
        avgSessionDuration: expect.any(Number),
        trafficSources: expect.any(Object)
      })
    })
  })

  describe('PostHogデータ形式', () => {
    it('行動分析データが含まれる', async () => {
      const result = await runDailyAnalytics({
        productId: 'TEST',
        dateRange: '1d', 
        ga4PropertyId: '123456789',
        posthogProjectId: 'abc123'
      })
      
      const posthog = result.posthogData
      expect(posthog).toEqual({
        funnelAnalysis: expect.objectContaining({
          steps: expect.any(Array),
          conversionRates: expect.any(Array)
        }),
        userJourney: expect.any(Array),
        featureUsage: expect.any(Object),
        cohortAnalysis: expect.any(Object)
      })
    })
  })
})