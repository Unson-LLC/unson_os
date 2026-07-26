import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '../route';

const payload = {
  submitted_at: '2026-04-26T00:00:00.000Z',
  form_variant: 'simple_diagnosis_v1',
  landing_page: '/ai-employee-diagnosis',
  company: {
    website: 'https://example.com',
  },
  diagnosis_seed: {
    pain_category: 'sales_ops',
    pain_text: '商談後の議事録整理とCRM更新が遅い',
    urgency: 'this_quarter',
  },
  attribution: {
    utm_source: 'x',
    utm_medium: 'paid_social',
    utm_campaign: 'ai_driven_management_202604',
    keyword_family: 'ai_employee',
  },
};

describe('POST /api/ai-employee-diagnosis/simple', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('会社URLと課題から簡易診断結果を返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          '<html><head><title>Example Inc.</title><meta name="description" content="B2B SaaS"></head><body><h1>営業支援SaaS</h1><h2>CRM連携</h2></body></html>',
          {
            status: 200,
            headers: { 'content-type': 'text/html' },
          },
        ),
      ),
    );

    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/simple', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result.primary_candidate.use_case_id).toBe('sales_ai_employee');
    expect(body.company_snapshot.homepage_title).toBe('Example Inc.');
    expect(body.handoff.intake_prefill.company.website).toBe('https://example.com');
  });

  it('ホームページ取得に失敗してもwarning付きで結果を返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network failed');
      }),
    );

    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/simple', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.validation.warnings[0].code).toBe('homepage_fetch_failed');
  });

  it('private URLはSSRF対策としてブロックする', async () => {
    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/simple', {
        method: 'POST',
        body: JSON.stringify({
          ...payload,
          company: {
            website: 'http://169.254.169.254/latest/meta-data',
          },
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.validation.errors.map((issue: { code: string }) => issue.code)).toContain('invalid_company_website');
  });

  it('不正なJSONならvalidation errorを返す', async () => {
    const response = await POST(
      new Request('https://example.com/api/ai-employee-diagnosis/simple', {
        method: 'POST',
        body: '{',
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.validation.errors[0].code).toBe('invalid_json');
  });
});
