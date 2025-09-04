import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 動的にベースURLを取得する関数
 * サーバーサイド・クライアントサイドの両方で使用可能
 */
export function getBaseUrl(): string {
  // ブラウザ環境
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // サーバーサイド環境
  // 環境変数から取得を試行
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // ローカル開発環境のデフォルト（Next.jsの標準ポート3000をベース）
  const port = process.env.PORT || '3000'
  return `http://localhost:${port}`
}

/**
 * 内部API呼び出し用のベースURLを取得する関数
 * 主にサーバーサイドでの内部API呼び出しで使用
 */
export function getApiBaseUrl(): string {
  // サーバーサイドでの内部API呼び出し
  if (typeof window === 'undefined') {
    return getBaseUrl()
  }
  
  // クライアントサイドでは相対パスで十分
  return ''
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function getTrendArrow(trend: 'up' | 'down'): string {
  return trend === 'up' ? '↑' : '↓'
}

export function getTrendColor(trend: 'up' | 'down'): string {
  return trend === 'up' ? 'text-green-500' : 'text-red-500'
}

export function formatDateSeparator(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function shouldShowDateSeparator(currentDate: Date, previousDate: Date | null): boolean {
  if (!previousDate) return true
  return currentDate.toDateString() !== previousDate.toDateString()
}

export function isNearBottom(element: HTMLElement, threshold: number = 100): boolean {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - threshold
}

export function getTrendIconClass(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up': return 'text-green-500'
    case 'down': return 'text-red-500'
    case 'stable': return 'text-gray-500'
    default: return 'text-gray-500'
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'active': return '✅'
    case 'warning': return '⚠️'
    case 'paused': return '⏸️'
    default: return '📊'
  }
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A+': return 'text-green-700 bg-green-100'
    case 'A': return 'text-green-600 bg-green-50'
    case 'B': return 'text-yellow-600 bg-yellow-50'
    case 'C': return 'text-orange-600 bg-orange-50'
    case 'D': return 'text-red-600 bg-red-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case 'buy': return 'text-green-600 bg-green-50'
    case 'sell': return 'text-red-600 bg-red-50'
    case 'hold': return 'text-gray-600 bg-gray-50'
    default: return 'text-blue-600 bg-blue-50'
  }
}