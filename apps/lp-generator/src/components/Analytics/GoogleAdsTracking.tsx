import Script from 'next/script';

interface GoogleAdsTrackingProps {
  adsId?: string;
}

export default function GoogleAdsTracking({ 
  adsId 
}: GoogleAdsTrackingProps) {
  // 開発環境では無効化
  if (process.env.NODE_ENV === 'development' || !adsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${adsId}');
          `,
        }}
      />
    </>
  );
}

// Google Ads コンバージョン送信関数
export const trackGoogleAdsConversion = (
  adsId: string,
  conversionLabel: string, 
  value?: number, 
  currency: string = 'JPY'
) => {
  if (typeof window !== 'undefined' && (window as any).gtag && adsId && conversionLabel) {
    (window as any).gtag('event', 'conversion', {
      'send_to': `${adsId}/${conversionLabel}`,
      'value': value || 0,
      'currency': currency,
    });
    console.log('Google Ads コンバージョン送信:', `${adsId}/${conversionLabel}`);
  }
};

// フォーム送信専用コンバージョン
export const trackFormConversion = (
  adsId?: string,
  conversionLabel?: string,
  serviceName?: string
) => {
  if (adsId && conversionLabel) {
    trackGoogleAdsConversion(adsId, conversionLabel, 0, 'JPY');
  }
};