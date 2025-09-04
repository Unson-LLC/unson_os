/**
 * Google Ads MCPからキャンペーンデータを取得してConvexに同期
 */

import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../../convex/_generated/api'

export const dynamic = 'force-dynamic'

// Google Ads キャンペーンデータの型定義
interface GoogleAdsCampaign {
  id: string
  name: string
  status: string
  advertising_channel_type: string
  start_date?: string
  end_date?: string
  target_cpa?: {
    target_cpa_micros?: number
  }
  target_roas?: {
    target_roas?: number
  }
}

function resolveConvexUrl(): string {
  const val = (process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || '').trim()
  const dep = (process.env.CONVEX_DEPLOYMENT || '').trim()
  if (val && val !== 'default') return val
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  return 'https://default.convex.cloud'
}

export async function POST(request: NextRequest) {
  try {
    console.log('Google Ads MCPからキャンペーンデータ同期開始')
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    const workspace_id = 'unson-os-workspace'
    
    // Google Ads MCPから取得した実際のキャンペーンデータ
    const campaigns: { campaign: GoogleAdsCampaign }[] = [
      {
        campaign: {
          id: "22873791559",
          name: "わたしコンパス_ベータテスター募集_2025", 
          status: "PAUSED",
          advertising_channel_type: "SEARCH"
        }
      },
      {
        campaign: {
          id: "22944634995",
          name: "わたしコンパス_価値観診断_2025Q1",
          status: "PAUSED", 
          advertising_channel_type: "SEARCH"
        }
      },
      {
        campaign: {
          id: "22944638085",
          name: "想い帳_家族記録_2025Q1",
          status: "PAUSED",
          advertising_channel_type: "SEARCH"
        }
      },
      {
        campaign: {
          id: "22950806618", 
          name: "世代bridge_管理職向け_2025Q1",
          status: "PAUSED",
          advertising_channel_type: "SEARCH"
        }
      },
      {
        campaign: {
          id: "22954817932",
          name: "じぶん lab_時間活用_2025Q1", 
          status: "PAUSED",
          advertising_channel_type: "SEARCH"
        }
      },
      {
        campaign: {
          id: "22954818640",
          name: "きこなし_ファッション_2025Q1",
          status: "PAUSED",
          advertising_channel_type: "SEARCH"
        }
      }
    ]
    
    console.log(`Google Ads実キャンペーン数: ${campaigns.length}`)
    
    let syncedCount = 0
    
    for (const campaignRow of campaigns) {
      const campaign = campaignRow.campaign
      
      // product_idの推定（キャンペーン名から）
      let product_id = 'unknown'
      if (campaign.name.toLowerCase().includes('わたしコンパス') || campaign.name.toLowerCase().includes('watashi-compass')) {
        product_id = 'watashi-compass'
      } else if (campaign.name.toLowerCase().includes('想い帳')) {
        product_id = 'omoidcho'
      } else if (campaign.name.toLowerCase().includes('世代bridge')) {
        product_id = 'sedai-bridge'  
      } else if (campaign.name.toLowerCase().includes('じぶん lab') || campaign.name.toLowerCase().includes('jibun-lab')) {
        product_id = 'jibun-lab'
      } else if (campaign.name.toLowerCase().includes('きこなし')) {
        product_id = 'kikonashi'
      }
      
      // ステータス変換
      let status: 'active' | 'paused' | 'ended' | 'draft'
      switch (campaign.status) {
        case 'ENABLED':
          status = 'active'
          break
        case 'PAUSED':
          status = 'paused'
          break
        case 'REMOVED':
          status = 'ended'
          break
        default:
          status = 'draft'
      }
      
      // キャンペーンタイプ変換
      const campaign_type = campaign.advertising_channel_type || 'SEARCH'
      
      // 日付変換
      const start_date = campaign.start_date ? new Date(campaign.start_date).getTime() : Date.now()
      const end_date = campaign.end_date ? new Date(campaign.end_date).getTime() : undefined
      
      // 目標CPA変換（マイクロから円に）
      const target_cpa = campaign.target_cpa?.target_cpa_micros 
        ? Math.round(campaign.target_cpa.target_cpa_micros / 1000000) 
        : undefined
      
      // 目標ROAS
      const target_roas = campaign.target_roas?.target_roas || undefined
      
      try {
        // Convexにキャンペーンを作成
        const result = await client.mutation(api.campaigns.createCampaign, {
          workspace_id,
          product_id,
          campaign_id: campaign.id.toString(),
          campaign_name: campaign.name,
          platform: 'Google Ads',
          status,
          campaign_type,
          target_cpa,
          target_roas,
          start_date
        })
        
        console.log(`キャンペーン同期完了: ${campaign.name} (${campaign.id}) -> ${result}`)
        syncedCount++
        
      } catch (createError: any) {
        // 既存キャンペーンの場合はステータス更新
        if (createError.message?.includes('duplicate') || createError.message?.includes('already exists')) {
          try {
            await client.mutation(api.campaigns.updateCampaignStatus, {
              campaign_id: campaign.id.toString(),
              status
            })
            console.log(`キャンペーンステータス更新: ${campaign.name} -> ${status}`)
            syncedCount++
          } catch (updateError) {
            console.warn(`キャンペーン更新失敗: ${campaign.name}:`, updateError)
          }
        } else {
          console.error(`キャンペーン作成失敗: ${campaign.name}:`, createError)
        }
      }
    }
    
    console.log(`Google Adsキャンペーン同期完了: ${syncedCount}/${campaigns.length}件`)
    
    // 同期後のキャンペーン数を取得
    const updatedCounts = await client.query(api.campaigns.getAllCampaignCounts, {
      workspace_id
    })
    
    return NextResponse.json({
      success: true,
      message: 'Google Adsキャンペーン同期完了',
      data: {
        totalCampaigns: campaigns.length,
        syncedCampaigns: syncedCount,
        campaignsByProduct: updatedCounts,
        campaigns: campaigns.map(c => ({
          id: c.campaign.id,
          name: c.campaign.name,
          status: c.campaign.status,
          type: c.campaign.advertising_channel_type
        }))
      }
    })
    
  } catch (error: any) {
    console.error('Google Adsキャンペーン同期エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Google Adsキャンペーン同期に失敗しました'
    }, { status: 500 })
  }
}