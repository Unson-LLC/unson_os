/**
 * アラート管理API
 * Convex alertsテーブルからアラートデータを取得・管理
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

// アラート一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'active', 'resolved', etc.
    const product_id = searchParams.get('product_id')
    
    console.log('アラート取得開始:', { status, product_id })
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    const workspace_id = 'unson-os-workspace'
    
    let alerts
    
    if (product_id) {
      // プロダクト別アラート取得
      alerts = await client.query(api.alerts.getAlertsByProduct, {
        workspace_id,
        product_id,
        status: status as any
      })
    } else {
      // 全アラート取得
      alerts = await client.query(api.alerts.getAlerts, {
        workspace_id,
        status: status as any
      })
    }
    
    console.log(`アラート取得成功: ${alerts.length}件`)
    
    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
      filters: { status, product_id }
    })
    
  } catch (error: any) {
    console.error('アラート取得エラー:', error)
    
    // フォールバック: わたしコンパス用のデモアラート
    const fallbackAlerts = [
      {
        alert_id: 'demo_alert_1',
        alert_type: 'cvr_below_threshold',
        severity: 'medium',
        title: 'CVR改善が必要',
        message: 'わたしコンパスのCVR 0%が改善目標です',
        status: 'active',
        product_id: 'watashi-compass',
        created_at: Date.now(),
        threshold_value: 10,
        current_value: 0
      }
    ]
    
    return NextResponse.json({
      success: false,
      error: error.message,
      alerts: fallbackAlerts,
      fallback: true
    }, { status: 200 }) // エラーでもデータ返却
  }
}

