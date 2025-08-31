// 実際のGoogle Ads APIデータ取得API - WATASHI-COMPASS実データ（Convex統合版）
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

// 時間別データを日次・週次に集約するヘルパー関数

/**
 * ISO週番号を取得
 */
function getISOWeek(date: Date): number {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - dayNumber + 3)
  const firstThursday = target.valueOf()
  target.setUTCMonth(0, 1)
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

/**
 * ISO週番号から週開始日を取得
 */
function getDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dow = simple.getDay()
  const ISOweekStart = simple
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  return ISOweekStart
}


export async function GET(req: NextRequest) {
  try {
    console.log('WATASHI-COMPASS実際のGoogle Adsデータ取得（Convex統合版）')
    
    const { searchParams } = new URL(req.url)
    const timeRange = searchParams.get('timeRange') || '4h'
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    
    let realData: any[] = []
    
    if (timeRange === '4h') {
      // Convexから4時間間隔データを取得（全期間対応）
      const windowMetrics = await client.query(api.ads.getWindowMetricsByProduct, {
        product_id: 'watashi-compass',
        window_hours: 4,
        limit: 50 // 全期間データを取得するために拡大
      })
      
      console.log('Convex 4時間データ取得:', windowMetrics?.length, '件')
      
      if (windowMetrics && windowMetrics.length > 0) {
        realData = windowMetrics.map((item: any) => {
          const tsStart = new Date(item.ts_start)
          const hour = tsStart.getHours()
          const timeWindow = `${hour}:00-${(hour + 4) % 24}:00`
          const dateStr = tsStart.toLocaleDateString('ja-JP')
          
          const ctr = item.impressions > 0 ? parseFloat(((item.clicks / item.impressions) * 100).toFixed(1)) : 0
          const cvr = item.clicks > 0 ? parseFloat(((item.conversions / item.clicks) * 100).toFixed(1)) : 0
          const cpc = item.clicks > 0 ? Math.round(item.cost / item.clicks) : 0
          
          return {
            date: tsStart.toISOString(),
            dateStr,
            timeWindow,
            impressions: item.impressions,
            clicks: item.clicks,
            cost: item.cost,
            conversions: item.conversions,
            ctr,
            cvr,
            cpc,
            platform: 'Google Ads (Convex Real Data)',
            isRealData: true
          }
        })
      }
    } else if (timeRange === '1d') {
      // 4時間ウィンドウデータから日次データを集約生成
      console.log('4時間ウィンドウから日次データ集約中...')
      const windowMetrics = await client.query(api.ads.getWindowMetricsByProduct, {
        product_id: 'watashi-compass',
        window_hours: 4,
        limit: 200 // 全期間データ取得のため増加
      })
      
      if (windowMetrics && windowMetrics.length > 0) {
        // 日付別にグループ化して集約
        const dailyGroups = windowMetrics.reduce((groups: any, item: any) => {
          const date = new Date(item.ts_start).toISOString().split('T')[0]
          if (!groups[date]) {
            groups[date] = {
              date: date,
              impressions: 0,
              clicks: 0,
              cost: 0,
              conversions: 0,
              windowCount: 0
            }
          }
          groups[date].impressions += item.impressions
          groups[date].clicks += item.clicks
          groups[date].cost += item.cost
          groups[date].conversions += item.conversions
          groups[date].windowCount++
          return groups
        }, {})
        
        // 日次データ配列に変換
        realData = Object.values(dailyGroups).map((daily: any) => {
          const ctr = daily.impressions > 0 ? parseFloat(((daily.clicks / daily.impressions) * 100).toFixed(1)) : 0
          const cvr = daily.clicks > 0 ? parseFloat(((daily.conversions / daily.clicks) * 100).toFixed(1)) : 0
          const cpc = daily.clicks > 0 ? Math.round(daily.cost / daily.clicks) : 0
          
          return {
            date: new Date(daily.date).toISOString(),
            dateStr: new Date(daily.date).toLocaleDateString('ja-JP'),
            impressions: daily.impressions,
            clicks: daily.clicks,
            cost: daily.cost,
            conversions: daily.conversions,
            ctr,
            cvr,
            cpc,
            platform: 'Google Ads (Convex Daily Aggregated)',
            isRealData: true,
            windowCount: daily.windowCount
          }
        })
      }
    } else if (timeRange === '1w') {
      // 4時間ウィンドウデータから週次データを集約生成
      console.log('4時間ウィンドウから週次データ集約中...')
      const windowMetrics = await client.query(api.ads.getWindowMetricsByProduct, {
        product_id: 'watashi-compass',
        window_hours: 4,
        limit: 200 // 全期間データ取得のため増加
      })
      
      if (windowMetrics && windowMetrics.length > 0) {
        // ISO週番号で週別にグループ化
        const weeklyGroups = windowMetrics.reduce((groups: any, item: any) => {
          const date = new Date(item.ts_start)
          const week = getISOWeek(date)
          const year = date.getFullYear()
          const weekKey = `${year}-W${week.toString().padStart(2, '0')}`
          
          if (!groups[weekKey]) {
            const weekStart = getDateOfISOWeek(week, year)
            const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
            
            groups[weekKey] = {
              weekKey,
              weekStart: weekStart.toISOString().split('T')[0],
              weekEnd: weekEnd.toISOString().split('T')[0],
              impressions: 0,
              clicks: 0,
              cost: 0,
              conversions: 0,
              windowCount: 0
            }
          }
          groups[weekKey].impressions += item.impressions
          groups[weekKey].clicks += item.clicks
          groups[weekKey].cost += item.cost
          groups[weekKey].conversions += item.conversions
          groups[weekKey].windowCount++
          return groups
        }, {})
        
        // 週次データ配列に変換
        realData = Object.values(weeklyGroups).map((weekly: any) => {
          const ctr = weekly.impressions > 0 ? parseFloat(((weekly.clicks / weekly.impressions) * 100).toFixed(1)) : 0
          const cvr = weekly.clicks > 0 ? parseFloat(((weekly.conversions / weekly.clicks) * 100).toFixed(1)) : 0
          const cpc = weekly.clicks > 0 ? Math.round(weekly.cost / weekly.clicks) : 0
          
          const startDate = new Date(weekly.weekStart).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
          const endDate = new Date(weekly.weekEnd).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
          
          return {
            date: new Date(weekly.weekStart).toISOString(),
            dateStr: `${startDate}~${endDate}`,
            impressions: weekly.impressions,
            clicks: weekly.clicks,
            cost: weekly.cost,
            conversions: weekly.conversions,
            ctr,
            cvr,
            cpc,
            platform: 'Google Ads (Convex Weekly Aggregated)',
            isRealData: true,
            windowCount: weekly.windowCount
          }
        })
      }
    }
    
    // 新しい順にソート
    realData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    console.log(`WATASHI-COMPASS実データ取得成功 (${timeRange}):`, realData.length, '件')
    
    return NextResponse.json({
      success: true,
      productId: 'WATASHI-COMPASS',
      data: {
        records: realData,
        totalRecords: realData.length,
        dataType: `WATASHI-COMPASS実データ（${timeRange}）`,
        campaign: 'わたしコンパス_ベータテスター募集_2025',
        timeRange: realData.length > 0 ? `${realData[realData.length - 1]?.dateStr} ~ ${realData[0]?.dateStr}` : '',
        isRealData: true,
        totalImpressions: realData.reduce((sum, d) => sum + (d.impressions || 0), 0),
        totalClicks: realData.reduce((sum, d) => sum + (d.clicks || 0), 0),
        totalCost: realData.reduce((sum, d) => sum + (d.cost || 0), 0),
        totalConversions: realData.reduce((sum, d) => sum + (d.conversions || 0), 0)
      }
    })
    
  } catch (error: any) {
    console.error('WATASHI-COMPASS実データ取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'WATASHI-COMPASS実データ取得に失敗しました',
      fallbackToSample: true
    }, { status: 500 })
  }
}