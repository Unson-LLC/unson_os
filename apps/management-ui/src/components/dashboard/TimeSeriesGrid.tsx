import React from 'react'
import { cn } from '@/lib/utils'

export interface TimeSeriesData {
  time: string
  mrr: number
  delta: number
  symbol: string
  dau: number
  dauDelta: number
  dauSymbol: string
  cvr: number
}

interface TimeSeriesGridProps {
  data: TimeSeriesData[]
  selectedSaaS: string
  onSaaSChange?: (saas: string) => void
  onExport?: () => void
  saasOptions?: string[]
  timeFrameOptions?: string[]
  periodOptions?: string[]
  className?: string
}

const DEFAULT_SAAS_OPTIONS = ['猫カフェ予約', '家計簿アプリ', '英会話マッチ', 'ペット管理']
const DEFAULT_TIMEFRAME_OPTIONS = ['5分', '1時間', '1日']
const DEFAULT_PERIOD_OPTIONS = ['今日', '昨日', '今週']

const SYMBOL_STYLES = {
  '⬆️': { bg: 'bg-green-100', text: 'text-green-700', label: '急上昇' },
  '↗️': { bg: 'bg-green-50', text: 'text-green-600', label: '上昇' },
  '→': { bg: '', text: 'text-gray-500', label: '横ばい' },
  '↘️': { bg: 'bg-orange-50', text: 'text-orange-600', label: '下降' },
  '⬇️': { bg: 'bg-red-100', text: 'text-red-700', label: '急降下' },
} as const

export function TimeSeriesGrid({ 
  data, 
  selectedSaaS,
  onSaaSChange,
  onExport,
  saasOptions = DEFAULT_SAAS_OPTIONS,
  timeFrameOptions = DEFAULT_TIMEFRAME_OPTIONS,
  periodOptions = DEFAULT_PERIOD_OPTIONS,
  className
}: TimeSeriesGridProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow", className)}>
      <GridHeader 
        selectedSaaS={selectedSaaS}
        saasOptions={saasOptions}
        timeFrameOptions={timeFrameOptions}
        periodOptions={periodOptions}
        onSaaSChange={onSaaSChange}
        onExport={onExport}
      />
      
      <GridTable 
        data={data}
        selectedSaaS={selectedSaaS}
      />
    </div>
  )
}

function GridHeader({
  selectedSaaS,
  saasOptions,
  timeFrameOptions,
  periodOptions,
  onSaaSChange,
  onExport
}: {
  selectedSaaS: string
  saasOptions: string[]
  timeFrameOptions: string[]
  periodOptions: string[]
  onSaaSChange?: (saas: string) => void
  onExport?: () => void
}) {
  return (
    <div className="p-6 border-b">
      <h2 className="text-lg font-semibold mb-4">
        時系列グリッド - {selectedSaaS}
      </h2>
      
      <div className="flex items-center space-x-4">
        <FilterSelect
          label="SaaS選択"
          value={selectedSaaS}
          options={saasOptions}
          onChange={onSaaSChange}
        />
        
        <FilterSelect
          label="時間足"
          options={timeFrameOptions}
        />
        
        <FilterSelect
          label="期間"
          options={periodOptions}
        />
        
        <button 
          className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          onClick={onExport}
        >
          エクスポート
        </button>
      </div>
    </div>
  )
}

function FilterSelect({
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
  )
}

function GridTable({
  data,
  selectedSaaS
}: {
  data: TimeSeriesData[]
  selectedSaaS: string
}) {
  return (
    <div className="overflow-x-auto">
      <table 
        className="w-full text-sm"
        aria-label={`${selectedSaaS}の時系列データ`}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">MRR</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Δ</th>
            <th className="px-4 py-2 text-center font-medium text-gray-700">記号</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">DAU</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Δ</th>
            <th className="px-4 py-2 text-center font-medium text-gray-700">記号</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">CVR</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <DataRow key={`${row.time}-${index}`} data={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DataRow({ data }: { data: TimeSeriesData }) {
  const isDanger = data.symbol === '⬇️'
  const symbolStyle = SYMBOL_STYLES[data.symbol as keyof typeof SYMBOL_STYLES]
  
  return (
    <tr className={cn(
      "border-b transition-colors",
      isDanger ? 'bg-red-50' : 'hover:bg-gray-50'
    )}>
      <td className="px-4 py-2 font-mono">{data.time}</td>
      <td className="px-4 py-2 text-right font-mono">
        <span className={cn(isDanger && symbolStyle?.bg, "px-1")}>
          ¥{data.mrr.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {data.delta.toLocaleString()}
      </td>
      <td 
        className="px-4 py-2 text-center text-lg"
        aria-label={symbolStyle?.label}
      >
        <span className={cn(symbolStyle?.bg, symbolStyle?.text, "px-1 rounded")}>
          {data.symbol}
        </span>
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {data.dau}
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {data.dauDelta > 0 ? '+' : ''}{data.dauDelta}
      </td>
      <td className="px-4 py-2 text-center text-lg">
        {data.dauSymbol}
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {data.cvr}%
      </td>
    </tr>
  )
}