import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navigateTo = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const isCurrentPath = useCallback((path: string) => {
    return pathname === path
  }, [pathname])

  const isPathActive = useCallback((path: string) => {
    return pathname.startsWith(path)
  }, [pathname])

  return {
    navigateTo,
    isCurrentPath,
    isPathActive,
    currentPath: pathname,
    router
  }
}