'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

interface PostHogProviderProps {
  children: React.ReactNode;
  postHogKey?: string;
  postHogHost?: string;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ 
  children, 
  postHogKey, 
  postHogHost 
}: PostHogProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && postHogKey && !posthog.__loaded) {
      posthog.init(postHogKey, {
        api_host: postHogHost || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        enable_heatmaps: true,
        enable_recording_console_log: true,
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
      });
    }
  }, [postHogKey, postHogHost]);

  // PostHogが設定されていない場合は子要素のみ返す
  if (!postHogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}