// Google Adsキャンペーンと製品の動的マッピングAPI
import { NextRequest, NextResponse } from 'next/server'

// Google Ads全キャンペーンを取得し、製品名とマッピング
export async function GET(req: NextRequest) {
  try {
    console.log('Google Adsキャンペーン動的マッピング開始')
    
    // MCPツール経由でGoogle Adsアカウント取得
    const accountsResponse = await fetch('http://localhost:3001/api/mcp-googleads-accounts', {
      method: 'GET',
      cache: 'no-store'
    })
    
    if (!accountsResponse.ok) {
      throw new Error(`アカウント取得失敗: ${accountsResponse.statusText}`)
    }
    
    const accountsData = await accountsResponse.json()
    const accounts = accountsData.result || []
    
    if (accounts.length === 0) {
      throw new Error('Google Adsアカウントが見つかりません')
    }
    
    const account = accounts[0] // Unson LLC
    const customerId = account.customerId
    const loginCustomerId = account.loginCustomerId
    
    console.log(`アカウント: ${account.name} (${customerId})`)
    
    // 全キャンペーン取得
    const campaignsResponse = await fetch('http://localhost:3001/api/mcp-googleads-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        loginCustomerId,
        query: 'SELECT campaign.name, campaign.id, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE campaign.status != "REMOVED" ORDER BY metrics.impressions DESC LIMIT 50',
        reportAggregation: 'campaign'
      }),
      cache: 'no-store'
    })
    
    if (!campaignsResponse.ok) {
      throw new Error(`キャンペーン取得失敗: ${campaignsResponse.statusText}`)
    }
    
    const campaignsData = await campaignsResponse.json()
    const campaigns = campaignsData.result?.data || []
    
    console.log(`取得キャンペーン数: ${campaigns.length}`)
    
    // 製品名とキャンペーン名の自動マッピング
    const productMapping = []
    
    for (const campaignRow of campaigns) {
      const [name, id, status, impressions, clicks, costMicros, conversions] = campaignRow
      
      // キャンペーン名から製品名を推測
      let productName = 'UNKNOWN'
      const campaignNameLower = name.toLowerCase()
      
      if (campaignNameLower.includes('watashi') || campaignNameLower.includes('わたし') || campaignNameLower.includes('compass')) {
        productName = 'わたしコンパス'
      } else if (campaignNameLower.includes('ai-bridge') || campaignNameLower.includes('bridge')) {
        productName = '世代bridge'
      } else if (campaignNameLower.includes('ai-coach') || campaignNameLower.includes('coach')) {
        productName = 'じぶん lab'
      } else if (campaignNameLower.includes('ai-stylist') || campaignNameLower.includes('stylist')) {
        productName = 'きこなし'
      } else if (campaignNameLower.includes('mywa')) {
        productName = 'MYWA'
      } else if (campaignNameLower.includes('legacy') || campaignNameLower.includes('creator')) {
        productName = '想い帳'
      }
      
      // メトリクス計算
      const numImpressions = parseInt(impressions) || 0
      const numClicks = parseInt(clicks) || 0
      const numCostMicros = parseInt(costMicros) || 0
      const numConversions = parseFloat(conversions) || 0
      
      const cost = Math.round(numCostMicros / 1000000) // マイクロ円を円に変換
      const ctr = numImpressions > 0 ? Math.round((numClicks / numImpressions) * 1000) / 10 : 0
      const cvr = numClicks > 0 ? Math.round((numConversions / numClicks) * 1000) / 10 : 0
      const cpc = numClicks > 0 ? Math.round(cost / numClicks) : 0
      
      productMapping.push({
        productName,
        campaign: {
          id,
          name,
          status
        },
        metrics: {
          impressions: numImpressions,
          clicks: numClicks,
          cost,
          conversions: numConversions,
          ctr,
          cvr,
          cpc
        }
      })
    }
    
    // 製品別に集計
    const productSummary = {}
    for (const mapping of productMapping) {
      const { productName, metrics } = mapping
      if (!productSummary[productName]) {
        productSummary[productName] = {
          productName,
          campaigns: [],
          totalImpressions: 0,
          totalClicks: 0,
          totalCost: 0,
          totalConversions: 0
        }
      }
      
      productSummary[productName].campaigns.push(mapping.campaign)
      productSummary[productName].totalImpressions += metrics.impressions
      productSummary[productName].totalClicks += metrics.clicks
      productSummary[productName].totalCost += metrics.cost
      productSummary[productName].totalConversions += metrics.conversions
    }
    
    // 製品別の指標を計算
    Object.values(productSummary).forEach((product: any) => {
      product.ctr = product.totalImpressions > 0 ? 
        Math.round((product.totalClicks / product.totalImpressions) * 1000) / 10 : 0
      product.cvr = product.totalClicks > 0 ? 
        Math.round((product.totalConversions / product.totalClicks) * 1000) / 10 : 0
      product.cpc = product.totalClicks > 0 ? 
        Math.round(product.totalCost / product.totalClicks) : 0
    })
    
    console.log('製品別集計:', Object.keys(productSummary))
    
    return NextResponse.json({
      success: true,
      account: account.name,
      data: {
        campaignMapping: productMapping,
        productSummary: Object.values(productSummary),
        totalCampaigns: campaigns.length
      }
    })
    
  } catch (error: any) {
    console.error('キャンペーンマッピングエラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Google Adsキャンペーンマッピングに失敗しました'
    }, { status: 500 })
  }
}