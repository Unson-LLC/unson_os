// 🟢 GREEN: 最小実装 - 実データ返却API
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
    const date = searchParams.get('date') || '2025-09-03'
    const interval = searchParams.get('interval') || '4h'
    const format = searchParams.get('format') || 'raw-data'
    const productId = searchParams.get('productId') || 'WATASHI-COMPASS'

    console.log('時系列実データ取得:', { date, interval, format, productId })

    // 🟢 GREEN: ベタ書き実装 - Convexから直接取得
    const c = client()
    const windowItems = await c.query(api.ads.getWindowMetricsByProduct, {
      product_id: productId,
      window_hours: 4,
      limit: 48  // 2日分
    })

    console.log(`取得データ: ${windowItems.length}件`)

    // 🔵 REFACTOR: UI表示用に適切な桁数で変換
    const data = windowItems.map((item: any) => {
      const startTime = new Date(item.ts_start)
      const endTime = new Date(item.ts_start + 4 * 60 * 60 * 1000)
      
      // 時刻表示の正規化: 日跨ぎを標準的な表記に
      const startHour = startTime.getHours()
      const endHour = endTime.getHours()
      
      // 日跨ぎの場合は翌日0時表記に統一（21h~1h → 21h~0h）
      const displayEndHour = endHour < startHour ? 0 : endHour
      const timeSlot = `${startHour}h~${displayEndHour}h`
      
      return {
        timeSlot,
        impressions: item.impressions,
        clicks: item.clicks,
        cost: item.cost,
        conversions: item.conversions,
        // 適切な桁数で丸め
        ctr: item.impressions > 0 ? Math.round(item.clicks / item.impressions * 10000) / 100 : 0, // 小数点2桁
        cpc: item.clicks > 0 ? Math.round(item.cost / item.clicks) : 0,
        cvr: item.clicks > 0 ? Math.round(item.conversions / item.clicks * 10000) / 100 : 0, // 小数点2桁
        cpa: item.conversions > 0 ? Math.round(item.cost / item.conversions) : 0
      }
    })

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        dateRange: `過去7日間`,
        totalWindows: data.length,
        lastSyncTime: new Date().toISOString(),
        dataFreshness: data.length > 0 ? "fresh" : "missing"
      }
    })

  } catch (error: any) {
    console.error('時系列データ取得エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      data: []  // 🟢 GREEN: エラー時は空配列（サンプルデータなし）
    }, { status: 500 })
  }
}