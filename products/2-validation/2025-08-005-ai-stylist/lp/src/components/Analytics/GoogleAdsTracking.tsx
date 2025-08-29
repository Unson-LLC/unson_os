import Script from 'next/script';

interface GoogleAdsTrackingProps {
  adsId?: string;
}

export default function GoogleAdsTracking({ 
  adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID 
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
  conversionLabel?: string, 
  value?: number, 
  currency: string = 'JPY'
) => {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = conversionLabel || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  
  if (typeof window !== 'undefined' && (window as any).gtag && adsId && label) {
    (window as any).gtag('event', 'conversion', {
      'send_to': `${adsId}/${label}`,
      'value': value || 0, // βテスト申し込みは無料
      'currency': currency,
    });
    console.log('Google Ads コンバージョン送信:', `${adsId}/${label}`);
  }
};

// フォーム送信専用コンバージョン
export const trackFormConversion = (serviceName: string = 'ai-stylist') => {
  trackGoogleAdsConversion(
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
    0, // βテスト申し込みは無料
    'JPY'
  );
};