'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'

export default function PlatformOverviewPage() {
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS プラットフォーム概要
              <span className="block text-blue-600 mt-2">
                AIエージェント主導のマイクロSaaS自動生成システム
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              会社の運営自体をソフトウェア化し、OSSとして公開。
              誰もが自律的なビジネスを構築できる革新的なプラットフォームです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/docs/technical/architecture">
                <Button size="lg">
                  技術アーキテクチャ
                </Button>
              </a>
              <a href="/docs/quickstart">
                <Button variant="outline" size="lg">
                  クイックスタート
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* プラットフォームコンセプト */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">プラットフォームの基本コンセプト</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🏭</span>
                <h3 className="text-xl font-semibold text-gray-900">Company-as-a-Product</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>会社運営のすべてのプロセスをコード化</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>GitHubでバージョン管理と継続的改善</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>OSSとして公開し、誰でもフォーク可能</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🚫</span>
                <h3 className="text-xl font-semibold text-gray-900">Zero-Sales Architecture</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>営業プロセスの段階的自動化</span>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>データドリブンな顧客獲得</span>
                </div>
                <div className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>人的介入なしの価値提供システム</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* システム構成 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">システム構成</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🎨 生成・開発層</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-blue-700">
                    <strong>Claude Code</strong><br/>
                    コード自動生成
                  </div>
                  <div className="text-blue-700">
                    <strong>生成AI</strong><br/>
                    画像・動画・コピー
                  </div>
                  <div className="text-blue-700">
                    <strong>GitHub</strong><br/>
                    バージョン管理
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-400">↓</div>
              
              <div className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">⚙️ 運用基盤層</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="text-green-700">
                    <strong>GitHub Actions</strong><br/>
                    CI/CD
                  </div>
                  <div className="text-green-700">
                    <strong>Vercel</strong><br/>
                    実行環境
                  </div>
                  <div className="text-green-700">
                    <strong>Convex</strong><br/>
                    データベース
                  </div>
                  <div className="text-green-700">
                    <strong>Stripe</strong><br/>
                    決済処理
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-400">↓</div>
              
              <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">📊 観測・安全層</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="text-purple-700">
                    <strong>PostHog</strong><br/>
                    行動分析
                  </div>
                  <div className="text-purple-700">
                    <strong>Sentry</strong><br/>
                    エラー監視
                  </div>
                  <div className="text-purple-700">
                    <strong>Semgrep</strong><br/>
                    静的解析
                  </div>
                  <div className="text-purple-700">
                    <strong>Metabase</strong><br/>
                    ダッシュボード
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-400">↓</div>
              
              <div className="card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">💰 コスト管理層</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="text-orange-700">
                    <strong>Infracost</strong><br/>
                    ビルド前見積
                  </div>
                  <div className="text-orange-700">
                    <strong>CloudForecast</strong><br/>
                    請求監視
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4段階ゲートシステム */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">4段階ゲートシステム</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🔍</span>
                <h3 className="text-lg font-semibold text-gray-900">フェーズ0</h3>
                <p className="text-sm text-gray-600">課題検知</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• SNS・検索トレンド分析</div>
                <div>• LLMによるクラスタリング</div>
                <div>• スコア付き課題リスト生成</div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">📄</span>
                <h3 className="text-lg font-semibold text-gray-900">ゲート①</h3>
                <p className="text-sm text-gray-600">LP作成</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 自動コピー生成</div>
                <div>• 即時デプロイ</div>
                <div><strong>基準:</strong> 訪問1,000人・登録率10%</div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">⚡</span>
                <h3 className="text-lg font-semibold text-gray-900">ゲート②</h3>
                <p className="text-sm text-gray-600">MVP開発</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• テスト駆動開発</div>
                <div>• 自動デプロイ</div>
                <div><strong>基準:</strong> 利用者200人・残存率30%</div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">💳</span>
                <h3 className="text-lg font-semibold text-gray-900">ゲート③</h3>
                <p className="text-sm text-gray-600">課金開始</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• 自動価格設定</div>
                <div>• A/Bテスト実行</div>
                <div><strong>基準:</strong> 転換率7%・CAC&lt;LTV÷3</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3段階のプラットフォーム進化 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">プラットフォームの段階的進化</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🌱</span>
                <h3 className="text-xl font-semibold text-gray-900">Phase 1: コンセプト訴求</h3>
                <p className="text-sm text-gray-600">現在〜3ヶ月</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">目的</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• コンセプト理解促進</div>
                    <div>• 初期コミュニティ形成（100-1,000人）</div>
                    <div>• 投資家・パートナー関係構築</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">主要機能</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• DAO配当シミュレーター</div>
                    <div>• SaaS自動生成プレビュー</div>
                    <div>• 透明性ツール</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🚀</span>
                <h3 className="text-xl font-semibold text-gray-900">Phase 2: 実証段階</h3>
                <p className="text-sm text-gray-600">3〜6ヶ月</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">目的</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• 実際のSaaS生成・運用実績</div>
                    <div>• コミュニティ主導開発実証</div>
                    <div>• 収益分配システム稼働</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">追加機能</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• プロダクトショーケース</div>
                    <div>• 参加型投票システム</div>
                    <div>• 開発者ツール・API</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🌐</span>
                <h3 className="text-xl font-semibold text-gray-900">Phase 3: 自動化プラットフォーム</h3>
                <p className="text-sm text-gray-600">6ヶ月〜</p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">目的</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• 完全自律型SaaS生成システム</div>
                    <div>• グローバルコミュニティハブ</div>
                    <div>• 新規事業領域への展開</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">高度機能</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• AI SaaS生成エンジン</div>
                    <div>• 分散型ガバナンス</div>
                    <div>• エコシステム統合</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* パフォーマンス目標 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">パフォーマンス目標</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <span className="text-3xl mb-2 block">⚡</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LP生成</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">&lt; 2時間</p>
              <p className="text-sm text-gray-600">アイデアからローンチまで</p>
            </div>
            
            <div className="card text-center">
              <span className="text-3xl mb-2 block">🔧</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">MVP開発</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">&lt; 24時間</p>
              <p className="text-sm text-gray-600">機能実装から本番デプロイ</p>
            </div>
            
            <div className="card text-center">
              <span className="text-3xl mb-2 block">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">レスポンス</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">&lt; 100ms</p>
              <p className="text-sm text-gray-600">P95レスポンスタイム</p>
            </div>
            
            <div className="card text-center">
              <span className="text-3xl mb-2 block">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">可用性</h3>
              <p className="text-2xl font-bold text-orange-600 mb-1">99.9%</p>
              <p className="text-sm text-gray-600">システム稼働率</p>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティとコンプライアンス */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">セキュリティ & コンプライアンス</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🛡️ 多層防御アーキテクチャ</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span><strong>コードレベル</strong>：Semgrepによる静的解析</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span><strong>ランタイム</strong>：Sentryによる異常検知</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span><strong>データ</strong>：暗号化とアクセス制御</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">4.</span>
                  <span><strong>ネットワーク</strong>：Cloudflare WAF</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 コンプライアンス対応</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>GDPR対応</strong>：データの地域分離と処理記録</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>PII保護</strong>：個人情報の自動マスキング</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>監査ログ</strong>：すべての操作の完全記録</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>定期監査</strong>：セキュリティとライセンスの外部監査</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 次のステップ */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">プラットフォームを始める</h2>
          <p className="text-large mb-8 text-blue-100">
            Unson OSで、あなたのアイデアを自動化された収益性のあるSaaSに変換してみませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/quickstart">
              <Button variant="secondary" size="lg">
                クイックスタート
              </Button>
            </a>
            <a href="/docs/technical/architecture">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                技術詳細を見る
              </Button>
            </a>
            <a href="/docs/development/process">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                開発プロセス
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/technical/architecture" className="text-blue-600 hover:text-blue-800">技術アーキテクチャ</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/technical/pipeline" className="text-blue-600 hover:text-blue-800">生成パイプライン</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/setup-guide" className="text-blue-600 hover:text-blue-800">セットアップ</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">DAOガバナンス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/micro-business" className="text-blue-600 hover:text-blue-800">戦略ガイド</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}