import { NextRequest, NextResponse } from 'next/server';
import { generateLPImages, createImageGenerationConfigFromTemplate } from '@/lib/image-generator';
import { TemplateConfig } from '@/types/template';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, serviceName, outputPath } = body as {
      config: TemplateConfig;
      serviceName: string;
      outputPath?: string;
    };

    // 画像生成設定をチェック
    const imageConfig = createImageGenerationConfigFromTemplate(config);
    if (!imageConfig) {
      return NextResponse.json({
        success: false,
        error: 'Image generation is not enabled in the config'
      });
    }

    // 出力パスを決定 - LP プロジェクトディレクトリに保存
    const projectName = serviceName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const projectDirName = `2025-09-011-${projectName}`;
    const defaultOutputPath = path.join(process.cwd(), '../../products/2-validation', projectDirName, 'lp/images');
    const finalOutputPath = outputPath || defaultOutputPath;

    // 出力ディレクトリを作成
    if (!fs.existsSync(finalOutputPath)) {
      fs.mkdirSync(finalOutputPath, { recursive: true });
    }

    console.log(`🎨 Starting image generation for ${serviceName}...`);
    
    // 画像を生成
    const result = await generateLPImages(imageConfig, finalOutputPath);

    return NextResponse.json({
      success: true,
      serviceName,
      outputPath: finalOutputPath,
      generated: result.success,
      total: result.total,
      errors: result.errors,
      config: imageConfig
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'status') {
    // 画像生成の状態を確認
    return NextResponse.json({
      geminiApiConfigured: !!process.env.GEMINI_API_KEY,
      status: 'ready'
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Invalid action'
  });
}