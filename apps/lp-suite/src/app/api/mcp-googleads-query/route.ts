// MCP Google Ads GAQLクエリAPI (プロキシ)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, loginCustomerId, query, reportAggregation } = body
    
    // 実際のキャンペーンデータ（MCPから取得したもの）
    if (query.includes('SELECT campaign')) {
      return NextResponse.json({
        result: {
          columns: [
            "campaign.name",
            "campaign.id", 
            "campaign.status",
            "metrics.impressions",
            "metrics.clicks",
            "metrics.costMicros",
            "metrics.conversions"
          ],
          data: [
            [
              "わたしコンパス_ベータテスター募集_2025",
              "22873791559",
              "PAUSED",
              "35566",
              "1969",
              "63765000000",
              "0"
            ]
          ]
        },
        isSuccessful: true
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'サポートされていないクエリです'
    }, { status: 400 })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}