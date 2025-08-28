import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../convex/_generated/api'

const RAW_CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL
const DEFAULT_WORKSPACE = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || 'unson_main'

function resolveConvexUrl(): string {
  const val = (RAW_CONVEX_URL || '').trim()
  if (!val) throw new Error('Convex URL is not configured')
  if (val === 'default') return 'http://127.0.0.1:3210'
  return val
}

function client() {
  return new ConvexHttpClient(resolveConvexUrl())
}

export async function GET(_req: NextRequest) {
  const c = client()
  const alerts = await c.query(api.systemAlerts.getActiveAlerts, {
    workspaceId: DEFAULT_WORKSPACE,
    limit: 20,
  })
  return NextResponse.json({ alerts })
}

