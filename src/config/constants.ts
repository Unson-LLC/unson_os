// Refactor Phase: 定数の外部化

/**
 * バリデーション闾値
 */
export const VALIDATION_LIMITS = {
  EMAIL_MAX_LENGTH: 100,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 5000,
  PRODUCT_TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 10000,
  COVER_LETTER_MAX_LENGTH: 5000,
} as const

/**
 * 許可されたプロダクトカテゴリ
 */
export const PRODUCT_CATEGORIES = [
  'productivity',
  'marketing', 
  'finance',
  'design',
  'development',
  'analytics',
  'communication',
  'other'
] as const

/**
 * 許可された採用ポジション
 */
export const CAREER_POSITIONS = [
  'Frontend Developer',
  'Backend Developer', 
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Data Scientist',
  'Marketing Manager',
  'Business Analyst',
  'QA Engineer',
  'Technical Writer'
] as const

/**
 * エラーメッセージ
 */
export const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON',
  INTERNAL_ERROR: 'Internal server error',
} as const

/**
 * 成功メッセージ
 */
export const SUCCESS_MESSAGES = {
  CONTACT_SUBMITTED: 'Contact form submitted successfully',
  PRODUCT_REQUEST_SUBMITTED: 'Product request submitted successfully',
  CAREER_APPLICATION_SUBMITTED: 'Career application submitted successfully',
  WAITLIST_ADDED: 'Successfully added to waitlist',
} as const
