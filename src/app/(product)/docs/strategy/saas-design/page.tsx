import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'SaaS設計プロセス - Unson OS ドキュメント',
  description: 'テックタッチ×決済システム付きSaaS案を設計。詳細Unit Economics計算からマルチテナント設計まで。',
  openGraph: {
    title: 'SaaS設計プロセス - Unson OS ドキュメント',
    description: 'テックタッチ×決済システム付きSaaS案を設計。詳細Unit Economics計算からマルチテナント設計まで。',
  },
}

// SaaS機能仕様テンプレート
const saasFeatures = [
  {
    category: 'コア機能（セルフサービス前提）',
    features: [
      { name: '主要機能1', automation: '全自動', userAction: 'ワンクリック実行', systemProcess: 'API連携で自動処理' },
      { name: '主要機能2', automation: '半自動', userAction: 'パラメータ設定', systemProcess: 'バックグラウンド処理' },
      { name: '主要機能3', automation: '手動', userAction: 'ガイド付き操作', systemProcess: 'リアルタイム支援' }
    ]
  },
  {
    category: 'セルフサービス機能',
    features: [
      { name: 'オンボーディング', automation: '90%自動', userAction: '自動ガイド・チュートリアル', systemProcess: 'プログレッシブ開示' },
      { name: '設定・カスタマイズ', automation: '85%自動', userAction: 'ノーコード設定画面', systemProcess: 'テンプレート自動適用' },
      { name: 'サポート', automation: '80%自動', userAction: 'FAQ・チャットボット', systemProcess: 'AI回答生成' }
    ]
  }
]

// 決済・課金設計
const pricingPlans = [
  {
    plan: 'フリー',
    price: '0円',
    features: ['機能制限版', '月10回利用', 'コミュニティサポート'],
    purpose: 'フリーミアム獲得'
  },
  {
    plan: 'ベーシック',
    price: '月額980円',
    features: ['基本機能すべて', '月200回利用', 'メールサポート'],
    purpose: '個人ユーザー向け'
  },
  {
    plan: 'プロ',
    price: '月額2,980円',
    features: ['高度機能含む', '無制限利用', 'プライオリティサポート'],
    purpose: 'プロユーザー向け'
  },
  {
    plan: 'エンタープライズ',
    price: '月額9,800円',
    features: ['カスタム機能', '専用環境', '専任サポート'],
    purpose: '企業・チーム向け'
  }
]

// SaaS指標
const saasMetrics = [
  {
    metric: 'MRR（月次経常収益）',
    calculation: 'プラン別ユーザー数 × 月額料金の合計',
    target: '初月10万円 → 12ヶ月後1,000万円',
    importance: 'SaaSの成長指標'
  },
  {
    metric: 'ARPU（ユーザー単価）',
    calculation: 'MRR ÷ アクティブユーザー数',
    target: '平均1,500円',
    importance: '収益効率の指標'
  },
  {
    metric: 'チャーン率（解約率）',
    calculation: '当月解約ユーザー数 ÷ 月初ユーザー数',
    target: '月次5%以下',
    importance: '顧客維持の指標'
  },
  {
    metric: 'LTV（顧客生涯価値）',
    calculation: 'ARPU ÷ チャーン率',
    target: '30,000円',
    importance: '長期収益の指標'
  },
  {
    metric: 'CAC（顧客獲得コスト）',
    calculation: 'マーケティング費用 ÷ 新規獲得ユーザー数',
    target: '10,000円（LTVの1/3）',
    importance: '獲得効率の指標'
  },
  {
    metric: 'NPS（推奨度）',
    calculation: '推奨者割合 - 批判者割合',
    target: '50以上',
    importance: '顧客満足の指標'
  }
]

// 技術仕様（SaaS前提）
const techArchitecture = [
  {
    layer: 'フロントエンド',
    technologies: ['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    description: 'モダンなユーザーインターフェース'
  },
  {
    layer: 'バックエンド',
    technologies: ['Node.js/Python', 'API-first設計', 'マイクロサービス', 'GraphQL'],
    description: 'スケーラブルなAPI設計'
  },
  {
    layer: 'データベース',
    technologies: ['PostgreSQL', 'MongoDB', 'Redis（キャッシュ）', 'マルチテナント設計'],
    description: 'セキュアなデータ管理'
  },
  {
    layer: '決済システム',
    technologies: ['Stripe', '自動課金・請求', '使用量ベース従量課金', 'PCI DSS準拠'],
    description: '安全な決済処理'
  },
  {
    layer: 'インフラ',
    technologies: ['AWS/Vercel', 'Cloudflare CDN', 'Auto Scaling', 'Load Balancer'],
    description: '高可用性インフラ'
  },
  {
    layer: 'セキュリティ',
    technologies: ['SOC2 Type II準拠', 'データ暗号化', 'ロールベースアクセス制御', '監査ログ'],
    description: 'エンタープライズ級セキュリティ'
  }
]

// 7日間実行スケジュール
const sevenDaySchedule = [
  {
    day: '1-2日目',
    title: 'アイデア発散・プロダクト案生成',
    duration: '6時間',
    activities: [
      'ブレインストーミング（15分）',
      'SCAMPER法（15分）',
      '競合改良法（15分）',
      '他業界ヒント収集'
    ],
    output: 'アイデア一覧（課題×20個）'
  },
  {
    day: '3-4日目',
    title: 'プロダクト仕様の具体化',
    duration: '8時間',
    activities: [
      'SaaS機能仕様設計',
      'UI/UXワイヤーフレーム作成',
      'マルチテナント設計',
      'API仕様設計'
    ],
    output: '詳細仕様書×上位案'
  },
  {
    day: '5日目',
    title: '市場性・競合優位性分析',
    duration: '3時間',
    activities: [
      'TAM/SAM/SOM詳細計算',
      '競合比較・差別化ポイント明確化',
      'SaaS市場ポジショニング'
    ],
    output: '市場性分析シート'
  },
  {
    day: '6日目',
    title: '収益性・実現性検証',
    duration: '3時間',
    activities: [
      '詳細Unit Economics計算',
      'SaaS指標設定',
      '技術的実現性評価',
      'リスク評価'
    ],
    output: '収益性・実現性評価'
  },
  {
    day: '7日目',
    title: '最終評価・優先順位決定',
    duration: '2時間',
    activities: [
      '統合評価システム',
      'SaaS適性評価',
      'ポートフォリオバランス考慮',
      '実行計画策定'
    ],
    output: '最終プロダクト案TOP3'
  }
]

// Unit Economics詳細
const unitEconomics = {
  mrrCalculation: [
    { plan: 'フリー', users: 1000, price: 0, mrr: 0 },
    { plan: 'ベーシック', users: 300, price: 980, mrr: 294000 },
    { plan: 'プロ', users: 100, price: 2980, mrr: 298000 },
    { plan: 'エンタープライズ', users: 20, price: 9800, mrr: 196000 }
  ],
  churnRates: [
    { plan: 'ベーシック', monthlyChurn: '5%', avgLifetime: '17ヶ月' },
    { plan: 'プロ', monthlyChurn: '3%', avgLifetime: '28ヶ月' },
    { plan: 'エンタープライズ', monthlyChurn: '2%', avgLifetime: '42ヶ月' }
  ]
}

export default function SaaSDesignProcessPage() {
  const readingTime = '約20分'
  
  // 総MRR計算
  const totalMRR = unitEconomics.mrrCalculation.reduce((sum, plan) => sum + plan.mrr, 0)
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-indigo-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              SaaS設計プロセス
              <span className="block text-indigo-600 mt-2">
                テックタッチ×決済システム統合
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              課題検知で特定した6-9個の課題から、テックタッチ×決済システム付きSaaS案を設計し、
              最も有望な3個を選定します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/strategy/mvp-validation" variant="default" size="lg">
                MVP検証フレームワーク
              </NavigationLink>
              <NavigationLink href="/docs/strategy/micro-business" variant="outline" size="lg">
                マイクロビジネス戦略
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS必須条件 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              SaaS必須条件
            </h2>
            <p className="text-large text-gray-600 mb-8">
              すべての設計は継続課金型サービスとスケーラブル運用を前提とします
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
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                決済システム統合
              </h3>
              <p className="text-gray-600 text-sm">
                Stripe等との自然な連携
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                スケーラブル設計
              </h3>
              <p className="text-gray-600 text-sm">
                自動化可能な機能構成
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS機能仕様設計 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              SaaS機能仕様設計
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              セルフサービス前提のマルチテナント機能設計
            </p>
          </div>
          
          <div className="space-y-8">
            {saasFeatures.map((category, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {category.category}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">機能名</th>
                        <th className="text-left py-3">自動化レベル</th>
                        <th className="text-left py-3">ユーザー操作</th>
                        <th className="text-left py-3">システム処理</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b">
                          <td className="py-3 font-medium">{feature.name}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              feature.automation === '全自動' ? 'bg-green-100 text-green-800' :
                              feature.automation === '半自動' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {feature.automation}
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">{feature.userAction}</td>
                          <td className="py-3 text-gray-600">{feature.systemProcess}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 決済・課金設計 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              決済・課金設計
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              フリーミアムから段階的アップグレードを促す料金体系
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`card text-center ${
                plan.plan === 'プロ' ? 'ring-2 ring-indigo-600' : ''
              }`}>
                {plan.plan === 'プロ' && (
                  <div className="bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-full inline-block mb-4">
                    おすすめ
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.plan}
                </h3>
                <div className="text-2xl font-bold text-indigo-600 mb-4">
                  {plan.price}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-gray-500">
                  {plan.purpose}
                </div>
              </div>
            ))}
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              決済システム統合
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Stripe連携</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 自動課金・請求</li>
                  <li>• サブスクリプション管理</li>
                  <li>• 使用量ベース従量課金</li>
                  <li>• 返金・キャンセル自動化</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">セキュリティ</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• PCI DSS準拠</li>
                  <li>• 3Dセキュア対応</li>
                  <li>• 不正決済検知</li>
                  <li>• 暗号化通信</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">レポート</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• リアルタイム売上分析</li>
                  <li>• 税務レポート自動生成</li>
                  <li>• 収益予測ダッシュボード</li>
                  <li>• チャーン分析</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS指標 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              重要SaaS指標
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              データドリブンな事業運営のための核心指標
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saasMetrics.map((metric, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {metric.metric}
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">計算方法</h4>
                    <p className="text-sm text-gray-600">{metric.calculation}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">目標値</h4>
                    <p className="text-sm font-medium text-indigo-600">{metric.target}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">重要性</h4>
                    <p className="text-sm text-gray-600">{metric.importance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Economics詳細計算 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              Unit Economics詳細計算
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              プラン別MRR試算とチャーン率分析
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                MRR（月次経常収益）試算
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">プラン</th>
                      <th className="text-right py-2">ユーザー数</th>
                      <th className="text-right py-2">月額</th>
                      <th className="text-right py-2">MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitEconomics.mrrCalculation.map((plan, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{plan.plan}</td>
                        <td className="py-2 text-right">{plan.users.toLocaleString()}人</td>
                        <td className="py-2 text-right">¥{plan.price.toLocaleString()}</td>
                        <td className="py-2 text-right font-semibold">¥{plan.mrr.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 font-bold">
                      <td className="py-2">合計</td>
                      <td className="py-2 text-right">
                        {unitEconomics.mrrCalculation.reduce((sum, plan) => sum + plan.users, 0).toLocaleString()}人
                      </td>
                      <td className="py-2"></td>
                      <td className="py-2 text-right text-indigo-600">¥{totalMRR.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                チャーン率・LTV計算
              </h3>
              <div className="space-y-4">
                {unitEconomics.churnRates.map((rate, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{rate.plan}</h4>
                      <span className="text-lg font-bold text-red-600">{rate.monthlyChurn}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      平均利用期間：{rate.avgLifetime}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">加重平均LTV</h4>
                <div className="text-2xl font-bold text-indigo-600">¥42,150</div>
                <div className="text-sm text-indigo-700">目標CAC：¥14,000以下（LTV/3）</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技術アーキテクチャ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              技術アーキテクチャ（SaaS前提）
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              マルチテナント・API-first・マイクロサービス設計
            </p>
          </div>
          
          <div className="space-y-6">
            {techArchitecture.map((layer, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {layer.layer}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{layer.description}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🏗️ マルチテナント設計原則
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-gray-900">データ分離</strong>
                <p className="text-gray-600">テナント別データベーススキーマ</p>
              </div>
              <div>
                <strong className="text-gray-900">セキュリティ</strong>
                <p className="text-gray-600">行レベルセキュリティ（RLS）</p>
              </div>
              <div>
                <strong className="text-gray-900">スケーラビリティ</strong>
                <p className="text-gray-600">自動水平スケーリング</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7日間実行スケジュール */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              7日間実行スケジュール
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              アイデア発散から最終評価まで、効率的な1週間プロセス
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {sevenDaySchedule.map((day, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {day.day}: {day.title}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-indigo-600 font-medium">
                        {day.duration}
                      </div>
                      <div className="text-xs text-gray-500">
                        {day.output}
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">主要活動</h4>
                      <ul className="space-y-1">
                        {day.activities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="text-sm text-gray-600">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-1">成果物</h4>
                      <p className="text-sm text-green-700">{day.output}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              合計実行時間：約22時間（1週間で完了）
            </h3>
            <p className="text-center text-gray-600">
              プロダクト案の考案フェーズ完了後、選定したTOP3案でLP作成→MVP開発に進みます
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="SaaS設計プロセスを実践しよう"
        subtitle="テックタッチ運用とスケーラブル設計で、成功するSaaSを構築しませんか？"
        actions={[
          { label: 'MVP検証フレームワーク', href: '/docs/strategy/mvp-validation' },
          { label: 'ユーザー調査手法', href: '/docs/strategy/user-research', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-indigo-600 to-purple-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/strategy/micro-business" className="text-blue-600 hover:text-blue-800">マイクロビジネス戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/mvp-validation" className="text-blue-600 hover:text-blue-800">MVP検証フレームワーク</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/user-research" className="text-blue-600 hover:text-blue-800">ユーザー調査手法</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/web-platform" className="text-blue-600 hover:text-blue-800">Webプラットフォーム戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </div>
  )
}