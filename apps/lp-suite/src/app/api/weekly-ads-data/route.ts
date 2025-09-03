// 🟢 GREEN: 週次Google Adsデータ取得API
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../convex/_generated/api'

function env(key: string): string {
  try {
    return (process.env && (process.env as any)[key]) || ''
  } catch {
    return ''
  }
}

function resolveConvexUrl(): string {
  const val = (env('NEXT_PUBLIC_CONVEX_URL') || env('CONVEX_URL') || '').trim()
  const dep = (env('CONVEX_DEPLOYMENT') || '').trim()
  if (val && val !== 'default') return val
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  return 'https://default.convex.cloud'
}

const client = () => new ConvexHttpClient(resolveConvexUrl())

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId') || 'WATASHI-COMPASS'
    const weeks = parseInt(searchParams.get('weeks') || '4')

    console.log('週次データ取得:', { productId, weeks })

    // 🟢 GREEN: ベタ書き実装 - 4時間ウィンドウデータから週次に集計
    const c = client()
    const windowItems = await c.query(api.ads.getWindowMetricsByProduct, {
      product_id: productId,
      window_hours: 4,
      limit: weeks * 7 * 6  // 週数 × 7日 × 6ウィンドウ
    })

    console.log(`取得ウィンドウデータ: ${windowItems.length}件`)

    // 週ごとに集計（月曜始まり）
    const weeklyData = new Map<string, any>()
    
    // 🔧 重複排除: 同一日付を1つの週にまとめる
    const dateToWeekMap = new Map<string, string>()
    
    windowItems.forEach((item: any) => {
      if (!item.ts_start) return
      
      const date = new Date(item.ts_start)
      if (isNaN(date.getTime())) return
      
      const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
      
      // 既にこの日付の週が決まっている場合はそれを使用
      if (dateToWeekMap.has(dateStr)) {
        const weekKey = dateToWeekMap.get(dateStr)!
        const weekly = weeklyData.get(weekKey)!
        weekly.impressions += item.impressions
        weekly.clicks += item.clicks
        weekly.cost += item.cost
        weekly.conversions += item.conversions
        return
      }
      
      // 月曜始まりの週を計算
      const monday = new Date(date)
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7))
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      
      const weekKey = monday.toISOString().split('T')[0] // YYYY-MM-DD (月曜)
      
      // 日付→週のマッピングを保存
      dateToWeekMap.set(dateStr, weekKey)
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          weekStart: weekKey,
          weekEnd: sunday.toISOString().split('T')[0],
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0
        })
      }
      
      const weekly = weeklyData.get(weekKey)!
      weekly.impressions += item.impressions
      weekly.clicks += item.clicks
      weekly.cost += item.cost
      weekly.conversions += item.conversions
    })

    // 週次データを配列に変換して計算値を追加
    const data = Array.from(weeklyData.values())
      .map(item => {
        const startDate = new Date(item.weekStart)
        const endDate = new Date(item.weekEnd)
        return {
          ...item,
          date: item.weekStart, // ソート用
          dateStr: `${startDate.getMonth() + 1}/${startDate.getDate()}~${endDate.getMonth() + 1}/${endDate.getDate()}`,
          timeWindow: '週間', // 週次データは週間表示
          ctr: item.impressions > 0 ? Math.round(item.clicks / item.impressions * 10000) / 100 : 0,
          cpc: item.clicks > 0 ? Math.round(item.cost / item.clicks) : 0,
          cvr: item.clicks > 0 ? Math.round(item.conversions / item.clicks * 10000) / 100 : 0,
          cpa: item.conversions > 0 ? Math.round(item.cost / item.conversions) : 0
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 新しい順

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        dateRange: `過去${weeks}週間`,
        totalWeeks: data.length,
        dataType: 'weekly',
        lastSyncTime: new Date().toISOString(),
        dataFreshness: data.length > 0 ? "fresh" : "missing"
      }
    })

  } catch (error: any) {
    console.error('週次データ取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 })
  }
}