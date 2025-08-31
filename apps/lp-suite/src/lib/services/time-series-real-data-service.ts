/**
 * 時系列実データサービス
 * Google Ads実データを時系列イベント分析に統合
 */

export interface TimeSeriesDataPoint {
  date: string
  timeSlot: string
  campaign: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
  cvr: number
  ctr: number
}

export interface EventLog {
  eventId: string
  timestamp: string
  type: string
  title: string
  metrics: {
    impressions: number
    clicks: number
    cost: number
    conversions: number
    cvr: number
    ctr: number
  }
  status: 'active' | 'warning' | 'error'
  source: string
}

export interface PerformanceAnalysis {
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  overallCVR: number
  status: 'good' | 'needs-optimization' | 'critical'
  recommendation: string
}

export interface HourlyAnalysis {
  bestHour: string
  worstHour: string
  peakImpressions: { hour: string; value: number }
  peakClicks: { hour: string; value: number }
}

export interface AIRecommendations {
  priority: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  estimatedImpact: {
    cvrImprovement: number
    costReduction: number
    clickIncrease: number
  }
}

export class TimeSeriesRealDataService {
  constructor() {
    // Convexからデータを取得するため、ハードコードされたデータは削除
  }

  /**
   * わたしコンパスの4時間別実データを取得（Convexから）
   */
  async getWatashiCompass4HourData(date: string): Promise<TimeSeriesDataPoint[]> {
    try {
      // 統合された実データAPIエンドポイント経由でデータ取得
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:3002'
      const apiUrl = `${baseUrl}/api/real-ads-data?timeRange=4h`
      
      const response = await fetch(apiUrl, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const adsData = await response.json()
        console.log('実データAPI 4時間窓データ取得:', adsData)
        
        // 実データAPIレスポンスをTimeSeriesDataPoint形式に変換
        const timeSeriesData = adsData.data.records.map((item: any) => {
          const date = new Date(item.date)
          const hour = date.getHours()
          const timeSlot = `${hour}h~`
          
          return {
            date: date.toISOString().split('T')[0], // YYYY-MM-DD形式
            timeSlot,
            campaign: 'わたしコンパス_ベータテスター募集_2025',
            impressions: item.impressions,
            clicks: item.clicks,
            cost: item.cost,
            conversions: item.conversions,
            cvr: item.cvr,
            ctr: item.ctr
          }
        })
        
        console.log('変換済み時系列データ:', timeSeriesData)
        return timeSeriesData.filter(item => item.date === date)
        
      } else {
        throw new Error(`実データAPI failed: ${response.status}`)
      }
      
    } catch (error) {
      console.error('実データAPI 4時間窓データ取得エラー:', error)
      
      // フォールバック: 空の配列を返す（データがない場合）
      console.warn('フォールバック: 空データ返却')
      return []
    }
  }

  /**
   * 統合イベントログ形式に変換
   */
  async convertToEventLog(dataPoint: TimeSeriesDataPoint): Promise<EventLog> {
    const eventId = `watashi-compass-${dataPoint.date}-${dataPoint.timeSlot.replace('h~', 'h')}`
    const status = this.determineStatusSync(dataPoint)

    return {
      eventId,
      timestamp: `${dataPoint.date} ${dataPoint.timeSlot}`,
      type: 'ads-performance',
      title: 'WATASHI-COMPASS-001統合イベントログ',
      metrics: {
        impressions: dataPoint.impressions,
        clicks: dataPoint.clicks,
        cost: dataPoint.cost,
        conversions: dataPoint.conversions,
        cvr: dataPoint.cvr,
        ctr: dataPoint.ctr
      },
      status,
      source: 'google-ads-real-data'
    }
  }

  /**
   * パフォーマンス分析
   */
  async analyzePerformance(data: TimeSeriesDataPoint[]): Promise<PerformanceAnalysis> {
    const totals = data.reduce((acc, item) => ({
      impressions: acc.impressions + item.impressions,
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions
    }), { impressions: 0, clicks: 0, conversions: 0 })

    const overallCVR = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0

    let status: 'good' | 'needs-optimization' | 'critical' = 'critical'
    let recommendation = 'コンバージョン改善が急務です。ランディングページとターゲティングの見直しを実施してください。'

    if (overallCVR >= 2) {
      status = 'good'
      recommendation = 'パフォーマンスは良好です。さらなる最適化でCVR向上を目指しましょう。'
    } else if (overallCVR >= 0.5) {
      status = 'needs-optimization'
      recommendation = 'CVRに改善の余地があります。A/Bテストによる最適化をおすすめします。'
    }

    return {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      overallCVR: Math.round(overallCVR * 10) / 10,
      status,
      recommendation
    }
  }

  /**
   * 時間帯別パフォーマンス分析
   */
  async analyzeHourlyPerformance(data: TimeSeriesDataPoint[]): Promise<HourlyAnalysis> {
    const sortedByCTR = [...data].sort((a, b) => b.ctr - a.ctr)
    const sortedByImpressions = [...data].sort((a, b) => b.impressions - a.impressions)
    const sortedByClicks = [...data].sort((a, b) => b.clicks - a.clicks)

    return {
      bestHour: sortedByCTR[0].timeSlot,
      worstHour: sortedByCTR[sortedByCTR.length - 1].timeSlot,
      peakImpressions: {
        hour: sortedByImpressions[0].timeSlot,
        value: sortedByImpressions[0].impressions
      },
      peakClicks: {
        hour: sortedByClicks[0].timeSlot,
        value: sortedByClicks[0].clicks
      }
    }
  }

  /**
   * 4時間間隔イベントログ生成
   */
  async generate4HourEventLogs(date: string): Promise<EventLog[]> {
    const timeSeriesData = await this.getWatashiCompass4HourData(date)
    const eventLogs: EventLog[] = []

    for (const dataPoint of timeSeriesData) {
      const eventLog = await this.convertToEventLog(dataPoint)
      eventLogs.push(eventLog)
    }

    return eventLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }

  /**
   * ステータス判定（同期版）
   */
  private determineStatusSync(dataPoint: TimeSeriesDataPoint): 'active' | 'warning' | 'error' {
    const { ctr, cvr, conversions } = dataPoint

    if (conversions > 0 && cvr >= 1) {
      return 'active' // コンバージョンありで良いCVR
    } else if (ctr >= 5 && conversions === 0) {
      return 'warning' // CTR良いがコンバージョンなし
    } else {
      return 'error' // パフォーマンス悪い
    }
  }

  /**
   * ステータス判定（非同期版 - テスト用）
   */
  async determineStatus(dataPoint: TimeSeriesDataPoint): Promise<'active' | 'warning' | 'error'> {
    return this.determineStatusSync(dataPoint)
  }

  /**
   * AI分析レコメンド生成
   */
  async generateAIRecommendations(data: TimeSeriesDataPoint[]): Promise<AIRecommendations> {
    const analysis = await this.analyzePerformance(data)
    const hourlyAnalysis = await this.analyzeHourlyPerformance(data)

    let priority: 'low' | 'medium' | 'high' | 'critical' = 'critical'
    const recommendations: string[] = []

    if (analysis.overallCVR === 0) {
      priority = 'critical'
      recommendations.push('ランディングページの改善: CVR 0%は緊急対応が必要です')
      recommendations.push('ターゲティングの見直し: より購買意欲の高いオーディエンスに絞り込み')
      recommendations.push('広告クリエイティブの最適化: クリック後の期待値とのミスマッチ解消')
    }

    // 時間帯別の推奨事項
    if (hourlyAnalysis.bestHour !== hourlyAnalysis.worstHour) {
      recommendations.push(`最適時間帯(${hourlyAnalysis.bestHour})での予算集中を検討`)
    }

    return {
      priority,
      recommendations: recommendations.slice(0, 3), // 上位3つのみ
      estimatedImpact: {
        cvrImprovement: analysis.overallCVR === 0 ? 1.5 : 0.5, // CVR改善予測
        costReduction: 15, // コスト削減予測(%)
        clickIncrease: 10 // クリック増加予測(%)
      }
    }
  }

  /**
   * Google Ads APIからのフェッチ（Convex経由）
   */
  async fetchFromGoogleAds(date: string): Promise<TimeSeriesDataPoint[]> {
    // ConvexのgetWatashiCompass4HourDataを使用
    return await this.getWatashiCompass4HourData(date)
  }

  /**
   * フォールバック付きデータ取得
   */
  async getTimeSeriesDataWithFallback(date: string): Promise<{
    success: boolean
    data?: TimeSeriesDataPoint[]
    fallbackData?: TimeSeriesDataPoint[]
    error?: string
  }> {
    try {
      const data = await this.fetchFromGoogleAds(date)
      if (data && data.length > 0) {
        return { success: true, data }
      } else {
        throw new Error('No data found in database')
      }
    } catch (error) {
      console.error('データ取得失敗、フォールバック実行:', error)
      
      // フォールバック: 空の配列（データベースにデータがない場合）
      return {
        success: false,
        fallbackData: [],
        error: String(error)
      }
    }
  }
}