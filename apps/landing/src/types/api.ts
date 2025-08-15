// Refactor Phase: TypeScript型定義の追加

/**
 * お問い合わせフォームのデータ型
 */
export interface ContactFormData {
  email: string
  name: string
  message: string
  subject?: string
}

/**
 * プロダクトリクエストフォームのデータ型
 */
export interface ProductRequestData {
  email: string
  name: string
  productTitle: string
  description: string
  category?: string
  priority?: string
}

/**
 * 採用応募フォームのデータ型
 */
export interface CareerApplicationData {
  email: string
  name: string
  position: string
  experience: string
  coverLetter: string
  portfolio?: string
  availability?: string
}

/**
 * APIレスポンスの型
 */
export interface ApiSuccessResponse {
  message: string
  id: string
}

export interface ApiErrorResponse {
  error: string
}

/**
 * バリデーション結果の型
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}
