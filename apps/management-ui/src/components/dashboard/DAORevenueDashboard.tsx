import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface Contributor {
  name: string
  points: number
  amount: number
}

interface DAORevenueData {
  totalRevenue: number
  operatingCost: number
  daoPool: number
  treasury: number
  treasuryChange: number
  contributors: Contributor[]
}

interface DAORevenueDashboardProps {
  data: DAORevenueData
  onDetailClick?: () => void
  onContributorClick?: (name: string) => void
}

export function DAORevenueDashboard({ 
  data,
  onDetailClick,
  onContributorClick
}: DAORevenueDashboardProps) {
  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`
  
  // 円グラフ用データ
  const pieData = [
    { name: '運営費', value: data.operatingCost, color: '#3B82F6' },
    { name: 'DAOプール', value: data.daoPool, color: '#10B981' },
  ]
  
  // 棒グラフ用データ
  const barData = data.contributors.map(c => ({
    name: c.name.replace('@', ''),
    points: c.points,
    amount: c.amount
  }))
  
  const renderRevenueBreakdown = () => (
    <div className="space-y-2 text-sm">
      <RevenueItem label="総売上:" amount={data.totalRevenue} isBold />
      <div className="ml-4">
        <RevenueItem label="├─ 運営費(60%):" amount={data.operatingCost} />
        <RevenueItem label="└─ DAOプール(40%):" amount={data.daoPool} />
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center">
          <span>DAOトレジャリー:</span>
          <span className="ml-2 font-bold">{formatCurrency(data.treasury)}</span>
          <TrendIndicator value={data.treasuryChange} />
        </div>
      </div>
    </div>
  )
  
  const renderContributorList = () => (
    <div className="space-y-2 text-sm">
      {data.contributors.map((contributor, index) => (
        <ContributorRow
          key={contributor.name}
          rank={index + 1}
          contributor={contributor}
          onNameClick={() => onContributorClick?.(contributor.name)}
        />
      ))}
    </div>
  )
  
  return (
    <div className="bg-white rounded-lg shadow" role="region" aria-label="収益分配">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">💰 収益分配ダッシュボード</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueSection 
            title="今月の収益分配:"
            content={renderRevenueBreakdown()}
            onDetailClick={onDetailClick}
          />
          
          <ContributorSection
            title="🏆 貢献度TOP5:"
            content={renderContributorList()}
          />
        </div>
        
        <ChartSection data={data} />
      </div>
    </div>
  )
}

// 分離したコンポーネント
function RevenueItem({ 
  label, 
  amount, 
  isBold = false 
}: { 
  label: string
  amount: number
  isBold?: boolean 
}) {
  return (
    <div className="flex items-center">
      <span>{label}</span>
      <span className={`ml-2 ${isBold ? 'font-bold' : ''}`}>
        ¥{amount.toLocaleString()}
      </span>
    </div>
  )
}

function TrendIndicator({ value }: { value: number }) {
  return (
    <span className="ml-2 text-green-600">
      ↗️+{value}%
    </span>
  )
}

function ContributorRow({ 
  rank,
  contributor,
  onNameClick
}: {
  rank: number
  contributor: Contributor
  onNameClick: () => void
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span>{rank}.</span>
        <button 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={onNameClick}
        >
          {contributor.name}
        </button>
        <span className="text-gray-500">
          ({contributor.points.toLocaleString()} pts)
        </span>
      </div>
      <span className="font-medium">
        → ¥{contributor.amount.toLocaleString()}
      </span>
    </div>
  )
}

function RevenueSection({ 
  title,
  content,
  onDetailClick
}: {
  title: string
  content: React.ReactNode
  onDetailClick?: () => void
}) {
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      {content}
      {onDetailClick && (
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onDetailClick}
        >
          詳細を見る
        </button>
      )}
    </div>
  )
}

function ContributorSection({ 
  title,
  content
}: {
  title: string
  content: React.ReactNode
}) {
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      {content}
    </div>
  )
}

function ChartSection({ data }: { data: DAORevenueData }) {
  const pieData = [
    { name: '運営費(60%)', value: data.operatingCost, color: '#3B82F6' },
    { name: 'DAOプール(40%)', value: data.daoPool, color: '#10B981' },
  ]
  
  const barData = data.contributors.map(c => ({
    name: c.name.replace('@', '').replace('_', ' '),
    points: c.points,
    amount: c.amount / 1000 // 千円単位で表示
  }))
  
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 収益分配円グラフ */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2 text-center">収益分配</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* 貢献度棒グラフ */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2 text-center">貢献度TOP5 (千円)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              fontSize={10}
            />
            <YAxis fontSize={10} />
            <Tooltip 
              formatter={(value: number) => `¥${(value * 1000).toLocaleString()}`}
              labelFormatter={(label) => `@${label}`}
            />
            <Bar dataKey="amount" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}