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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const c = client()
    const { searchParams } = new URL(req.url)
    const gran = (searchParams.get('granularity') || '4h').toLowerCase()
    if (gran === '4h' || gran === 'window') {
      const items = await c.query(api.ads.getWindowMetricsByProduct, { product_id: params.id, window_hours: 4, limit: 24 })
      const ads = (items || []).map((it: any) => {
        const d = new Date(it.ts_start)
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        const hh = String(d.getHours()).padStart(2, '0')
        return {
          date: `${d.getFullYear()}-${mm}-${dd} ${hh}:00`,
          impressions: it.impressions,
          clicks: it.clicks,
          cost: it.cost,
          conversions: it.conversions,
        }
      })
      return NextResponse.json({ ads })
    } else {
      const items = await c.query(api.ads.getDailyMetricsByProduct, { product_id: params.id, limit: 30 })
      const ads = (items || []).map((it: any) => ({
        date: it.date,
        impressions: it.impressions,
        clicks: it.clicks,
        cost: it.cost,
        conversions: it.conversions,
      }))
      return NextResponse.json({ ads })
    }
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
    const c = client()
    const sessions = await c.query(api.lpValidation.getSessionsByProduct, { productId: params.id, limit: 1 })
    const s = sessions[0]
    const workspace_id = s?.workspace_id || 'unson_main'

    // Determine import mode: windowed (4h) vs daily
    const mode = (body.mode || body.granularity || '').toLowerCase()
    if (mode === '4h' || mode === 'window') {
      await c.mutation(api.ads.importWindowMetrics, {
        workspace_id,
        product_id: params.id,
        window_hours: Number(body.windowHours || 4),
        items: items.map((d: any) => ({
          ts_start: Number(d.ts_start ?? d.timestamp ?? Date.parse(d.datetime || d.date) || 0),
          impressions: Number(d.impressions || 0),
          clicks: Number(d.clicks || 0),
          cost: Number(d.cost || 0),
          conversions: Number(d.conversions || 0),
          platform: d.platform || 'Google Ads',
        })),
      })
    } else {
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
        })),
      })
    }
    return NextResponse.json({ success: true, count: items.length })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to import' }, { status: 500 })
  }
}
