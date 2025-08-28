// 簡易テストAPI - Google Adsサンプルデータを直接Convexに投入
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

// Google Adsサンプルデータを直接Convexに投入するテストAPI
export async function POST(req: NextRequest) {
  try {
    console.log('Google Adsテストデータ投入開始')
    
    const c = client()
    const productId = 'WATASHI-COMPASS'
    const workspace_id = 'unson_main'
    
    // 過去7日間のサンプルデータを生成
    const dailyMetrics = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const dayOfWeek = date.getDay()
      
      // 曜日による変動（平日が高く、土日が低い）
      const weekdayMultipliers = [0.6, 1.0, 1.1, 1.2, 1.3, 0.8, 0.7] // 日-土
      const baseMultiplier = weekdayMultipliers[dayOfWeek]
      const dailyVariation = 0.8 + Math.random() * 0.4 // 0.8-1.2の範囲
      const finalMultiplier = baseMultiplier * dailyVariation
      
      const impressions = Math.floor((1500 + Math.random() * 500) * finalMultiplier)
      const ctr = 0.025 + Math.random() * 0.020 // 2.5-4.5%
      const clicks = Math.floor(impressions * ctr)
      const cpc = 80 + Math.random() * 40 // 80-120円
      const cost = Math.floor(clicks * cpc)
      const cvr = 0.08 + Math.random() * 0.05 // 8-13%
      const conversions = Math.floor(clicks * cvr)
      
      dailyMetrics.push({
        date: dateStr,
        impressions,
        clicks,
        cost,
        conversions,
        platform: 'Google Ads'
      })
    }
    
    console.log('生成されたサンプルデータ:', dailyMetrics)
    
    // Convexに日次データを保存
    const result = await c.mutation(api.ads.importDailyMetrics, {
      workspace_id,
      product_id: productId,
      items: dailyMetrics
    })
    
    console.log('Convex保存結果:', result)
    
    // 保存されたデータを確認
    const savedData = await c.query(api.ads.getDailyMetricsByProduct, { 
      product_id: productId, 
      limit: 10 
    })
    
    console.log('保存確認:', savedData)
    
    return NextResponse.json({
      success: true,
      message: 'Google Adsテストデータを正常に投入しました',
      data: {
        productId,
        workspace_id,
        recordsCreated: dailyMetrics.length,
        dateRange: `${dailyMetrics[0].date} ~ ${dailyMetrics[dailyMetrics.length - 1].date}`,
        sampleMetrics: dailyMetrics.slice(0, 3),
        savedRecords: savedData.length,
        totalImpressions: dailyMetrics.reduce((sum, d) => sum + d.impressions, 0),
        totalClicks: dailyMetrics.reduce((sum, d) => sum + d.clicks, 0),
        totalCost: dailyMetrics.reduce((sum, d) => sum + d.cost, 0),
        totalConversions: dailyMetrics.reduce((sum, d) => sum + d.conversions, 0)
      }
    })
    
  } catch (error: any) {
    console.error('Google Adsテストデータ投入エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Google Adsテストデータ投入に失敗しました'
    }, { status: 500 })
  }
}

// 投入されたデータの確認
export async function GET(req: NextRequest) {
  try {
    const c = client()
    const productId = 'WATASHI-COMPASS'
    
    const dailyData = await c.query(api.ads.getDailyMetricsByProduct, { 
      product_id: productId, 
      limit: 30 
    })
    
    return NextResponse.json({
      success: true,
      productId,
      data: {
        dailyRecords: dailyData.length,
        latestDate: dailyData.length > 0 ? dailyData[0].date : null,
        records: dailyData
      }
    })
    
  } catch (error: any) {
    console.error('データ確認エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}