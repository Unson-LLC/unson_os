import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface ProjectInfo {
  id: string
  name: string
  description: string
  targetAudience: string
  mainBenefit: string
  status: string
  createdDate: string
  lpGenerated: boolean
  posthogEnabled: boolean
  configExists: boolean
  lastModified: string
}

export async function GET(request: NextRequest) {
  try {
    const validationPath = path.join(process.cwd(), '../../products/2-validation')

    if (!existsSync(validationPath)) {
      return NextResponse.json({
        success: true,
        projects: [],
        message: 'Validation directory not found'
      })
    }

    // products/2-validation配下のディレクトリを取得
    const directories = await readdir(validationPath, { withFileTypes: true })
    const projectDirectories = directories.filter(dir => dir.isDirectory())

    const projects: ProjectInfo[] = []

    for (const dir of projectDirectories) {
      const projectId = dir.name
      const projectPath = path.join(validationPath, projectId)
      const productYamlPath = path.join(projectPath, 'product.yaml')
      const configPath = path.join(projectPath, 'lp', 'configs', 'config.json')

      let projectInfo: ProjectInfo = {
        id: projectId,
        name: projectId,
        description: 'No description available',
        targetAudience: 'Unknown',
        mainBenefit: 'Unknown',
        status: 'unknown',
        createdDate: 'Unknown',
        lpGenerated: false,
        posthogEnabled: false,
        configExists: false,
        lastModified: 'Unknown'
      }

      // product.yamlから基本情報を取得
      if (existsSync(productYamlPath)) {
        try {
          const yamlContent = await readFile(productYamlPath, 'utf-8')
          
          // 簡易YAML パーサー（name, description, target_audience, main_benefit, status, created_date, lp_generated, posthog_enabledのみ）
          const nameMatch = yamlContent.match(/^name:\s*["']?(.*?)["']?$/m)
          const descMatch = yamlContent.match(/^description:\s*["']?(.*?)["']?$/m)
          const targetMatch = yamlContent.match(/^target_audience:\s*["']?(.*?)["']?$/m)
          const benefitMatch = yamlContent.match(/^main_benefit:\s*["']?(.*?)["']?$/m)
          const statusMatch = yamlContent.match(/^status:\s*["']?(.*?)["']?$/m)
          const createdMatch = yamlContent.match(/^created_date:\s*["']?(.*?)["']?$/m)
          const lpGeneratedMatch = yamlContent.match(/^lp_generated:\s*(true|false)$/m)
          const posthogMatch = yamlContent.match(/^posthog_enabled:\s*(true|false)$/m)

          if (nameMatch) projectInfo.name = nameMatch[1]
          if (descMatch) projectInfo.description = descMatch[1]
          if (targetMatch) projectInfo.targetAudience = targetMatch[1]
          if (benefitMatch) projectInfo.mainBenefit = benefitMatch[1]
          if (statusMatch) projectInfo.status = statusMatch[1]
          if (createdMatch) projectInfo.createdDate = createdMatch[1]
          if (lpGeneratedMatch) projectInfo.lpGenerated = lpGeneratedMatch[1] === 'true'
          if (posthogMatch) projectInfo.posthogEnabled = posthogMatch[1] === 'true'
        } catch (error) {
          console.warn(`Failed to parse product.yaml for ${projectId}:`, error)
        }
      }

      // config.jsonの存在確認と最終更新日時
      if (existsSync(configPath)) {
        projectInfo.configExists = true
        try {
          const stats = await stat(configPath)
          projectInfo.lastModified = stats.mtime.toISOString()
        } catch (error) {
          console.warn(`Failed to get stats for ${configPath}:`, error)
        }
      }

      projects.push(projectInfo)
    }

    // 作成日時でソート（新しい順）
    projects.sort((a, b) => {
      const dateA = a.createdDate !== 'Unknown' ? new Date(a.createdDate) : new Date(0)
      const dateB = b.createdDate !== 'Unknown' ? new Date(b.createdDate) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({
      success: true,
      projects,
      total: projects.length
    })

  } catch (error) {
    console.error('Failed to load projects:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}