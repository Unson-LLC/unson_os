import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// シンプルなファイルベース取り込み: products/**/<productId>/ads/history.json を探す
async function findHistoryPath(productId: string): Promise<string | null> {
  // 既知の配置パターン: products/2-validation/<id>/ads/history.json
  const candidate = path.join(process.cwd(), 'products', '2-validation', productId, 'ads', 'history.json')
  try {
    await fs.access(candidate)
    return candidate
  } catch {}

  // 汎用探索（浅め）: products/*/*/<id>/ads/history.json
  const productsRoot = path.join(process.cwd(), 'products')
  const stages = await fs.readdir(productsRoot).catch(() => [])
  for (const stage of stages) {
    const stageDir = path.join(productsRoot, stage)
    try {
      const entries = await fs.readdir(stageDir)
      for (const e of entries) {
        if (e === productId) {
          const p = path.join(stageDir, e, 'ads', 'history.json')
          try {
            await fs.access(p)
            return p
          } catch {}
        }
      }
    } catch {}
  }
  return null
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const p = await findHistoryPath(params.id)
    if (!p) return NextResponse.json({ ads: [] })
    const raw = await fs.readFile(p, 'utf8')
    const data = JSON.parse(raw)
    // 期待スキーマ: [{ date: '2025-08-01', impressions: 1234, clicks: 56, cost: 1234, conversions: 7 }]
    const ads = Array.isArray(data) ? data : (data.items || [])
    return NextResponse.json({ ads })
  } catch (e) {
    return NextResponse.json({ ads: [] })
  }
}

