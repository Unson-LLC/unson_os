import { useCallback } from 'react'

interface AnalyticsEvent {
  event: string
  category?: string
  label?: string
  value?: number
  userId?: string
}

export function useAnalytics() {
  const trackEvent = useCallback((eventData: AnalyticsEvent) => {
    // 本番環境では実際のアナリティクスサービス（GA4、Mixpanel等）に送信
    if (typeof window !== 'undefined') {
      console.log('Analytics Event:', eventData)
      
      // Google Analytics 4の例
      if (window.gtag) {
        window.gtag('event', eventData.event, {
          event_category: eventData.category,
          event_label: eventData.label,
          value: eventData.value,
          user_id: eventData.userId
        })
      }
    }
  }, [])

  const trackPageView = useCallback((page: string, title?: string) => {
    if (typeof window !== 'undefined') {
      console.log('Page View:', { page, title })
      
      if (window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: title,
          page_location: window.location.href
        })
      }
    }
  }, [])

  const trackWaitlistSignup = useCallback((email: string) => {
    trackEvent({
      event: 'waitlist_signup',
      category: 'engagement',
      label: 'waitlist_form',
      userId: email
    })
  }, [trackEvent])

  const trackContactForm = useCallback((formType: string) => {
    trackEvent({
      event: 'contact_form_submit',
      category: 'engagement',
      label: formType
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackWaitlistSignup,
    trackContactForm
  }
}

// Global gtag type declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}