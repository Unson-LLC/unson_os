// Refactor Phase: ベタ書き・ハードコードを除去
import { NextRequest } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { validateEmail, validateLength, combineValidationResults } from '@/lib/validation'
import { createSuccessResponse, createErrorResponse, generateId, safeParseJson } from '@/lib/api'
import { VALIDATION_LIMITS, SUCCESS_MESSAGES } from '@/config'

interface WaitlistData {
  email: string
  name: string
  role?: string
  company?: string
  interests?: string[]
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

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
  
  try {
    // Convexに保存
    await convex.mutation(api.waitlist.add, {
      email: body.email,
      name: body.name,
      company: body.company,
      interests: body.interests || [],
      source: request.headers.get('referer') || undefined,
    })
    
    // 成功レスポンス
    return createSuccessResponse(
      SUCCESS_MESSAGES.WAITLIST_ADDED,
      generateId('waitlist')
    )
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      return createErrorResponse('このメールアドレスは既に登録されています')
    }
    throw error
  }
}