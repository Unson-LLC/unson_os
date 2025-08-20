import { useState, useMemo } from 'react'

interface UseSearchProps<T> {
  items: T[]
  searchFields: (keyof T)[]
}

export function useSearch<T>({ items, searchFields }: UseSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items

    const lowerSearchTerm = searchTerm.toLowerCase()
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearchTerm)
        }
        return false
      })
    )
  }, [items, searchFields, searchTerm])

  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  }
}