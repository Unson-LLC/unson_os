// 1週間間隔Google Adsサンプルデータ生成API
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

// 週間集計のGoogle Adsサンプルデータを生成・返却
export async function GET(req: NextRequest) {
  try {
    console.log('週間集計Google Adsデータ生成開始')
    
    // 過去4週間を1週間間隔で分割（4エントリ）
    const weeklyMetrics = []
    const now = new Date()
    
    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      // 月曜日を週の開始とする
      const dayOfWeek = startOfWeek.getDay()
      const daysFromMonday = (dayOfWeek + 6) % 7
      startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday)
      startOfWeek.setHours(0, 0, 0, 0)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      // 週による変動（最近の週ほど高い）
      const weekMultiplier = 0.7 + (3 - i) * 0.15 // 0.7, 0.85, 1.0, 1.15
      const weeklyVariation = 0.9 + Math.random() * 0.2 // 0.9-1.1の範囲
      const finalMultiplier = weekMultiplier * weeklyVariation
      
      // 週間集計（7日分）
      const impressions = Math.floor((18000 + Math.random() * 6000) * finalMultiplier)
      const ctr = 0.025 + Math.random() * 0.020 // 2.5-4.5%
      const clicks = Math.floor(impressions * ctr)
      const cpc = 80 + Math.random() * 40 // 80-120円
      const cost = Math.floor(clicks * cpc)
      const cvr = 0.08 + Math.random() * 0.05 // 8-13%
      const conversions = Math.floor(clicks * cvr)
      
      // 週間の表示形式
      const startDateStr = startOfWeek.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
      const endDateStr = endOfWeek.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
      const dateStr = `${startDateStr}~${endDateStr}`
      
      weeklyMetrics.push({
        date: startOfWeek.toISOString(),
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
    weeklyMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    console.log('生成された週間集計データ:', weeklyMetrics.length, '件')
    
    return NextResponse.json({
      success: true,
      productId: 'WATASHI-COMPASS',
      data: {
        records: weeklyMetrics,
        totalRecords: weeklyMetrics.length,
        dataType: '週間集計',
        timeRange: `${weeklyMetrics[weeklyMetrics.length - 1]?.dateStr} ~ ${weeklyMetrics[0]?.dateStr}`,
        totalImpressions: weeklyMetrics.reduce((sum, d) => sum + d.impressions, 0),
        totalClicks: weeklyMetrics.reduce((sum, d) => sum + d.clicks, 0),
        totalCost: weeklyMetrics.reduce((sum, d) => sum + d.cost, 0),
        totalConversions: weeklyMetrics.reduce((sum, d) => sum + d.conversions, 0)
      }
    })
    
  } catch (error: any) {
    console.error('週間集計データ生成エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '週間集計データ生成に失敗しました'
    }, { status: 500 })
  }
}