'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'
import { DocsLayout } from '@/components/layout/DocsLayout'

export default function TestingGuidelinesPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const CodeBlock = ({ children, language = 'javascript', id }: { children: string; language?: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(children, id)}
          className="text-gray-400 hover:text-white"
        >
          {copiedCode === id ? 'コピー済み!' : 'コピー'}
        </Button>
      </div>
      <pre className="text-green-400 text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )

  const tddCycle = [
    {
      phase: 'Red',
      title: '最初にテストを書く',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: '🔴',
      description: '実装前に失敗するテストを書く',
      details: [
        'テストは具体的で、1つの振る舞いだけをテストする',
        'テストの意図が明確になるような名前をつける',
        '実装がないため、テストは失敗する'
      ]
    },
    {
      phase: 'Green',
      title: '最小限の実装',
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '🟢',
      description: 'テストを通すために必要最小限のコードを書く',
      details: [
        'この時点では汚いコードでも構わない',
        'ベタ書きやハードコードも許容される',
        'とにかくテストを通すことを優先する'
      ]
    },
    {
      phase: 'Refactor',
      title: 'リファクタリング',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '🔵',
      description: 'テストが通った状態を保ちながらコードを改善する',
      details: [
        '必ずベタ書きやハードコードを適切な実装に置き換える',
        '重複を取り除き、設計を改善する',
        'マジックナンバーは定数化し、ハードコードされた値は設定可能にする'
      ]
    }
  ]

  const testingTabs = [
    {
      id: 'tdd-cycle',
      label: 'TDDサイクル',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              t_wada方式のTDD
            </h3>
            <p className="text-gray-600">
              このプロジェクトでは、t_wada方式のTDDを採用しています。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tddCycle.map((phase, index) => (
              <div key={index} className={`border-2 rounded-lg p-6 ${phase.color}`}>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{phase.icon}</div>
                  <h4 className="text-lg font-semibold">{phase.phase}</h4>
                  <p className="text-sm font-medium">{phase.title}</p>
                </div>
                <p className="text-sm mb-4 text-center">
                  {phase.description}
                </p>
                <ul className="text-xs space-y-1">
                  {phase.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">AAA パターンの例</h4>
            <CodeBlock language="javascript" id="aaa-pattern">
{`test('日本語プロンプトから英語プロンプトが生成される', async () => {
  // Arrange - テストデータの準備
  const japanesePrompt = '桜並木を歩く女性';
  const expectedEnglishPrompt = 'A woman walking along cherry blossom trees';
  
  // Act - プロンプト変換の実行
  const result = await convertPrompt(japanesePrompt);
  
  // Assert - 結果の検証
  expect(result.english).toContain('woman');
  expect(result.english).toContain('cherry blossom');
  expect(result.quality).toBeGreaterThan(0.8);
});`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'mvp-strategy',
      label: 'MVP開発戦略',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">
                フェーズ1: ランディングページ検証（0-2週間）
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">A/Bテスト実装</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• メッセージの訴求力テスト</li>
                    <li>• 価格表示のバリエーションテスト</li>
                    <li>• CTAボタンの文言・配置テスト</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">計測対象メトリクス</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ページビュー → 登録完了率</li>
                    <li>• 滞在時間とスクロール深度</li>
                    <li>• アンケート回答率と内容分析</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">
                フェーズ2: MVP実装（2-4週間）
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">コア機能のユニットテスト</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ビジネスロジックの正確性</li>
                    <li>• エッジケースの処理</li>
                    <li>• エラーハンドリング</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">決済フローのE2Eテスト</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Stripe連携の正常系</li>
                    <li>• エラー時のリトライ処理</li>
                    <li>• サブスクリプション管理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'test-commands',
      label: 'テスト実行',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">基本コマンド</h4>
              <CodeBlock language="bash" id="basic-commands">
{`# ファイル変更を監視しながらテストを実行
npm run test:watch

# 特定のテストファイルのみ実行
npm test -- path/to/test.js

# カバレッジレポート付きで実行
npm run test:coverage

# E2Eテスト実行
npm run test:e2e`}
              </CodeBlock>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">テストの原則</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Arrange-Act-Assert (AAA) パターンを使用</strong></li>
                <li>• <strong>各テストは独立して実行可能</strong></li>
                <li>• <strong>モックは最小限に留める</strong></li>
                <li>• <strong>テストデータは実際のユースケースに基づく</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'saas-scenarios',
      label: 'SaaS固有シナリオ',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">ユーザー登録・認証</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• メールアドレス検証</li>
                <li>• パスワードポリシーの適用</li>
                <li>• OAuth連携（Google、GitHub等）</li>
                <li>• セッション管理とタイムアウト</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">サブスクリプション管理</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 無料トライアル開始</li>
                <li>• 有料プランへの移行</li>
                <li>• プランアップグレード/ダウングレード</li>
                <li>• 解約処理とデータ保持</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">使用量制限とクォータ</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• API呼び出し回数の制限</li>
                <li>• ストレージ使用量の計測</li>
                <li>• 同時実行数の制御</li>
                <li>• レート制限の実装</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">データプライバシー</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 個人情報の暗号化</li>
                <li>• GDPRコンプライアンス</li>
                <li>• データエクスポート機能</li>
                <li>• アカウント削除時のデータ消去</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ]

  const performanceTestExample = {
    title: 'パフォーマンステスト例',
    code: `test('プロンプト変換が3秒以内に完了する', async () => {
  const startTime = Date.now();
  
  const result = await convertPrompt('複雑な日本語の説明文...');
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(3000);
});`
  }

  const testEnvironments = [
    {
      name: '開発環境',
      env: 'NODE_ENV=development',
      description: 'ローカル開発用',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      name: 'テスト環境',
      env: 'NODE_ENV=test',
      description: 'モックAPI使用',
      color: 'bg-green-100 text-green-700'
    },
    {
      name: 'ステージング環境',
      env: 'NODE_ENV=staging',
      description: '本番相当',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      name: '本番環境',
      env: 'NODE_ENV=production',
      description: '本番デプロイ用',
      color: 'bg-red-100 text-red-700'
    }
  ]

  const cicdPipeline = [
    {
      stage: 'プルリクエスト時',
      items: [
        'ユニットテスト全実行',
        'コードカバレッジチェック（80%以上）',
        'Lintチェック'
      ]
    },
    {
      stage: 'マージ時',
      items: [
        'E2Eテスト実行',
        'パフォーマンステスト',
        'セキュリティスキャン'
      ]
    },
    {
      stage: 'デプロイ前',
      items: [
        'スモークテスト',
        'ヘルスチェック',
        'ロールバック準備'
      ]
    }
  ]

  const metricsItems = [
    {
      title: '技術指標',
      content: (
        <div>
          <ul className="text-gray-600 space-y-2">
            <li><strong>レスポンスタイム</strong>: p50, p95, p99</li>
            <li><strong>エラー率</strong>: 各エンドポイントのエラー発生率</li>
            <li><strong>API成功率</strong>: 外部API呼び出しの成功率</li>
          </ul>
        </div>
      )
    },
    {
      title: 'ビジネス指標',
      content: (
        <div>
          <ul className="text-gray-600 space-y-2">
            <li><strong>登録コンバージョン率</strong>: 訪問者からの登録率</li>
            <li><strong>有料転換率</strong>: 無料から有料への転換率</li>
            <li><strong>チャーン率</strong>: 月次解約率</li>
            <li><strong>LTV/CAC比率</strong>: 顧客生涯価値と獲得コストの比率</li>
          </ul>
        </div>
      )
    },
    {
      title: 'ユーザー体験指標',
      content: (
        <div>
          <ul className="text-gray-600 space-y-2">
            <li><strong>NPS（Net Promoter Score）</strong>: 週次でのユーザー満足度調査</li>
            <li><strong>機能改善の効果測定</strong>: 新機能の利用率と満足度</li>
            <li><strong>タスク完了率</strong>: 主要機能の完了率測定</li>
            <li><strong>UIの直感性検証</strong>: ユーザビリティテスト結果</li>
          </ul>
        </div>
      )
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              テスト
              <span className="block text-green-600 mt-2">
                ガイドライン
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              t_wada方式のTDDを採用し、MVP開発からSaaS運用まで品質を保証する包括的テスト戦略。
              Red-Green-Refactorサイクルで安全で保守性の高いコードを実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                TDD開始
              </Button>
              <Button variant="outline" size="lg">
                テスト例確認
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TDDサイクル詳細 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">Test-Driven Development</h2>
          <Tabs items={testingTabs} />
        </div>
      </section>

      {/* パフォーマンステスト */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">パフォーマンステスト</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {performanceTestExample.title}
              </h3>
              <p className="text-gray-600 mb-4">
                レスポンス時間の要件を満たすことを確認するテスト
              </p>
              <CodeBlock language="javascript" id="performance-test">
                {performanceTestExample.code}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* テスト環境管理 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">テスト環境管理</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testEnvironments.map((env, index) => (
              <div key={index} className="card text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${env.color}`}>
                  {env.name}
                </div>
                <div className="font-mono text-sm text-gray-700 mb-2 bg-gray-100 p-2 rounded">
                  {env.env}
                </div>
                <p className="text-gray-600 text-sm">
                  {env.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CI/CDパイプライン */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">CI/CDパイプラインでのテスト</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cicdPipeline.map((stage, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stage.stage}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {stage.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                      <span className="mr-2 text-green-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 重要な指標の監視 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">重要な指標の監視</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion items={metricsItems} />
          </div>
        </div>
      </section>

      {/* ベストプラクティス */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">テストのベストプラクティス</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🎯 明確なテスト意図</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• 1つのテストで1つの動作を検証</li>
                <li>• 分かりやすいテスト名を付ける</li>
                <li>• AAAパターンを徹底</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🔄 継続的な改善</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• テストコードもリファクタリング対象</li>
                <li>• 冗長なテストは削除</li>
                <li>• カバレッジよりも品質重視</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">⚡ 高速なフィードバック</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• ユニットテストは数秒で実行</li>
                <li>• 統合テストは並列実行</li>
                <li>• E2Eテストは重要パスのみ</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🛡️ 信頼性の確保</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• フレーキーテストは即座に修正</li>
                <li>• テストデータの独立性確保</li>
                <li>• 外部依存は適切にモック</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">📊 データドリブン</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• 実際のユーザーデータに基づく</li>
                <li>• エッジケースも考慮</li>
                <li>• 思い込み破壊シナリオ追加</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🎨 保守性の向上</h3>
              <ul className="text-green-100 text-sm space-y-1">
                <li>• テストヘルパーの活用</li>
                <li>• ページオブジェクトパターン</li>
                <li>• 共通テストユーティリティ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/development/setup-guide" className="text-blue-600 hover:text-blue-800">セットアップガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/api-tests-complete" className="text-blue-600 hover:text-blue-800">API テスト完全ガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/folder-structure-guide" className="text-blue-600 hover:text-blue-800">フォルダ構造ガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/node-version-management" className="text-blue-600 hover:text-blue-800">Node.js管理</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}