'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'

export default function IntroductionPage() {
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS へようこそ
              <span className="block text-blue-600 mt-2">
                営業ゼロで価値を連続出荷する自律企業OS
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              人間とAIが協働し、100個のマイクロSaaSを自動生成・運営する革新的なプラットフォーム。
              2週間サイクルで課題を発見し、MVPから課金まで完全自動化します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/docs/quickstart">
                <Button size="lg" className="w-full sm:w-auto">
                  クイックスタート 【執筆中】
                </Button>
              </a>
              <a href="/docs/platform-overview">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  プラットフォーム概要 【執筆中】
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ビジョン・ミッション */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">ビジョン & ミッション</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🎯</span>
                <h3 className="text-xl font-semibold text-gray-900">ビジョン</h3>
              </div>
              <blockquote className="text-lg text-gray-700 mb-4 border-l-4 border-blue-600 pl-4">
                「営業ゼロで価値を連続出荷する自律企業OSになる」
              </blockquote>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>営業ゼロ</strong>：人的セールス組織なし、完全自動化</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>価値の連続出荷</strong>：2週間サイクルでの価値創造</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>自律企業OS</strong>：会社運営をソフトウェア化</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🚀</span>
                <h3 className="text-xl font-semibold text-gray-900">ミッション</h3>
              </div>
              <blockquote className="text-lg text-gray-700 mb-4 border-l-4 border-indigo-600 pl-4">
                「人⇄AIの最短距離で欲しいものを即座に出現させる」
              </blockquote>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>最短距離</strong>：承認フローを排除し、KPIで自動判断</span>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>即座に出現</strong>：LP/MVP/Billingを2週間サイクルで</span>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>人⇄AI協調</strong>：人間はGo/Holdと倫理ガードのみ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コアバリュー */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">4つのコアバリュー</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover:shadow-lg transition-shadow duration-200">
              <div className="text-center">
                <span className="text-4xl mb-4 block">⚡</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Speed First</h3>
                <p className="text-sm text-gray-600 mb-3">「遅い善より速い試行」</p>
                <p className="text-xs text-gray-500">仕様書より動くLP/MVPを優先</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-200">
              <div className="text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Or Die</h3>
                <p className="text-sm text-gray-600 mb-3">「感覚で語らず、曲線で語る」</p>
                <p className="text-xs text-gray-500">すべての意見をメトリクスで検証</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-200">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🤝</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Being a Good Person</h3>
                <p className="text-sm text-gray-600 mb-3">「AIと差別化できる最後の価値」</p>
                <p className="text-xs text-gray-500">人間として一緒に仕事したいと思われる人に</p>
              </div>
            </div>
            
            <div className="card hover:shadow-lg transition-shadow duration-200">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🔄</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Flywheel</h3>
                <p className="text-sm text-gray-600 mb-3">「稼いだら還す、還したら増える」</p>
                <p className="text-xs text-gray-500">売上の40%をDAO配当にプール</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 雲孫OS構想 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">雲孫OS構想</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🏭</span>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  3年で100個のマイクロサービスを自動生成
                </h3>
                <p className="text-large">
                  世界標準の自律企業OSプラットフォームを構築し、
                  Company-as-a-Productアプローチで革新的なビジネスモデルを確立
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">なぜ100個のサービスなのか</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>リスク分散</strong>：1つのサービスに依存しない</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>高速検証</strong>：小さく始めて素早く判断</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>累積効果</strong>：成功パターンの蓄積と再利用</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>コミュニティ成長</strong>：多様な貢献機会の創出</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">実現方法</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>AIエージェント自動化</strong>：アイデア生成から課金まで</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>データドリブン判断</strong>：すべてを数値で意思決定</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-gray-600"><strong>オープンソース化</strong>：組織自体をOSS公開</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3年間ロードマップ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">3年間のロードマップ</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">📋</span>
                <h3 className="text-xl font-semibold text-gray-900">Year 1: 基盤構築</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  <span>エンジンv1完成</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  <span>ARR 1億円達成</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  <span>4ゲートPipeline稼働</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  <span>DAO Fund運用開始</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">📈</span>
                <h3 className="text-xl font-semibold text-gray-900">Year 2: スケール</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <span>1日50LP生成体制</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <span>ARR 10億円達成</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <span>自動アーカイブ実装</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  <span>再投資アルゴリズム導入</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🌐</span>
                <h3 className="text-xl font-semibold text-gray-900">Year 3: エコシステム</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  <span>外部企業によるフォーク運用</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  <span>ARR 100億円規模</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  <span>"Unson OS Alliance"発足</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  <span>商標ライセンス収益化</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ワークスタイル */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">AI駆動型ワークスタイル</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">人間の役割：3つのC</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Curator（キュレーター）</h4>
                    <p className="text-gray-600 text-sm">課題選定、ゲート承認、広告ターゲット設定</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Craftsman（クラフツマン）</h4>
                    <p className="text-gray-600 text-sm">UX・ブランド調整、メディア確認</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🔗</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connector（コネクター）</h4>
                    <p className="text-gray-600 text-sm">データ連携、規制対応、外部折衝</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">DAO型協働モデル</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">収益分配（45/15/40）</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">運営・再投資</span>
                      <span className="text-gray-900 font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">創業者ボーナス</span>
                      <span className="text-gray-900 font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">コミュニティ配当</span>
                      <span className="text-gray-900 font-medium">40%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">貢献の可視化</h4>
                  <div className="text-sm text-gray-600">
                    GitHub PR/Issue、Slack Q&A、会議提案がすべて自動スコア化され、
                    四半期配当に反映されます。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 次のステップ */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">さあ、始めましょう</h2>
          <p className="text-large mb-8 text-blue-100">
            Unson OSプラットフォームで、あなたのアイデアを収益性のあるSaaSに変えてみませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/quickstart">
              <Button variant="secondary" size="lg">
                クイックスタート 【執筆中】
              </Button>
            </a>
            <a href="/docs/platform-overview">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                プラットフォーム概要 【執筆中】
              </Button>
            </a>
            <a href="/docs/architecture">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                アーキテクチャ 【執筆中】
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/quickstart" className="text-blue-600 hover:text-blue-800">クイックスタート</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/platform-overview" className="text-blue-600 hover:text-blue-800">プラットフォーム概要</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/architecture" className="text-blue-600 hover:text-blue-800">アーキテクチャ</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development-process" className="text-blue-600 hover:text-blue-800">開発プロセス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">DAO ガバナンス</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}