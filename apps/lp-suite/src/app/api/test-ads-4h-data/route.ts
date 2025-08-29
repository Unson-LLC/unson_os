// 4時間間隔Google Adsサンプルデータ生成API
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../../convex/_generated/api'

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

// 4時間間隔のGoogle Adsサンプルデータを生成・返却
export async function GET(req: NextRequest) {
  try {
    console.log('4時間間隔Google Adsデータ生成開始')
    
    // 過去48時間を4時間間隔で分割（12エントリ）
    const hourlyMetrics = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const startTime = new Date(now.getTime() - i * 4 * 60 * 60 * 1000) // 4時間前ずつ
      const hour = startTime.getHours()
      
      // 4時間ウィンドウの開始時間（0, 4, 8, 12, 16, 20）
      const windowStart = Math.floor(hour / 4) * 4
      startTime.setHours(windowStart, 0, 0, 0)
      
      // 時間帯による変動（昼間が高く、深夜が低い）
      const hourMultipliers = {
        0: 0.2,   // 0-4h: 深夜
        4: 0.1,   // 4-8h: 早朝  
        8: 0.8,   // 8-12h: 午前
        12: 1.2,  // 12-16h: 昼間（ピーク）
        16: 1.0,  // 16-20h: 夕方
        20: 0.6   // 20-24h: 夜
      }
      const baseMultiplier = hourMultipliers[windowStart] || 0.5
      const randomVariation = 0.7 + Math.random() * 0.6 // 0.7-1.3の範囲
      const finalMultiplier = baseMultiplier * randomVariation
      
      const impressions = Math.floor((300 + Math.random() * 200) * finalMultiplier)
      const ctr = 0.025 + Math.random() * 0.020 // 2.5-4.5%
      const clicks = Math.floor(impressions * ctr)
      const cpc = 80 + Math.random() * 40 // 80-120円
      const cost = Math.floor(clicks * cpc)
      const cvr = 0.08 + Math.random() * 0.05 // 8-13%
      const conversions = Math.floor(clicks * cvr)
      
      // 4時間ウィンドウの表示形式
      const dateStr = startTime.toLocaleDateString('ja-JP')
      const timeWindow = `${windowStart}:00-${(windowStart + 4) % 24}:00`
      
      hourlyMetrics.push({
        date: startTime.toISOString(),
        dateStr,
        timeWindow,
        impressions,
        clicks,
        cost,
        conversions,
        ctr: parseFloat(((clicks / impressions) * 100).toFixed(1)),
        cvr: clicks > 0 ? parseFloat(((conversions / clicks) * 100).toFixed(1)) : 0,
        cpc: clicks > 0 ? Math.round(cost / clicks) : 0,
        platform: 'Google Ads'
      })
    }
    
    // 新しい順に並び替え（最新が上）
    hourlyMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    console.log('生成された4時間間隔データ:', hourlyMetrics.length, '件')
    
    return NextResponse.json({
      success: true,
      productId: 'WATASHI-COMPASS',
      data: {
        records: hourlyMetrics,
        totalRecords: hourlyMetrics.length,
        dataType: '4時間間隔',
        timeRange: `${hourlyMetrics[hourlyMetrics.length - 1]?.dateStr} ~ ${hourlyMetrics[0]?.dateStr}`,
        totalImpressions: hourlyMetrics.reduce((sum, d) => sum + d.impressions, 0),
        totalClicks: hourlyMetrics.reduce((sum, d) => sum + d.clicks, 0),
        totalCost: hourlyMetrics.reduce((sum, d) => sum + d.cost, 0),
        totalConversions: hourlyMetrics.reduce((sum, d) => sum + d.conversions, 0)
      }
    })
    
  } catch (error: any) {
    console.error('4時間間隔データ生成エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '4時間間隔データ生成に失敗しました'
    }, { status: 500 })
  }
}