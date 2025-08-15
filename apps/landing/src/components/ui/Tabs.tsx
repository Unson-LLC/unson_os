'use client'

import { useState } from 'react'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  items: TabItem[]
  defaultActiveTab?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

export function Tabs({ 
  items, 
  defaultActiveTab, 
  variant = 'default',
  size = 'md' 
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id)

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const getTabClasses = (item: TabItem) => {
    const baseClasses = `${sizeClasses[size]} font-medium transition-colors cursor-pointer`
    const isActive = activeTab === item.id
    const isDisabled = item.disabled

    if (isDisabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-lg ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`
      
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900'
        }`
      
      default:
        return `${baseClasses} border border-gray-300 ${
          isActive 
            ? 'bg-white text-blue-600 border-blue-600' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`
    }
  }

  const getContainerClasses = () => {
    switch (variant) {
      case 'pills':
        return 'flex flex-wrap gap-2'
      case 'underline':
        return 'flex border-b border-gray-200'
      default:
        return 'flex border-b border-gray-300'
    }
  }

  const activeContent = items.find(item => item.id === activeTab)?.content

  return (
    <div className="w-full">
      {/* タブヘッダー */}
      <div className={getContainerClasses()}>
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setActiveTab(item.id)}
            className={`${getTabClasses(item)} ${
              variant === 'default' && index === 0 ? 'rounded-l-lg' : ''
            } ${
              variant === 'default' && index === items.length - 1 ? 'rounded-r-lg' : ''
            }`}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  )
}

// 垂直タブ用のコンポーネント
interface VerticalTabsProps {
  items: TabItem[]
  defaultActiveTab?: string
  width?: string
}

export function VerticalTabs({ 
  items, 
  defaultActiveTab,
  width = '200px'
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id)

  const activeContent = items.find(item => item.id === activeTab)?.content

  return (
    <div className="flex">
      {/* サイドバータブ */}
      <div className="flex flex-col border-r border-gray-200" style={{ width }}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setActiveTab(item.id)}
            className={`px-4 py-3 text-left transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            } ${
              item.disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 p-6">
        {activeContent}
      </div>
    </div>
  )
}