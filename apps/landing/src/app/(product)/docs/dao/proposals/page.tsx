'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'

export default function DAOProposalsPage() {
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              DAO提案と投票システム
              <span className="block text-purple-600 mt-2">
                コミュニティ主導の透明な意思決定
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              分散型自律組織として、すべての重要な意思決定はコミュニティメンバーの投票によって行われます。
              透明性と公平性を重視した民主的なガバナンスシステムです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/docs/dao/overview">
                <Button size="lg">
                  DAOの仕組み
                </Button>
              </a>
              <a href="/docs/dao/tokenomics">
                <Button variant="outline" size="lg">
                  トークノミクス
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 提案プロセス概要 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">提案から実行までの流れ</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">提案作成</h3>
                  <p className="text-gray-600">Slackまたはフォーラムで議論を開始し、具体的な提案内容を形にします</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">フォーラム議論</h3>
                  <p className="text-gray-600">2-3日間のオープンな議論期間。メンバーからのフィードバックと改善提案</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Snapshot投票</h3>
                  <p className="text-gray-600">7日間の投票期間。UNSONトークン保有者が投票権を行使</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">4</span>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">結果発表・実行</h3>
                  <p className="text-gray-600">可決した提案は48時間の猶予期間後、自動的に実行開始</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 提案カテゴリー */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">提案カテゴリー</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">📝</span>
                <h3 className="text-xl font-semibold text-gray-900">通常提案</h3>
                <p className="text-sm text-gray-600">日常的な運営改善</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>新機能の追加・改善</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>開発プロセスの改善</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>パートナーシップ締結</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>コミュニティイベント</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">投票基準</p>
                <p className="text-sm text-blue-700">参加率20%以上・賛成66%以上</p>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🏛️</span>
                <h3 className="text-xl font-semibold text-gray-900">重要提案</h3>
                <p className="text-sm text-gray-600">戦略的意思決定</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>トークノミクスの変更</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>大規模投資（100万円以上）</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>基本方針・戦略の変更</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>ガバナンス構造の修正</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-semibold text-purple-900">投票基準</p>
                <p className="text-sm text-purple-700">参加率30%以上・賛成75%以上</p>
              </div>
            </div>
            
            <div className="card">
              <div className="text-center mb-4">
                <span className="text-4xl mb-2 block">🚨</span>
                <h3 className="text-xl font-semibold text-gray-900">緊急提案</h3>
                <p className="text-sm text-gray-600">即座の対応が必要</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>セキュリティ脆弱性対応</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>重大バグの緊急修正</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>法規制への対応</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>サービス停止への対処</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-semibold text-red-900">投票基準</p>
                <p className="text-sm text-red-700">48時間投票・参加率15%以上</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 投票システム */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">投票システムの詳細</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🗳️ 投票ルール</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">投票権の計算</span>
                  <span className="text-blue-600">1 UNSON = 1票</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">標準投票期間</span>
                  <span className="text-green-600">7日間</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">最小参加率</span>
                  <span className="text-purple-600">20%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">可決基準</span>
                  <span className="text-orange-600">賛成66%以上</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">⚡ Snapshot活用</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>ガス費ゼロ</strong>：投票に手数料がかからない</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>検証可能</strong>：すべての投票が公開記録される</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>改ざん不可能</strong>：ブロックチェーンによる保護</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>リアルタイム</strong>：投票状況の即座な確認</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 提案例 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">提案例</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💰</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">予算配分の変更</h3>
                  <p className="text-sm text-gray-600">通常提案の例</p>
                </div>
              </div>
              <div className="space-y-3 text-gray-600 text-sm">
                <p><strong>タイトル:</strong> 広告予算を月額50万円から80万円に増額</p>
                <p><strong>理由:</strong> LP登録率が目標の10%を上回り、スケール機会到来</p>
                <p><strong>期待効果:</strong> 月間新規ユーザー1,000人→2,000人</p>
                <p><strong>予算:</strong> 月額30万円の増額（3ヶ月間の試験運用）</p>
                <p><strong>成功指標:</strong> CAC（顧客獲得コスト）を現在の1.5倍以下に維持</p>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-800"><strong>結果:</strong> 賛成76%で可決・実行済み</p>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔄</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">収益分配比率の調整</h3>
                  <p className="text-sm text-gray-600">重要提案の例</p>
                </div>
              </div>
              <div className="space-y-3 text-gray-600 text-sm">
                <p><strong>タイトル:</strong> 運営費比率を45%→40%に削減、DAO配当を40%→45%に増額</p>
                <p><strong>理由:</strong> 自動化進展により運営コストが想定より低く推移</p>
                <p><strong>期待効果:</strong> コミュニティメンバーの配当が約12%増加</p>
                <p><strong>実施時期:</strong> 次四半期から適用</p>
                <p><strong>条件:</strong> 3ヶ月運用後の効果検証と必要に応じた再調整</p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800"><strong>状況:</strong> フォーラム議論中（投票まで2日）</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 参加方法 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">投票に参加する方法</h2>
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">UNSONトークンの取得</h3>
                    <p className="text-gray-600 text-sm">貢献活動（コーディング、デザイン、Q&A対応など）によってトークンを獲得するか、取引所で購入</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ウォレット接続</h3>
                    <p className="text-gray-600 text-sm">MetaMaskやWalletConnectを使ってDAOプラットフォームにウォレットを接続</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">提案を確認</h3>
                    <p className="text-gray-600 text-sm">フォーラムで議論内容を確認し、提案の詳細と背景を理解</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-semibold text-sm">4</span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">投票実行</h3>
                    <p className="text-gray-600 text-sm">Snapshotページで「賛成」「反対」「棄権」のいずれかを選択して投票</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティと透明性 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">セキュリティと透明性</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔒 セキュリティ対策</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>マルチシグ実行</strong>：重要な変更は複数の署名が必要</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>Timelock機能</strong>：可決後48時間の執行猶予期間</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>RageQuit権</strong>：いつでも資金を引き出して離脱可能</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span><strong>監査済みコード</strong>：スマートコントラクトの外部監査</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👁️ 透明性の確保</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>公開議論</strong>：すべての提案が事前にオープンに議論</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>投票記録</strong>：誰がどう投票したかが永続的に記録</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>実行状況</strong>：可決した提案の実行状況をリアルタイム公開</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>資金流れ</strong>：すべての支出が自動的にダッシュボードで公開</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 次のアクション */}
      <section className="section-padding bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">DAOガバナンスに参加しよう</h2>
          <p className="text-large mb-8 text-purple-100">
            コミュニティの一員として、Unson OSの未来を一緒に決めていきませんか？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/dao/overview">
              <Button variant="secondary" size="lg">
                DAOの仕組みを学ぶ
              </Button>
            </a>
            <a href="/docs/dao/tokenomics">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                トークン取得方法
              </Button>
            </a>
            <a href="/docs/dao/guide">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                初心者ガイド
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
            <a href="/docs/dao/revenue-sharing" className="text-blue-600 hover:text-blue-800">収益分配</a>
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