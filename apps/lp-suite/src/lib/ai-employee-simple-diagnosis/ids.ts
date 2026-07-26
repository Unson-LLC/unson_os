import type { SimpleDiagnosisRequest } from './types';
import { normalizeWebsite } from './validate';

function hash10(input: string): string {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }

  const unsigned = hash >>> 0;
  return unsigned.toString(36).padStart(10, '0').slice(0, 10);
}

export function buildSimpleDiagnosisId(input: SimpleDiagnosisRequest): string {
  const submittedDate = (input.submitted_at || new Date().toISOString()).slice(0, 10);
  const key = [
    normalizeWebsite(input.company?.website).toLowerCase(),
    input.diagnosis_seed?.pain_category || 'unknown',
    input.diagnosis_seed?.pain_text || '',
    submittedDate,
  ].join('|');

  return `simp_ai_employee_${hash10(key)}`;
}
