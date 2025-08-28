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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const productIds: string[] = Array.isArray(body?.productIds) ? body.productIds : []
    if (productIds.length === 0) {
      return NextResponse.json({ error: 'productIds is required (array)' }, { status: 400 })
    }
    const c = client()
    const results: Record<string, number> = {}
    for (const pid of productIds) {
      const sessions: any[] = await c.query(api.lpValidation.getSessionsByProduct, { productId: pid, limit: 100 })
      let deleted = 0
      for (const s of sessions) {
        if (s?._id) {
          await c.mutation(api.lpValidation.deleteSession, { sessionId: s._id })
          deleted++
        }
      }
      results[pid] = deleted
    }
    return NextResponse.json({ ok: true, results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to purge positions' }, { status: 500 })
  }
}

