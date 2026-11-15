import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NODE_ENV === 'production' ? 'https://unsonos-api.vercel.app' : 'http://localhost:3000'
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function getTrendArrow(trend: string): string {
  if (trend === 'up') return '↗'
  if (trend === 'down') return '↘'
  return '→'
}

export function getTrendColor(trend: string): string {
  if (trend === 'up') return 'text-green-600'
  if (trend === 'down') return 'text-red-600'
  return 'text-gray-600'
}

export function getTrendIconClass(trend: string): string {
  const base = 'w-4 h-4'
  if (trend === 'up') return `${base} text-green-500`
  if (trend === 'down') return `${base} text-red-500`
  return `${base} text-gray-500`
}

export function getStatusIcon(status: string): string {
  if (status === 'RUNNING' || status === 'active') return '🟢'
  if (status === 'OPTIMIZING' || status === 'pending') return '🟡'
  if (status === 'CLOSED' || status === 'failed') return '🔴'
  return '⚪'
}

export function getGradeColor(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'text-green-700 bg-green-50'
  if (grade === 'B') return 'text-blue-700 bg-blue-50'
  if (grade === 'C') return 'text-yellow-700 bg-yellow-50'
  return 'text-red-700 bg-red-50'
}

export function getActionColor(action: string): string {
  if (action.includes('停止') || action.includes('終了')) return 'text-red-700 bg-red-50'
  if (action.includes('改善') || action.includes('最適化')) return 'text-yellow-700 bg-yellow-50'
  return 'text-blue-700 bg-blue-50'
}

export function formatDateSeparator(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
}

export function shouldShowDateSeparator(current: Date, previous: Date | null): boolean {
  if (!previous) return true
  return current.toDateString() !== previous.toDateString()
}

export function isNearBottom(element: HTMLElement, threshold = 100): boolean {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - threshold
}
