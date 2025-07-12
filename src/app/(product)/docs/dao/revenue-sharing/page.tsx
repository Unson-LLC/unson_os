'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'

export default function RevenueSharing() {
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              DAO収益分配システム
              <span className="block text-green-600 mt-2">
                透明で公平なコミュニティ利益分配
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              売上の40%をコミュニティに還元する革新的な分配モデル。
              貢献度に応じた公平な配当システムで、みんなで価値を共有します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/docs/dao/tokenomics">
                <Button size="lg">
                  トークノミクス詳細
                </Button>
              </a>
              <a href="/docs/dao/overview">
                <Button variant="outline" size="lg">
                  DAOの仕組み
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 45/15/40分配モデル */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">45/15/40 分配モデル</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">売上100%の自動分流</h3>
                <p className="text-gray-600">Stripe Webhookによる三つのSafeへの即座な振り分け</p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">45%</div>
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">運営・再投資</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• 開発・広告・インフラ</div>
                    <div>• 時給1,000円×実績先払い</div>
                    <div>• 緊急対応資金</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">15%</div>
                  <h4 className="text-lg font-semibold text-purple-900 mb-2">創業者ボーナス</h4>
                  <div className="text-sm text-purple-700 space-y-1">
                    <div>• 創業期リスクへの報酬</div>
                    <div>• 12ヶ月線形ベスティング</div>
                    <div>• 離脱分はDAO還元</div>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">40%</div>
                  <h4 className="text-lg font-semibold text-green-900 mb-2">コミュニティ配当</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>• 全コントリビューター</div>
                    <div>• 四半期自動配当</div>
                    <div>• 活動係数で公平分配</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 創業者ボーナス詳細 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">創業者ボーナス（15%）</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💎 対象者と配分</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">代表（創業者）</span>
                  <span className="text-blue-600 font-semibold">40%（即時受領）</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">キュレーター</span>
                  <span className="text-green-600 font-semibold">20%（12ヶ月ベスティング）</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">クラフツマン</span>
                  <span className="text-purple-600 font-semibold">20%（12ヶ月ベスティング）</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">開発リーダー</span>
                  <span className="text-orange-600 font-semibold">20%（12ヶ月ベスティング）</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">⏰ ベスティング仕組み</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>線形解放</strong>：12ヶ月間で均等に権利獲得</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>四半期支払い</strong>：3ヶ月ごとに蓄積分を受領</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>早期離脱</strong>：未ベスト分は自動的にDAO Fundに回帰</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>USDC支払い</strong>：価格変動リスクを排除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コミュニティ配当システム */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">コミュニティ配当システム（40%）</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🏆 活動係数による配分</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">貢献活動とポイント</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span>コードコミット（PR）</span>
                      <span className="text-blue-600 font-semibold">+3pt</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span>Issue解決</span>
                      <span className="text-green-600 font-semibold">+2pt</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span>会議での採用提案</span>
                      <span className="text-purple-600 font-semibold">+2pt</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span>メディア確認・Q&A回答</span>
                      <span className="text-orange-600 font-semibold">+1pt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 配当計算式</h3>
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">個人配当額</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">=</div>
                  <div className="text-sm text-gray-700">
                    Fund残高 × (UNSON保有比率 × 活動係数)
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-gray-600 text-sm">
                <div>
                  <strong>活動係数</strong> = 個人活動ポイント ÷ 全体活動ポイント合計
                </div>
                <div>
                  <strong>配当頻度</strong>：四半期ごと（3月・6月・9月・12月）
                </div>
                <div>
                  <strong>送金方法</strong>：Superfluidによる自動USDC送金
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 収益例シミュレーション */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">収益分配シミュレーション</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                📊 月間総収益 $100,000 の場合
              </h3>
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">$45,000</div>
                  <div className="text-sm text-blue-800">運営・再投資</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">$15,000</div>
                  <div className="text-sm text-purple-800">創業者ボーナス</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">$40,000</div>
                  <div className="text-sm text-green-800">コミュニティ配当</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">個人収益例（月間活動ポイント30ptの場合）</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">高貢献者（全体の3%）</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>活動係数</span>
                        <span className="font-semibold">3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UNSON保有</span>
                        <span className="font-semibold">50,000 tokens（5%）</span>
                      </div>
                      <div className="flex justify-between bg-green-50 p-2 rounded">
                        <span className="font-semibold">月間配当</span>
                        <span className="font-bold text-green-600">$3,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">中程度貢献者（全体の1%）</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>活動係数</span>
                        <span className="font-semibold">1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UNSON保有</span>
                        <span className="font-semibold">20,000 tokens（2%）</span>
                      </div>
                      <div className="flex justify-between bg-blue-50 p-2 rounded">
                        <span className="font-semibold">月間配当</span>
                        <span className="font-bold text-blue-600">$800</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 自動分流システム */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">自動分流システム</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                ⚙️ Stripe Webhook → Safe 自動振替
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 text-xl">💳</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">売上発生</div>
                    <div className="text-xs text-gray-600">Stripe決済</div>
                  </div>
                  
                  <div className="mx-4 text-gray-400">→</div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 text-xl">🔄</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">自動分流</div>
                    <div className="text-xs text-gray-600">Webhook処理</div>
                  </div>
                  
                  <div className="mx-4 text-gray-400">→</div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 text-xl">🏦</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">3つのSafe</div>
                    <div className="text-xs text-gray-600">USDC送金</div>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-900 mb-2">運営Safe</h4>
                    <div className="text-sm text-blue-700">
                      <div>freee API自動仕訳</div>
                      <div>時給先払い処理</div>
                      <div>OPEX自動支払い</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-900 mb-2">創業者Safe</h4>
                    <div className="text-sm text-purple-700">
                      <div>ベスティング管理</div>
                      <div>四半期自動分配</div>
                      <div>離脱時回収</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <h4 className="font-semibold text-green-900 mb-2">DAO Treasury</h4>
                    <div className="text-sm text-green-700">
                      <div>Superfluid配当</div>
                      <div>活動係数計算</div>
                      <div>RageQuit処理</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 透明性と監査 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">透明性と監査</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👁️ リアルタイム可視化</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>売上ダッシュボード</strong>：収益のリアルタイム表示</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>分配履歴</strong>：すべての配当記録が公開</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>活動ランキング</strong>：貢献者スコアボード</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>資金流れ</strong>：ブロックチェーン上で追跡可能</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔍 監査体制</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>四半期レポート</strong>：詳細な収支報告を公開</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>外部監査</strong>：年1回の独立監査人による検証</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>コード監査</strong>：スマートコントラクトの定期検証</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>コミュニティ監視</strong>：メンバーによる相互チェック</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 参加方法 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">配当を受け取る方法</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">貢献活動を開始</h3>
                    <p className="text-gray-600 text-sm">コーディング、デザイン、Q&A対応、ドキュメント作成など、様々な形で貢献</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">UNSONトークンを取得</h3>
                    <p className="text-gray-600 text-sm">貢献によるエアドロップまたは取引所での購入でトークンを保有</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ウォレット登録</h3>
                    <p className="text-gray-600 text-sm">配当受取用のウォレットアドレスをDAOシステムに登録</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-semibold text-sm">4</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">自動配当受領</h3>
                    <p className="text-gray-600 text-sm">四半期ごとに貢献度に応じたUSDC配当が自動的にウォレットに送金</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">コミュニティ配当を受け取ろう</h2>
          <p className="text-large mb-8 text-green-100">
            あなたの貢献が直接的な収益になる、公平で透明な収益分配システムに参加しませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/dao/guide">
              <Button variant="secondary" size="lg">
                参加方法を見る
              </Button>
            </a>
            <a href="/docs/dao/tokenomics">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                トークン詳細
              </Button>
            </a>
            <a href="/docs/dao/proposals">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                投票に参加
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">DAOの仕組み</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/tokenomics" className="text-blue-600 hover:text-blue-800">トークノミクス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/proposals" className="text-blue-600 hover:text-blue-800">提案・投票</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/guide" className="text-blue-600 hover:text-blue-800">初心者ガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/structure" className="text-blue-600 hover:text-blue-800">DAO構造</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}