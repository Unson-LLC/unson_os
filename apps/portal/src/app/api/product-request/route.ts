// Refactor Phase: ベタ書き・ハードコードを除去
import { NextRequest } from 'next/server'
import { validateEmail, validateLength, validateInList, combineValidationResults } from '@/lib/validation'
import { createSuccessResponse, createErrorResponse, generateId, safeParseJson } from '@/lib/api'
import { VALIDATION_LIMITS, SUCCESS_MESSAGES, PRODUCT_CATEGORIES } from '@/config'
import type { ProductRequestData } from '@/types/api'

export async function POST(request: NextRequest) {
  // 安全なJSONパース
  const parseResult = await safeParseJson(request)
  if (!parseResult.success) {
    return parseResult.response
  }
  
  const body: ProductRequestData = parseResult.data
  
  // リファクタ済みバリデーション
  const validationResult = combineValidationResults(
    validateEmail(body.email),
    validateLength(body.name, 'Name', VALIDATION_LIMITS.NAME_MAX_LENGTH),
    validateLength(body.productTitle, 'Product title', VALIDATION_LIMITS.PRODUCT_TITLE_MAX_LENGTH),
    validateLength(body.description, 'Description', VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH),
    validateInList(body.category, PRODUCT_CATEGORIES as unknown as string[], 'Category')
  )
  
  if (!validationResult.isValid) {
    return createErrorResponse(validationResult.error!)
  }
  
  // 成功レスポンス
  return createSuccessResponse(
    SUCCESS_MESSAGES.PRODUCT_REQUEST_SUBMITTED,
    generateId('product_request')
  )
}
