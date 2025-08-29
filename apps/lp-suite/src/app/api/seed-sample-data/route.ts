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

// 正式サービス名のサンプルデータ
const sampleSessions = [
  {
    id: '2025-08-002-ai-bridge',
    name: '世代bridge',
    lpUrl: 'https://unson-lp-ai-bridge.vercel.app',
    status: 'active' as const,
    targetCvr: 10.0,
    targetCpa: 3980,
    minSessions: 1000,
    playbookId: 'PB-001'
  },
  {
    id: '2025-08-003-ai-coach',
    name: 'じぶん lab',
    lpUrl: 'https://unson-lp-ai-coach.vercel.app',
    status: 'active' as const,
    targetCvr: 12.0,
    targetCpa: 2980,
    minSessions: 1000,
    playbookId: 'PB-001'
  },
  {
    id: '2025-08-005-ai-stylist',
    name: 'きこなし',
    lpUrl: 'https://unson-lp-ai-stylist.vercel.app',
    status: 'active' as const,
    targetCvr: 15.0,
    targetCpa: 4980,
    minSessions: 1000,
    playbookId: 'PB-001'
  },
  {
    id: '2025-08-004-ai-legacy-creator',
    name: '想い帳',
    lpUrl: 'https://unson-lp-ai-legacy-creator.vercel.app',
    status: 'active' as const,
    targetCvr: 8.0,
    targetCpa: 19800,
    minSessions: 500,
    playbookId: 'PB-001'
  },
  {
    id: '2025-08-006-watashi-compass',
    name: 'わたしコンパス',
    lpUrl: 'https://unson-lp-watashi-compass.vercel.app',
    status: 'active' as const,
    targetCvr: 10.0,
    targetCpa: 5000,
    minSessions: 1000,
    playbookId: 'PB-001'
  },
  {
    id: '2025-08-001-mywa',
    name: 'MYWA',
    lpUrl: 'https://unson-lp-mywa.vercel.app',
    status: 'active' as const,
    targetCvr: 20.0,
    targetCpa: 2000,
    minSessions: 2000,
    playbookId: 'PB-001'
  }
]

export async function POST() {
  try {
    const c = client()
    
    console.log('正式サービス名でサンプルデータを作成中...')
    
    let createdCount = 0
    
    for (const session of sampleSessions) {
      try {
        // 既存セッションがあるかチェック（product_idで）
        const existingSessions = await c.query(api.lpValidation.getSessionsByProduct, { 
          productId: session.id,
          limit: 1
        })
        
        if (existingSessions.length > 0) {
          console.log(`${session.name} は既に存在するためスキップ`)
          continue
        }
        
        // セッション作成
        await c.mutation(api.lpValidation.createSession, {
          workspace_id: DEFAULT_WORKSPACE,
          product_id: session.id,
          product_name: session.name,
          lp_url: session.lpUrl,
          status: session.status,
          target_cvr: session.targetCvr,
          target_cpa: session.targetCpa,
          min_sessions: session.minSessions,
          automation_enabled: true,
          auto_optimization: true,
          auto_deployment: false,
          current_playbook_id: session.playbookId,
          created_by: 'sample-data-seeder'
        })
        
        console.log(`✅ ${session.name} セッション作成完了`)
        createdCount++
        
      } catch (error) {
        console.error(`${session.name} 作成エラー:`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${createdCount}件の正式サービス名サンプルデータを作成しました`,
      created: createdCount,
      total: sampleSessions.length
    })
    
  } catch (error: any) {
    console.error('サンプルデータ作成エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'サンプルデータの作成に失敗しました'
    }, { status: 500 })
  }
}

// 古いデータを削除する機能
export async function DELETE() {
  try {
    const c = client()
    
    // 全アクティブセッション取得
    const sessions = await c.query(api.lpValidation.getActiveSessionsByWorkspace, {
      workspaceId: DEFAULT_WORKSPACE
    })
    
    console.log(`削除対象セッション数: ${sessions.length}`)
    
    let deletedCount = 0
    
    for (const session of sessions) {
      await c.mutation(api.lpValidation.deleteSession, {
        sessionId: session._id
      })
      deletedCount++
    }
    
    return NextResponse.json({
      success: true,
      message: `${deletedCount}件のセッションを削除しました`,
      deleted: deletedCount
    })
    
  } catch (error: any) {
    console.error('データ削除エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'データの削除に失敗しました'
    }, { status: 500 })
  }
}