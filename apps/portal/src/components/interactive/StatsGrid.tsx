// Refactor Phase: 統計表示を再利用可能なコンポーネントに抽出
import React from 'react'

export interface StatItem {
  label: string
  value: string | number
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'yellow'
  icon?: string
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: number
  className?: string
}

export function StatsGrid({ 
  stats, 
  columns = 4, 
  className = 'grid gap-8 text-center' 
}: StatsGridProps) {
  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600', 
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  }

  const gridClass = `${className} ${
    columns === 2 ? 'md:grid-cols-2' :
    columns === 3 ? 'md:grid-cols-3' :
    columns === 4 ? 'md:grid-cols-4' :
    columns === 5 ? 'md:grid-cols-5' :
    `md:grid-cols-${columns}`
  }`

  return (
    <div className={gridClass}>
      {stats.map((stat, index) => (
        <div key={index} className="animate-fade-in">
          <div className={`text-3xl font-bold mb-2 ${stat.color ? colorClasses[stat.color] : 'text-gray-900'}`}>
            {stat.icon && <span className="mr-2">{stat.icon}</span>}
            {stat.value}
          </div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}