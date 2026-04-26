import { NextResponse } from 'next/server';

import { buildIntakeDryRun } from '@/lib/ai-employee-intake/transform';
import type { AiEmployeeIntakeRequest } from '@/lib/ai-employee-intake/types';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dryRun') === 'true';

  if (!dryRun) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Only dryRun=true is implemented. Real Graph/PostHog/NocoDB writes are intentionally disabled.',
      },
      { status: 501 },
    );
  }

  try {
    const body = (await request.json()) as AiEmployeeIntakeRequest;
    const response = buildIntakeDryRun(body);

    return NextResponse.json(response, { status: response.ok ? 200 : 400 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        dry_run: true,
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
        write_plan: [],
        graph: {
          entities: [],
          edges: [],
        },
      },
      { status: 400 },
    );
  }
}
