/**
 * 全プロダクトのキャンペーン数取得API
 * Convex campaignsテーブルから実際のキャンペーン数を取得
 */

import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../../convex/_generated/api'

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

export async function GET(request: NextRequest) {
  try {
    console.log('全プロダクトキャンペーン数取得開始')
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    const workspace_id = 'unson-os-workspace' // 固定ワークスペースID
    
    // Convexから全プロダクトのキャンペーン数を取得
    const campaignCounts = await client.query(api.campaigns.getAllCampaignCounts, {
      workspace_id
    })
    
    console.log('キャンペーン数取得成功:', campaignCounts)
    
    return NextResponse.json({
      success: true,
      workspace_id,
      campaignsByProduct: campaignCounts,
      summary: {
        totalProducts: Object.keys(campaignCounts).length,
        totalCampaigns: Object.values(campaignCounts).reduce((sum, data: any) => sum + data.total, 0),
        activeCampaigns: Object.values(campaignCounts).reduce((sum, data: any) => sum + data.active, 0),
        pausedCampaigns: Object.values(campaignCounts).reduce((sum, data: any) => sum + data.paused, 0)
      }
    })
    
  } catch (error: any) {
    console.error('キャンペーン数取得エラー:', error)
    
    // フォールバック: わたしコンパスのみ1キャンペーン、他は0
    const fallbackCounts = {
      'watashi-compass': { total: 1, active: 1, paused: 0 },
      'mywa': { total: 0, active: 0, paused: 0 },
      'ai-bridge': { total: 0, active: 0, paused: 0 },
      'ai-coach': { total: 0, active: 0, paused: 0 },
      'ai-stylist': { total: 0, active: 0, paused: 0 },
      'ai-legacy-creator': { total: 0, active: 0, paused: 0 }
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      campaignsByProduct: fallbackCounts,
      fallback: true
    }, { status: 200 }) // エラーでもデータ返却
  }
}