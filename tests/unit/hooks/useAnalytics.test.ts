import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '@/hooks/useAnalytics'

// Google Analytics のモック
const mockGtag = jest.fn()
global.gtag = mockGtag

describe('useAnalytics hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGtag.mockClear()
    // テスト用にGA IDを設定
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123'
    
    // windowオブジェクトにgtagを設定
    Object.defineProperty(window, 'gtag', {
      value: mockGtag,
      writable: true,
    })
  })

  it('should track events with correct parameters', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('button_click', {
        button_name: 'cta_primary',
        page: 'home',
      })
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
      button_name: 'cta_primary',
      page: 'home',
    })
  })

  it('should track page views', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackPageView('/dao')
    })
    
    expect(mockGtag).toHaveBeenCalledWith('config', expect.any(String), {
      page_path: '/dao',
    })
  })

  it('should track conversion events', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackConversion('waitlist_signup', {
        value: 1,
        currency: 'USD',
      })
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'waitlist_signup',
      value: 1,
      currency: 'USD',
    })
  })

  it('should not track when analytics is disabled', () => {
    // 環境変数でアナリティクスを無効化
    const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('test_event', {})
    })
    
    expect(mockGtag).not.toHaveBeenCalled()
    
    // 環境変数を復元
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv
  })

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockGtag.mockImplementation(() => {
      throw new Error('Analytics error')
    })
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('error_test', {})
    })
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Analytics tracking error:',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })

  it('should not track when gtag is not available', () => {
    // gtagを一時的に削除
    const originalGtag = window.gtag
    delete (window as any).gtag
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('no_gtag_test', {})
    })
    
    expect(mockGtag).not.toHaveBeenCalled()
    
    // gtagを復元
    window.gtag = originalGtag
  })
})