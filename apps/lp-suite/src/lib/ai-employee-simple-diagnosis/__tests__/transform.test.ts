import { describe, expect, it } from 'vitest';

import { buildSimpleDiagnosis } from '../transform';
import type { SimpleDiagnosisRequest } from '../types';

const validRequest: SimpleDiagnosisRequest = {
  submitted_at: '2026-04-26T00:00:00.000Z',
  form_variant: 'simple_diagnosis_v1',
  landing_page: '/ai-employee-diagnosis',
  referrer: 'https://x.com/',
  company: {
    website: 'https://example.com',
  },
  diagnosis_seed: {
    pain_category: 'sales_ops',
    pain_text: '商談後の議事録整理とCRM更新が遅い',
    current_tools: ['notion', 'slack', 'claude'],
    team_size: '11-50',
    urgency: 'this_quarter',
  },
  attribution: {
    utm_source: 'x',
    utm_medium: 'paid_social',
    utm_campaign: 'ai_driven_management_202604',
    utm_content: 'simple_diagnosis_hero_a',
    utm_term: 'ai_employee',
    keyword_family: 'ai_employee',
    click_ids: {
      xclid: 'x_123',
      fbclid: null,
      gclid: null,
    },
  },
};

describe('buildSimpleDiagnosis', () => {
  it('URLと課題カテゴリだけでAI社員化候補と詳細診断handoffを返す', () => {
    const result = buildSimpleDiagnosis({
      ...validRequest,
      diagnosis_seed: {
        pain_category: 'sales_ops',
      },
    });

    expect(result.ok).toBe(true);
    expect(result.simple_diagnosis_id).toMatch(/^simp_ai_employee_[a-z0-9]{10}$/);
    expect(result.validation.valid).toBe(true);
    expect(result.result?.primary_candidate.use_case_id).toBe('sales_ai_employee');
    expect(result.result?.primary_candidate.title).toBe('営業AI社員');
    expect(result.result?.cta.next_step).toBe('detailed_diagnosis');
    expect(result.handoff?.intake_prefill.company.website).toBe('https://example.com');
    expect(result.handoff?.intake_prefill.diagnosis.free_text).toContain(result.simple_diagnosis_id);
  });

  it('ホームページ取得に失敗してもwarning付きで入力内容から結果を返す', () => {
    const result = buildSimpleDiagnosis(validRequest, {
      warnings: [
        {
          code: 'homepage_fetch_failed',
          message: 'ホームページの読み取りはできませんでしたが、入力内容から診断できます',
          severity: 'warning',
          path: 'company.website',
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.validation.warnings.map((issue) => issue.code)).toContain('homepage_fetch_failed');
    expect(result.company_snapshot.confidence).toBe('low');
    expect(result.posthog?.properties.homepage_fetch_status).toBe('failed');
  });

  it('URLが空なら結果を返さない', () => {
    const result = buildSimpleDiagnosis({
      ...validRequest,
      company: {
        website: '',
      },
    });

    expect(result.ok).toBe(false);
    expect(result.validation.errors.map((issue) => issue.code)).toContain('missing_company_website');
    expect(result.result).toBeUndefined();
  });

  it('URL形式が不正なら結果を返さない', () => {
    const result = buildSimpleDiagnosis({
      ...validRequest,
      company: {
        website: 'not-a-url',
      },
    });

    expect(result.ok).toBe(false);
    expect(result.validation.errors.map((issue) => issue.code)).toContain('invalid_company_website');
    expect(result.posthog).toBeUndefined();
  });

  it('課題カテゴリと自由入力が両方空なら結果を返さない', () => {
    const result = buildSimpleDiagnosis({
      ...validRequest,
      diagnosis_seed: {},
    });

    expect(result.ok).toBe(false);
    expect(result.validation.errors.map((issue) => issue.code)).toContain('missing_pain_signal');
  });

  it('個人情報入力要求やGraph/NocoDB write planを含めない', () => {
    const result = buildSimpleDiagnosis(validRequest);
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain('contact');
    expect(serialized).not.toContain('email');
    expect(serialized).not.toContain('write_plan');
    expect(serialized).not.toContain('nocodb');
    expect(serialized).not.toContain('graph');
    expect(result.posthog?.event).toBe('simple_diagnosis_completed');
    expect(result.posthog?.properties.simple_diagnosis_id).toBe(result.simple_diagnosis_id);
  });
});
