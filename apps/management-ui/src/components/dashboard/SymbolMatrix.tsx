import React from 'react'
import { cn } from '@/lib/utils'

export interface SaaSSymbolData {
  name: string
  status: '🟢' | '🟡' | '🔴'
  symbols: string[]
}

interface SymbolMatrixProps {
  data: SaaSSymbolData[]
  metric: string
  onMetricChange?: (metric: string) => void
  onTimeFrameChange?: (timeFrame: string) => void
  metricOptions?: string[]
  timeFrameOptions?: string[]
  className?: string
}

const DEFAULT_METRIC_OPTIONS = ['MRR', 'DAU', 'CVR']
const DEFAULT_TIMEFRAME_OPTIONS = ['1h', '5分', '1日']

const SYMBOL_STYLES = {
  '⬆️': { bg: 'bg-green-100', text: 'text-green-700', title: '急上昇' },
  '↗️': { bg: 'bg-green-50', text: 'text-green-600', title: '上昇' },
  '→': { bg: '', text: 'text-gray-500', title: '横ばい' },
  '↘️': { bg: 'bg-orange-50', text: 'text-orange-600', title: '下降' },
  '⬇️': { bg: 'bg-red-100', text: 'text-red-700', title: '急降下' },
} as const

const STATUS_STYLES = {
  '🟢': 'bg-green-50',
  '🟡': 'bg-yellow-50',
  '🔴': 'bg-red-50',
} as const

export function SymbolMatrix({ 
  data, 
  metric,
  onMetricChange,
  onTimeFrameChange,
  metricOptions = DEFAULT_METRIC_OPTIONS,
  timeFrameOptions = DEFAULT_TIMEFRAME_OPTIONS,
  className
}: SymbolMatrixProps) {
  const hours = Array.from({ length: 16 }, (_, i) => String(i).padStart(2, '0'))
  
  return (
    <div className={cn("bg-white rounded-lg shadow", className)}>
      <MatrixHeader
        metric={metric}
        metricOptions={metricOptions}
        timeFrameOptions={timeFrameOptions}
        onMetricChange={onMetricChange}
        onTimeFrameChange={onTimeFrameChange}
      />
      
      <MatrixTable
        data={data}
        metric={metric}
        hours={hours}
      />
    </div>
  )
}

function MatrixHeader({
  metric,
  metricOptions,
  timeFrameOptions,
  onMetricChange,
  onTimeFrameChange
}: {
  metric: string
  metricOptions: string[]
  timeFrameOptions: string[]
  onMetricChange?: (metric: string) => void
  onTimeFrameChange?: (timeFrame: string) => void
}) {
  return (
    <div className="p-6 border-b">
      <h2 className="text-lg font-semibold mb-4">記号マトリックス</h2>
      
      <div className="flex items-center space-x-4">
        <MatrixSelect
          label="メトリクス"
          value={metric}
          options={metricOptions}
          onChange={onMetricChange}
        />
        
        <MatrixSelect
          label="時間足"
          options={timeFrameOptions}
          onChange={onTimeFrameChange}
        />
      </div>
    </div>
  )
}

function MatrixSelect({
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

function MatrixTable({
  data,
  metric,
  hours
}: {
  data: SaaSSymbolData[]
  metric: string
  hours: string[]
}) {
  return (
    <div className="p-6 overflow-x-auto">
      <table 
        className="w-full text-sm font-mono"
        aria-label={`${metric}の記号マトリックス`}
      >
        <thead>
          <tr>
            <th className="text-right pr-4 pb-2 text-gray-600 font-medium">
              時間
            </th>
            {hours.map(hour => (
              <th key={hour} className="px-1 pb-2 text-center text-gray-600 font-normal">
                {hour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((saas, index) => (
            <SaaSRow 
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

function SaaSRow({ 
  saas, 
  hours 
}: { 
  saas: SaaSSymbolData
  hours: string[] 
}) {
  const rowClass = STATUS_STYLES[saas.status] || ''
  
  return (
    <tr className={cn("border-b", rowClass)}>
      <td className="text-right pr-4 py-1 whitespace-nowrap font-medium">
        {saas.status}{saas.name}
      </td>
      {saas.symbols.map((symbol, i) => (
        <SymbolCell 
          key={i} 
          symbol={symbol} 
          hour={hours[i]}
        />
      ))}
    </tr>
  )
}

function SymbolCell({ 
  symbol, 
  hour 
}: { 
  symbol: string
  hour: string 
}) {
  const style = SYMBOL_STYLES[symbol as keyof typeof SYMBOL_STYLES] || SYMBOL_STYLES['→']
  
  return (
    <td className="px-1 py-1 text-center">
      <span 
        className={cn(
          "inline-block px-1 rounded transition-colors hover:opacity-80",
          style.bg,
          style.text
        )}
        title={`${hour}時: ${style.title}`}
      >
        {symbol}
      </span>
    </td>
  )
}