import React from 'react'
import { cn } from '@/lib/utils'
import { DocStatus } from './StatusBadge'

interface ExpectationBannerProps {
  status: DocStatus
  estimatedLaunch?: string
  className?: string
}

interface BannerConfigItem {
  title: string
  description: string
  bgColor: string
  darkBgColor: string
  textColor: string
  warning?: string
  cta?: {
    text: string
    urls: Array<{ label: string; url: string }>
  }
}

const bannerConfig: Record<DocStatus, BannerConfigItem> = {
  available: {
    title: '✅ このドキュメントは利用可能です',
    description: 'ここに記載されている内容は、現在実際に利用できる機能です。',
    bgColor: 'bg-green-50 border-green-200',
    darkBgColor: 'dark:bg-green-900/20 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-200'
  },
  'in-discussion': {
    title: '🔨 このドキュメントは設計・議論中です',
    description: '記載内容は変更される可能性があります。ぜひDiscordやGitHubで議論に参加してください。',
    bgColor: 'bg-yellow-50 border-yellow-200',
    darkBgColor: 'dark:bg-yellow-900/20 dark:border-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    cta: {
      text: '議論に参加する',
      urls: [
        { label: 'Discord', url: 'https://discord.gg/unsonos' },
        { label: 'GitHub', url: 'https://github.com/Unson-LLC/unson_os/issues' }
      ]
    }
  },
  future: {
    title: '⚠️ このドキュメントは構想段階です',
    description: 'ここに記載されている内容は将来の構想であり、実装時期は未定です。',
    bgColor: 'bg-red-50 border-red-200',
    darkBgColor: 'dark:bg-red-900/20 dark:border-red-800',
    textColor: 'text-red-800 dark:text-red-200',
    warning: '実際のサービス開始は2025年中頃以降を予定しています。'
  }
}

export function ExpectationBanner({ 
  status, 
  estimatedLaunch,
  className 
}: ExpectationBannerProps) {
  const config = bannerConfig[status]
  
  // 利用可能な場合はバナーを表示しない
  if (status === 'available') {
    return null
  }
  
  return (
    <div className={cn(
      'rounded-lg border p-4 mb-6',
      config.bgColor,
      config.darkBgColor,
      className
    )}>
      <div className={config.textColor}>
        <h3 className="font-semibold text-sm mb-1">
          {config.title}
        </h3>
        <p className="text-sm">
          {config.description}
        </p>
        
        {estimatedLaunch && (
          <p className="text-sm mt-2">
            <span className="font-semibold">予定時期:</span> {estimatedLaunch}
          </p>
        )}
        
        {config.warning && (
          <p className="text-sm font-medium mt-2">
            {config.warning}
          </p>
        )}
        
        {config.cta && (
          <div className="flex gap-3 mt-3">
            {config.cta.urls.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline hover:no-underline"
              >
                {link.label}で{config.cta!.text} →
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// コンパクト版の期待値管理バナー
export function ExpectationBannerCompact({ 
  status,
  className 
}: Omit<ExpectationBannerProps, 'estimatedLaunch'>) {
  if (status === 'available') {
    return null
  }
  
  const messages = {
    'in-discussion': '⚡ このページの内容は現在議論・設計中です',
    'future': '🚧 このページの内容は将来の構想です（2025年以降実装予定）'
  }
  
  const colors = {
    'in-discussion': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'future': 'bg-red-100 border-red-300 text-red-800'
  }
  
  return (
    <div className={cn(
      'text-sm text-center p-2 border rounded-md mb-4',
      colors[status],
      className
    )}>
      {messages[status]}
    </div>
  )
}