import GoogleAnalytics from './GoogleAnalytics';
import GoogleAdsTracking from './GoogleAdsTracking';
import PostHogAnalytics from './PostHogAnalytics';

interface AnalyticsProps {
  serviceName: string;
  config?: {
    googleAnalytics?: string;
    googleAdsId?: string;
    googleAdsConversionLabel?: string;
    postHogKey?: string;
    postHogHost?: string;
  };
}

export default function Analytics({ 
  serviceName,
  config
}: AnalyticsProps) {
  return (
    <>
      {config?.googleAnalytics && (
        <GoogleAnalytics measurementId={config.googleAnalytics} />
      )}
      {config?.googleAdsId && (
        <GoogleAdsTracking adsId={config.googleAdsId} />
      )}
      {config?.postHogKey && (
        <PostHogAnalytics serviceName={serviceName} />
      )}
    </>
  );
}

// カスタムイベント追跡用のヘルパー関数
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// フォーム送信イベント
export const trackFormSubmission = (serviceName: string, formType: string = 'contact') => {
  trackEvent('form_submission', 'engagement', `${serviceName}_${formType}`);
};

// CTAクリックイベント
export const trackCTAClick = (serviceName: string, ctaLabel: string) => {
  trackEvent('cta_click', 'engagement', `${serviceName}_${ctaLabel}`);
};