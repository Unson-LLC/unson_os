'use client'

import { useState } from 'react'

interface AccordionItem {
  id?: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenItems?: string[]
}

export function Accordion({ items, allowMultiple = false, defaultOpenItems = [] }: AccordionProps) {
  // idがない場合は自動生成
  const processedItems = items.map((item, index) => ({
    ...item,
    id: item.id || `accordion-item-${index}`
  }))
  
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems)

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className="space-y-2">
      {processedItems.map((item) => {
        const isOpen = openItems.includes(item.id!)
        
        return (
          <div key={item.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(item.id!)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`transition-all duration-300 overflow-hidden ${
              isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-4 pt-2 text-gray-600 border-t border-gray-100">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}