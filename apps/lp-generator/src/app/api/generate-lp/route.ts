import { NextRequest, NextResponse } from 'next/server';
import { generateFullLP, LPGenerationPrompt } from '@/lib/lp-generator';
import { TemplateConfig } from '@/types/template';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt: LPGenerationPrompt = body;

    // バリデーション
    if (!prompt.serviceName || !prompt.serviceDescription || !prompt.targetAudience || !prompt.mainBenefit) {
      return NextResponse.json(
        { success: false, error: 'Required fields: serviceName, serviceDescription, targetAudience, mainBenefit' },
        { status: 400 }
      );
    }

    // LP生成
    console.log(`🚀 Generating LP for: ${prompt.serviceName}`);
    const result = await generateFullLP(prompt);

    if (!result.success || !result.config) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate LP',
        errors: result.errors
      }, { status: 500 });
    }

    // 既存のconfig.jsonを読み込み、生成されたコンテンツをマージ
    const configPath = path.join(process.cwd(), 'configs', 'config.json');
    let existingConfig: TemplateConfig = {} as TemplateConfig;

    if (existsSync(configPath)) {
      try {
        const existingConfigData = await readFile(configPath, 'utf-8');
        existingConfig = JSON.parse(existingConfigData);
      } catch (error) {
        console.warn('Failed to read existing config, using defaults');
      }
    }

    // 生成されたコンテンツと既存の設定をマージ
    const mergedConfig: TemplateConfig = {
      ...existingConfig,
      ...result.config,
      meta: {
        ...existingConfig.meta,
        ...result.config.meta
      },
      content: {
        ...existingConfig.content,
        ...result.config.content
      },
      settings: {
        ...existingConfig.settings,
        // 開発者設定は保持
        development: {
          showCopywritingTips: true,
          copywritingTipsPosition: 'bottom',
          showSectionGuides: false,
          ...existingConfig.settings?.development
        }
      },
      theme: existingConfig.theme || {
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#EC4899',
          background: '#FFFFFF',
          text: '#1F2937',
          textLight: '#6B7280'
        },
        fonts: {
          heading: "'Inter', sans-serif",
          body: "'Inter', sans-serif"
        },
        gradients: {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
      },
      assets: existingConfig.assets || {
        logo: '/images/logo.svg',
        favicon: '/favicon.ico',
        images: {}
      }
    };

    // config.jsonに保存
    const configsDir = path.join(process.cwd(), 'configs');
    if (!existsSync(configsDir)) {
      await mkdir(configsDir, { recursive: true });
    }

    await writeFile(configPath, JSON.stringify(mergedConfig, null, 2));

    console.log(`✅ LP generated and saved for: ${prompt.serviceName}`);

    return NextResponse.json({
      success: true,
      config: mergedConfig,
      generatedSections: Object.keys(result.config.content || {}),
      errors: result.errors,
      message: `LP generated successfully for ${prompt.serviceName}`
    });

  } catch (error) {
    console.error('LP generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LP Generator API',
    endpoints: {
      'POST /api/generate-lp': 'Generate a complete landing page',
    },
    required_fields: ['serviceName', 'serviceDescription', 'targetAudience', 'mainBenefit'],
    optional_fields: ['pricing', 'competitorAnalysis', 'brandTone']
  });
}