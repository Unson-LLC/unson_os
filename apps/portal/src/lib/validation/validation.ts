// Refactor Phase: バリデーション機能の共通化

/**
 * メールアドレスの形式バリデーション
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  return { isValid: true }
}

/**
 * 文字列の長さバリデーション
 */
export function validateLength(
  value: string, 
  fieldName: string, 
  maxLength: number, 
  minLength: number = 1
): { isValid: boolean; error?: string } {
  if (!value || value.length < minLength) {
    return { isValid: false, error: `${fieldName} is required` }
  }
  
  if (value.length > maxLength) {
    return { isValid: false, error: `${fieldName} too long` }
  }
  
  return { isValid: true }
}

/**
 * 値が許可されたリストに含まれているかバリデーション
 */
export function validateInList(
  value: string | undefined,
  allowedValues: string[],
  fieldName: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true } // オプショナルフィールドの場合
  }
  
  if (!allowedValues.includes(value)) {
    return { isValid: false, error: `Invalid ${fieldName.toLowerCase()}` }
  }
  
  return { isValid: true }
}

/**
 * URL形式のバリデーション
 */
export function validateUrl(
  url: string | undefined,
  fieldName: string
): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: true } // オプショナルフィールドの場合
  }
  
  const urlRegex = /^https?:\/\/.+/
  if (!urlRegex.test(url)) {
    return { isValid: false, error: `Invalid ${fieldName.toLowerCase()} URL` }
  }
  
  return { isValid: true }
}

/**
 * 複数のバリデーション結果をまとめる
 */
export function combineValidationResults(
  ...results: Array<{ isValid: boolean; error?: string }>
): { isValid: boolean; error?: string } {
  for (const result of results) {
    if (!result.isValid) {
      return result
    }
  }
  return { isValid: true }
}
