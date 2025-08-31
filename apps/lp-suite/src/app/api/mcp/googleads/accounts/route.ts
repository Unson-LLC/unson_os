/**
 * MCP Google Ads アカウント取得API
 * 実際のMCPツールを直接呼び出し
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('MCP Google Ads アカウント取得開始')

    // 実際のMCPツールを呼び出し
    if (typeof mcp__googleads__getAccounts === 'function') {
      console.log('MCPツール直接呼び出し: mcp__googleads__getAccounts')
      const accounts = await mcp__googleads__getAccounts({})
      
      console.log('Google Adsアカウント取得成功:', accounts)
      
      return NextResponse.json({
        success: true,
        accounts,
        source: 'mcp-direct-call',
        timestamp: new Date().toISOString()
      })
    }

    // MCPツールが利用できない場合のエラー
    console.error('MCPツールが利用できません: mcp__googleads__getAccounts')
    
    return NextResponse.json({
      success: false,
      error: 'MCP Google Adsツールが利用できません',
      available_functions: typeof mcp__googleads__getAccounts,
      fallback: 'using-environment-config'
    }, { status: 503 })

  } catch (error) {
    console.error('MCP Google Ads アカウント取得エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// TypeScript用のMCP関数宣言
declare global {
  function mcp__googleads__getAccounts(params: any): Promise<any>
}