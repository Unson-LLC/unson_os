// Google Ads履歴データ取得API
import { NextRequest, NextResponse } from 'next/server'

// Google Ads Reporting API実装予定
// 現在は過去7日間のサンプルデータを生成
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId') || 'WATASHI-COMPASS'
    const days = parseInt(searchParams.get('days') || '7')
    
    console.log('Google Ads履歴データ取得開始:', { productId, days })
    
    // 過去7日間の日付を生成
    const historicalData = generateHistoricalAdsData(days)
    
    console.log('Google Ads履歴データ取得完了:', {
      totalDays: historicalData.length,
      totalImpressions: historicalData.reduce((sum, d) => sum + d.impressions, 0),
      totalClicks: historicalData.reduce((sum, d) => sum + d.clicks, 0),
      totalCost: historicalData.reduce((sum, d) => sum + d.cost, 0)
    })

    return NextResponse.json({
      success: true,
      productId,
      data: {
        dateRange: `過去${days}日間`,
        startDate: getDateString(days - 1),
        endDate: getDateString(0),
        dailyMetrics: historicalData,
        summary: {
          totalImpressions: historicalData.reduce((sum, d) => sum + d.impressions, 0),
          totalClicks: historicalData.reduce((sum, d) => sum + d.clicks, 0),
          totalCost: historicalData.reduce((sum, d) => sum + d.cost, 0),
          avgCTR: calculateAverageCTR(historicalData),
          avgCPC: calculateAverageCPC(historicalData),
          conversions: historicalData.reduce((sum, d) => sum + d.conversions, 0)
        }
      }
    })
    
  } catch (error: any) {
    console.error('Google Ads履歴データ取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Google Ads履歴データの取得に失敗しました'
    }, { status: 500 })
  }
}

// POST: 特定期間のデータを強制再取得
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, startDate, endDate, campaignIds } = body
    
    console.log('Google Ads期間指定データ取得:', { productId, startDate, endDate, campaignIds })
    
    // 実際の実装では Google Ads Reporting API を使用
    const customData = await fetchGoogleAdsReportingAPI({
      productId,
      startDate,
      endDate,
      campaignIds
    })
    
    return NextResponse.json({
      success: true,
      productId,
      data: customData,
      message: `期間 ${startDate} - ${endDate} のGoogle Adsデータを取得しました`
    })
    
  } catch (error: any) {
    console.error('Google Ads期間指定取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// ヘルパー関数: 履歴データ生成
function generateHistoricalAdsData(days: number) {
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = getDateString(i)
    const dayOfWeek = new Date(Date.now() - i * 24 * 60 * 60 * 1000).getDay()
    
    // 曜日によってパフォーマンスを変動させる
    const weekdayMultiplier = [0.7, 1.0, 1.1, 1.0, 1.2, 0.8, 0.6][dayOfWeek] // 日-土
    
    const impressions = Math.floor((800 + Math.random() * 400) * weekdayMultiplier)
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03))
    const cost = Math.floor(clicks * (50 + Math.random() * 100))
    const conversions = Math.floor(clicks * (0.08 + Math.random() * 0.07))
    
    data.push({
      date,
      dayOfWeek: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek],
      impressions,
      clicks,
      cost,
      conversions,
      ctr: clicks / impressions,
      cpc: clicks > 0 ? cost / clicks : 0,
      cvr: clicks > 0 ? conversions / clicks : 0,
      cpa: conversions > 0 ? cost / conversions : 0,
      campaigns: generateCampaignBreakdown(impressions, clicks, cost, conversions)
    })
  }
  
  return data.reverse() // 古い順に並び替え
}

// キャンペーン別内訳生成
function generateCampaignBreakdown(totalImpressions: number, totalClicks: number, totalCost: number, totalConversions: number) {
  const campaigns = [
    { name: 'WATASHI-COMPASS_検索', weight: 0.6 },
    { name: 'WATASHI-COMPASS_ディスプレイ', weight: 0.3 },
    { name: 'WATASHI-COMPASS_YouTube', weight: 0.1 }
  ]
  
  return campaigns.map(campaign => ({
    campaignName: campaign.name,
    impressions: Math.floor(totalImpressions * campaign.weight),
    clicks: Math.floor(totalClicks * campaign.weight),
    cost: Math.floor(totalCost * campaign.weight),
    conversions: Math.floor(totalConversions * campaign.weight)
  }))
}

// 日付文字列取得
function getDateString(daysAgo: number): string {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString().split('T')[0]
}

// 平均CTR計算
function calculateAverageCTR(data: any[]): number {
  const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0)
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0)
  return totalImpressions > 0 ? totalClicks / totalImpressions : 0
}

// 平均CPC計算
function calculateAverageCPC(data: any[]): number {
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0)
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0)
  return totalClicks > 0 ? totalCost / totalClicks : 0
}

// Google Ads Reporting API実装予定
async function fetchGoogleAdsReportingAPI(params: any) {
  // 実際の実装では以下のようなGAQLクエリを実行
  /*
  const gaql = `
    SELECT 
      segments.date,
      campaign.name,
      campaign.id,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign 
    WHERE segments.date BETWEEN '${params.startDate}' AND '${params.endDate}'
    ORDER BY segments.date DESC
  `
  */
  
  // 現在はサンプルデータを返却
  return {
    dateRange: `${params.startDate} - ${params.endDate}`,
    dailyMetrics: generateHistoricalAdsData(7),
    summary: {
      message: '実際のGoogle Ads APIと連携後、リアルデータが表示されます'
    }
  }
}