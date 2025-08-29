import { NextRequest, NextResponse } from 'next/server';
import { ulid } from 'ulid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { positionId, testConfig = {} } = body;

    if (!positionId) {
      return NextResponse.json({ 
        error: 'ポジションIDが必要です' 
      }, { status: 400 });
    }

    // PostHog Feature Flags統合準備（実装予定）
    const abTestData = {
      testId: ulid(),
      positionId,
      flagKey: `lp-test-${positionId}`,
      variants: [
        {
          name: 'control',
          description: 'オリジナルLP',
          allocation: 50
        },
        {
          name: 'variant-1',
          description: 'AI最適化版',
          allocation: 50
        }
      ],
      config: {
        minSampleSize: testConfig.minSampleSize || 100,
        significance: testConfig.significance || 0.95,
        duration: testConfig.duration || 7, // days
        metrics: ['conversion_rate', 'cpa', 'bounce_rate'],
        ...testConfig
      },
      status: 'active',
      startedAt: new Date().toISOString()
    };

    // 実際の実装では、PostHog APIを呼び出してフィーチャーフラグを作成
    console.log('🧪 PostHog A/Bテスト設定:', abTestData);

    // モックレスポンス（実装時にはPostHog API統合）
    const mockPostHogResponse = {
      success: true,
      flag: {
        key: abTestData.flagKey,
        id: 'mock-flag-id',
        active: true
      }
    };

    if (!mockPostHogResponse.success) {
      throw new Error('PostHog A/Bテスト作成に失敗しました');
    }

    // Convexに A/Bテストデータ保存（実装予定）
    // await api.mutations.lpAbTests.create({ 
    //   testId: abTestData.testId,
    //   positionId,
    //   posthogFlagId: mockPostHogResponse.flag.id,
    //   config: abTestData.config
    // });

    return NextResponse.json({
      success: true,
      testId: abTestData.testId,
      flagKey: abTestData.flagKey,
      posthogFlagId: mockPostHogResponse.flag.id,
      status: 'active',
      variants: abTestData.variants,
      config: abTestData.config,
      urls: {
        dashboard: `/position/${positionId}?tab=ab-test`,
        postHogDashboard: `https://app.posthog.com/feature_flags/${mockPostHogResponse.flag.id}`
      },
      estimatedResults: {
        minDuration: `${abTestData.config.duration}日`,
        requiredTraffic: abTestData.config.minSampleSize * 2,
        expectedSignificance: `${(abTestData.config.significance * 100)}%`
      }
    });

  } catch (error) {
    console.error('A/Bテスト開始エラー:', error);
    return NextResponse.json({
      error: 'A/Bテスト開始中にエラーが発生しました',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// A/Bテスト結果取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get('testId');

  if (!testId) {
    return NextResponse.json({ 
      error: 'テストIDが必要です' 
    }, { status: 400 });
  }

  // モックデータ（実装時にはConvex + PostHogから実データ取得）
  return NextResponse.json({
    testId,
    status: 'running',
    progress: {
      duration: 3, // days
      totalVisitors: 245,
      controlVisitors: 122,
      variantVisitors: 123,
      conversions: {
        control: 8,
        variant: 12
      },
      significance: 0.73 // 73% - まだ有意でない
    },
    currentWinner: 'variant-1',
    metrics: {
      conversionRate: {
        control: 6.56,
        variant: 9.76,
        improvement: 48.8,
        significance: 0.73
      },
      cpa: {
        control: 4200,
        variant: 3100,
        improvement: -26.2,
        significance: 0.81
      }
    },
    recommendation: 'サンプルサイズが小さいため継続観測中',
    nextAction: 'あと4日間継続推奨'
  });
}