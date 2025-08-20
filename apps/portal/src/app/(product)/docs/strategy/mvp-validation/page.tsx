import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'MVP検証フレームワーク - Unson OS ドキュメント',
  description: '課題検知から最有望な3案選定まで。SaaSモデルとテックタッチ運用を前提とした実践的なMVP検証プロセス。',
  openGraph: {
    title: 'MVP検証フレームワーク - Unson OS ドキュメント',
    description: '課題検知から最有望な3案選定まで。SaaSモデルとテックタッチ運用を前提とした実践的なMVP検証プロセス。',
  },
}

// アイデア発散手法
const ideationMethods = [
  {
    method: 'ブレインストーミング',
    duration: '15分',
    description: '課題解決のアイデアを質より量で出す',
    rules: ['実現性は考えず、自由に発想', '最低20個のアイデアを出す', '他人の意見を批判しない'],
    output: '20個以上のアイデア'
  },
  {
    method: 'SCAMPER法',
    duration: '15分',
    description: '既存ソリューションを体系的に改良',
    rules: [
      'S（代用）：既存サービスの代替案',
      'C（結合）：2つの機能を組み合わせ',
      'A（適応）：他業界の成功事例を適用',
      'M（修正）：既存解決策の改良'
    ],
    output: '改良アイデア'
  },
  {
    method: '競合改良法',
    duration: '15分',
    description: '主要競合の不満点を解決',
    rules: ['競合にない機能を追加', '競合より安く・簡単に・速く', 'ユーザーレビューの不満点を解決'],
    output: '差別化アイデア'
  }
]

// 実現可能性チェック項目
const feasibilityChecklist = [
  {
    category: '技術的実現性',
    weight: '40%',
    items: [
      { item: '使用予定API/ライブラリ', criteria: '存在するか' },
      { item: '技術的難易度', criteria: '3段階評価（低/中/高）' },
      { item: '必要な専門知識レベル', criteria: 'チーム内で対応可能か' },
      { item: '開発工数', criteria: 'フロント・バック・インフラの時間' }
    ]
  },
  {
    category: '事業実現性',
    weight: '35%',
    items: [
      { item: '収益モデル', criteria: '月額課金/従量課金/その他' },
      { item: '想定単価レンジ', criteria: '市場価格との整合性' },
      { item: '収益化までの期間', criteria: 'LP公開から何週間か' },
      { item: '運用負荷', criteria: 'テックタッチ実現度' }
    ]
  },
  {
    category: '差別化度',
    weight: '25%',
    items: [
      { item: '競合優位性', criteria: '明確な差別化ポイント' },
      { item: '参入障壁', criteria: '他社が真似しにくい要素' },
      { item: '新規性', criteria: '市場にない新しい価値' },
      { item: 'ブランド適合性', criteria: 'Unson OSとの整合性' }
    ]
  }
]

// LP構成テンプレート
const lpStructure = [
  {
    section: 'ヒーローセクション',
    elements: ['メインメッセージ', 'サブメッセージ', 'メインビジュアル', 'CTA（メール登録/無料トライアル）'],
    purpose: 'ファーストインプレッションでユーザーの関心をキャッチ'
  },
  {
    section: '課題提起セクション',
    elements: ['ターゲットの課題を具体化', '共感を得るストーリー', 'ペインポイントの明確化'],
    purpose: 'ユーザーの課題意識を喚起し、共感を獲得'
  },
  {
    section: 'ソリューション説明',
    elements: ['機能の概要', '使い方の流れ（3ステップ）', 'デモ動画/GIF', '技術的優位性'],
    purpose: '課題解決方法を分かりやすく説明'
  },
  {
    section: 'ベネフィット',
    elements: ['具体的な効果・数値', 'Before/After比較', 'ROI計算', '時間短縮効果'],
    purpose: 'ユーザーが得られる価値を数値で示す'
  },
  {
    section: '社会的証明',
    elements: ['利用者数・企業ロゴ', 'お客様の声（想定）', '専門家の推薦', 'メディア掲載'],
    purpose: '信頼性と実績を示す'
  },
  {
    section: '料金プラン',
    elements: ['フリー/有料プランの比較', '明確な価格表示', '返金保証', 'アップグレード誘導'],
    purpose: '価格の妥当性と透明性を示す'
  }
]

// 検証指標
const validationMetrics = [
  {
    phase: 'LP効果測定',
    duration: '1週間',
    metrics: [
      { metric: '訪問者数', target: '500人以上', method: 'GA4' },
      { metric: 'メール登録率', target: '10%以上', method: '登録フォーム' },
      { metric: '滞在時間', target: '2分以上', method: 'GA4' },
      { metric: '直帰率', target: '70%以下', method: 'GA4' }
    ]
  },
  {
    phase: 'アンケート分析',
    duration: '1週間',
    metrics: [
      { metric: '回答率', target: '60%以上', method: 'アンケートフォーム' },
      { metric: '支払意向', target: '1,000円以上が50%以上', method: 'アンケート' },
      { metric: '利用意向', target: '「すぐに」「1ヶ月以内」が70%以上', method: 'アンケート' },
      { metric: '課題共感度', target: '想定課題選択率80%以上', method: 'アンケート' }
    ]
  }
]

// 5ステップワークフロー
const fiveStepWorkflow = [
  {
    step: 1,
    title: 'アイデア発散・プロダクト案生成',
    duration: '1-2日目',
    description: '各課題に対するソリューション案出し（課題ごと45分）',
    activities: [
      'ブレインストーミング（15分）',
      'SCAMPER法適用（15分）',
      '競合改良法（15分）',
      '他業界ヒント収集'
    ],
    output: 'アイデア一覧（課題×20個）',
    deliverable: '各課題に対して20個以上のアイデア'
  },
  {
    step: 2,
    title: '実現可能性チェック',
    duration: '3-4日目',
    description: '技術的・事業的実現性の簡易評価（上位案ごと30分）',
    activities: [
      '技術実現性評価',
      '開発工数見積もり',
      '外部API依存度チェック',
      'リスク評価（技術・事業・法的）'
    ],
    output: '実現可能性評価表',
    deliverable: '各案の実現性スコア（10点満点）'
  },
  {
    step: 3,
    title: 'ユーザー訴求方法検討',
    duration: '5日目',
    description: 'ターゲットユーザーペルソナ明確化とメッセージ設計',
    activities: [
      'ペルソナ設定（各案30分）',
      'メインメッセージ設計',
      'ビジュアル訴求検討',
      'Before/Afterストーリー作成'
    ],
    output: '訴求戦略シート',
    deliverable: 'ペルソナとメッセージセット'
  },
  {
    step: 4,
    title: 'LP作成・ユーザー検証',
    duration: '6-8日目',
    description: 'ランディングページ作成とユーザーからのフィードバック収集',
    activities: [
      'ランディングページ作成（各案2-3時間）',
      'メール登録フォーム設計',
      'ユーザーアンケート実装',
      'KPI測定・分析'
    ],
    output: 'LP検証結果',
    deliverable: '各案の登録率・支払意向・フィードバック'
  },
  {
    step: 5,
    title: '最終評価・優先順位決定',
    duration: '9-10日目',
    description: 'LP検証結果をもとに最も有望な3案を選定',
    activities: [
      '統合評価システム（60分）',
      '上位3案の選定（30分）',
      'MVP開発計画策定（30分）',
      '成功指標設定'
    ],
    output: '最終プロダクト案TOP3',
    deliverable: '開発優先順位と実行計画'
  }
]

// 成功指標設定
const successCriteria = [
  {
    stage: 'MVP段階（2-3週間）',
    kpis: [
      { metric: 'DAU', target: '100人以上', note: 'アクティブユーザー数' },
      { metric: '有料転換率', target: '10%以上', note: '無料→有料の転換率' },
      { metric: '継続率', target: '7日後50%以上', note: 'ユーザー定着度' },
      { metric: 'NPS', target: '30以上', note: '推奨度スコア' }
    ]
  },
  {
    stage: '課金開始段階（4-6週間）',
    kpis: [
      { metric: 'MRR', target: '10万円以上', note: '月次経常収益' },
      { metric: 'CAC', target: 'LTVの1/3以下', note: '顧客獲得コスト' },
      { metric: 'チャーン率', target: '5%以下', note: '月次解約率' },
      { metric: '顧客満足度', target: '80%以上', note: 'アンケート結果' }
    ]
  },
  {
    stage: '成長段階（8-12週間）',
    kpis: [
      { metric: 'MRR成長率', target: '20%/月以上', note: '月次成長率' },
      { metric: 'バイラル係数', target: '1.1以上', note: '紹介による成長' },
      { metric: 'プロダクトマーケットフィット', target: 'スコア40以上', note: 'PMFスコア' },
      { metric: '機能利用率', target: '主要3機能で50%以上', note: 'フィーチャー利用' }
    ]
  }
]

export default function MVPValidationFrameworkPage() {
  const readingTime = '約18分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-purple-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              MVP検証フレームワーク
              <span className="block text-purple-600 mt-2">
                最有望な3案を科学的に選定
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              課題検知で特定した6-9個の課題から、実現可能なSaaS案を設計し、
              LPでユーザー検証を行い、最も有望な3個を選定します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/strategy/saas-design" variant="default" size="lg">
                SaaS設計プロセス
              </NavigationLink>
              <NavigationLink href="/docs/strategy/micro-business" variant="outline" size="lg">
                マイクロビジネス戦略
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 必須条件 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              必須条件：SaaS × テックタッチ
            </h2>
            <p className="text-large text-gray-600 mb-8">
              すべての検証は、継続課金型サービスとセルフサービス運用を前提とします
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                SaaSモデル
              </h3>
              <p className="text-gray-600 text-sm">
                月額/年額課金による継続的価値提供
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                テックタッチ運用
              </h3>
              <p className="text-gray-600 text-sm">
                セルフサービス中心の最小限人的サポート
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                実現可能性重視
              </h3>
              <p className="text-gray-600 text-sm">
                詳細仕様より「作れるか」の判断に集中
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ユーザー検証
              </h3>
              <p className="text-gray-600 text-sm">
                LPとアンケートで実際の需要を確認
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5ステップワークフロー */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              5ステップワークフロー
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              アイデア発散から最終選定まで、体系化された10日間プロセス
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {fiveStepWorkflow.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < fiveStepWorkflow.length - 1 && (
                      <div className="w-0.5 h-16 bg-purple-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-purple-600 font-medium">
                            {step.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {step.output}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">主要活動</h4>
                          <ul className="space-y-1">
                            {step.activities.map((activity, activityIndex) => (
                              <li key={activityIndex} className="text-sm text-gray-600">
                                • {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-1">成果物</h4>
                          <p className="text-sm text-purple-700">{step.deliverable}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* アイデア発散手法 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              アイデア発散手法
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              課題ごと45分で系統的にソリューション案を生成
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {ideationMethods.map((method, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {method.method}
                  </h3>
                  <span className="text-sm text-purple-600 font-medium">
                    {method.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">実行ルール</h4>
                  <ul className="space-y-1">
                    {method.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="text-sm text-gray-600">
                        • {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">期待アウトプット</h4>
                  <p className="text-sm text-green-700">{method.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 実現可能性チェック */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              実現可能性チェック
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              技術・事業・差別化の3軸で総合的に評価
            </p>
          </div>
          
          <div className="space-y-8">
            {feasibilityChecklist.map((category, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.category}
                  </h3>
                  <span className="text-xl font-bold text-purple-600">
                    {category.weight}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.item}</span>
                      <span className="text-sm text-gray-600">{item.criteria}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              総合スコア計算式
            </h3>
            <div className="text-center">
              <div className="text-lg font-mono text-blue-700 mb-2">
                総合スコア = (技術×0.4) + (事業×0.35) + (差別化×0.25)
              </div>
              <p className="text-sm text-gray-600">
                各項目を10点満点で評価し、重み付き平均で総合判定
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LP構成テンプレート */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              LP構成テンプレート
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              ユーザー検証のための戦略的ランディングページ設計
            </p>
          </div>
          
          <div className="space-y-6">
            {lpStructure.map((section, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {section.section}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{section.purpose}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">構成要素</h4>
                    <ul className="space-y-1">
                      {section.elements.map((element, elementIndex) => (
                        <li key={elementIndex} className="text-sm text-gray-600">
                          • {element}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-1">目的</h4>
                    <p className="text-sm text-yellow-700">{section.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 検証指標 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              検証指標とKPI設定
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              データドリブンな意思決定のための定量指標
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {validationMetrics.map((phase, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {phase.phase}
                  </h3>
                  <span className="text-sm text-purple-600 font-medium">
                    {phase.duration}
                  </span>
                </div>
                <div className="space-y-3">
                  {phase.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{metric.metric}</div>
                        <div className="text-xs text-gray-500">{metric.method}</div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {metric.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              現実的な検証サイクル考慮事項
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">データ収集時間</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• 初期トラフィック獲得：2-3日</li>
                  <li>• 統計的有意性確保：72-168時間（3-7日）</li>
                  <li>• 季節性・曜日効果考慮：最低1週間</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">人的評価時間</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• UIレビュー・フィードバック：2-4時間</li>
                  <li>• 機能テスト・不具合確認：4-6時間</li>
                  <li>• ステークホルダー承認：12-24時間</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 成功指標設定 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              段階別成功指標
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              MVP開発から成長段階まで、各フェーズの明確な目標設定
            </p>
          </div>
          
          <div className="space-y-8">
            {successCriteria.map((stage, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {stage.stage}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {stage.kpis.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{kpi.metric}</div>
                        <div className="text-xs text-gray-500">{kpi.note}</div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {kpi.target}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="MVP検証フレームワークを活用しよう"
        subtitle="科学的なアプローチで、最も有望なプロダクト案を発見しませんか？"
        actions={[
          { label: 'SaaS設計プロセス', href: '/docs/strategy/saas-design' },
          { label: 'ユーザー調査手法', href: '/docs/strategy/user-research', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-purple-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/strategy/micro-business" className="text-blue-600 hover:text-blue-800">マイクロビジネス戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/saas-design" className="text-blue-600 hover:text-blue-800">SaaS設計プロセス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/user-research" className="text-blue-600 hover:text-blue-800">ユーザー調査手法</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/web-platform" className="text-blue-600 hover:text-blue-800">Webプラットフォーム戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}