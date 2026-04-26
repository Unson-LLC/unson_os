import { NextResponse } from 'next/server';

import { readHomepageSnapshot } from '@/lib/ai-employee-simple-diagnosis/homepage';
import { captureSimpleDiagnosisEvent } from '@/lib/ai-employee-simple-diagnosis/posthog';
import { buildSimpleDiagnosis } from '@/lib/ai-employee-simple-diagnosis/transform';
import type { SimpleDiagnosisRequest } from '@/lib/ai-employee-simple-diagnosis/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SimpleDiagnosisRequest;
    const initialResponse = buildSimpleDiagnosis(body);

    if (!initialResponse.ok) {
      return NextResponse.json(initialResponse, { status: 400 });
    }

    const homepageRead = await readHomepageSnapshot(body.company?.website || '');
    const response = buildSimpleDiagnosis(body, homepageRead);
    await captureSimpleDiagnosisEvent(response.posthog);

    return NextResponse.json(response, { status: response.ok ? 200 : 400 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        validation: {
          valid: false,
          errors: [
            {
              code: 'invalid_json',
              message: 'Request body must be valid JSON.',
              severity: 'error',
            },
          ],
          warnings: [],
        },
      },
      { status: 400 },
    );
  }
}
