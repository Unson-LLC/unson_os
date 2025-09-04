// Google Ads API連携 - 実データ取得・同期API
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

// 🟢 GREEN: 最小実装 - Convex同期関数を直接呼び出し
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, days = 7, forceSync = false } = body
    
    console.log('Google Ads API同期開始:', { productId, days, forceSync })

    // 🟢 GREEN: ベタ書き実装 - Convex syncGoogleAdsData を直接呼び出し
    const c = client()
    const result = await c.mutation(api.ads.syncGoogleAdsData, {
      product_id: productId,
      workspace_id: 'unson_main'
    })

    console.log('Google Ads データ同期完了:', result)

    return NextResponse.json({
      success: result.success,
      productId: productId,
      message: result.message,
      data: {
        windowRecords: result.windowRecords
      }
    })

  } catch (error: any) {
    console.error('Google Ads API同期エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Google Ads API同期に失敗しました'
    }, { status: 500 })
  }
}

// 同期状況の確認
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId') || 'WATASHI-COMPASS'
    
    const c = client()
    
    // 既存データの確認
    const dailyItems = await c.query(api.ads.getDailyMetricsByProduct, { product_id: productId, limit: 30 })
    const windowItems = await c.query(api.ads.getWindowMetricsByProduct, { product_id: productId, window_hours: 4, limit: 48 })
    
    const lastSync = dailyItems.length > 0 ? 
      Math.max(...dailyItems.map((item: any) => new Date(item.date).getTime())) : null

    return NextResponse.json({
      success: true,
      productId,
      syncStatus: {
        dailyRecords: dailyItems.length,
        windowRecords: windowItems.length,
        lastSyncDate: lastSync ? new Date(lastSync).toISOString().split('T')[0] : null,
        isDataAvailable: dailyItems.length > 0
      },
      recommendations: {
        shouldSync: dailyItems.length === 0,
        message: dailyItems.length === 0 ? 
          'Google Adsデータが見つかりません。/api/ads-sync に POST リクエストで同期してください。' :
          'Google Adsデータが利用可能です。'
      }
    })
    
  } catch (error: any) {
    console.error('Google Ads同期状況確認エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// 🟢 GREEN: 不要な関数を削除（syncGoogleAdsData内で処理するため）