import { buildDedupePlan, buildStableIds, normalizeCompanyName, normalizeEmail } from './ids';
import { mapProbabilityToNocoAngle, mapPushCaseStageToNocoStatus } from './stage-mapping';
import type {
  AiEmployeeIntakeRequest,
  GraphEdge,
  GraphEntity,
  IntakeDryRunResponse,
  IntakeStableIds,
  NocoDbProjectionPlan,
  PostHogCapturePlan,
} from './types';
import { validateIntake } from './validate';

const PHILOSOPHY_IDS = [
  'phi_push_case_center',
  'phi_ui_is_projection',
  'phi_data_ownership_by_use',
  'phi_learning_loop',
];

const WRITE_PLAN = [
  'graph.customer.upsert',
  'graph.contact.upsert',
  'graph.push_case.upsert',
  'graph.diagnosis.upsert',
  'graph.edges.upsert',
  'posthog.capture',
  'nocodb.push_case_projection.upsert',
];

function sourceChannel(utmSource?: string | null): string {
  if (utmSource === 'x') return 'x_ads';
  if (utmSource === 'meta' || utmSource === 'facebook' || utmSource === 'instagram') return 'meta_ads';
  if (utmSource === 'google') return 'google_ads';
  return 'inbound_form';
}

function buildGraphEntities(input: AiEmployeeIntakeRequest, ids: IntakeStableIds): GraphEntity[] {
  const companyName = normalizeCompanyName(input.company?.name);
  const email = normalizeEmail(input.contact?.email);
  const submittedAt = input.submitted_at || new Date().toISOString();
  const title = `${companyName} AI社員化PoC提案`;
  const stage = 'diagnosis_submitted';
  const probability = 0.1;

  const customer: GraphEntity = {
    id: ids.brainbase_customer_id,
    entityType: 'customer',
    projectCode: 'unson',
    projectName: 'Unson',
    roleMin: 'gm',
    sensitivity: 'restricted',
    payload: {
      customer_id: ids.brainbase_customer_id,
      name: companyName,
      website: input.company?.website || '',
      company_size: input.company?.size || '',
      industry: input.company?.industry || '',
      status: 'prospect',
      projects: ['ai-employee-adoption'],
      source: 'ai_employee_diagnosis',
      lead_source: {
        utm_source: input.attribution?.utm_source || null,
        utm_medium: input.attribution?.utm_medium || null,
        utm_campaign: input.attribution?.utm_campaign || null,
        utm_content: input.attribution?.utm_content || null,
        utm_term: input.attribution?.utm_term || null,
        keyword_family: input.attribution?.keyword_family || null,
        offer: 'diagnosis',
      },
      created_or_updated_from: 'ai_employee_diagnosis_intake',
      last_intake_at: submittedAt,
    },
  };

  const contact: GraphEntity = {
    id: ids.brainbase_contact_id,
    entityType: 'contact',
    projectCode: 'unson',
    projectName: 'Unson',
    roleMin: 'gm',
    sensitivity: 'restricted',
    payload: {
      contact_id: ids.brainbase_contact_id,
      name: input.contact?.name || '',
      email,
      phone: input.contact?.phone || '',
      company: companyName,
      company_id: ids.brainbase_customer_id,
      department: input.contact?.department || '',
      role: input.contact?.role || '',
      projects: ['ai-employee-adoption'],
      source: 'ai_employee_diagnosis',
      last_intake_at: submittedAt,
    },
  };

  const pushCase: GraphEntity = {
    id: ids.brainbase_push_case_id,
    entityType: 'push_case',
    projectCode: 'unson',
    projectName: 'Unson',
    roleMin: 'gm',
    sensitivity: 'restricted',
    payload: {
      push_case_id: ids.brainbase_push_case_id,
      title,
      display_name: `${companyName} / AI社員化PoC`,
      customer_id: ids.brainbase_customer_id,
      primary_contact_id: ids.brainbase_contact_id,
      owner_person_id: 'per_keigo_sato',
      project_code: 'unson',
      stage,
      stage_reason: 'AI社員化診断フォーム送信により作成',
      value_hypothesis: `${input.diagnosis?.pain || ''}領域をAI社員化できる`,
      offer_family: 'diagnosis',
      source: {
        source_type: 'inbound_form',
        channel: sourceChannel(input.attribution?.utm_source),
        utm_source: input.attribution?.utm_source || null,
        utm_medium: input.attribution?.utm_medium || null,
        utm_campaign: input.attribution?.utm_campaign || null,
        utm_content: input.attribution?.utm_content || null,
        utm_term: input.attribution?.utm_term || null,
        keyword_family: input.attribution?.keyword_family || null,
        landing_page: input.landing_page || null,
        referrer: input.referrer || null,
        click_ids: input.attribution?.click_ids || {},
      },
      next_action: {
        label: '診断日程を確定する',
        owner_person_id: 'per_keigo_sato',
        due_at: null,
        ball_holder: 'unson',
        status: 'open',
      },
      forecast: {
        expected_value_jpy: null,
        expected_value_confidence: 'unknown',
        expected_timing: 'unknown',
        probability,
      },
      qualification: {
        company_size: input.company?.size || '',
        target_function: input.diagnosis?.target_function || '',
        urgency: input.diagnosis?.urgency || '',
        budget_signal: input.diagnosis?.budget_signal || 'unknown',
        authority_signal: input.diagnosis?.authority_signal || 'unknown',
        need_signal: 'medium',
        timing_signal: input.diagnosis?.urgency === 'this_quarter' ? 'high' : 'medium',
        fit_score: null,
        qualified_reason: null,
      },
      control_state: {
        execution_health: 'normal',
        evidence_state: 'missing',
        approval_state: 'not_required',
        escalation_state: 'none',
        attention_level: 'watch',
        blocked_reason: null,
        missing_evidence: ['診断回答', '導入対象業務', '決裁関与者'],
        last_decision_record_id: null,
      },
      philosophy_ids: PHILOSOPHY_IDS,
      refs: {
        diagnosis_ids: [ids.diagnosis_id],
        initiative_ids: [],
        story_ids: [],
        decision_item_ids: [],
        decision_record_ids: [],
        communication_ids: [],
        evidence_ref_ids: [],
        task_refs: [],
        ship_refs: [],
        nocodb_sales_record: null,
      },
      created_at: submittedAt,
      updated_at: submittedAt,
    },
  };

  const diagnosis: GraphEntity = {
    id: ids.diagnosis_id,
    entityType: 'diagnosis',
    projectCode: 'unson',
    projectName: 'Unson',
    roleMin: 'gm',
    sensitivity: 'restricted',
    payload: {
      diagnosis_id: ids.diagnosis_id,
      push_case_id: ids.brainbase_push_case_id,
      customer_id: ids.brainbase_customer_id,
      contact_id: ids.brainbase_contact_id,
      status: 'submitted',
      submitted_at: submittedAt,
      form_variant: input.form_variant || 'diagnosis_v1',
      answers: {
        target_function: input.diagnosis?.target_function || '',
        ai_adoption_stage: input.diagnosis?.ai_adoption_stage || '',
        pain: input.diagnosis?.pain || '',
        urgency: input.diagnosis?.urgency || '',
        budget_signal: input.diagnosis?.budget_signal || 'unknown',
        authority_signal: input.diagnosis?.authority_signal || 'unknown',
        free_text: input.diagnosis?.free_text || '',
      },
      fit_score: null,
      analysis_refs: [],
      decision_record_id: null,
    },
  };

  return [customer, contact, pushCase, diagnosis];
}

function buildGraphEdges(ids: IntakeStableIds): GraphEdge[] {
  return [
    { fromId: ids.brainbase_customer_id, toId: ids.brainbase_push_case_id, relType: 'has_push_case' },
    { fromId: ids.brainbase_contact_id, toId: ids.brainbase_push_case_id, relType: 'participates_in' },
    { fromId: ids.brainbase_contact_id, toId: ids.brainbase_push_case_id, relType: 'primary_contact_for' },
    { fromId: ids.brainbase_push_case_id, toId: ids.diagnosis_id, relType: 'has_diagnosis' },
    { fromId: ids.diagnosis_id, toId: ids.brainbase_customer_id, relType: 'belongs_to_customer' },
    ...PHILOSOPHY_IDS.map((philosophyId) => ({
      fromId: ids.brainbase_push_case_id,
      toId: philosophyId,
      relType: 'governed_by' as const,
    })),
  ];
}

function buildPostHogPlan(input: AiEmployeeIntakeRequest, ids: IntakeStableIds): PostHogCapturePlan {
  return {
    event: 'diagnosis_form_submit',
    distinct_id: ids.brainbase_contact_id,
    timestamp: input.submitted_at || new Date().toISOString(),
    properties: {
      brainbase_customer_id: ids.brainbase_customer_id,
      brainbase_contact_id: ids.brainbase_contact_id,
      brainbase_push_case_id: ids.brainbase_push_case_id,
      diagnosis_id: ids.diagnosis_id,
      company_size: input.company?.size || '',
      target_function: input.diagnosis?.target_function || '',
      urgency: input.diagnosis?.urgency || '',
      utm_source: input.attribution?.utm_source || null,
      utm_medium: input.attribution?.utm_medium || null,
      utm_campaign: input.attribution?.utm_campaign || null,
      utm_content: input.attribution?.utm_content || null,
      utm_term: input.attribution?.utm_term || null,
      keyword_family: input.attribution?.keyword_family || null,
      offer: 'diagnosis',
      form_variant: input.form_variant || 'diagnosis_v1',
      landing_page: input.landing_page || null,
    },
  };
}

function buildNocoDbProjection(input: AiEmployeeIntakeRequest, ids: IntakeStableIds): NocoDbProjectionPlan {
  const companyName = normalizeCompanyName(input.company?.name);
  const submittedDate = (input.submitted_at || '').slice(0, 10);
  const stage = 'diagnosis_submitted';
  const probability = 0.1;

  return {
    baseId: 'pipf5irgs2lzuon',
    tableName: '推進案件',
    fields: {
      案件名: `${companyName} AI社員化PoC提案`,
      顧客名: companyName,
      ステータス: mapPushCaseStageToNocoStatus(stage),
      角度: mapProbabilityToNocoAngle(probability),
      '予算規模（万円）': null,
      入金時期: '未定',
      担当者: '佐藤圭吾',
      初回接触日: submittedDate,
      次アクション: '診断日程を確定する',
      次アクション期限: null,
      議事録リンク: null,
      備考: `source=${input.attribution?.utm_source || 'unknown'} / campaign=${input.attribution?.utm_campaign || 'unknown'} / keyword_family=${input.attribution?.keyword_family || 'unknown'}`,
      brainbase_push_case_id: ids.brainbase_push_case_id,
      brainbase_customer_id: ids.brainbase_customer_id,
      brainbase_contact_id: ids.brainbase_contact_id,
      diagnosis_id: ids.diagnosis_id,
      graph_url: `https://bb.unson.jp/graph/entities/${ids.brainbase_push_case_id}`,
    },
  };
}

export function buildIntakeDryRun(input: AiEmployeeIntakeRequest): IntakeDryRunResponse {
  const validation = validateIntake(input);

  if (!validation.valid) {
    return {
      ok: false,
      dry_run: true,
      validation,
      write_plan: [],
      graph: {
        entities: [],
        edges: [],
      },
    };
  }

  const ids = buildStableIds(input);
  const dedupe = buildDedupePlan(input, ids);
  const entities = buildGraphEntities(input, ids);
  const edges = buildGraphEdges(ids);

  return {
    ok: true,
    dry_run: true,
    validation,
    ids,
    dedupe,
    write_plan: WRITE_PLAN,
    graph: {
      entities,
      edges,
    },
    posthog: buildPostHogPlan(input, ids),
    nocodb_projection: buildNocoDbProjection(input, ids),
    next: 'booking',
  };
}
