// Refactor Phase: ベタ書き・ハードコードを除去
import { NextRequest } from 'next/server'
import { validateEmail, validateLength, validateInList, validateUrl, combineValidationResults } from '@/lib/validation'
import { createSuccessResponse, createErrorResponse, generateId, safeParseJson } from '@/lib/api'
import { VALIDATION_LIMITS, SUCCESS_MESSAGES, CAREER_POSITIONS } from '@/config'
import type { CareerApplicationData } from '@/types/api'

export async function POST(request: NextRequest) {
  // 安全なJSONパース
  const parseResult = await safeParseJson(request)
  if (!parseResult.success) {
    return parseResult.response
  }
  
  const body: CareerApplicationData = parseResult.data
  
  // リファクタ済みバリデーション
  const validationResult = combineValidationResults(
    validateEmail(body.email),
    validateLength(body.name, 'Name', VALIDATION_LIMITS.NAME_MAX_LENGTH),
    validateLength(body.position, 'Position', 100),
    validateLength(body.experience, 'Experience', 500),
    validateLength(body.coverLetter, 'Cover letter', VALIDATION_LIMITS.COVER_LETTER_MAX_LENGTH),
    validateInList(body.position, CAREER_POSITIONS as unknown as string[], 'Position'),
    validateUrl(body.portfolio, 'Portfolio')
  )
  
  if (!validationResult.isValid) {
    return createErrorResponse(validationResult.error!)
  }
  
  // 成功レスポンス
  return createSuccessResponse(
    SUCCESS_MESSAGES.CAREER_APPLICATION_SUBMITTED,
    generateId('career')
  )
}
