import { NextRequest, NextResponse } from 'next/server'
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
  try {
    const c = client()
    const items = await c.query(api.ads.getDailyMetricsByProduct, { product_id: params.id, limit: 30 })
    // normalize to UI shape
    const ads = (items || []).map((it: any) => ({
      date: it.date,
      impressions: it.impressions,
      clicks: it.clicks,
      cost: it.cost,
      conversions: it.conversions,
    }))
    return NextResponse.json({ ads })
  } catch (e) {
    return NextResponse.json({ ads: [] })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const items = Array.isArray(body) ? body : body.items
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    // workspaceを最新セッションから推定する
    const c = client()
    const sessions = await c.query(api.lpValidation.getSessionsByProduct, { productId: params.id, limit: 1 })
    const s = sessions[0]
    const workspace_id = s?.workspace_id || 'unson_main'
    await c.mutation(api.ads.importDailyMetrics, {
      workspace_id,
      product_id: params.id,
      items: items.map((d: any) => ({
        date: d.date,
        impressions: Number(d.impressions || 0),
        clicks: Number(d.clicks || 0),
        cost: Number(d.cost || 0),
        conversions: Number(d.conversions || 0),
        platform: d.platform || 'Google Ads',
      }))
    })
    return NextResponse.json({ success: true, count: items.length })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to import' }, { status: 500 })
  }
}
