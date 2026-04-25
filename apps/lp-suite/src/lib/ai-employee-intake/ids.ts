import { createHash } from 'crypto';

import type { AiEmployeeIntakeRequest, DedupePlan, IntakeStableIds } from './types';

const OFFER_FAMILY = 'diagnosis';

export function normalizeCompanyName(value: string | undefined): string {
  return (value || '').trim().replace(/\s+/g, ' ');
}

export function normalizeEmail(value: string | undefined): string {
  return (value || '').trim().toLowerCase();
}

function hash10(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 10);
}

export function buildStableIds(input: AiEmployeeIntakeRequest): IntakeStableIds {
  const companyName = normalizeCompanyName(input.company?.name);
  const email = normalizeEmail(input.contact?.email);
  const submittedAt = (input.submitted_at || '').trim();

  const customerHash = hash10(companyName);
  const contactHash = hash10(email);
  const pushCaseHash = hash10(`${companyName}:${email}:${OFFER_FAMILY}`);
  const diagnosisHash = hash10(`pc_ai_employee_${pushCaseHash}:${submittedAt}`);

  return {
    brainbase_customer_id: `cus_ai_employee_${customerHash}`,
    brainbase_contact_id: `con_ai_employee_${contactHash}`,
    brainbase_push_case_id: `pc_ai_employee_${pushCaseHash}`,
    diagnosis_id: `diag_ai_employee_${diagnosisHash}`,
  };
}

export function buildDedupePlan(input: AiEmployeeIntakeRequest, ids: IntakeStableIds): DedupePlan {
  const companyName = normalizeCompanyName(input.company?.name);
  const email = normalizeEmail(input.contact?.email);

  return {
    customer: {
      key: `company_name:${companyName}`,
      id: ids.brainbase_customer_id,
      action: 'upsert',
    },
    contact: {
      key: `email:${email}`,
      id: ids.brainbase_contact_id,
      action: 'upsert',
    },
    push_case: {
      key: `${companyName}:${email}:${OFFER_FAMILY}`,
      id: ids.brainbase_push_case_id,
      action: 'upsert',
    },
    diagnosis: {
      key: `${ids.brainbase_push_case_id}:${(input.submitted_at || '').trim()}`,
      id: ids.diagnosis_id,
      action: 'create',
    },
  };
}
