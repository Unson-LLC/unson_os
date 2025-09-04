/**
 * Google Ads履歴データ取得API
 * Convex adsWindowMetricsから実際の履歴データを取得
 */

import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../convex/_generated/api'

export const dynamic = 'force-dynamic'

function resolveConvexUrl(): string {
  const val = (process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || '').trim()
  const dep = (process.env.CONVEX_DEPLOYMENT || '').trim()
  if (val && val !== 'default') return val
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  return 'https://default.convex.cloud'
}
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId') || 'watashi-compass'
  const days = parseInt(searchParams.get('days') || '7')
  
  try {
    
    console.log('Google Ads履歴データ取得開始:', { productId, days })
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    const workspace_id = 'unson-os-workspace'
    
    // Convex adsWindowMetricsから実際のデータを取得
    const adsMetrics = await client.query(api.ads.getWindowMetricsByProduct, {
      product_id: productId,
      limit: days * 6 // 1日6ウィンドウ（4時間ごと）
    })
    
    console.log(`adsWindowMetrics取得: ${adsMetrics.length}件`)
    
    // ウィンドウデータを日別に集約
    const historicalData = aggregateMetricsByDay(adsMetrics, days)
    
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
    
    // フォールバック: わたしコンパス用のデモデータ
    const fallbackData = generateFallbackAdsData(days)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      productId,
      data: {
        dateRange: `過去${days}日間`,
        startDate: getDateString(days - 1),
        endDate: getDateString(0),
        dailyMetrics: fallbackData,
        summary: {
          totalImpressions: fallbackData.reduce((sum, d) => sum + d.impressions, 0),
          totalClicks: fallbackData.reduce((sum, d) => sum + d.clicks, 0),
          totalCost: fallbackData.reduce((sum, d) => sum + d.cost, 0),
          avgCTR: calculateAverageCTR(fallbackData),
          avgCPC: calculateAverageCPC(fallbackData),
          conversions: fallbackData.reduce((sum, d) => sum + d.conversions, 0)
        }
      },
      fallback: true,
      message: 'データベース接続エラー、フォールバックデータを使用'
    }, { status: 200 }) // エラーでもデータ返却
  }
}

// POST: 特定期間のデータを強制再取得
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, startDate, endDate, campaignIds } = body
    
    console.log('Google Ads期間指定データ取得:', { productId, startDate, endDate, campaignIds })
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    const workspace_id = 'unson-os-workspace'
    
    // 期間指定でConvex adsWindowMetricsを取得
    const startTime = new Date(startDate).getTime()
    const endTime = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 // 終了日の23:59:59まで
    
    // POSTは一旦簡単なウィンドウ取得で実装
    const adsMetrics = await client.query(api.ads.getWindowMetricsByProduct, {
      product_id: productId,
      limit: 50 // とりあえず50ウィンドウ
    })
    
    // 期間内の日数を計算
    const daysDiff = Math.ceil((endTime - startTime) / (24 * 60 * 60 * 1000))
    const historicalData = aggregateMetricsByDay(adsMetrics, daysDiff)
    
    return NextResponse.json({
      success: true,
      productId,
      data: {
        dateRange: `${startDate} - ${endDate}`,
        dailyMetrics: historicalData,
        summary: {
          totalImpressions: historicalData.reduce((sum, d) => sum + d.impressions, 0),
          totalClicks: historicalData.reduce((sum, d) => sum + d.clicks, 0),
          totalCost: historicalData.reduce((sum, d) => sum + d.cost, 0),
          avgCTR: calculateAverageCTR(historicalData),
          avgCPC: calculateAverageCPC(historicalData),
          conversions: historicalData.reduce((sum, d) => sum + d.conversions, 0)
        }
      },
      message: `期間 ${startDate} - ${endDate} のGoogle Adsデータを取得しました`
    })
    
  } catch (error: any) {
    console.error('Google Ads期間指定取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback: true
    }, { status: 500 })
  }
}

// Convex adsWindowMetricsデータを日別に集約
function aggregateMetricsByDay(adsMetrics: any[], days: number) {
  const dailyData = new Map()
  
  // 過去N日分の日付を初期化
  for (let i = days - 1; i >= 0; i--) {
    const date = getDateString(i)
    dailyData.set(date, {
      date,
      dayOfWeek: getDayOfWeekJP(i),
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      campaigns: new Map()
    })
  }
  
  // adsWindowMetricsデータを日別に集約
  adsMetrics.forEach(metric => {
    const date = new Date(metric.ts_start).toISOString().split('T')[0]
    const dailyMetric = dailyData.get(date)
    
    if (dailyMetric) {
      dailyMetric.impressions += metric.impressions || 0
      dailyMetric.clicks += metric.clicks || 0
      dailyMetric.cost += metric.cost || 0
      dailyMetric.conversions += metric.conversions || 0
      
      // キャンペーン別集約
      const campaignName = `${metric.product_id}-${metric.platform || 'Google Ads'}`
      if (!dailyMetric.campaigns.has(campaignName)) {
        dailyMetric.campaigns.set(campaignName, {
          campaignName,
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0
        })
      }
      const campaignData = dailyMetric.campaigns.get(campaignName)
      campaignData.impressions += metric.impressions || 0
      campaignData.clicks += metric.clicks || 0
      campaignData.cost += metric.cost || 0
      campaignData.conversions += metric.conversions || 0
    }
  })
  
  // Map to Array変換と計算指標追加
  return Array.from(dailyData.values()).map(day => ({
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    impressions: day.impressions,
    clicks: day.clicks,
    cost: day.cost,
    conversions: day.conversions,
    ctr: day.impressions > 0 ? day.clicks / day.impressions : 0,
    cpc: day.clicks > 0 ? day.cost / day.clicks : 0,
    cvr: day.clicks > 0 ? day.conversions / day.clicks : 0,
    cpa: day.conversions > 0 ? day.cost / day.conversions : 0,
    campaigns: Array.from(day.campaigns.values())
  })).reverse() // 古い順に並び替え
}

// フォールバック用のデモデータ生成
function generateFallbackAdsData(days: number) {
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = getDateString(i)
    const dayOfWeek = getDayOfWeekJP(i)
    
    // わたしコンパス用のリアルなデモデータ
    const impressions = 145 // わたしコンパス実績ベース
    const clicks = 3
    const cost = 200
    const conversions = 0 // CVR 0%
    
    data.push({
      date,
      dayOfWeek,
      impressions,
      clicks,
      cost,
      conversions,
      ctr: clicks / impressions,
      cpc: clicks > 0 ? cost / clicks : 0,
      cvr: clicks > 0 ? conversions / clicks : 0,
      cpa: conversions > 0 ? cost / conversions : 0,
      campaigns: [
        {
          campaignName: 'わたしコンパス_ベータテスター募集_2025',
          impressions: impressions,
          clicks: clicks,
          cost: cost,
          conversions: conversions
        }
      ]
    })
  }
  
  return data.reverse()
}

// 日本語曜日取得
function getDayOfWeekJP(daysAgo: number): string {
  const dayOfWeek = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).getDay()
  return ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
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

