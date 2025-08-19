import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ 
  measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID 
}: GoogleAnalyticsProps) {
  // 開発環境では無効化
  if (process.env.NODE_ENV === 'development' || !measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}