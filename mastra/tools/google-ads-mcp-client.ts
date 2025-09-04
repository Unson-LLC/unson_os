// Google Ads MCP クライアント（リファクタリング済み）
import { GOOGLE_ADS_CONFIG } from '../config/google-ads-constants'
import { GoogleAdsQueryBuilder, QueryOptions } from './google-ads-query-builder'
import { GoogleAdsResponseTransformer } from './google-ads-response-transformer'
import { mastraConfig } from '../config'

export interface GoogleAdsMetric {
  timestamp: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
}

export interface CampaignInfo {
  id: string
  name: string
  status: string
  impressions: number
  clicks: number
}

export interface KeywordPerformance {
  keyword: string
  impressions: number
  clicks: number
  cost: number
  ctr: number
  cpc: number
}

export class GoogleAdsMcpClient {
  private mcpClient: any

  constructor(mcpClient?: any) {
    this.mcpClient = mcpClient || this.getDefaultMcpClient()
  }

  async get4HourMetrics(customerId: number, loginCustomerId: number, options: QueryOptions = {}): Promise<GoogleAdsMetric[]> {
    try {
      const query = GoogleAdsQueryBuilder.build4HourMetricsQuery(options)
      
      const response = await this.executeQuery({
        customerId,
        loginCustomerId,
        query,
        reportAggregation: GOOGLE_ADS_CONFIG.REPORT_AGGREGATION.HOURLY
      })

      return GoogleAdsResponseTransformer.transformMetricsResponse(response.results || [])
    } catch (error: any) {
      throw new Error(`${GOOGLE_ADS_CONFIG.ERROR_MESSAGES.MCP_QUERY_FAILED}: ${error.message}`)
    }
  }

  async getCurrentCampaigns(customerId: number, loginCustomerId: number, options: QueryOptions = {}): Promise<CampaignInfo[]> {
    try {
      const query = GoogleAdsQueryBuilder.buildCampaignQuery(options)

      const response = await this.executeQuery({
        customerId,
        loginCustomerId,
        query,
        reportAggregation: GOOGLE_ADS_CONFIG.REPORT_AGGREGATION.CAMPAIGN
      })

      return GoogleAdsResponseTransformer.transformCampaignResponse(response.results || [])
    } catch (error: any) {
      throw new Error(`Campaign query failed: ${error.message}`)
    }
  }

  async getKeywordPerformance(customerId: number, loginCustomerId: number, campaignId: string, options: QueryOptions = {}): Promise<KeywordPerformance[]> {
    try {
      const query = GoogleAdsQueryBuilder.buildKeywordPerformanceQuery(campaignId, options)

      const response = await this.executeQuery({
        customerId,
        loginCustomerId,
        query,
        reportAggregation: GOOGLE_ADS_CONFIG.REPORT_AGGREGATION.KEYWORD
      })

      return GoogleAdsResponseTransformer.transformKeywordResponse(response.results || [])
    } catch (error: any) {
      throw new Error(`Keyword query failed: ${error.message}`)
    }
  }

  private async executeQuery(params: {
    customerId: number
    loginCustomerId: number
    query: string
    reportAggregation: string
  }) {
    return await this.mcpClient.execute(GOOGLE_ADS_CONFIG.MCP_TOOL_NAME, params)
  }

  private getDefaultMcpClient(): any {
    // MCP クライアントの代替実装
    return {
      execute: async (toolName: string, params: any) => {
        throw new Error(`MCP Google Ads client not configured. Tool: ${toolName}, Params: ${JSON.stringify(params)}`)
      }
    }
  }
}