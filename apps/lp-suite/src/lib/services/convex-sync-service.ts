/**
 * Convex同期サービス
 * Google Ads実データとConvex DBの同期処理
 */

import type { 
  ConvexSyncData, 
  ConvexSyncResult, 
  GoogleAdsMetrics 
} from '@/types/google-ads-mcp'

export class ConvexSyncService {
  private convexUrl: string
  private apiKey: string

  constructor() {
    this.convexUrl = process.env.CONVEX_URL || 'https://default.convex.cloud'
    this.apiKey = process.env.CONVEX_API_KEY || 'default-key'
  }

  /**
   * Google AdsデータをConvexに同期
   */
  async syncGoogleAdsData(syncData: ConvexSyncData): Promise<ConvexSyncResult> {
    try {
      // Convex mutations APIを呼び出し
      const result = await this.callConvexMutation('syncGoogleAdsMetrics', {
        productId: syncData.productId,
        metrics: syncData.metrics,
        lastUpdated: syncData.lastUpdated,
        source: 'google-ads-mcp'
      })

      return {
        success: true,
        productId: syncData.productId,
        syncedMetrics: syncData.metrics
      }
    } catch (error) {
      console.error('Convex同期エラー:', error)
      
      return {
        success: false,
        productId: syncData.productId,
        syncedMetrics: {} as GoogleAdsMetrics,
        error: String(error)
      }
    }
  }

  /**
   * フォールバック付き同期処理
   */
  async syncWithFallback(data: {
    productId: string
    adsData: any
  }): Promise<ConvexSyncResult> {
    try {
      const syncData: ConvexSyncData = {
        productId: data.productId,
        metrics: this.transformAdsDataToMetrics(data.adsData),
        lastUpdated: new Date().toISOString()
      }

      return await this.syncGoogleAdsData(syncData)
    } catch (error) {
      // フォールバック: ローカルキャッシュまたはデフォルト値
      return {
        success: false,
        productId: data.productId,
        syncedMetrics: this.getDefaultMetrics(),
        fallback: true,
        error: `Convex connection failed: ${error}`
      }
    }
  }

  /**
   * Convexからわたしコンパスデータを取得
   */
  async getWatashiCompassMetrics(): Promise<GoogleAdsMetrics | null> {
    try {
      const result = await this.callConvexQuery('getProductMetrics', {
        productId: 'watashi-compass'
      })

      return result?.metrics || null
    } catch (error) {
      console.error('Convexデータ取得エラー:', error)
      return null
    }
  }

  /**
   * 実データ優先のマージ処理
   */
  async mergeWithGoogleAdsData(
    convexData: any, 
    googleAdsData: GoogleAdsMetrics
  ): Promise<GoogleAdsMetrics> {
    // Google Ads実データを常に優先
    const mergedMetrics: GoogleAdsMetrics = {
      // Google Ads実データを優先使用
      impressions: googleAdsData.impressions || convexData?.impressions || 0,
      clicks: googleAdsData.clicks || convexData?.clicks || 0,
      cost: googleAdsData.cost || convexData?.cost || 0,
      conversions: googleAdsData.conversions || convexData?.conversions || 0,
      cvr: googleAdsData.cvr || convexData?.cvr || 0,
      cpc: googleAdsData.cpc || convexData?.cpc || 0,
      cpa: googleAdsData.cpa || convexData?.cpa || 0,
      status: googleAdsData.status || convexData?.status || 'paused'
    }

    // マージ結果をConvexに保存
    await this.syncGoogleAdsData({
      productId: 'watashi-compass',
      metrics: mergedMetrics,
      lastUpdated: new Date().toISOString()
    })

    return mergedMetrics
  }

  /**
   * バッチ同期処理（全サービス対応）
   */
  async batchSyncAllServices(servicesData: Array<{
    productId: string
    adsData: GoogleAdsMetrics
  }>): Promise<ConvexSyncResult[]> {
    const results: ConvexSyncResult[] = []

    for (const service of servicesData) {
      try {
        const syncResult = await this.syncGoogleAdsData({
          productId: service.productId,
          metrics: service.adsData,
          lastUpdated: new Date().toISOString()
        })
        results.push(syncResult)
      } catch (error) {
        results.push({
          success: false,
          productId: service.productId,
          syncedMetrics: {} as GoogleAdsMetrics,
          error: String(error)
        })
      }
    }

    return results
  }

  /**
   * Convex mutation呼び出しヘルパー
   */
  private async callConvexMutation(mutationName: string, args: any): Promise<any> {
    // 実際のConvex API呼び出し実装
    // 現在はモック実装
    console.log(`Convex Mutation: ${mutationName}`, args)
    
    // 成功レスポンスをシミュレート
    return {
      success: true,
      id: `sync_${Date.now()}`,
      updatedAt: new Date().toISOString()
    }
  }

  /**
   * Convex query呼び出しヘルパー
   */
  private async callConvexQuery(queryName: string, args: any): Promise<any> {
    // 実際のConvex API呼び出し実装
    console.log(`Convex Query: ${queryName}`, args)
    
    // わたしコンパスのテストデータを返す
    if (args.productId === 'watashi-compass') {
      return {
        metrics: {
          impressions: 5234,
          clicks: 187,
          cost: 12450,
          conversions: 0,
          cvr: 0,
          cpc: 66.6,
          cpa: 0,
          status: 'warning'
        },
        lastUpdated: new Date().toISOString()
      }
    }

    return null
  }

  /**
   * AdsデータをMetrics型に変換
   */
  private transformAdsDataToMetrics(adsData: any): GoogleAdsMetrics {
    return {
      impressions: adsData.totalImpressions || 0,
      clicks: adsData.totalClicks || 0,
      cost: adsData.totalCost || 0,
      conversions: adsData.totalConversions || 0,
      cvr: adsData.totalClicks > 0 ? 
        Math.round((adsData.totalConversions / adsData.totalClicks) * 1000) / 10 : 0,
      cpc: adsData.totalClicks > 0 ? 
        Math.round(adsData.totalCost / adsData.totalClicks * 10) / 10 : 0,
      cpa: adsData.totalConversions > 0 ? 
        Math.round(adsData.totalCost / adsData.totalConversions) : 0,
      status: this.determineStatus(adsData)
    }
  }

  /**
   * ステータス判定
   */
  private determineStatus(adsData: any): 'active' | 'warning' | 'paused' {
    const clicks = adsData.totalClicks || 0
    const conversions = adsData.totalConversions || 0
    const cost = adsData.totalCost || 0
    
    if (conversions > 0) return 'active'
    if (clicks > 0 && cost < 100 * clicks) return 'warning' // CPC < 100円
    return 'paused'
  }

  /**
   * デフォルトメトリクス取得
   */
  private getDefaultMetrics(): GoogleAdsMetrics {
    return {
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      cvr: 0,
      cpc: 0,
      cpa: 0,
      status: 'paused'
    }
  }
}