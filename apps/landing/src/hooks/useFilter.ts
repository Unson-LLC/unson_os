import { useState, useMemo } from 'react'

interface UseFilterProps<T> {
  items: T[]
  filterField: keyof T
  defaultFilter?: string
}

export function useFilter<T>({ items, filterField, defaultFilter = 'すべて' }: UseFilterProps<T>) {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter)

  const filters = useMemo(() => {
    const uniqueValues = new Set<string>()
    
    items.forEach(item => {
      const value = item[filterField]
      if (typeof value === 'string') {
        uniqueValues.add(value)
      }
    })

    return [defaultFilter, ...Array.from(uniqueValues)]
  }, [items, filterField, defaultFilter])

  const filteredItems = useMemo(() => {
    if (selectedFilter === defaultFilter) return items

    return items.filter(item => {
      const value = item[filterField]
      return value === selectedFilter
    })
  }, [items, filterField, selectedFilter, defaultFilter])

  return {
    filters,
    selectedFilter,
    setSelectedFilter,
    filteredItems
  }
}