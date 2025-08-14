import React, { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// 人間向け数値・グラフ表示データ
export interface SaaSMetricsData {
  name: string
  status: '🟢' | '🟡' | '🔴'
  currentValue: number
  values: number[]        // 時系列数値
  unit: string           // '%', 'K', '円' など
  trend: string          // "↗️ +2.3%" のような文字説明
  sparkline?: number[]   // ミニグラフ用データ
}

interface MetricsGridProps {
  data: SaaSMetricsData[]
  metric: string
  onMetricChange?: (metric: string) => void
  onTimeFrameChange?: (timeFrame: string) => void
  metricOptions?: string[]
  timeFrameOptions?: string[]
  className?: string
}

const DEFAULT_METRIC_OPTIONS = ['MRR', 'DAU', 'CVR']
const DEFAULT_TIMEFRAME_OPTIONS = ['1h', '1日', '1週']

export function MetricsGrid({ 
  data, 
  metric,
  onMetricChange,
  onTimeFrameChange,
  metricOptions = DEFAULT_METRIC_OPTIONS,
  timeFrameOptions = DEFAULT_TIMEFRAME_OPTIONS,
  className
}: MetricsGridProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const hours = Array.from({ length: 7 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`)
  
  return (
    <div className={cn("bg-white rounded-lg shadow", className)}>
      <MetricsHeader
        metric={metric}
        metricOptions={metricOptions}
        timeFrameOptions={timeFrameOptions}
        viewMode={viewMode}
        onMetricChange={onMetricChange}
        onTimeFrameChange={onTimeFrameChange}
        onViewModeChange={setViewMode}
      />
      
      {viewMode === 'table' ? (
        <MetricsTable data={data} metric={metric} hours={hours} />
      ) : (
        <MetricsCards data={data} metric={metric} />
      )}
    </div>
  )
}

function MetricsHeader({
  metric,
  metricOptions,
  timeFrameOptions,
  viewMode,
  onMetricChange,
  onTimeFrameChange,
  onViewModeChange
}: {
  metric: string
  metricOptions: string[]
  timeFrameOptions: string[]
  viewMode: 'table' | 'cards'
  onMetricChange?: (metric: string) => void
  onTimeFrameChange?: (timeFrame: string) => void
  onViewModeChange: (mode: 'table' | 'cards') => void
}) {
  return (
    <div className="p-6 border-b">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          メトリクス分析
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            📋 テーブル
          </button>
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            📊 カード
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <MetricsSelect
          label="メトリクス"
          value={metric}
          options={metricOptions}
          onChange={onMetricChange}
        />
        
        <MetricsSelect
          label="時間足"
          options={timeFrameOptions}
          onChange={onTimeFrameChange}
        />
      </div>
    </div>
  )
}

function MetricsSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string
  value?: string
  options: string[]
  onChange?: (value: string) => void
}) {
  return (
    <>
      <label className="text-sm font-medium text-gray-700">{label}:</label>
      <select 
        className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={label}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </>
  )
}

function MetricsTable({
  data,
  metric,
  hours
}: {
  data: SaaSMetricsData[]
  metric: string
  hours: string[]
}) {
  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-2 text-gray-600 font-medium min-w-[120px]">
              SaaS
            </th>
            <th className="text-right pb-2 text-gray-600 font-medium min-w-[80px]">
              現在値
            </th>
            <th className="text-center pb-2 text-gray-600 font-medium min-w-[100px]">
              トレンド
            </th>
            {hours.map(hour => (
              <th key={hour} className="text-center pb-2 text-gray-600 font-normal min-w-[60px]">
                {hour}
              </th>
            ))}
            <th className="text-center pb-2 text-gray-600 font-medium min-w-[80px]">
              ミニグラフ
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((saas, index) => (
            <SaaSMetricsRow 
              key={`${saas.name}-${index}`} 
              saas={saas} 
              hours={hours}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SaaSMetricsRow({ 
  saas, 
  hours 
}: { 
  saas: SaaSMetricsData
  hours: string[] 
}) {
  const getStatusBg = (status: string) => {
    switch (status) {
      case '🟢': return 'bg-green-50'
      case '🟡': return 'bg-yellow-50'
      case '🔴': return 'bg-red-50'
      default: return ''
    }
  }
  
  return (
    <tr className={cn("border-b hover:bg-gray-50", getStatusBg(saas.status))}>
      <td className="py-3 font-medium">
        <div className="flex items-center space-x-2">
          <span>{saas.status}</span>
          <span>{saas.name}</span>
        </div>
      </td>
      <td className="py-3 text-right font-mono font-bold">
        {saas.currentValue.toLocaleString()}{saas.unit}
      </td>
      <td className="py-3 text-center">
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {saas.trend}
        </span>
      </td>
      {saas.values.map((value, i) => (
        <td key={i} className="py-3 text-center font-mono text-sm">
          {value.toLocaleString()}
        </td>
      ))}
      <td className="py-3 text-center">
        <Sparkline values={saas.sparkline || saas.values} />
      </td>
    </tr>
  )
}

function MetricsCards({
  data,
  metric
}: {
  data: SaaSMetricsData[]
  metric: string
}) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((saas, index) => (
        <MetricsCard key={`${saas.name}-${index}`} saas={saas} />
      ))}
    </div>
  )
}

function MetricsCard({ saas }: { saas: SaaSMetricsData }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '🟢': return 'border-green-200 bg-green-50'
      case '🟡': return 'border-yellow-200 bg-yellow-50'
      case '🔴': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }
  
  return (
    <div className={cn("border rounded-lg p-4", getStatusColor(saas.status))}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span>{saas.status}</span>
          <span className="font-medium">{saas.name}</span>
        </div>
        <span className="text-sm text-gray-500">{saas.trend}</span>
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold font-mono">
          {saas.currentValue.toLocaleString()}{saas.unit}
        </div>
      </div>
      
      <div className="h-12">
        <Sparkline values={saas.sparkline || saas.values} />
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        最小: {Math.min(...saas.values).toLocaleString()}{saas.unit} | 
        最大: {Math.max(...saas.values).toLocaleString()}{saas.unit}
      </div>
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (!values || values.length === 0) return <div className="w-full h-8 bg-gray-100 rounded" />
  
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  
  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  const trendColor = values[values.length - 1] > values[0] ? '#10b981' : '#ef4444'
  
  return (
    <div className="w-full h-full flex items-center">
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          points={points}
        />
        {/* 最新値のポイント */}
        <circle
          cx={values.length > 1 ? ((values.length - 1) / (values.length - 1)) * 100 : 50}
          cy={values.length > 0 ? 100 - ((values[values.length - 1] - min) / range) * 100 : 50}
          r="2"
          fill={trendColor}
        />
      </svg>
    </div>
  )
}