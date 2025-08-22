'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { StatusBadge } from '@/components/docs/StatusBadge'
import { ExpectationBanner } from '@/components/docs/ExpectationBanner'

export default function IntroductionPage() {
  return (
    <DocsLayout>
      {/* 期待値管理バナー */}
      <ExpectationBanner 
        status="future" 
        estimatedLaunch="2025年中頃"
        className="mb-6"
      />
      
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center items-center gap-3 mb-4">
              <StatusBadge status="future" size="lg" />
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS 構想
              <span className="block text-blue-600 mt-2">
                AIに仕事を奪われる、ではなくAIが稼ぐ時代へ
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              UnsonOSは、AIを使って100個のマイクロSaaSを自動生成・運営するプラットフォーム構想です。<br />
              AIの進化を恐れるのではなく、AIと共に豊かになる仕組みを作ります。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/ubDYjDVC" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto bg-[#5865F2] hover:bg-[#4752C4]">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  Discordで構想に参加
                </Button>
              </a>
              <a href="/docs/dao/overview">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  将来のDAO構想を見る
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

      {/* UnsonOS構想 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">UnsonOS構想</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🏭</span>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  100個のSaaSビジネスをAIが自動運営
                </h3>
                <p className="text-large">
                  あなたがアイデアを提供し、AIがビジネスを運営。<br />
                  収益はコミュニティ全体で分配する新しい仕組みを構想中
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    💡 この構想を実現するための技術選定、アーキテクチャ設計、ビジネスモデル検討を一緒に行ってくださる方を募集中です。
                  </p>
                </div>
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

      {/* ロードマップ（構想） */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">ロードマップ（構想）</h2>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-800 text-sm text-center">
              ⚠️ 以下は目指すべきマイルストーンであり、現在の開発状況によって変更される可能性があります。
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">📋</span>
                <h3 className="text-xl font-semibold text-gray-900">2025年: 基盤構築</h3>
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
                <h3 className="text-xl font-semibold text-gray-900">2026年: スケール</h3>
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
                <h3 className="text-xl font-semibold text-gray-900">2027年: エコシステム</h3>
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
                  <span>&ldquo;Unson OS Alliance&rdquo;発足</span>
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
      <section className="section-padding bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">一緒に未来を作りませんか？</h2>
          <p className="text-large mb-8 text-gray-300">
            AIに仕事を奪われる恐怖から、AIと共に豊かになる希望へ。<br />
            UnsonOS構想を一緒に実現する共創メンバーを募集中です。
          </p>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-yellow-200 text-sm">
              ⚠️ 現在は構想・設計段階です。実際の収益分配は2025年後半以降を予定しています。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/ubDYjDVC" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] border-0">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Discordで議論に参加 →
              </Button>
            </a>
            <a href="/docs/dao/overview">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                DAO構想を見る
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                ホームに戻る
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">DAO構想</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/technical/architecture" className="text-blue-600 hover:text-blue-800">技術設計</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/mvp-validation" className="text-blue-600 hover:text-blue-800">MVP検証</a>
            <span className="text-gray-300">|</span>
            <a href="https://discord.gg/ubDYjDVC" className="text-blue-600 hover:text-blue-800">Discord</a>
            <span className="text-gray-300">|</span>
            <a href="/community" className="text-blue-600 hover:text-blue-800">コミュニティ</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}