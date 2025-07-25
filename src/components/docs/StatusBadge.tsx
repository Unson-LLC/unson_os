import React from 'react'
import { cn } from '@/lib/utils'

export type DocStatus = 'available' | 'in-discussion' | 'future'

interface StatusBadgeProps {
  status: DocStatus
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const statusConfig = {
  available: {
    icon: '🟢',
    text: '利用可能',
    color: 'text-green-700 bg-green-50 border-green-200',
    darkColor: 'dark:text-green-300 dark:bg-green-900/20 dark:border-green-800'
  },
  'in-discussion': {
    icon: '🟡',
    text: '議論中',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    darkColor: 'dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800'
  },
  future: {
    icon: '🔴',
    text: '構想段階',
    color: 'text-red-700 bg-red-50 border-red-200',
    darkColor: 'dark:text-red-300 dark:bg-red-900/20 dark:border-red-800'
  }
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2'
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showText = true,
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.color,
        config.darkColor,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg'
      )}>
        {config.icon}
      </span>
      {showText && (
        <span>{config.text}</span>
      )}
    </div>
  )
}

// ステータスアイコンのみを返すヘルパー関数
export function getStatusIcon(status: DocStatus): string {
  return statusConfig[status].icon
}

// ステータステキストのみを返すヘルパー関数
export function getStatusText(status: DocStatus): string {
  return statusConfig[status].text
}

// ステータスの説明を返すヘルパー関数
export function getStatusDescription(status: DocStatus): string {
  const descriptions = {
    available: '今すぐ利用できる機能・ドキュメント',
    'in-discussion': '現在設計・議論中の内容',
    future: '将来実装予定の構想'
  }
  return descriptions[status]
}