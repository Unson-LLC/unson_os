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