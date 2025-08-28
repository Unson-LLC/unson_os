// Google Ads レスポンス変換ツール（データ変換ロジック分離）
import { GOOGLE_ADS_CONFIG } from '../config/google-ads-constants'
import { GoogleAdsMetric, CampaignInfo, KeywordPerformance } from './google-ads-mcp-client'

export class GoogleAdsResponseTransformer {
  static transformMetricsResponse(results: any[]): GoogleAdsMetric[] {
    return results.map(row => ({
      timestamp: this.createTimestamp(row.segments.date, row.segments.hour_of_day),
      impressions: Number(row.metrics.impressions) || 0,
      clicks: Number(row.metrics.clicks) || 0,
      cost: this.convertMicrosToYen(row.metrics.cost_micros),
      conversions: Number(row.metrics.conversions) || 0
    }))
  }

  static transformCampaignResponse(results: any[]): CampaignInfo[] {
    return results.map(row => ({
      id: String(row.campaign.id),
      name: String(row.campaign.name || ''),
      status: String(row.campaign.status || ''),
      impressions: Number(row.metrics.impressions) || 0,
      clicks: Number(row.metrics.clicks) || 0
    }))
  }

  static transformKeywordResponse(results: any[]): KeywordPerformance[] {
    return results.map(row => {
      const impressions = Number(row.metrics.impressions) || 0
      const clicks = Number(row.metrics.clicks) || 0
      const cost = this.convertMicrosToYen(row.metrics.cost_micros)

      return {
        keyword: String(row.ad_group_criterion?.keyword?.text || ''),
        impressions,
        clicks,
        cost,
        ctr: this.calculateCTR(clicks, impressions),
        cpc: this.calculateCPC(cost, clicks)
      }
    })
  }

  private static createTimestamp(date: string, hourOfDay: number): string {
    const paddedHour = String(hourOfDay).padStart(2, '0')
    return `${date}T${paddedHour}:00:00.000Z`
  }

  private static convertMicrosToYen(micros: number): number {
    return Number((micros / GOOGLE_ADS_CONFIG.CONVERSION_RATES.MICROS_TO_YEN).toFixed(2))
  }

  private static calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0
    return Number(((clicks / impressions) * 100).toFixed(1))
  }

  private static calculateCPC(cost: number, clicks: number): number {
    if (clicks === 0) return 0
    return Number((cost / clicks).toFixed(2))
  }
}