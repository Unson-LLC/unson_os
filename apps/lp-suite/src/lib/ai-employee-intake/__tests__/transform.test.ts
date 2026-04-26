import { describe, expect, it } from 'vitest';

import { buildIntakeDryRun } from '../transform';
import type { AiEmployeeIntakeRequest } from '../types';

const validRequest: AiEmployeeIntakeRequest = {
  submitted_at: '2026-04-26T00:00:00.000Z',
  form_variant: 'diagnosis_v1',
  landing_page: '/ai-employee-diagnosis',
  referrer: 'https://x.com/',
  attribution: {
    utm_source: 'x',
    utm_medium: 'paid_social',
    utm_campaign: 'ai_driven_management_202604',
    utm_content: 'hero_a',
    utm_term: 'ai_employee',
    keyword_family: 'ai_employee',
    click_ids: {
      xclid: 'x_123',
      fbclid: null,
      gclid: null,
    },
  },
  company: {
    name: '株式会社サンプル',
    website: 'https://example.com',
    size: '51-200',
    industry: 'software',
  },
  contact: {
    name: '山田 太郎',
    email: 'TARO@example.com',
    phone: '',
    department: '事業開発',
    role: '事業責任者',
  },
  diagnosis: {
    target_function: 'sales',
    ai_adoption_stage: 'trial',
    pain: '議事録とCRM更新が属人化している',
    urgency: 'this_quarter',
    budget_signal: 'unknown',
    authority_signal: 'medium',
    free_text: '営業チームの商談後処理をAI化したい',
  },
  consent: {
    privacy_policy: true,
    marketing_contact: true,
  },
};

describe('buildIntakeDryRun', () => {
  it('valid request creates Graph/PostHog/NocoDB write plans without writing', () => {
    const result = buildIntakeDryRun(validRequest);

    expect(result.ok).toBe(true);
    expect(result.dry_run).toBe(true);
    expect(result.validation.valid).toBe(true);
    expect(result.write_plan).toEqual([
      'graph.customer.upsert',
      'graph.contact.upsert',
      'graph.push_case.upsert',
      'graph.diagnosis.upsert',
      'graph.edges.upsert',
      'posthog.capture',
      'nocodb.push_case_projection.upsert',
    ]);
    expect(result.graph.entities.map((entity) => entity.entityType)).toEqual([
      'customer',
      'contact',
      'push_case',
      'diagnosis',
    ]);
    expect(result.posthog?.event).toBe('diagnosis_form_submit');
    expect(result.nocodb_projection?.tableName).toBe('推進案件');
  });

  it('push_case is the CRM center and carries governance philosophy ids', () => {
    const result = buildIntakeDryRun(validRequest);
    const pushCase = result.graph.entities.find((entity) => entity.entityType === 'push_case');

    expect(pushCase?.payload.customer_id).toBe(result.ids?.brainbase_customer_id);
    expect(pushCase?.payload.primary_contact_id).toBe(result.ids?.brainbase_contact_id);
    expect(pushCase?.payload.stage).toBe('diagnosis_submitted');
    expect(pushCase?.payload.philosophy_ids).toEqual([
      'phi_push_case_center',
      'phi_ui_is_projection',
      'phi_data_ownership_by_use',
      'phi_learning_loop',
    ]);
    expect(result.graph.edges.filter((edge) => edge.relType === 'governed_by')).toHaveLength(4);
  });

  it('NocoDB projection remains a projection and includes Brainbase IDs', () => {
    const result = buildIntakeDryRun(validRequest);

    expect(result.nocodb_projection?.fields).toMatchObject({
      案件名: '株式会社サンプル AI社員化PoC提案',
      顧客名: '株式会社サンプル',
      ステータス: 'リード',
      角度: '★☆☆☆☆ (10%)',
      brainbase_push_case_id: result.ids?.brainbase_push_case_id,
      brainbase_customer_id: result.ids?.brainbase_customer_id,
      brainbase_contact_id: result.ids?.brainbase_contact_id,
      diagnosis_id: result.ids?.diagnosis_id,
    });
  });

  it('invalid request returns no write plan and no side-effect payloads', () => {
    const result = buildIntakeDryRun({
      ...validRequest,
      contact: {
        ...validRequest.contact,
        email: '',
      },
    });

    expect(result.ok).toBe(false);
    expect(result.validation.valid).toBe(false);
    expect(result.validation.errors.map((issue) => issue.code)).toContain('missing_contact_email');
    expect(result.write_plan).toEqual([]);
    expect(result.graph.entities).toEqual([]);
    expect(result.graph.edges).toEqual([]);
    expect(result.posthog).toBeUndefined();
    expect(result.nocodb_projection).toBeUndefined();
  });
});
