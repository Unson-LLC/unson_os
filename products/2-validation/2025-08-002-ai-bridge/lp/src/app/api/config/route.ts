import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { TemplateConfig } from '@/types/template'

const configPath = path.join(process.cwd(), 'configs', 'config.json')

export async function GET() {
  try {
    const configFile = await fs.readFile(configPath, 'utf8')
    const config: TemplateConfig = JSON.parse(configFile)
    // Basic validation of essential fields
    if (!config.meta || !config.meta.title || !config.meta.description) {
      throw new Error('Invalid config: meta.title/description are required')
    }
    if (!config.content || !config.content.hero || !config.content.form) {
      throw new Error('Invalid config: content.hero and content.form are required')
    }
    
    return NextResponse.json({ config, lastModified: Date.now() })
  } catch (error) {
    console.error('Error reading config file:', error)
    return NextResponse.json(
      { error: 'Failed to read config file' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { config } = await request.json()
    
    // Validate config structure (basic validation)
    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { error: 'Invalid config format' },
        { status: 400 }
      )
    }
    
    // enforce minimal fields before save
    if (!config.meta?.title || !config.meta?.description) {
      return NextResponse.json(
        { error: 'meta.title and meta.description are required' },
        { status: 400 }
      )
    }
    if (!config.content?.hero || !config.content?.form) {
      return NextResponse.json(
        { error: 'content.hero and content.form are required' },
        { status: 400 }
      )
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ success: true, lastModified: Date.now() })
  } catch (error) {
    console.error('Error writing config file:', error)
    return NextResponse.json(
      { error: 'Failed to write config file' },
      { status: 500 }
    )
  }
}
