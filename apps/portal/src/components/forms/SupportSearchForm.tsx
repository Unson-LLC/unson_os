'use client'

import { Button } from '../ui/Button'

export function SupportSearchForm() {
  return (
    <form className="flex gap-2" onSubmit={(e) => {
      e.preventDefault()
      alert('検索機能は近日実装予定です')
    }}>
      <input
        type="text"
        placeholder="FAQを検索..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Button type="submit">検索</Button>
    </form>
  )
}