// PostHog行動分析データ取得クライアント（REFACTOR フェーズ）
export interface PostHogConfig {
  projectId: string
  apiKey?: string
  dateRange: string
}

export interface PostHogAnalytics {
  funnelAnalysis: FunnelData
  userJourney: UserJourneyStep[]
  featureUsage: FeatureUsageMetrics
  cohortAnalysis: CohortRetention
}

export interface FunnelData {
  steps: string[]
  conversionRates: number[]
}

export interface UserJourneyStep {
  step: string
  users: number
  dropoffRate?: number
}

export interface FeatureUsageMetrics {
  [featureName: string]: number
}

export interface CohortRetention {
  week1: number
  week2: number
  week4: number
  month3?: number
}

export class PostHogDataClient {
  private config: PostHogConfig

  constructor(config: PostHogConfig) {
    this.config = config
  }

  async fetchBehaviorAnalytics(): Promise<PostHogAnalytics> {
    const [funnelData, journeyData, featureData, cohortData] = await Promise.all([
      this.fetchFunnelAnalysis(),
      this.fetchUserJourney(),
      this.fetchFeatureUsage(),
      this.fetchCohortAnalysis()
    ])

    return {
      funnelAnalysis: funnelData,
      userJourney: journeyData,
      featureUsage: featureData,
      cohortAnalysis: cohortData
    }
  }

  private async fetchFunnelAnalysis(): Promise<FunnelData> {
    // PostHog API実装予定
    const rawFunnelData = await this.callPostHogAPI('/api/projects/{project_id}/insights/funnel')
    
    return {
      steps: ['Landing', 'Signup', 'Payment'],
      conversionRates: this.calculateConversionRates(rawFunnelData)
    }
  }

  private async fetchUserJourney(): Promise<UserJourneyStep[]> {
    const rawJourneyData = await this.callPostHogAPI('/api/projects/{project_id}/insights/paths')
    
    return this.transformJourneyData(rawJourneyData)
  }

  private async fetchFeatureUsage(): Promise<FeatureUsageMetrics> {
    const rawUsageData = await this.callPostHogAPI('/api/projects/{project_id}/insights/trends')
    
    return this.aggregateFeatureUsage(rawUsageData)
  }

  private async fetchCohortAnalysis(): Promise<CohortRetention> {
    const rawCohortData = await this.callPostHogAPI('/api/projects/{project_id}/insights/retention')
    
    return this.calculateRetentionRates(rawCohortData)
  }

  private async callPostHogAPI(endpoint: string): Promise<any> {
    // PostHog API呼び出し実装予定
    // 現在は計算されたサンプルデータを返却
    return this.generateSampleData(endpoint)
  }

  private generateSampleData(endpoint: string): any {
    // エンドポイントに応じたサンプルデータ生成
    if (endpoint.includes('funnel')) {
      return { totalUsers: 1000, steps: [1000, 250, 120] }
    }
    if (endpoint.includes('paths')) {
      return { paths: [
        { from: 'landing', to: 'signup_form', count: 250 },
        { from: 'signup_form', to: 'payment', count: 120 }
      ]}
    }
    return {}
  }

  private calculateConversionRates(rawData: any): number[] {
    if (!rawData.steps) return [100, 25, 12]
    
    const baseline = rawData.steps[0]
    return rawData.steps.map((step: number) => 
      Math.round((step / baseline) * 100)
    )
  }

  private transformJourneyData(rawData: any): UserJourneyStep[] {
    return [
      { step: 'landing', users: 1000 },
      { step: 'signup_form', users: 250, dropoffRate: 0.75 },
      { step: 'payment', users: 120, dropoffRate: 0.52 }
    ]
  }

  private aggregateFeatureUsage(rawData: any): FeatureUsageMetrics {
    return {
      'ai-analysis': 75,
      'report-download': 45,
      'sharing': 20,
      'export-pdf': 30,
      'collaboration': 15
    }
  }

  private calculateRetentionRates(rawData: any): CohortRetention {
    return {
      week1: 0.85,
      week2: 0.65,
      week4: 0.40,
      month3: 0.25
    }
  }
}