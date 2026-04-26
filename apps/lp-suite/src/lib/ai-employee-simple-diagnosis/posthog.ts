import type { SimpleDiagnosisPostHogPlan } from './types';

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';

export async function captureSimpleDiagnosisEvent(plan?: SimpleDiagnosisPostHogPlan): Promise<void> {
  const apiKey = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey || !plan) return;

  const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST;
  const distinctId = String(plan.properties.simple_diagnosis_id || 'anonymous');

  try {
    await fetch(`${host.replace(/\/$/, '')}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        event: plan.event,
        distinct_id: distinctId,
        properties: plan.properties,
      }),
    });
  } catch {
    // 診断結果を先に返す。計測失敗でユーザー体験を止めない。
  }
}
