// Google Ads GAQL クエリビルダー（ベタ書きクエリの除去）
import { GOOGLE_ADS_CONFIG } from '../config/google-ads-constants'

export interface QueryOptions {
  startDate?: string
  endDate?: string
  limit?: number
  campaignId?: string
}

export class GoogleAdsQueryBuilder {
  static build4HourMetricsQuery(options: QueryOptions = {}): string {
    const { startDate, endDate, limit = GOOGLE_ADS_CONFIG.QUERY_LIMITS.MAX_4H_WINDOWS } = options
    
    const defaultStartDate = this.getDefaultStartDate()
    const defaultEndDate = this.getDefaultEndDate()

    return `
      SELECT 
        segments.hour_of_day,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign_performance_report 
      WHERE segments.date >= '${startDate || defaultStartDate}' 
        AND segments.date <= '${endDate || defaultEndDate}'
      ORDER BY segments.date DESC, segments.hour_of_day DESC
      LIMIT ${limit}
    `.trim()
  }

  static buildCampaignQuery(options: QueryOptions = {}): string {
    const { limit = GOOGLE_ADS_CONFIG.QUERY_LIMITS.MAX_CAMPAIGNS } = options

    return `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks
      FROM campaign 
      WHERE campaign.status = '${GOOGLE_ADS_CONFIG.STATUS.ENABLED}'
      LIMIT ${limit}
    `.trim()
  }

  static buildKeywordPerformanceQuery(campaignId: string, options: QueryOptions = {}): string {
    const { limit = GOOGLE_ADS_CONFIG.QUERY_LIMITS.MAX_KEYWORDS } = options

    return `
      SELECT 
        ad_group_criterion.keyword.text,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM keyword_view 
      WHERE campaign.id = '${campaignId}'
      LIMIT ${limit}
    `.trim()
  }

  private static getDefaultStartDate(): string {
    const date = new Date()
    date.setDate(date.getDate() - GOOGLE_ADS_CONFIG.DATE_RANGES.DEFAULT_LOOKBACK_DAYS)
    return this.formatDateForGAQL(date)
  }

  private static getDefaultEndDate(): string {
    return this.formatDateForGAQL(new Date())
  }

  private static formatDateForGAQL(date: Date): string {
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }
}