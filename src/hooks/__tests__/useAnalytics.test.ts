import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '../useAnalytics'

// Google Analytics のモック
const mockGtag = jest.fn()
declare global {
  var gtag: any
}
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
      result.current.trackEvent({
        event: 'button_click',
        category: 'engagement',
        label: 'cta_primary'
      })
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
      event_category: 'engagement',
      event_label: 'cta_primary',
      value: undefined,
      user_id: undefined
    })
  })

  it('should track page views', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackPageView('/dao', 'DAO Page')
    })
    
    expect(mockGtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
      page_title: 'DAO Page',
      page_location: expect.any(String)
    })
  })

  it('should track waitlist signup', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackWaitlistSignup('test@example.com')
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'waitlist_signup', {
      event_category: 'engagement',
      event_label: 'waitlist_form',
      value: undefined,
      user_id: 'test@example.com'
    })
  })

  it('should track contact form submission', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackContactForm('support')
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'contact_form_submit', {
      event_category: 'engagement',
      event_label: 'support',
      value: undefined,
      user_id: undefined
    })
  })

  it('should not track when gtag is not available', () => {
    // gtagを一時的に削除
    const originalGtag = window.gtag
    delete (window as any).gtag
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackEvent({ event: 'no_gtag_test' })
    })
    
    expect(mockGtag).not.toHaveBeenCalled()
    
    // gtagを復元
    window.gtag = originalGtag
  })
})