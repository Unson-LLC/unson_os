'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

interface PostHogAnalyticsProps {
  serviceName: string;
}

export default function PostHogAnalytics({ serviceName }: PostHogAnalyticsProps) {
  useEffect(() => {
    if (posthog && typeof window !== 'undefined') {
      posthog.register({
        service_name: serviceName,
      });
    }
  }, [serviceName]);

  return null;
}

export const useAnalytics = () => {

  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.capture(eventName, properties);
      }
    },
    trackFormSubmission: (formType: string = 'contact') => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.capture('form_submitted', {
          form_type: formType,
          timestamp: new Date().toISOString(),
        });
      }
    },
    trackCTAClick: (ctaLabel: string) => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.capture('cta_clicked', {
          cta_label: ctaLabel,
          timestamp: new Date().toISOString(),
        });
      }
    },
    trackScrollDepth: (depth: number) => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.capture('scroll_depth', {
          depth_percentage: depth,
          timestamp: new Date().toISOString(),
        });
      }
    },
    identifyUser: (userId: string, properties?: Record<string, any>) => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.identify(userId, properties);
      }
    },
    setUserProperties: (properties: Record<string, any>) => {
      if (typeof window !== 'undefined' && posthog) {
        posthog.setPersonProperties(properties);
      }
    },
  };
};