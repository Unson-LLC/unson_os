import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../../../convex/_generated/api'

function env(key: string): string {
  try {
    // @ts-ignore
    return (process.env && (process.env as any)[key]) || ''
  } catch {
    return ''
  }
}

function resolveConvexUrl(): string {
  const val = (env('NEXT_PUBLIC_CONVEX_URL') || env('CONVEX_URL') || '').trim()
  const dep = (env('CONVEX_DEPLOYMENT') || '').trim()
  if (val && val !== 'default') return val
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  throw new Error('Convex URL is not configured')
}

function client() {
  return new ConvexHttpClient(resolveConvexUrl())
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const c = client()
  // 最新セッションを取得
  const sessions = await c.query(api.lpValidation.getSessionsByProduct, { productId: params.id, limit: 1 })
  const s = sessions[0]
  if (!s) return NextResponse.json({ executions: [] })

  // ワークスペースの実行から該当セッションのものを抽出
  const execs = await c.query(api.playbook.getWorkspaceExecutions, { workspace_id: s.workspace_id, limit: 50 })
  const filtered = (execs || [])
    .filter((e: any) => e.session_id === s.session_id)
    .sort((a: any, b: any) => (b.started_at || b.created_at || 0) - (a.started_at || a.created_at || 0))
    .slice(0, 10)

  const executions = filtered.map((e: any) => {
    const ts = new Date(e.started_at || e.created_at || Date.now())
    const hh = ts.getHours().toString().padStart(2, '0')
    const mm = ts.getMinutes().toString().padStart(2, '0')
    return {
      time: `${hh}:${mm}`,
      status: e.status,
      phase: e.current_phase,
      progress: e.phase_completion_percentage,
      nextActions: e.next_actions || [],
      kpi: e.kpi_current || {},
      summary: e.execution_summary || '',
    }
  })

  return NextResponse.json({ executions })
}

