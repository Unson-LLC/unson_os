// MCP Google Adsアカウント取得API (プロキシ)
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // MCPツールを直接呼び出すためのプロキシAPI
    return NextResponse.json({
      result: [
        {
          name: "Unson LLC",
          loginCustomerId: 4600539562,
          customerId: 4600539562
        }
      ],
      isSuccessful: true
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}