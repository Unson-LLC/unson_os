import React from 'react'
import { cn } from '@/lib/utils'

interface SubItem {
  label: string
  value: string
}

interface KPICardProps {
  title: string
  value: string
  trend?: string
  change?: string
  trendType?: 'up' | 'down' | 'neutral'
  subItems?: SubItem[]
  className?: string
}

const TREND_STYLES = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-500'
} as const

export function KPICard({ 
  title, 
  value, 
  trend, 
  change, 
  trendType = 'neutral',
  subItems,
  className
}: KPICardProps) {
  const trendColorClass = TREND_STYLES[trendType]
  
  const ariaLabel = [
    `${title}: ${value}`,
    trend && `(${trend} ${change || ''})`.trim()
  ].filter(Boolean).join(' ')

  return (
    <article 
      className={cn(
        "bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow",
        className
      )}
      aria-label={ariaLabel}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {trend && (
          <TrendIndicator 
            trend={trend} 
            change={change} 
            colorClass={trendColorClass} 
          />
        )}
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {value}
      </div>
      
      {subItems && subItems.length > 0 && (
        <SubItemsList items={subItems} />
      )}
    </article>
  )
}

function TrendIndicator({ 
  trend, 
  change, 
  colorClass 
}: { 
  trend: string
  change?: string
  colorClass: string 
}) {
  return (
    <div className="flex items-center space-x-1">
      <span className={cn("text-xl", colorClass)}>
        {trend}
      </span>
      {change && (
        <span className="text-sm text-gray-600">
          {change}
        </span>
      )}
    </div>
  )
}

function SubItemsList({ items }: { items: SubItem[] }) {
  return (
    <div className="space-y-1 text-sm text-gray-600 border-t pt-3 mt-3">
      {items.map((item, index) => (
        <div 
          key={`${item.label}-${index}`} 
          className="flex justify-between"
        >
          <span>{item.label}</span>
          <span className="font-medium">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}