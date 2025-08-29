'use client';

import { useEffect, useRef } from 'react';

export default function ScrollTracker() {
  const scrollDepthRef = useRef<number>(0);
  const milestones = [25, 50, 75, 100];
  const trackedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > scrollDepthRef.current) {
        scrollDepthRef.current = scrollPercent;

        // マイルストーンに到達した場合のみ送信
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !trackedMilestones.current.has(milestone)) {
            trackedMilestones.current.add(milestone);
            
            // Google Analytics tracking
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'scroll', {
                event_category: 'engagement',
                event_label: `scroll_${milestone}`,
                value: milestone,
              });
            }

            // PostHog tracking
            if (typeof window !== 'undefined' && (window as any).posthog) {
              (window as any).posthog.capture('scroll_depth', {
                depth_percentage: milestone,
                timestamp: new Date().toISOString(),
              });
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}