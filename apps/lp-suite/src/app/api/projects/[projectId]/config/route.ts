import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // プロジェクトディレクトリのパスを構築
    const projectBasePath = path.join(process.cwd(), '../../products/2-validation', projectId)
    const configPath = path.join(projectBasePath, 'lp', 'configs', 'config.json')

    // ファイルの存在確認
    if (!existsSync(configPath)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Configuration file not found for project: ${projectId}`,
          path: configPath
        },
        { status: 404 }
      )
    }

    // config.jsonを読み込み
    const configData = await readFile(configPath, 'utf-8')
    const config = JSON.parse(configData)

    return NextResponse.json({
      success: true,
      config,
      projectId,
      configPath
    })

  } catch (error) {
    console.error('Failed to load project config:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}