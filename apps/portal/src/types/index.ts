// 共通のページプロパティ
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Next.js Metadata
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  openGraph?: {
    title: string
    description: string
    type?: string
    images?: string[]
  }
}

// フォーム関連
export interface FormField {
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  label: string
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface FormConfig {
  fields: FormField[]
  submitText: string
  successMessage: string
}

// API応答
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 統計情報
export interface Statistics {
  [key: string]: string | number
}

// 検索・フィルタリング
export interface FilterOptions {
  categories?: string[]
  status?: string[]
  sortBy?: 'name' | 'date' | 'rating' | 'users'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  hasMore: boolean
}

// ユーティリティ型
export type Status = 'active' | 'beta' | 'coming-soon' | 'deprecated'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type ContactType = 
  | 'general'
  | 'technical' 
  | 'billing'
  | 'custom-product'
  | 'partnership'
  | 'media'
  | 'career'
  | 'dao'

export type SupportType = 
  | 'general'
  | 'technical'
  | 'billing'
  | 'feature'
  | 'dao'
  | 'partnership'

// コンポーネントプロパティ
export interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

export interface ButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// エラーハンドリング
export interface ErrorInfo {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}