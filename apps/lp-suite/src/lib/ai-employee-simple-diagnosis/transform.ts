import { buildSimpleDiagnosisId } from './ids';
import type {
  HomepageReadResult,
  HomepageSnapshot,
  IntakePrefill,
  SimpleDiagnosisRequest,
  SimpleDiagnosisResponse,
  SimpleDiagnosisResult,
  UseCaseDefinition,
  ValidationIssue,
} from './types';
import { getUseCaseDefinition } from './use-case-map';
import { normalizeWebsite, validateSimpleDiagnosis } from './validate';
import { buildInputOnlySnapshot } from './homepage';

function mergeWarnings(...warningGroups: Array<ValidationIssue[] | undefined>): ValidationIssue[] {
  return warningGroups.flatMap((warnings) => warnings || []);
}

function buildResult(definition: UseCaseDefinition): SimpleDiagnosisResult {
  return {
    headline: '貴社で最初にAI社員化しやすい業務候補',
    primary_candidate: {
      use_case_id: definition.primary_use_case,
      title: definition.title,
      target_workflow: definition.target_workflow,
      reason: definition.reason,
      first_poc_scope: definition.first_poc_scope,
    },
    claude_code_use_cases: definition.claude_code_use_cases,
    expected_change:
      '人間が毎回AIに指示する状態から、AI社員が業務フロー内で下書き/整理/記録まで進める状態へ。',
    likely_bottlenecks: definition.likely_bottlenecks,
    detail_diagnosis_agenda: [
      '実際の業務フローを確認する',
      '利用ツールとデータの場所を確認する',
      'PoC候補を1つに絞る',
    ],
    cta: {
      label: 'この結果をもとに30分でPoC候補を1つに絞る',
      next_step: 'detailed_diagnosis',
    },
  };
}

function buildHandoff(
  input: SimpleDiagnosisRequest,
  snapshot: HomepageSnapshot,
  definition: UseCaseDefinition,
  simpleDiagnosisId: string,
): { intake_prefill: IntakePrefill } {
  const painText = input.diagnosis_seed?.pain_text || definition.target_workflow;

  return {
    intake_prefill: {
      company: {
        website: normalizeWebsite(input.company?.website),
        name: snapshot.inferred_company_name || snapshot.hostname,
      },
      diagnosis: {
        target_function: definition.target_function,
        pain: painText,
        urgency: input.diagnosis_seed?.urgency || 'unknown',
        free_text: `simple_diagnosis_id=${simpleDiagnosisId} / primary_use_case=${definition.primary_use_case}`,
      },
      attribution: {
        utm_source: input.attribution?.utm_source || null,
        utm_medium: input.attribution?.utm_medium || null,
        utm_campaign: input.attribution?.utm_campaign || null,
        utm_content: input.attribution?.utm_content || null,
        keyword_family: input.attribution?.keyword_family || null,
      },
    },
  };
}

function homepageFetchStatus(snapshot: HomepageSnapshot, warnings: ValidationIssue[]): string {
  if (warnings.some((issue) => issue.code === 'homepage_fetch_failed')) return 'failed';
  if (warnings.some((issue) => issue.code === 'homepage_low_signal')) return 'low_signal';
  return snapshot.source === 'homepage' ? 'success' : 'input_only';
}

export function buildSimpleDiagnosis(
  input: SimpleDiagnosisRequest,
  homepageRead?: HomepageReadResult,
): SimpleDiagnosisResponse {
  const validation = validateSimpleDiagnosis(input);

  if (!validation.valid) {
    return {
      ok: false,
      validation,
    };
  }

  const simpleDiagnosisId = buildSimpleDiagnosisId(input);
  const definition = getUseCaseDefinition(input.diagnosis_seed?.pain_category);
  const snapshot = homepageRead?.snapshot || buildInputOnlySnapshot(normalizeWebsite(input.company?.website));
  const warnings = mergeWarnings(validation.warnings, homepageRead?.warnings);
  const result = buildResult(definition);

  return {
    ok: true,
    simple_diagnosis_id: simpleDiagnosisId,
    validation: {
      ...validation,
      warnings,
    },
    company_snapshot: snapshot,
    result,
    handoff: buildHandoff(input, snapshot, definition, simpleDiagnosisId),
    posthog: {
      event: 'simple_diagnosis_completed',
      properties: {
        simple_diagnosis_id: simpleDiagnosisId,
        company_website_domain: snapshot.hostname,
        pain_category: definition.pain_category,
        primary_use_case: definition.primary_use_case,
        result_confidence: snapshot.confidence,
        homepage_fetch_status: homepageFetchStatus(snapshot, warnings),
        keyword_family: input.attribution?.keyword_family || null,
        utm_source: input.attribution?.utm_source || null,
        utm_medium: input.attribution?.utm_medium || null,
        utm_campaign: input.attribution?.utm_campaign || null,
        utm_content: input.attribution?.utm_content || null,
        utm_term: input.attribution?.utm_term || null,
      },
    },
  };
}
