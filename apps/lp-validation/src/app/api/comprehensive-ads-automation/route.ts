// 包括的Google Ads AI自動化API エンドポイント
import { NextRequest, NextResponse } from 'next/server'
import { 
  runComprehensiveAutomation, 
  ComprehensiveAutomationConfig 
} from '../../../../../mastra/workflows/comprehensive-ads-automation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const config: ComprehensiveAutomationConfig = {
      customerId: parseInt(body.customerId) || 1234567890,
      loginCustomerId: parseInt(body.loginCustomerId) || 9876543210,
      productId: body.productId || 'WATASHI-COMPASS',
      businessGoals: body.businessGoals || [
        'CVR向上',
        'CPA削減', 
        'リーチ拡大',
        'ブランド認知向上'
      ],
      constraints: {
        maxBudgetIncrease: body.constraints?.maxBudgetIncrease || 20,
        maxDailyChanges: body.constraints?.maxDailyChanges || 10,
        riskTolerance: body.constraints?.riskTolerance || 'balanced'
      },
      dryRun: body.dryRun !== false // デフォルトは true
    }

    console.log('包括的Google Ads AI自動化開始:', {
      productId: config.productId,
      businessGoals: config.businessGoals,
      constraints: config.constraints,
      dryRun: config.dryRun
    })
    
    const result = await runComprehensiveAutomation(config)
    
    console.log('包括的AI自動化完了:', {
      status: result.status,
      totalActions: result.summary.totalActions,
      successfulActions: result.summary.successfulActions,
      highImpactActions: result.summary.highImpactActions
    })

    return NextResponse.json({
      success: true,
      result,
      message: `包括的AI自動化が${result.status === 'success' ? '成功' : result.status === 'partial' ? '部分的に成功' : '失敗'}しました`,
      summary: result.summary
    })
    
  } catch (error: any) {
    console.error('包括的Google Ads AI自動化エラー:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '包括的AI自動化処理に失敗しました'
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    name: '包括的Google Ads AI自動化API',
    description: 'AIがGoogle Ads APIの全機能を判断・実行する包括的自動最適化システム',
    usage: {
      method: 'POST',
      endpoint: '/api/comprehensive-ads-automation',
      body: {
        customerId: 'Google Ads顧客ID（数値）',
        loginCustomerId: 'ログイン顧客ID（数値）',
        productId: 'プロダクトID（例: WATASHI-COMPASS）',
        businessGoals: [
          'CVR向上', 'CPA削減', 'リーチ拡大', 'ブランド認知向上',
          'コンバージョン数増加', 'クリック単価削減', '品質スコア改善'
        ],
        constraints: {
          maxBudgetIncrease: '予算増加上限（%、例: 20）',
          maxDailyChanges: '1日の最大変更数（例: 10）',
          riskTolerance: 'conservative | balanced | aggressive'
        },
        dryRun: 'true（デフォルト）/ false（実際実行）'
      }
    },
    capabilities: {
      '🎯 AIによる包括的分析': [
        'パフォーマンス指標の多角的分析',
        '競合・季節要因を考慮した戦略立案',
        'ビジネス目標に合わせた最適化提案'
      ],
      '🔧 対応可能な操作カテゴリ': [
        'キーワード管理（追加・削除・入札調整・マッチタイプ変更）',
        '広告文・クリエイティブ（RSA作成・A/Bテスト・動的広告）',
        'キャンペーン管理（予算配分・入札戦略・ターゲティング）',
        'オーディエンス（リマーケ・類似・デモグラフィック）',
        '広告表示オプション（サイトリンク・コールアウト等）',
        '自動化・スマート入札（目標CPA・ROAS・最大化）'
      ],
      '⚡ Google Ads API全機能対応': [
        'キーワード: 追加・削除・停止・入札調整・マッチタイプ変更',
        'ネガティブキーワード: キャンペーン・広告グループレベル',
        '広告: レスポンシブ検索広告・動的検索広告・ショッピング広告',
        'キャンペーン: 予算・入札戦略・配信設定・地域ターゲティング',
        '表示オプション: サイトリンク・電話番号・住所・価格・プロモーション',
        'オーディエンス: リマーケ・カスタム・類似・デモグラ・アフィニティ',
        '自動化: スマート入札・自動ルール・レスポンシブディスプレイ広告'
      ],
      '🛡️ 安全機能': [
        'リスクレベル評価（conservative/balanced/aggressive）',
        '予算変更制限（設定可能上限）',
        '1日の変更件数制限',
        'DRY RUNモードでの事前確認',
        '段階的実行による影響最小化'
      ]
    },
    response_format: {
      aiStrategy: 'AI エージェントが生成した最適化戦略',
      comprehensiveActions: '実行された全アクションの詳細',
      executionResults: '各アクションの実行結果',
      summary: {
        totalActions: '総アクション数',
        successfulActions: '成功アクション数', 
        highImpactActions: '高インパクトアクション数',
        estimatedImprovements: '期待される改善効果'
      },
      status: 'success | partial | failed'
    },
    examples: {
      conservative: '安全重視: 低リスクなキーワード・広告文最適化のみ',
      balanced: 'バランス: 中程度の予算・入札戦略調整を含む',
      aggressive: '積極的: 大幅な戦略変更・新機能導入を含む'
    }
  })
}