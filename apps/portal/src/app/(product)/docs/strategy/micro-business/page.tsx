import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'マイクロビジネス戦略 - Unson OS ドキュメント',
  description: '100個の小さな事業で大きな収益を実現。キーワードA×B手法による市場機会発見とニッチ分野の戦略的攻略法。',
  openGraph: {
    title: 'マイクロビジネス戦略 - Unson OS ドキュメント',
    description: '100個の小さな事業で大きな収益を実現。キーワードA×B手法による市場機会発見とニッチ分野の戦略的攻略法。',
  },
}

// キーワード組み合わせ例
const keywordCombinations = [
  { 
    trendKeyword: 'AI自動化',
    organizationKeyword: 'ミニマリスト',
    generatedField: '持ち物管理AI',
    description: 'AIで不要な物を自動判定し、断捨離をサポート'
  },
  {
    trendKeyword: '副業支援',
    organizationKeyword: '地方創生',
    generatedField: '地方副業マッチング',
    description: '地方企業と都市部副業者をマッチング'
  },
  {
    trendKeyword: '健康管理',
    organizationKeyword: 'データ分析',
    generatedField: '体調変化予測ツール',
    description: '日々のバイタルデータから体調不良を予測'
  },
  {
    trendKeyword: 'ノーコード',
    organizationKeyword: 'コミュニティ',
    generatedField: '地域イベント作成ツール',
    description: 'プログラミング不要でイベント告知サイト作成'
  }
]

// 市場検証手法
const validationMethods = [
  {
    category: 'Google Trends調査',
    timeframe: '45分',
    methods: [
      '過去7日間の急上昇率チェック',
      '検索ボリューム絶対値測定',
      '関連急上昇クエリ分析',
      '地域別の伸び率確認'
    ],
    example: '「AI 持ち物管理」: 前週比+340%、月1,200回検索'
  },
  {
    category: 'SNS急上昇パターン',
    timeframe: '30分',
    methods: [
      'Twitter「○○が欲しい」検索',
      'Reddit「I wish there was...」調査',
      'TikTok/YouTube制作動画増加確認',
      'エンゲージメント率測定'
    ],
    example: '投稿数週次変化率、コメント要望数カウント'
  }
]

// 参入容易性評価基準
const accessibilityChecklist = [
  { category: '参入容易性', weight: '40%', criteria: ['MVP 2週間以内作成可能', '既存APIで80%実現', 'デザイン素材流用可能', '法的許可不要'] },
  { category: '競合密度', weight: '30%', criteria: ['直接競合3社以下', 'Google検索50位以内に類似サービス3個以下', '大手企業参入発表なし'] },
  { category: '需要確実性', weight: '20%', criteria: ['課題明確＋月額1,000円以下なら払う', 'SNSで「欲しい」声が週10件以上', 'ターゲットユーザー明確特定可能'] },
  { category: '収益予測', weight: '10%', criteria: ['月10万円到達可能性', '既存回りくどい解決方法存在', '支払意向確認済み'] }
]

// ポートフォリオ分散ルール
const portfolioRules = [
  {
    category: '分野分散',
    distribution: [
      { type: 'トレンド急上昇', count: '4-5分野', description: '高リスク高リターン' },
      { type: 'ニッチ安定', count: '4-5分野', description: '低リスク低リターン' },
      { type: 'ランダム実験', count: '2-3分野', description: '学習目的' }
    ]
  },
  {
    category: '技術難易度分散',
    distribution: [
      { type: '簡単（1週間）', count: '6分野', description: '即座に展開可能' },
      { type: '中程度（2週間）', count: '4分野', description: '標準的な開発期間' },
      { type: '難しい（3週間以上）', count: '1分野', description: '技術的チャレンジ' }
    ]
  }
]

// 6ステップ実行プロセス
const sixStepProcess = [
  {
    step: 1,
    title: 'ハイブリッド課題発見',
    duration: '1日目',
    description: 'キーワードA×B組み合わせ手法で意図的なランダム性を導入',
    methods: ['トレンド軸キーワード選定', '組織特性軸キーワード選定', 'ランダム要素組み込み'],
    output: '組み合わせ50個リスト'
  },
  {
    step: 2,
    title: '直近成長率重視の市場検証',
    duration: '2日目',
    description: '12ヶ月トレンドから直近7日間の急成長指標へシフト',
    methods: ['Google Trends 7日間調査', 'SNS急上昇パターン検知', '地域別伸び率分析'],
    output: '急上昇分野20個'
  },
  {
    step: 3,
    title: '小規模参入可能性評価',
    duration: '3日目',
    description: '利益最大化より参入容易性を優先した評価',
    methods: ['参入容易性チェック', '競合密度調査', '需要確実性確認'],
    output: '参入容易性スコア'
  },
  {
    step: 4,
    title: 'ニッチ度・差別化評価',
    duration: '4日目',
    description: '誰も気づいていない領域の発見とニッチ度スコア算出',
    methods: ['ニッチ度計算式適用', '差別化ポイント検証', '競合認知度評価'],
    output: 'ニッチ度ランキング'
  },
  {
    step: 5,
    title: 'ポートフォリオ選定',
    duration: '5日目',
    description: '意図的分散によるリスク回避と最適な組み合わせ',
    methods: ['分野分散ルール適用', '技術難易度分散', '地域・文化分散'],
    output: '最終選定10-15分野'
  },
  {
    step: 6,
    title: '高速検証プロセス設計',
    duration: '6日目',
    description: 'UnsonOS特徴を活かした3日間検証サイクル設計',
    methods: ['LP作成＋広告開始', 'ユーザー反応分析', '継続/停止判定'],
    output: '3日間サイクル設計'
  }
]

export default function MicroBusinessStrategyPage() {
  const readingTime = '約15分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-green-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              マイクロビジネス戦略
              <span className="block text-green-600 mt-2">
                小さく確実に需要がある分野を攻略
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              100儲かる事業を1、2つではなく、1儲かる事業を100個作る発想。
              ニッチ市場の積み重ねで結果的に大きな収益を実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/strategy/mvp-validation" variant="default" size="lg">
                MVP検証フレームワーク
              </NavigationLink>
              <NavigationLink href="/docs/strategy/user-research" variant="outline" size="lg">
                ユーザー調査手法
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 戦略概要 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              戦略転換：「小さく始められる」を最優先
            </h2>
            <p className="text-large text-gray-600 mb-8">
              従来の「大きな市場を狙う」アプローチから脱却し、
              参入容易性と競合の少なさを重視した新しいアプローチを採用します。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                10-15個の分野特定
              </h3>
              <p className="text-gray-600 text-sm">
                小さく確実に需要がある分野を体系的に発見。
                利益最大化より「小さく始められる＋競合少ない」を優先。
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                直近7日間の急成長指標
              </h3>
              <p className="text-gray-600 text-sm">
                12ヶ月トレンドから直近伸び率へシフト。
                他社が気づく前に機会をキャッチ。
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                意図的なランダム性
              </h3>
              <p className="text-gray-600 text-sm">
                他社がUnsonOSを使った時の市場重複を避ける
                ランダム性を組み込み。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* キーワード組み合わせ手法 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              キーワードA×B組み合わせ手法
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              トレンド軸と組織特性軸を掛け合わせて、新しい市場機会を発見
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                キーワードA（トレンド軸）
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">テクノロジー系</h4>
                  <div className="flex flex-wrap gap-2">
                    {['AI自動化', 'ノーコード', 'リモートワーク', 'DX効率化'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">ライフスタイル系</h4>
                  <div className="flex flex-wrap gap-2">
                    {['健康管理', '副業支援', 'オンライン学習', '節約術'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">社会課題系</h4>
                  <div className="flex flex-wrap gap-2">
                    {['少子高齢化', '地方創生', '環境対策', '働き方改革'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                キーワードB（組織特性軸）
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">技術的強み</h4>
                  <div className="flex flex-wrap gap-2">
                    {['自動化', 'API連携', 'データ分析', '高速開発'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">文化的特徴</h4>
                  <div className="flex flex-wrap gap-2">
                    {['ミニマリスト', '効率重視', '透明性', 'コミュニティ'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">ランダム要素</h4>
                  <div className="flex flex-wrap gap-2">
                    {['チームの趣味', '地域特性', '偶然の課題', 'サイコロ振りで決定'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 組み合わせ例 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">組み合わせ例</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">キーワードA（トレンド）</th>
                    <th className="text-left py-3">キーワードB（特性）</th>
                    <th className="text-left py-3">生成される分野</th>
                    <th className="text-left py-3">説明</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordCombinations.map((combo, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {combo.trendKeyword}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          {combo.organizationKeyword}
                        </span>
                      </td>
                      <td className="py-3 font-medium">{combo.generatedField}</td>
                      <td className="py-3 text-gray-600">{combo.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 市場検証手法 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              直近成長率重視の市場検証
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              7日間・30日間の急成長指標で市場機会を即座にキャッチ
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {validationMethods.map((method, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {method.category}
                  </h3>
                  <span className="text-sm text-blue-600 font-medium">
                    {method.timeframe}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {method.methods.map((methodItem, methodIndex) => (
                    <li key={methodIndex} className="text-gray-600 text-sm">
                      • {methodItem}
                    </li>
                  ))}
                </ul>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">記録例</h4>
                  <p className="text-sm text-green-700">{method.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参入容易性評価 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              小規模参入可能性評価
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              利益最大化より参入容易性を優先した評価軸
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {accessibilityChecklist.map((check, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {check.category}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">
                    {check.weight}
                  </span>
                </div>
                <ul className="space-y-2">
                  {check.criteria.map((criterion, criterionIndex) => (
                    <li key={criterionIndex} className="text-gray-600 text-sm flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              ニッチ度スコア計算式
            </h3>
            <div className="text-center">
              <div className="text-xl font-mono text-blue-700 mb-2">
                ニッチ度 = (需要の確実性 × 参入容易性) ÷ 競合認知度
              </div>
              <p className="text-sm text-gray-600">
                高いニッチ度スコアほど「誰も気づいていない有望分野」を示します
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6ステップ実行プロセス */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              6ステップ実行プロセス
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              課題発見から高速検証まで、体系化された6日間プロセス
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sixStepProcess.map((process, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {process.step}
                    </div>
                    {index < sixStepProcess.length - 1 && (
                      <div className="w-0.5 h-16 bg-green-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {process.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            {process.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {process.output}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {process.description}
                      </p>
                      <div className="space-y-1">
                        {process.methods.map((method, methodIndex) => (
                          <div key={methodIndex} className="text-sm text-gray-600">
                            • {method}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              合計実行時間：約10.5時間（従来より短縮）
            </h3>
            <p className="text-center text-gray-600">
              効率化された手法により、1週間で10-15分野の戦略的選定が完了します
            </p>
          </div>
        </div>
      </section>

      {/* ポートフォリオ分散戦略 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              意図的分散によるリスク回避
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              ポートフォリオバランスを考慮した戦略的分散
            </p>
          </div>
          
          <div className="space-y-8">
            {portfolioRules.map((rule, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {rule.category}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {rule.distribution.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {item.count}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {item.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
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
        title="マイクロビジネス戦略を実践しよう"
        subtitle="100個の小さな事業で大きな成功を。Unson OSのマイクロビジネス戦略を今すぐ始めませんか？"
        actions={[
          { label: 'MVP検証フレームワーク', href: '/docs/strategy/mvp-validation' },
          { label: 'ユーザー調査手法', href: '/docs/strategy/user-research', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-green-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/strategy/mvp-validation" className="text-blue-600 hover:text-blue-800">MVP検証フレームワーク</a>
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