'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Always skip direct initialization - use CDN version from PostHogScript.tsx
if (false) {
  console.log('PostHog ENV Check:', {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST
  });
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    enable_heatmaps: true,
    enable_recording_console_log: true,
    debug: process.env.NODE_ENV === 'development',
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    autocapture: {
      dom_event_allowlist: ['click', 'change', 'submit'],
      element_allowlist: ['button', 'input', 'select', 'textarea', 'a'],
    },
    loaded: (ph) => {
      console.log('PostHog initialized successfully for MyWa', ph);
      window.__posthog_initialized = true;
    },
    on_request_error: (error) => {
      console.error('PostHog request failed:', error);
    }
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Always skip - CDN version handles pageview
    if (false) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      
      // GCLID自動取得
      const urlParams = new URLSearchParams(searchParams?.toString() || '');
      const gclid = urlParams.get('gclid');
      
      // セッションストレージに保存（ページ遷移でも保持）
      if (gclid && typeof gclid === 'string') {
        sessionStorage.setItem('gclid', gclid);
      }
      
      const storedGclid = sessionStorage.getItem('gclid');
      
      posthog.capture('$pageview', {
        $current_url: url,
        gclid: gclid || storedGclid,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content'),
        page_load_time: performance.now(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
      
      console.log('Enhanced pageview tracked', { 
        url, 
        gclid: gclid || sessionStorage.getItem('gclid'),
        service: 'mywa'
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}