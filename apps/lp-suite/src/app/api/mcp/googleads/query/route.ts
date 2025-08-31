/**
 * MCP Google Ads GAQLクエリ実行API
 * 実際のMCPツールを直接呼び出し
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, customerId, loginCustomerId, reportAggregation } = body

    console.log('MCP Google Ads クエリ実行開始:', {
      customerId,
      loginCustomerId,
      queryLength: query.length
    })

    // 実際のMCPツールを呼び出し
    if (typeof mcp__googleads__executeGaqlQuery === 'function') {
      console.log('MCPツール直接呼び出し: mcp__googleads__executeGaqlQuery')
      
      const result = await mcp__googleads__executeGaqlQuery({
        query,
        customerId,
        loginCustomerId,
        reportAggregation: reportAggregation || 'DEFAULT'
      })
      
      console.log('Google Ads GAQLクエリ実行成功:', {
        resultsCount: result?.results?.length || 0
      })
      
      return NextResponse.json({
        success: true,
        result,
        source: 'mcp-direct-call',
        query: query.substring(0, 100) + '...', // クエリの一部のみログ
        timestamp: new Date().toISOString()
      })
    }

    // MCPツールが利用できない場合のエラー
    console.error('MCPツールが利用できません: mcp__googleads__executeGaqlQuery')
    
    return NextResponse.json({
      success: false,
      error: 'MCP Google Adsクエリツールが利用できません',
      available_functions: typeof mcp__googleads__executeGaqlQuery,
      fallback: 'using-static-data',
      params: { customerId, loginCustomerId, reportAggregation }
    }, { status: 503 })

  } catch (error) {
    console.error('MCP Google Ads クエリ実行エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// TypeScript用のMCP関数宣言
declare global {
  function mcp__googleads__executeGaqlQuery(params: {
    query: string
    customerId: number
    loginCustomerId: number
    reportAggregation: string
  }): Promise<any>
}