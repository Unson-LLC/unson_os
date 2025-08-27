import { NextRequest, NextResponse } from 'next/server'
import { PR_AUTOMATION_CONSTANTS } from '@/lib/constants/pr-automation-constants'

const DATA_PATH = 'apps/lp-validation/data/positions.json'

async function ghRequest(endpoint: string, init: RequestInit = {}) {
  const token = process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_TOKEN]
  const owner = process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_OWNER] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_OWNER
  const repo = process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_REPO] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_REPO
  const url = `${PR_AUTOMATION_CONSTANTS.GITHUB_API.BASE_URL}/repos/${owner}/${repo}/${endpoint}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Authorization': token ? `token ${token}` : '',
      'Accept': PR_AUTOMATION_CONSTANTS.GITHUB_API.ACCEPT_HEADER,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })
  return res
}

async function readPositions() {
  try {
    const res = await ghRequest(`contents/${DATA_PATH}?ref=${PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH}`)
    if (!res.ok) return { positions: [], sha: undefined as string | undefined }
    const json = await res.json()
    const content = Buffer.from(json.content || '', 'base64').toString('utf8')
    const data = JSON.parse(content)
    return { positions: Array.isArray(data) ? data : [], sha: json.sha as string }
  } catch {
    return { positions: [], sha: undefined as string | undefined }
  }
}

async function writePositions(positions: any[], sha?: string) {
  const message = `chore(lp-validation): update positions data (${new Date().toISOString()})`
  const body: any = {
    message,
    content: Buffer.from(JSON.stringify(positions, null, 2), 'utf8').toString('base64'),
    branch: PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH,
  }
  if (sha) body.sha = sha
  const res = await ghRequest(`contents/${DATA_PATH}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Failed to write positions: ${res.status} ${t}`)
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { positions } = await readPositions()
  const p = positions.find((x: any) => x.id === params.id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ position: p })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { positions, sha } = await readPositions()
    const idx = positions.findIndex((p: any) => p.id === params.id)
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    positions[idx] = { ...positions[idx], ...body, id: params.id, updatedAt: new Date().toISOString() }
    await writePositions(positions, sha)
    return NextResponse.json({ ok: true, position: positions[idx] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { positions, sha } = await readPositions()
    const next = positions.filter((p: any) => p.id !== params.id)
    if (next.length === positions.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await writePositions(next, sha)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to delete' }, { status: 500 })
  }
}

