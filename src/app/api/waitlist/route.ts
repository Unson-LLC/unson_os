// Refactor Phase: ベタ書き・ハードコードを除去
import { NextRequest } from 'next/server'
import { validateEmail, validateLength, combineValidationResults } from '@/lib/validation'
import { createSuccessResponse, createErrorResponse, generateId, safeParseJson } from '@/lib/api'
import { VALIDATION_LIMITS, SUCCESS_MESSAGES } from '@/config'

interface WaitlistData {
  email: string
  name: string
  role?: string
}

export async function POST(request: NextRequest) {
  // 安全なJSONパース
  const parseResult = await safeParseJson(request)
  if (!parseResult.success) {
    return parseResult.response
  }
  
  const body: WaitlistData = parseResult.data
  
  // リファクタ済みバリデーション
  const validationResult = combineValidationResults(
    validateEmail(body.email),
    validateLength(body.name, 'Name', VALIDATION_LIMITS.NAME_MAX_LENGTH),
    // メール長さも統一的にチェック
    validateLength(body.email, 'Email', VALIDATION_LIMITS.EMAIL_MAX_LENGTH)
  )
  
  if (!validationResult.isValid) {
    return createErrorResponse(validationResult.error!)
  }
  
  // 成功レスポンス
  return createSuccessResponse(
    SUCCESS_MESSAGES.WAITLIST_ADDED,
    generateId('waitlist')
  )
}