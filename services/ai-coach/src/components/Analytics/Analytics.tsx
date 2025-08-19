import GoogleAnalytics from './GoogleAnalytics';
import ClarityScript from './ClarityScript';

interface AnalyticsProps {
  serviceName: string;
  ga4MeasurementId?: string;
  clarityProjectId?: string;
}

export default function Analytics({ 
  serviceName,
  ga4MeasurementId,
  clarityProjectId 
}: AnalyticsProps) {
  return (
    <>
      <GoogleAnalytics measurementId={ga4MeasurementId} />
      <ClarityScript projectId={clarityProjectId} />
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

// スクロール深度イベント
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll', 'engagement', `scroll_${depth}`, depth);
};