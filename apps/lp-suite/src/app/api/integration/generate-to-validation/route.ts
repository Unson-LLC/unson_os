import { NextRequest, NextResponse } from 'next/server';
import { generateFullLP as generateLP, LPGenerationPrompt } from '@/lib/lp-generator';
import { ulid } from 'ulid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, validationConfig = {}, autoStart = false } = body;

    if (!prompt) {
      return NextResponse.json({ 
        error: 'プロンプトが必要です' 
      }, { status: 400 });
    }

    // 1. LP生成実行
    console.log('🔨 LP生成開始:', prompt.serviceName);
    const generationResult = await generateLP(prompt as LPGenerationPrompt);

    if (!generationResult.success) {
      return NextResponse.json({
        error: 'LP生成に失敗しました',
        details: generationResult.errors
      }, { status: 500 });
    }

    // 2. 検証ポジション作成のためのデータ準備
    const positionData = {
      id: ulid(),
      name: prompt.serviceName,
      description: prompt.serviceDescription,
      domain: validationConfig.domain || `${prompt.serviceName.toLowerCase().replace(/\s+/g, '-')}.example.com`,
      targetAudience: prompt.targetAudience,
      pricing: prompt.pricing,
      expectedCvr: validationConfig.expectedCvr || 5.0,
      expectedCpa: validationConfig.expectedCpa || 5000,
      status: 'active',
      createdAt: new Date().toISOString(),
      lpConfig: generationResult.config,
      generationStats: generationResult.stats
    };

    // 3. 検証ポジション作成API呼び出し
    console.log('🎯 検証ポジション作成開始:', positionData.name);
    const positionResponse = await fetch(`${request.url.replace('/api/integration/generate-to-validation', '/api/positions')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positionData),
    });

    if (!positionResponse.ok) {
      console.error('検証ポジション作成失敗:', await positionResponse.text());
      return NextResponse.json({
        error: '検証ポジション作成に失敗しました',
        lpGenerated: true,
        generationResult
      }, { status: 500 });
    }

    const positionResult = await positionResponse.json();

    // 4. A/Bテスト機能は廃止のためスキップ

    // 5. 統合結果返却
    return NextResponse.json({
      success: true,
      message: 'LP生成→検証ワークフロー完了',
      workflowId: ulid(),
      results: {
        lpGeneration: {
          success: true,
          stats: generationResult.stats
        },
        validation: {
          positionId: positionResult.id,
          url: `${request.url.replace('/api/integration/generate-to-validation', '')}/position/${positionResult.id}`,
          status: 'active'
        },
        abTest: null
      },
      nextSteps: [
        'LP生成完了',
        '検証ポジション作成完了',
        '最適化準備完了',
        'Google Ads連携待機中'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('統合ワークフローエラー:', error);
    return NextResponse.json({
      error: '統合ワークフロー実行中にエラーが発生しました',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// ワークフロー状況取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflowId');

  if (!workflowId) {
    return NextResponse.json({ 
      error: 'ワークフローIDが必要です' 
    }, { status: 400 });
  }

  // 実際の実装では、Convexやデータベースからワークフロー状況を取得
  return NextResponse.json({
    workflowId,
    status: 'completed',
    progress: {
      lpGeneration: 'completed',
      validation: 'active',
      abTest: 'running',
      optimization: 'pending'
    },
    results: {
      generatedAt: new Date(Date.now() - 3600000).toISOString(),
      positionId: 'mock-position-id',
      currentCvr: 3.2,
      improvementRate: 15.3
    }
  });
}
