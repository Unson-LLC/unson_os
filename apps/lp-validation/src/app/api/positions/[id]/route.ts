import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../../convex/_generated/api'

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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const c = client()
  // product_idで最新セッションを取得
  const sessions = await c.query(api.lpValidation.getSessionsByProduct, { productId: params.id, limit: 1 })
  const s = sessions[0]
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const position = {
    id: s.product_id,
    name: s.product_name,
    lpUrl: s.lp_url,
    status: s.status,
    cvr: s.current_cvr,
    cpl: s.current_cpa ? `¥${Math.round(s.current_cpa)}` : '',
    leads: s.total_conversions,
    sessions: s.total_sessions,
    spend: s.total_spend,
    sessionId: s.session_id,
    workspaceId: s.workspace_id,
    grade: '',
    performance: s.current_playbook_status || '',
    description: '',
  }
  return NextResponse.json({ position })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // ここでは簡易対応: 直接更新APIは未提供のためNot Implemented
    return NextResponse.json({ error: 'Not Implemented' }, { status: 501 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // ここでは簡易対応: セッション削除はドキュメントIDが必要なため未実装
    return NextResponse.json({ error: 'Not Implemented' }, { status: 501 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete' }, { status: 500 })
  }
}
