'use client'

import { useEffect, useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface ClientOnlyIconProps {
  icon: LucideIcon
  className?: string
}

export function ClientOnlyIcon({ icon: Icon, className }: ClientOnlyIconProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`${className} animate-pulse bg-gray-200 rounded`} />
  }

  return <Icon className={className} />
}