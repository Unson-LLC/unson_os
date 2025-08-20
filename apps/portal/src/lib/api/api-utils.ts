// Refactor Phase: APIユーティリティ関数の共通化

import { NextResponse } from 'next/server'
import { ERROR_MESSAGES } from '@/config'

/**
 * 成功レスポンスを生成
 */
export function createSuccessResponse(
  message: string,
  id: string,
  status: number = 201
) {
  return NextResponse.json(
    { message, id },
    { status }
  )
}

/**
 * エラーレスポンスを生成
 */
export function createErrorResponse(
  error: string,
  status: number = 400
) {
  return NextResponse.json(
    { error },
    { status }
  )
}

/**
 * IDを生成
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}`
}

/**
 * APIハンドラーの共通エラーハンドリング
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)
  return createErrorResponse(ERROR_MESSAGES.INVALID_JSON)
}

/**
 * JSONパースを安全に実行
 */
export async function safeParseJson(
  request: Request
): Promise<{ success: true; data: any } | { success: false; response: NextResponse }> {
  try {
    const data = await request.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      response: handleApiError(error)
    }
  }
}
