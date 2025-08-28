import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../convex/_generated/api'

// Read env at runtime using bracket notation to avoid compile-time inlining
function env(key: string): string {
  try {
    // @ts-ignore
    return (process.env && (process.env as any)[key]) || ''
  } catch {
    return ''
  }
}

const DEFAULT_WORKSPACE = env('NEXT_PUBLIC_DEFAULT_WORKSPACE_ID') || 'unson_main'

function resolveConvexUrl(): string {
  const val = (env('NEXT_PUBLIC_CONVEX_URL') || env('CONVEX_URL') || '').trim()
  const dep = (env('CONVEX_DEPLOYMENT') || '').trim()
  // Prefer explicit URL when provided and not default
  if (val && val !== 'default') return val
  // If convex dev is running (dev:xxxx) or URL is default, use local dev server
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  throw new Error('Convex URL is not configured')
}

function client() {
  return new ConvexHttpClient(resolveConvexUrl())
}

export async function GET() {
  const c = client()
  // 当面はワークスペースのアクティブセッション＝ポジションとして扱う
  const sessions = await c.query(api.lpValidation.getActiveSessionsByWorkspace, { workspaceId: DEFAULT_WORKSPACE })
  const positions = sessions.map((s: any) => ({
    id: s.product_id,
    name: s.product_name,
    lpUrl: s.lp_url,
    status: 'active',
    cvr: s.current_cvr,
    cpl: s.current_cpa ? `¥${Math.round(s.current_cpa)}` : '',
    leads: s.total_conversions,
    grade: '',
    performance: s.current_playbook_status || '',
    description: '',
  }))
  return NextResponse.json({ positions })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const required = ['id', 'name', 'lpUrl']
    for (const k of required) {
      if (!body[k]) return NextResponse.json({ error: `${k} is required` }, { status: 400 })
    }
    const c = client()
    await c.mutation(api.lpValidation.createSession, {
      workspace_id: DEFAULT_WORKSPACE,
      product_id: body.id,
      product_name: body.name,
      lp_url: body.lpUrl,
      status: (body.status as any) || 'active',
      target_cvr: Number(body.targetCvr ?? 5),
      target_cpa: Number(body.targetCpa ?? 2000),
      min_sessions: Number(body.minSessions ?? 100),
      google_ads_campaign_id: body.googleAdsCampaignId,
      automation_enabled: body.automationEnabled ?? true,
      auto_optimization: body.autoOptimization ?? true,
      auto_deployment: body.autoDeployment ?? false,
      current_playbook_id: body.playbookId,
      created_by: body.createdBy || 'lp-validation-ui',
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create session' }, { status: 500 })
  }
}
