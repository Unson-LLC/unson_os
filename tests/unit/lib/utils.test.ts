import { cn, formatCurrency, formatNumber, sleep } from '@/lib/utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle Tailwind conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })

  describe('formatCurrency function', () => {
    it('should format currency without decimals for whole numbers', () => {
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(50000)).toBe('$50,000')
      expect(formatCurrency(1250000)).toBe('$1,250,000')
    })

    it('should handle zero and negative numbers', () => {
      expect(formatCurrency(0)).toBe('$0')
      expect(formatCurrency(-1000)).toBe('-$1,000')
    })

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1000.50)).toBe('$1,001')
      expect(formatCurrency(999.99)).toBe('$1,000')
    })
  })

  describe('formatNumber function', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(999)).toBe('999')
    })
  })

  describe('sleep function', () => {
    it('should resolve after specified milliseconds', async () => {
      const start = Date.now()
      await sleep(100)
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(95) // 多少の誤差を許容
      expect(elapsed).toBeLessThan(150)
    })
  })
})