'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

interface PostHogAnalyticsProps {
  serviceName: string;
}

export default function PostHogAnalytics({ serviceName }: PostHogAnalyticsProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.register({
        service_name: serviceName,
      });
    }
  }, [posthog, serviceName]);

  return null;
}

export const useAnalytics = () => {
  const posthog = usePostHog();

  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      posthog?.capture(eventName, properties);
    },
    trackFormSubmission: (formType: string = 'contact') => {
      posthog?.capture('form_submitted', {
        form_type: formType,
        timestamp: new Date().toISOString(),
      });
    },
    trackCTAClick: (ctaLabel: string) => {
      posthog?.capture('cta_clicked', {
        cta_label: ctaLabel,
        timestamp: new Date().toISOString(),
      });
    },
    trackScrollDepth: (depth: number) => {
      posthog?.capture('scroll_depth', {
        depth_percentage: depth,
        timestamp: new Date().toISOString(),
      });
    },
    identifyUser: (userId: string, properties?: Record<string, any>) => {
      posthog?.identify(userId, properties);
    },
    setUserProperties: (properties: Record<string, any>) => {
      posthog?.setPersonProperties(properties);
    },
  };
};