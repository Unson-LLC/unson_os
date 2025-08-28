// Google Ads データ取得ワークフロー（t_wada式TDD - GREENフェーズ ベタ書き実装）
import { Workflow } from 'mastra'
import { GoogleAdsMcpClient, GoogleAdsMetric } from '../tools/google-ads-mcp-client'
import { analyzeAdsPerformance } from './ads-analysis'
import { AdsWindow, PerformanceAnalysis } from '../types'

export interface AdsAnalysisResult {
  productId: string
  metrics: GoogleAdsMetric[]
  analysis: PerformanceAnalysis
  timestamp: string
}

// ベタ書き：データ取得＆分析関数
export async function fetchAndAnalyzeAds(
  customerId: number, 
  loginCustomerId: number, 
  productId: string
): Promise<AdsAnalysisResult> {
  try {
    const client = new GoogleAdsMcpClient()
    
    // ベタ書き：4時間メトリクス取得
    const metrics = await client.get4HourMetrics(customerId, loginCustomerId, 48)
    
    if (metrics.length < 2) {
      throw new Error('分析に必要な過去データが不足しています。最低2つの4時間窓データが必要です。')
    }

    // ベタ書き：最新と前回のデータ抽出
    const currentWindow: AdsWindow = {
      timestamp: metrics[0].timestamp,
      impressions: metrics[0].impressions,
      clicks: metrics[0].clicks,
      cost: metrics[0].cost,
      conversions: metrics[0].conversions
    }

    const previousWindow: AdsWindow = {
      timestamp: metrics[1].timestamp,
      impressions: metrics[1].impressions,
      clicks: metrics[1].clicks,
      cost: metrics[1].cost,
      conversions: metrics[1].conversions
    }

    // ベタ書き：分析実行
    const analysis = await analyzeAdsPerformance(currentWindow, previousWindow)

    return {
      productId,
      metrics,
      analysis,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    throw new Error(`Google Ads データ取得に失敗: ${error.message}`)
  }
}

// ベタ書き：Mastra ワークフロー定義
export const adsDataFetcherWorkflow = new Workflow({
  name: 'ads-data-fetcher',
  triggerSchema: {
    customerId: Number,
    loginCustomerId: Number,
    productId: String
  }
})
.step('fetch-metrics', async (context) => {
  const { customerId, loginCustomerId, productId } = context.data
  return await fetchAndAnalyzeAds(customerId, loginCustomerId, productId)
})