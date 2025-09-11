export interface PostHogConfig {
  projectApiKey: string;
  posthogHost?: string;
  googleAdsId?: string;
  googleAdsConversionLabel?: string;
  ga4MeasurementId?: string;
  enableSessionRecording?: boolean;
  enableHeatmaps?: boolean;
  enableSurveys?: boolean;
}

export const defaultPostHogConfig: PostHogConfig = {
  projectApiKey: 'phc_YnN6K2xNK3hcOTlxK9h3Q7wHn3Q',
  posthogHost: 'https://us.posthog.com',
  googleAdsId: 'AW-17431174236',
  googleAdsConversionLabel: 'zINmCPbAtIMbENy46vdA',
  ga4MeasurementId: '',
  enableSessionRecording: true,
  enableHeatmaps: true,
  enableSurveys: false
};

export async function setupPostHogForLP(
  lpDirectory: string,
  serviceName: string,
  customConfig?: Partial<PostHogConfig>
): Promise<{
  success: boolean;
  files: string[];
  errors: string[];
}> {
  const config = { ...defaultPostHogConfig, ...customConfig };
  const files: string[] = [];
  const errors: string[] = [];

  try {
    // PostHogScript.tsx を生成
    const postHogScriptContent = generatePostHogScript(config);
    files.push('components/analytics/PostHogScript.tsx');

    // PostHogProvider.tsx を生成
    const postHogProviderContent = generatePostHogProvider(config);
    files.push('components/analytics/PostHogProvider.tsx');

    // Analytics.tsx を生成
    const analyticsContent = generateAnalyticsComponent(config);
    files.push('components/analytics/Analytics.tsx');

    // GoogleAdsTracking.tsx を生成
    if (config.googleAdsId) {
      const googleAdsContent = generateGoogleAdsTracking(config);
      files.push('components/analytics/GoogleAdsTracking.tsx');
    }

    // vercel.json 環境変数設定を生成
    const vercelConfigContent = generateVercelConfig(config);
    files.push('vercel.json');

    // layout.tsx を修正する内容を準備
    const layoutModifications = generateLayoutModifications(config);
    files.push('app/layout.tsx (修正)');

    return {
      success: true,
      files,
      errors
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown error in PostHog setup');
    return {
      success: false,
      files,
      errors
    };
  }
}

function generatePostHogScript(config: PostHogConfig): string {
  return `'use client';

import Script from 'next/script';

interface PostHogScriptProps {
  defer?: boolean;
}

export default function PostHogScript({ defer = true }: PostHogScriptProps = {}) {
  const initScript = \`
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    
    posthog.init('${config.projectApiKey}', {
      api_host: '${config.posthogHost}',
      person_profiles: 'always',
      session_recording: {
        recordCrossOriginIframes: true
      },
      capture_pageview: false,
      capture_pageleave: true
    });
    
    // Arc ブラウザ対応
    if (navigator.userAgent.includes('Arc')) {
      console.log('Arc browser detected - PostHog initialized with compatibility mode');
    }
    
    // GCLID パラメータを保存
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get('gclid');
    if (gclid) {
      sessionStorage.setItem('gclid', gclid);
      posthog.register({ gclid: gclid });
    }
  \`;

  return (
    <>
      <Script 
        id="posthog-init"
        strategy={defer ? "afterInteractive" : "beforeInteractive"}
        dangerouslySetInnerHTML={{ __html: initScript }}
      />
    </>
  );
}`;
}

function generatePostHogProvider(config: PostHogConfig): string {
  return `'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

interface CSRPostHogProviderProps {
  children: React.ReactNode;
}

export default function CSRPostHogProvider({ children }: CSRPostHogProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init('${config.projectApiKey}', {
        api_host: '${config.posthogHost}',
        person_profiles: 'always',
        ${config.enableSessionRecording ? `
        session_recording: {
          recordCrossOriginIframes: true
        },` : ''}
        capture_pageview: false,
        capture_pageleave: true,
        ${config.enableHeatmaps ? `
        enable_heatmaps: true,` : ''}
        ${config.enableSurveys ? `
        enable_surveys: true,` : ''}
      });
      
      // Arc ブラウザ対応
      if (navigator.userAgent.includes('Arc')) {
        console.log('Arc browser detected - PostHog initialized');
      }
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}`;
}

function generateAnalyticsComponent(config: PostHogConfig): string {
  return `'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

interface AnalyticsProps {
  pageTitle?: string;
  pagePath?: string;
}

export default function Analytics({ pageTitle, pagePath }: AnalyticsProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      // ページビューを手動でトラック
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        page_title: pageTitle || document.title,
        page_path: pagePath || window.location.pathname
      });

      // GCLID がある場合は Google Ads からの流入として記録
      const gclid = sessionStorage.getItem('gclid');
      if (gclid) {
        posthog.capture('google_ads_click', {
          gclid: gclid,
          landing_page: window.location.href
        });
      }
    }
  }, [posthog, pageTitle, pagePath]);

  return null;
}`;
}

function generateGoogleAdsTracking(config: PostHogConfig): string {
  return `'use client';

import Script from 'next/script';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

interface GoogleAdsTrackingProps {
  conversionAction?: string;
  conversionValue?: number;
}

export default function GoogleAdsTracking({ 
  conversionAction, 
  conversionValue 
}: GoogleAdsTrackingProps) {
  const posthog = usePostHog();

  useEffect(() => {
    // コンバージョンが発生した場合の処理
    if (conversionAction && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: '${config.googleAdsId}/${config.googleAdsConversionLabel}',
        value: conversionValue || 1.0,
        currency: 'JPY'
      });

      // PostHog にもコンバージョンを記録
      if (posthog) {
        posthog.capture('conversion', {
          action: conversionAction,
          value: conversionValue || 1.0,
          ads_id: '${config.googleAdsId}',
          conversion_label: '${config.googleAdsConversionLabel}'
        });
      }
    }
  }, [conversionAction, conversionValue, posthog]);

  return (
    <>
      <Script
        src={\`https://www.googletagmanager.com/gtag/js?id=${config.googleAdsId}\`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {\`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.googleAdsId}');
        \`}
      </Script>
      ${config.ga4MeasurementId ? `
      <Script
        src={\`https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}\`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {\`
          gtag('config', '${config.ga4MeasurementId}');
        \`}
      </Script>
      ` : ''}
    </>
  );
}`;
}

function generateVercelConfig(config: PostHogConfig): string {
  return JSON.stringify({
    "env": {
      "NEXT_PUBLIC_POSTHOG_KEY": config.projectApiKey,
      "NEXT_PUBLIC_POSTHOG_HOST": config.posthogHost,
      "NEXT_PUBLIC_GOOGLE_ADS_ID": config.googleAdsId,
      "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL": config.googleAdsConversionLabel,
      "NEXT_PUBLIC_GA4_MEASUREMENT_ID": config.ga4MeasurementId || ""
    }
  }, null, 2);
}

function generateLayoutModifications(config: PostHogConfig): string {
  return `
// layout.tsx に以下を追加:

import PostHogScript from '@/components/analytics/PostHogScript'
import CSRPostHogProvider from '@/components/analytics/PostHogProvider'
import GoogleAdsTracking from '@/components/analytics/GoogleAdsTracking'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <PostHogScript />
      </head>
      <body>
        <CSRPostHogProvider>
          {children}
          <GoogleAdsTracking />
        </CSRPostHogProvider>
      </body>
    </html>
  )
}
`;
}