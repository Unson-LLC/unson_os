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

// サービス名マッピング
const SERVICE_NAME_MAPPING = {
  'AI-BRIDGE': '世代bridge',
  'AI世代間ブリッジ': '世代bridge',
  'AI-COACH': 'じぶん lab',
  'AI自分時間コーチ': 'じぶん lab',
  'AI-STYLIST': 'きこなし',
  'AIパーソナルスタイリスト': 'きこなし',
  'AI-LEGACY-CREATOR': '想い帳',
  'AIレガシー・クリエーター': '想い帳',
  'WATASHI-COMPASS': 'わたしコンパス'
}

export async function POST() {
  try {
    const c = client()
    
    // 既存セッションを取得
    const sessions = await c.query(api.lpValidation.getActiveSessionsByWorkspace, { 
      workspaceId: DEFAULT_WORKSPACE 
    })
    
    console.log(`移行対象セッション数: ${sessions.length}`)
    
    let updateCount = 0
    
    for (const session of sessions) {
      const oldName = session.product_name
      const newName = SERVICE_NAME_MAPPING[oldName as keyof typeof SERVICE_NAME_MAPPING]
      
      if (newName && newName !== oldName) {
        // 製品名を更新
        await c.mutation(api.lpValidation.updateProductName, {
          sessionId: session._id,
          newProductName: newName
        })
        
        console.log(`更新: ${oldName} → ${newName}`)
        updateCount++
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${updateCount}件のサービス名を更新しました`,
      updated: updateCount,
      total: sessions.length
    })
    
  } catch (error: any) {
    console.error('サービス名移行エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'サービス名の移行に失敗しました'
    }, { status: 500 })
  }
}