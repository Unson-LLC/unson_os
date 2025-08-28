// 1日間隔Google Adsサンプルデータ生成API
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

// 1日間隔のGoogle Adsサンプルデータを生成・返却
export async function GET(req: NextRequest) {
  try {
    console.log('1日間隔Google Adsデータ生成開始')
    
    // 過去7日間を1日間隔で分割（7エントリ）
    const dailyMetrics = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      date.setHours(0, 0, 0, 0) // 00:00:00に設定
      
      const dayOfWeek = date.getDay()
      
      // 曜日による変動（平日が高く、土日が低い）
      const weekdayMultipliers = [0.6, 1.0, 1.1, 1.2, 1.3, 0.8, 0.7] // 日-土
      const baseMultiplier = weekdayMultipliers[dayOfWeek]
      const dailyVariation = 0.8 + Math.random() * 0.4 // 0.8-1.2の範囲
      const finalMultiplier = baseMultiplier * dailyVariation
      
      const impressions = Math.floor((2400 + Math.random() * 800) * finalMultiplier)
      const ctr = 0.025 + Math.random() * 0.020 // 2.5-4.5%
      const clicks = Math.floor(impressions * ctr)
      const cpc = 80 + Math.random() * 40 // 80-120円
      const cost = Math.floor(clicks * cpc)
      const cvr = 0.08 + Math.random() * 0.05 // 8-13%
      const conversions = Math.floor(clicks * cvr)
      
      // 1日の表示形式
      const dateStr = date.toLocaleDateString('ja-JP')
      
      dailyMetrics.push({
        date: date.toISOString(),
        dateStr,
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
    dailyMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    console.log('生成された1日間隔データ:', dailyMetrics.length, '件')
    
    return NextResponse.json({
      success: true,
      productId: 'WATASHI-COMPASS',
      data: {
        records: dailyMetrics,
        totalRecords: dailyMetrics.length,
        dataType: '1日間隔',
        timeRange: `${dailyMetrics[dailyMetrics.length - 1]?.dateStr} ~ ${dailyMetrics[0]?.dateStr}`,
        totalImpressions: dailyMetrics.reduce((sum, d) => sum + d.impressions, 0),
        totalClicks: dailyMetrics.reduce((sum, d) => sum + d.clicks, 0),
        totalCost: dailyMetrics.reduce((sum, d) => sum + d.cost, 0),
        totalConversions: dailyMetrics.reduce((sum, d) => sum + d.conversions, 0)
      }
    })
    
  } catch (error: any) {
    console.error('1日間隔データ生成エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '1日間隔データ生成に失敗しました'
    }, { status: 500 })
  }
}