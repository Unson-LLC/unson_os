// 🟢 GREEN: 日次Google Adsデータ取得API
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
    const days = parseInt(searchParams.get('days') || '7')

    console.log('日次データ取得:', { productId, days })

    // 🟢 GREEN: ベタ書き実装 - 4時間ウィンドウデータから日次に集計
    const c = client()
    const windowItems = await c.query(api.ads.getWindowMetricsByProduct, {
      product_id: productId,
      window_hours: 4,
      limit: days * 6  // 1日6ウィンドウ × 日数
    })

    console.log(`取得ウィンドウデータ: ${windowItems.length}件`)

    // 日付ごとに集計
    const dailyData = new Map<string, any>()
    
    windowItems.forEach((item: any) => {
      const date = new Date(item.ts_start).toISOString().split('T')[0] // YYYY-MM-DD
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date,
          impressions: 0,
          clicks: 0,
          cost: 0,
          conversions: 0
        })
      }
      
      const daily = dailyData.get(date)!
      daily.impressions += item.impressions
      daily.clicks += item.clicks
      daily.cost += item.cost
      daily.conversions += item.conversions
    })

    // 日次データを配列に変換して計算値を追加
    const data = Array.from(dailyData.values())
      .map(item => ({
        ...item,
        dateStr: new Date(item.date).toLocaleDateString('ja-JP'),
        timeWindow: '全日', // 日次データは全日表示
        ctr: item.impressions > 0 ? Math.round(item.clicks / item.impressions * 10000) / 100 : 0,
        cpc: item.clicks > 0 ? Math.round(item.cost / item.clicks) : 0,
        cvr: item.clicks > 0 ? Math.round(item.conversions / item.clicks * 10000) / 100 : 0,
        cpa: item.conversions > 0 ? Math.round(item.cost / item.conversions) : 0
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 新しい順

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        dateRange: `過去${days}日間`,
        totalDays: data.length,
        dataType: 'daily',
        lastSyncTime: new Date().toISOString(),
        dataFreshness: data.length > 0 ? "fresh" : "missing"
      }
    })

  } catch (error: any) {
    console.error('日次データ取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 })
  }
}