// Refactor Phase: フィルターボタンを再利用可能なコンポーネントに抽出
import React from 'react'
import { Button } from '@/components/ui/Button'

interface FilterButtonsProps {
  filters: string[]
  selectedFilter: string
  onFilterChange: (filter: string) => void
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function FilterButtons({
  filters,
  selectedFilter,
  onFilterChange,
  className = 'flex flex-wrap gap-3 justify-center',
  size = 'sm'
}: FilterButtonsProps) {
  return (
    <div className={className}>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={filter === selectedFilter ? 'default' : 'outline'}
          size={size}
          className="min-w-fit"
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  )
}