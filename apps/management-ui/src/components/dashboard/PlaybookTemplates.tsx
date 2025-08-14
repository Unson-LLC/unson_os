import React, { useState } from 'react'

// プレイブックテンプレート = 業界別SaaS運用ノウハウ
interface PlaybookTemplate {
  id: string
  name: string
  industry: string  // '予約業界', 'FinTech', 'EdTech'
  category: string  // 'B2B', 'B2C', 'MarketPlace'
  description: string
  targetMarket: string[]  // ['SMB', 'Enterprise', 'Consumer']
  
  // 業界特有の調査段階
  researchPhase: {
    marketAnalysis: string[]  // この業界で調べるべきこと
    competitorAnalysis: string[]
    userResearch: string[]
    regulatoryCheck: string[]  // 法的チェック項目
  }
  
  // 業界特有の開発段階
  developmentPhase: {
    coreFeatures: string[]  // 必須機能
    integrations: string[]  // 必要な外部連携
    compliance: string[]   // コンプライアンス要件
    scalingConsiderations: string[]
  }
  
  // 業界特有の運用段階
  operationPhase: {
    keyMetrics: string[]   // 重要指標
    commonIssues: string[] // よくある問題
    seasonality: string[]  // 季節性の考慮
    customerSupport: string[] // サポート要件
  }
  
  // 成功/失敗パターン
  patterns: {
    successCases: {
      condition: string
      outcome: string
      lessons: string[]
    }[]
    failureCases: {
      condition: string
      outcome: string
      lessons: string[]
    }[]
  }
  
  // 使用するPKG
  recommendedPKGs: string[]
  
  // 実績
  stats: {
    usageCount: number
    successRate: number
    avgTimeToMarket: string
    avgFirstYearRevenue: number
  }
}

// モックプレイブックテンプレート
const mockPlaybookTemplates: PlaybookTemplate[] = [
  {
    id: 'reservation_systems',
    name: '予約システム業界プレイブック',
    industry: '予約・ブッキング',
    category: 'B2B2C',
    description: '美容院、レストラン、施設予約等の予約システム構築・運用ノウハウ',
    targetMarket: ['SMB', 'Local Business'],
    
    researchPhase: {
      marketAnalysis: [
        '地域の競合予約システム調査',
        'ターゲット店舗の予約フロー分析',
        '繁忙期・閑散期の需要パターン',
        'ノーショー率の業界平均調査'
      ],
      competitorAnalysis: [
        'HotPepper Beauty、ぐるなび等の大手',
        '地域密着型予約システム',
        'POS連携システム',
        '料金体系比較（手数料 vs 月額）'
      ],
      userResearch: [
        '店舗オーナーの予約管理の痛み',
        '顧客の予約行動パターン',
        'キャンセル・変更の頻度',
        'リマインド機能の需要'
      ],
      regulatoryCheck: [
        '個人情報保護法対応',
        '決済代行業者登録',
        '消費者契約法への対応'
      ]
    },
    
    developmentPhase: {
      coreFeatures: [
        'カレンダー予約機能',
        'リマインド通知（SMS/メール）',
        'キャンセル・変更機能',
        'POS・会計システム連携'
      ],
      integrations: [
        'SMS配信API（Twilio等）',
        '決済システム（Stripe、PayPal）',
        'Google Calendar同期',
        'POS連携（Square、Airレジ等）'
      ],
      compliance: [
        '個人情報の暗号化',
        'クレカ情報の非保持',
        'GDPR対応（海外展開時）'
      ],
      scalingConsiderations: [
        '複数店舗管理機能',
        'フランチャイズ対応',
        'API提供による他システム連携',
        'ホワイトラベル対応'
      ]
    },
    
    operationPhase: {
      keyMetrics: [
        '予約完了率（CVR）',
        'ノーショー率',
        '1店舗あたりの月間予約数',
        '店舗継続率',
        'ARPU（店舗あたり売上）'
      ],
      commonIssues: [
        'ノーショーによる売上損失',
        '繁忙期のサーバー負荷',
        '店舗のITリテラシー不足',
        'キャンセル料トラブル'
      ],
      seasonality: [
        '美容院：年末年始、卒業・入学シーズン',
        'レストラン：歓送迎会、クリスマス',
        '施設：夏休み、GW、年末年始'
      ],
      customerSupport: [
        '店舗向け操作サポート',
        '顧客からの予約変更対応',
        '障害時の代替手段提供'
      ]
    },
    
    patterns: {
      successCases: [
        {
          condition: '地域密着 + POS連携',
          outcome: '1年で地域シェア30%獲得',
          lessons: ['地域営業の重要性', 'POS連携による工数削減効果大']
        },
        {
          condition: '特定業界に特化',
          outcome: 'ニッチ業界でのデファクトスタンダード化',
          lessons: ['業界特化のカスタマイズが差別化要因', 'コミュニティ形成が重要']
        }
      ],
      failureCases: [
        {
          condition: '大手競合との正面衝突',
          outcome: '価格競争に巻き込まれ収益悪化',
          lessons: ['差別化ポイントの明確化不足', '顧客セグメント選択ミス']
        },
        {
          condition: '多機能化しすぎ',
          outcome: 'UI複雑化でユーザー離脱',
          lessons: ['シンプルさの価値', 'ターゲットの絞り込み重要性']
        }
      ]
    },
    
    recommendedPKGs: [
      'local_business_research',
      'pos_integration_development', 
      'reservation_optimization',
      'seasonal_demand_management'
    ],
    
    stats: {
      usageCount: 23,
      successRate: 65,
      avgTimeToMarket: '45日',
      avgFirstYearRevenue: 2800000
    }
  },
  
  {
    id: 'personal_fintech',
    name: '個人向けFinTechプレイブック',
    industry: 'FinTech',
    category: 'B2C',
    description: '家計簿、投資、保険等の個人向け金融サービス',
    targetMarket: ['Consumer', 'Mass Market'],
    
    researchPhase: {
      marketAnalysis: [
        '金融リテラシー調査',
        '既存金融サービスの満足度',
        'モバイルファースト前提の調査',
        '年齢層別の金融行動パターン'
      ],
      competitorAnalysis: [
        'マネーフォワード、Zaim等の家計簿',
        '証券会社のアプリ',
        '銀行の公式アプリ',
        '海外FinTechサービス'
      ],
      userResearch: [
        '現在の家計管理方法',
        '投資経験とリスク許容度',
        '金融情報の信頼できるソース',
        'セキュリティに対する不安'
      ],
      regulatoryCheck: [
        '金融商品取引法',
        '銀行法（口座連携時）',
        '個人情報保護法（機微情報）',
        '投資助言・代理業登録の要否'
      ]
    },
    
    developmentPhase: {
      coreFeatures: [
        '銀行・証券口座の自動連携',
        '支出カテゴリ自動分類',
        '予算管理・アラート機能',
        'セキュリティ強化（2FA等）'
      ],
      integrations: [
        '銀行API（全銀協、オープンバンキング）',
        '証券会社API',
        'クレジットカード明細取得',
        'レシートOCR（Google Vision等）'
      ],
      compliance: [
        'PCI DSS準拠',
        '金融データの暗号化',
        'アクセスログの保管',
        '第三者セキュリティ監査'
      ],
      scalingConsiderations: [
        '多通貨対応',
        '法人版の提供',
        'API提供によるエコシステム構築',
        '投資商品の直接販売'
      ]
    },
    
    operationPhase: {
      keyMetrics: [
        'DAU（デイリーアクティブユーザー）',
        'セッション時間',
        '口座連携数',
        '有料プラン転換率',
        'データ精度（自動分類正解率）'
      ],
      commonIssues: [
        '銀行API接続の不安定性',
        '自動分類の精度問題',
        'セキュリティインシデント',
        'ユーザーの継続利用率低下'
      ],
      seasonality: [
        '1月：新年の家計見直し需要',
        '3月：確定申告シーズン',
        '12月：年末の資産整理'
      ],
      customerSupport: [
        '口座連携トラブル対応',
        'データ同期の問題解決',
        'セキュリティ関連の問い合わせ'
      ]
    },
    
    patterns: {
      successCases: [
        {
          condition: '特定世代に特化（20代女性等）',
          outcome: 'ターゲット層で高いエンゲージメント',
          lessons: ['ペルソナの明確化', 'SNSマーケティングの効果']
        }
      ],
      failureCases: [
        {
          condition: 'セキュリティ軽視',
          outcome: 'データ漏洩で信頼失墜',
          lessons: ['FinTechではセキュリティが最優先', '透明性のある情報開示']
        }
      ]
    },
    
    recommendedPKGs: [
      'financial_regulatory_check',
      'bank_api_integration',
      'fintech_security_hardening',
      'financial_literacy_onboarding'
    ],
    
    stats: {
      usageCount: 18,
      successRate: 72,
      avgTimeToMarket: '65日',
      avgFirstYearRevenue: 5200000
    }
  },
  
  {
    id: 'b2b_productivity',
    name: 'B2B生産性ツールプレイブック',
    industry: 'B2B SaaS',
    category: 'B2B',
    description: '議事録、タスク管理、CRM等のビジネス生産性向上ツール',
    targetMarket: ['SMB', 'Mid-Market', 'Enterprise'],
    
    researchPhase: {
      marketAnalysis: [
        'リモートワーク需要の調査',
        '既存ツールの乗り換え障壁',
        '部門別のツール導入決裁プロセス',
        'ROI計測方法の調査'
      ],
      competitorAnalysis: [
        'Slack、Teams等のコミュニケーション',
        'Notion、Asana等のプロジェクト管理',
        'Salesforce等のCRM',
        'Google Workspace、Office365'
      ],
      userResearch: [
        '現在の業務フローの痛み',
        'ツール間の連携状況',
        '導入決定者と実際の利用者の違い',
        'セキュリティ・コンプライアンス要件'
      ],
      regulatoryCheck: [
        '業界固有の規制（医療、金融等）',
        'データ保護規制（GDPR等）',
        'SOC2、ISO27001等の認証',
        '輸出管理規制（EAR等）'
      ]
    },
    
    developmentPhase: {
      coreFeatures: [
        'シングルサインオン（SSO）',
        '既存ツールとの連携',
        '権限管理・アクセス制御',
        'データエクスポート機能'
      ],
      integrations: [
        'Microsoft Graph API',
        'Google Workspace API',
        'Slack、Teams連携',
        'Zapier、IFTTT対応'
      ],
      compliance: [
        'SOC2 Type II取得',
        'GDPR対応',
        'セキュリティ監査ログ',
        'データ暗号化（保存時・転送時）'
      ],
      scalingConsiderations: [
        'マルチテナント設計',
        'API rate limiting',
        'エンタープライズ機能',
        'カスタマイズ機能'
      ]
    },
    
    operationPhase: {
      keyMetrics: [
        'MAU（月間アクティブユーザー）',
        'チャーン率',
        'NPS（ネットプロモータースコア）',
        'アップセル率',
        'カスタマーサポート満足度'
      ],
      commonIssues: [
        'ユーザー onboarding の複雑さ',
        '他ツールからの移行困難',
        'エンタープライズ要件への対応',
        'カスタマーサクセスのスケール'
      ],
      seasonality: [
        '4月：新年度での新ツール導入',
        '1月：予算確定後の導入検討',
        '12月：来年度予算の検討'
      ],
      customerSupport: [
        'オンボーディング支援',
        '導入コンサルティング',
        'API連携サポート',
        'セキュリティ関連問い合わせ'
      ]
    },
    
    patterns: {
      successCases: [
        {
          condition: '特定業界に特化',
          outcome: '業界標準ツールとして確立',
          lessons: ['業界知識の深さが差別化', 'コミュニティ形成が重要']
        }
      ],
      failureCases: [
        {
          condition: '機能過多でUI複雑化',
          outcome: 'ユーザー adoption率低下',
          lessons: ['シンプルさの重要性', 'progressive disclosure設計']
        }
      ]
    },
    
    recommendedPKGs: [
      'b2b_user_research',
      'enterprise_security_setup',
      'saas_pricing_optimization',
      'customer_success_automation'
    ],
    
    stats: {
      usageCount: 31,
      successRate: 68,
      avgTimeToMarket: '85日',
      avgFirstYearRevenue: 8900000
    }
  }
]

// SaaS適用例
const saasApplications = [
  { saasName: '猫カフェ予約', playbookId: 'reservation_systems', phase: '運用', status: 'success' },
  { saasName: '家計簿アプリ', playbookId: 'personal_fintech', phase: '開発', status: 'in_progress' },
  { saasName: 'AI議事録作成', playbookId: 'b2b_productivity', phase: '調査', status: 'in_progress' },
  { saasName: 'ペット管理', playbookId: 'reservation_systems', phase: '運用', status: 'success' },
  { saasName: '英会話マッチ', playbookId: 'b2b_productivity', phase: '開発', status: 'warning' }
]

interface PlaybookTemplatesProps {
  onSelectTemplate?: (templateId: string, saasName: string) => void
  onViewDetails?: (templateId: string) => void
}

export function PlaybookTemplates({ onSelectTemplate, onViewDetails }: PlaybookTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(null)
  const [viewMode, setViewMode] = useState<'templates' | 'applications' | 'details'>('templates')

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case '予約・ブッキング': return 'bg-blue-100 text-blue-800'
      case 'FinTech': return 'bg-green-100 text-green-800'
      case 'B2B SaaS': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📚 プレイブックテンプレート</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('templates')}
            className={`px-4 py-2 rounded ${viewMode === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            テンプレート一覧
          </button>
          <button
            onClick={() => setViewMode('applications')}
            className={`px-4 py-2 rounded ${viewMode === 'applications' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            適用状況
          </button>
          {selectedTemplate && (
            <button
              onClick={() => setViewMode('details')}
              className={`px-4 py-2 rounded ${viewMode === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              詳細表示
            </button>
          )}
        </div>
      </div>

      {/* テンプレート一覧 */}
      {viewMode === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockPlaybookTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template)
                setViewMode('details')
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${getIndustryColor(template.industry)}`}>
                  {template.industry}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">使用実績:</span>
                  <span className="font-medium">{template.stats.usageCount}回</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">成功率:</span>
                  <span className="font-medium text-green-600">{template.stats.successRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">平均TTM:</span>
                  <span className="font-medium">{template.stats.avgTimeToMarket}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.targetMarket.map(market => (
                  <span key={market} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {market}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 適用状況 */}
      {viewMode === 'applications' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold">現在のSaaSへの適用状況</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SaaS名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">適用プレイブック</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">現在フェーズ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {saasApplications.map((app, idx) => {
                  const template = mockPlaybookTemplates.find(t => t.id === app.playbookId)
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{app.saasName}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{template?.name}</div>
                          <div className="text-sm text-gray-500">{template?.industry}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{app.phase}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewDetails?.(app.playbookId)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            詳細
                          </button>
                          <button
                            onClick={() => onSelectTemplate?.(app.playbookId, app.saasName)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            実行
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 詳細表示 */}
      {viewMode === 'details' && selectedTemplate && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>
              <span className={`px-3 py-1 rounded ${getIndustryColor(selectedTemplate.industry)}`}>
                {selectedTemplate.industry}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedTemplate.stats.usageCount}</div>
                <div className="text-sm text-gray-500">使用実績</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{selectedTemplate.stats.successRate}%</div>
                <div className="text-sm text-gray-500">成功率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedTemplate.stats.avgTimeToMarket}</div>
                <div className="text-sm text-gray-500">平均TTM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">¥{(selectedTemplate.stats.avgFirstYearRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-gray-500">初年度売上平均</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 調査段階 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-xl mr-2">🔍</span>
                調査段階
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">市場分析</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.researchPhase.marketAnalysis.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">競合分析</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.researchPhase.competitorAnalysis.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 開発段階 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-xl mr-2">⚙️</span>
                開発段階
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">必須機能</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.developmentPhase.coreFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">必要な連携</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.developmentPhase.integrations.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 運用段階 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-xl mr-2">📊</span>
                運用段階
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">重要指標</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.operationPhase.keyMetrics.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">よくある問題</h5>
                  <ul className="text-sm space-y-1">
                    {selectedTemplate.operationPhase.commonIssues.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 成功/失敗パターン */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4 text-green-800">✅ 成功パターン</h4>
              <div className="space-y-4">
                {selectedTemplate.patterns.successCases.map((pattern, idx) => (
                  <div key={idx} className="border-l-4 border-green-400 pl-4">
                    <div className="font-medium text-sm">{pattern.condition}</div>
                    <div className="text-sm text-gray-600 mb-2">{pattern.outcome}</div>
                    <ul className="text-xs space-y-1">
                      {pattern.lessons.map((lesson, lessonIdx) => (
                        <li key={lessonIdx} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4 text-red-800">❌ 失敗パターン</h4>
              <div className="space-y-4">
                {selectedTemplate.patterns.failureCases.map((pattern, idx) => (
                  <div key={idx} className="border-l-4 border-red-400 pl-4">
                    <div className="font-medium text-sm">{pattern.condition}</div>
                    <div className="text-sm text-gray-600 mb-2">{pattern.outcome}</div>
                    <ul className="text-xs space-y-1">
                      {pattern.lessons.map((lesson, lessonIdx) => (
                        <li key={lessonIdx} className="flex items-start">
                          <span className="text-red-500 mr-1">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-semibold mb-4">推奨PKG</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.recommendedPKGs.map(pkg => (
                <span key={pkg} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {pkg}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}