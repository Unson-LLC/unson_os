import { describe, expect, it } from 'vitest';

import { POST } from '../route';

const payload = {
  submitted_at: '2026-04-26T00:00:00.000Z',
  form_variant: 'diagnosis_v1',
  landing_page: '/ai-employee-diagnosis',
  attribution: {
    utm_source: 'x',
    utm_medium: 'paid_social',
    utm_campaign: 'ai_driven_management_202604',
    keyword_family: 'ai_employee',
  },
  company: {
    name: '株式会社サンプル',
    size: '51-200',
  },
  contact: {
    name: '山田 太郎',
    email: 'taro@example.com',
  },
  diagnosis: {
    target_function: 'sales',
    pain: '議事録とCRM更新が属人化している',
    urgency: 'this_quarter',
    budget_signal: 'unknown',
    authority_signal: 'medium',
  },
  consent: {
    privacy_policy: true,
  },
};

describe('POST /api/ai-employee-diagnosis/intake', () => {
  it('returns dry-run payload when dryRun=true', async () => {
    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/intake?dryRun=true', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.dry_run).toBe(true);
    expect(body.write_plan).toContain('graph.push_case.upsert');
    expect(body.nocodb_projection.fields.brainbase_push_case_id).toBe(body.ids.brainbase_push_case_id);
  });

  it('rejects real writes until Graph/PostHog/NocoDB clients are implemented', async () => {
    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/intake', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(501);
    expect(body.ok).toBe(false);
    expect(body.error).toContain('Only dryRun=true is implemented');
  });

  it('returns validation errors for malformed JSON', async () => {
    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/intake?dryRun=true', {
        method: 'POST',
        body: '{',
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.validation.errors[0].code).toBe('invalid_json');
    expect(body.write_plan).toEqual([]);
  });
});
