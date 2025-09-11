'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    posthog: any;
    __posthog_initialized: boolean;
  }
}

export default function PostHogScript() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__posthog_initialized) {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
      
      console.log('CDN版PostHog初期化開始:', {
        key: posthogKey,
        host: posthogHost
      });
      
      // CDN版PostHog読み込み（複数CDN試行）
      const cdnUrls = [
        'https://cdn.jsdelivr.net/npm/posthog-js@latest/dist/array.full.js',
        'https://unpkg.com/posthog-js@latest/dist/array.full.js',
        'https://app.posthog.com/static/array.js?v=1.262.0'
      ];
      
      let currentCdnIndex = 0;
      
      const loadScript = () => {
        if (currentCdnIndex >= cdnUrls.length) {
          console.error('❌ 全CDN版PostHog読み込み失敗 - Arcブラウザがブロック中');
          return;
        }
        
        const script = document.createElement('script');
        script.src = cdnUrls[currentCdnIndex];
        script.onload = function() {
          console.log(`✅ CDN版PostHog読み込み成功! (${cdnUrls[currentCdnIndex]})`);
          
          if (typeof window.posthog !== 'undefined') {
            window.posthog.init(posthogKey, {
              api_host: posthogHost,
              person_profiles: 'identified_only',
              capture_pageview: '2025-05-24',
              capture_pageleave: true,
              enable_heatmaps: true,
              debug: process.env.NODE_ENV === 'development',
              loaded: function(ph: any) {
                console.log('🎉 CDN版PostHog初期化成功 for MyWa!', ph);
                window.__posthog_initialized = true;
                
                // 拡張ページビューイベント送信
                const urlParams = new URLSearchParams(window.location.search);
                const gclid = urlParams.get('gclid');
                
                if (gclid) {
                  sessionStorage.setItem('gclid', gclid);
                }
                
                setTimeout(function() {
                  ph.capture('$pageview', {
                    $current_url: window.location.href,
                    service_name: 'mywa',
                    cdn_version: true,
                    gclid: gclid || sessionStorage.getItem('gclid'),
                    utm_source: urlParams.get('utm_source'),
                    utm_medium: urlParams.get('utm_medium'),
                    utm_campaign: urlParams.get('utm_campaign'),
                    page_load_time: performance.now(),
                    user_agent: navigator.userAgent,
                    referrer: document.referrer
                  });
                  console.log('📊 拡張ページビューイベント送信完了!');
                }, 100);
              },
              on_request_error: function(error: any) {
                console.error('❌ CDN版PostHogエラー:', error);
              }
            });
          } else {
            console.error('❌ PostHogオブジェクトが見つかりません');
          }
        };
        script.onerror = function() {
          console.error(`❌ CDN[${currentCdnIndex}] ${cdnUrls[currentCdnIndex]} 読み込み失敗`);
          currentCdnIndex++;
          loadScript(); // 次のCDNを試行
        };
        document.head.appendChild(script);
      };
      
      loadScript(); // 初回実行
    }
  }, []);

  return null;
}