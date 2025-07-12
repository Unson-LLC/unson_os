import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'セキュリティガイド - Unson OS ドキュメント',
  description: 'Unson OSプラットフォームのセキュリティ設計、脆弱性対策、監査体制について詳しく解説。安全で信頼性の高いマイクロSaaS開発環境。',
  openGraph: {
    title: 'セキュリティガイド - Unson OS ドキュメント',
    description: 'Unson OSプラットフォームのセキュリティ設計、脆弱性対策、監査体制について詳しく解説。安全で信頼性の高いマイクロSaaS開発環境。',
  },
}

// セキュリティレイヤー
const securityLayers = [
  {
    layer: '観測・安全層',
    description: 'アプリケーションレベルでの監視とセキュリティ',
    technologies: [
      { name: 'PostHog', purpose: '行動分析・異常検知', icon: '📊' },
      { name: 'Sentry', purpose: 'エラー監視・パフォーマンス追跡', icon: '🚨' },
      { name: 'Semgrep', purpose: '静的解析・脆弱性検出', icon: '🔍' },
      { name: 'Metabase', purpose: 'セキュリティダッシュボード', icon: '📈' }
    ],
    color: 'red',
    bgColor: 'bg-red-50'
  },
  {
    layer: '運用基盤層',
    description: 'インフラ・プラットフォームレベルのセキュリティ',
    technologies: [
      { name: 'GitHub Actions', purpose: 'CI/CD セキュリティチェック', icon: '⚡' },
      { name: 'Vercel', purpose: 'セキュアホスティング・DDoS対策', icon: '🛡️' },
      { name: 'Convex', purpose: '暗号化データベース・アクセス制御', icon: '🔐' },
      { name: 'Stripe', purpose: 'PCI DSS準拠決済処理', icon: '💳' }
    ],
    color: 'blue',
    bgColor: 'bg-blue-50'
  },
  {
    layer: '生成・開発層',
    description: 'コード生成とバージョン管理のセキュリティ',
    technologies: [
      { name: 'Claude Code', purpose: 'セキュアコード生成・レビュー', icon: '🤖' },
      { name: '生成AI', purpose: 'セキュリティ監査・脆弱性検査', icon: '🧠' },
      { name: 'GitHub', purpose: 'アクセス制御・監査ログ', icon: '📂' }
    ],
    color: 'green',
    bgColor: 'bg-green-50'
  }
]

// セキュリティ原則
const securityPrinciples = [
  {
    principle: 'ゼロトラスト原則',
    description: 'すべてのアクセスを検証し、最小権限の原則を適用',
    implementations: [
      '多要素認証（MFA）の必須化',
      'API アクセスの厳格な認証・認可',
      '定期的なアクセス権見直し',
      'ネットワークセグメンテーション'
    ],
    icon: '🔒'
  },
  {
    principle: '深層防御',
    description: '複数のセキュリティレイヤーによる多重防護',
    implementations: [
      'WAF（Web Application Firewall）',
      'DDoS攻撃対策',
      'リアルタイム脅威検知',
      '暗号化通信（TLS 1.3）'
    ],
    icon: '🛡️'
  },
  {
    principle: 'セキュリティ・バイ・デザイン',
    description: '設計段階からセキュリティを組み込み',
    implementations: [
      'セキュアコーディング標準',
      '脆弱性スキャンの自動化',
      'ペネトレーションテスト',
      'コードレビューでのセキュリティチェック'
    ],
    icon: '🏗️'
  },
  {
    principle: '継続的監視',
    description: '24/7のセキュリティ監視と迅速な対応',
    implementations: [
      'SIEM（Security Information and Event Management）',
      '異常行動検知AI',
      'インシデント対応プレイブック',
      '脅威インテリジェンス活用'
    ],
    icon: '👁️'
  }
]

// 脆弱性対策
const vulnerabilityCountermeasures = [
  {
    category: 'インジェクション攻撃',
    threats: ['SQL Injection', 'NoSQL Injection', 'XSS', 'CSRF'],
    countermeasures: [
      'パラメータ化クエリの使用',
      '入力値のサニタイゼーション',
      'CSP（Content Security Policy）の実装',
      'CSRFトークンの利用'
    ],
    severity: 'high'
  },
  {
    category: '認証・認可',
    threats: ['パスワード攻撃', '権限昇格', 'セッションハイジャック'],
    countermeasures: [
      '強力なパスワードポリシー',
      'JWT トークンの適切な管理',
      'セッションタイムアウトの設定',
      '権限ベースアクセス制御（RBAC）'
    ],
    severity: 'high'
  },
  {
    category: 'データ保護',
    threats: ['データ漏洩', '機密情報露出', '不適切な暗号化'],
    countermeasures: [
      'AES-256による暗号化',
      '個人情報の仮名化・匿名化',
      'データ分類とラベリング',
      'データアクセスログの記録'
    ],
    severity: 'medium'
  },
  {
    category: 'API セキュリティ',
    threats: ['API濫用', '認証バイパス', 'レート制限回避'],
    countermeasures: [
      'APIキーの適切な管理',
      'レート制限の実装',
      'API ゲートウェイの活用',
      'OAuth 2.0 / OpenID Connect'
    ],
    severity: 'medium'
  }
]

// コンプライアンス対応
const complianceStandards = [
  {
    standard: 'GDPR',
    description: 'EU一般データ保護規則',
    scope: 'EUユーザーのデータ保護',
    measures: [
      'データ処理の合法性確保',
      'データポータビリティの実装',
      '忘れられる権利への対応',
      'データ保護影響評価（DPIA）'
    ]
  },
  {
    standard: '個人情報保護法',
    description: '日本の個人情報保護法',
    scope: '日本国内のデータ処理',
    measures: [
      'プライバシーポリシーの明確化',
      '個人情報の適切な取得・利用',
      'データ主体の権利への対応',
      '個人情報保護委員会への報告体制'
    ]
  },
  {
    standard: 'SOC 2',
    description: 'Service Organization Control 2',
    scope: 'サービス組織の内部統制',
    measures: [
      'セキュリティ統制の文書化',
      '可用性・機密性の保証',
      '定期的な内部監査',
      '外部監査人による評価'
    ]
  },
  {
    standard: 'ISO 27001',
    description: '情報セキュリティマネジメントシステム',
    scope: '組織全体のセキュリティ管理',
    measures: [
      'リスクアセスメントの実施',
      'セキュリティポリシーの策定',
      '継続的改善プロセス',
      '従業員セキュリティ教育'
    ]
  }
]

// インシデント対応手順
const incidentResponseSteps = [
  { step: 1, phase: '検知・分析', description: '異常の発見と初期分析', duration: '0-1時間' },
  { step: 2, phase: '封じ込め', description: '被害拡散の防止', duration: '1-2時間' },
  { step: 3, phase: '根絶', description: '脅威の完全除去', duration: '2-8時間' },
  { step: 4, phase: '復旧', description: 'システムの正常化', duration: '8-24時間' },
  { step: 5, phase: '事後分析', description: '原因分析と再発防止', duration: '1-7日' }
]

// セキュリティチーム
const securityTeam = [
  {
    role: 'CISO（最高情報セキュリティ責任者）',
    responsibilities: [
      'セキュリティ戦略の策定',
      'リスク管理とガバナンス',
      '経営陣への報告',
      'コンプライアンス監督'
    ]
  },
  {
    role: 'セキュリティエンジニア',
    responsibilities: [
      'セキュリティツールの運用',
      '脆弱性評価・対策',
      'インシデント対応',
      'セキュリティ監視'
    ]
  },
  {
    role: 'DevSecOpsエンジニア',
    responsibilities: [
      'CI/CDパイプラインのセキュリティ',
      'Infrastructure as Code のセキュリティ',
      '開発チームとの連携',
      'セキュリティ自動化'
    ]
  }
]

// 読み時間の計算（概算）
const readingTime = 10

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS 
              <span className="block text-gradient bg-gradient-to-r from-red-600 to-orange-600">
                セキュリティガイド
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約{readingTime}分</span>
              <span>•</span>
              <span>🏷️ セキュリティ・コンプライアンス</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large max-w-3xl mx-auto mb-8">
              多層防御アーキテクチャとゼロトラストモデルによる包括的セキュリティ。
              GDPR・個人情報保護法に対応し、企業レベルの安全性を確保。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink 
                href="#architecture" 
                variant="default"
                size="lg"
              >
                セキュリティアーキテクチャ
              </NavigationLink>
              <NavigationLink 
                href="#compliance" 
                variant="outline"
                size="lg"
              >
                コンプライアンス対応
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#architecture" className="block py-2 text-red-600 hover:text-red-800">1. セキュリティアーキテクチャ</a>
                <a href="#principles" className="block py-2 text-red-600 hover:text-red-800">2. セキュリティ原則</a>
                <a href="#vulnerabilities" className="block py-2 text-red-600 hover:text-red-800">3. 脆弱性対策</a>
                <a href="#compliance" className="block py-2 text-red-600 hover:text-red-800">4. コンプライアンス対応</a>
              </div>
              <div>
                <a href="#incident-response" className="block py-2 text-red-600 hover:text-red-800">5. インシデント対応</a>
                <a href="#security-team" className="block py-2 text-red-600 hover:text-red-800">6. セキュリティチーム</a>
                <a href="#best-practices" className="block py-2 text-red-600 hover:text-red-800">7. ベストプラクティス</a>
                <a href="#resources" className="block py-2 text-red-600 hover:text-red-800">8. リソース・連絡先</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティアーキテクチャ */}
      <section id="architecture" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              多層防御セキュリティアーキテクチャ
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              3つのセキュリティレイヤーによる包括的な防御システム
            </p>
            
            <div className="space-y-8">
              {securityLayers.map((layer, index) => (
                <div key={index} className={`card ${layer.bgColor} border-l-4 border-${layer.color}-500`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {layer.layer}
                  </h3>
                  <p className="text-gray-700 mb-6">{layer.description}</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {layer.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">{tech.icon}</span>
                          <span className="font-semibold text-gray-900">{tech.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{tech.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティ原則 */}
      <section id="principles" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              セキュリティ基本原則
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {securityPrinciples.map((principle, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{principle.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {principle.principle}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4">{principle.description}</p>
                  <ul className="space-y-2">
                    {principle.implementations.map((implementation, implIndex) => (
                      <li key={implIndex} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm text-gray-600">{implementation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 脆弱性対策 */}
      <section id="vulnerabilities" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              脆弱性対策マトリックス
            </h2>
            
            <div className="space-y-6">
              {vulnerabilityCountermeasures.map((vuln, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {vuln.category}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vuln.severity === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vuln.severity === 'high' ? '高リスク' : '中リスク'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">脅威の種類</h4>
                      <ul className="space-y-1">
                        {vuln.threats.map((threat, threatIndex) => (
                          <li key={threatIndex} className="flex items-center">
                            <span className="text-red-500 mr-2">⚠️</span>
                            <span className="text-sm text-gray-700">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">対策・防御手法</h4>
                      <ul className="space-y-1">
                        {vuln.countermeasures.map((countermeasure, counterIndex) => (
                          <li key={counterIndex} className="flex items-center">
                            <span className="text-green-500 mr-2">🛡️</span>
                            <span className="text-sm text-gray-700">{countermeasure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* コンプライアンス対応 */}
      <section id="compliance" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              コンプライアンス対応
            </h2>
            
            <div className="grid gap-8">
              {complianceStandards.map((standard, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {standard.standard}
                      </h3>
                      <p className="text-gray-600">{standard.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">適用範囲</span>
                      <p className="text-sm font-medium text-gray-900">{standard.scope}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {standard.measures.map((measure, measureIndex) => (
                      <div key={measureIndex} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-500 mr-2">📋</span>
                        <span className="text-sm text-gray-700">{measure}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* データ保護の詳細 */}
            <div className="card mt-8 bg-blue-50 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🔐 データ保護の実装詳細
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">暗号化</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 保存時: AES-256暗号化</li>
                    <li>• 転送時: TLS 1.3</li>
                    <li>• キー管理: HSM使用</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">アクセス制御</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 最小権限の原則</li>
                    <li>• 定期的権限見直し</li>
                    <li>• 全アクセスログ記録</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">データ処理</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 目的制限の原則</li>
                    <li>• データ最小化</li>
                    <li>• 自動削除ポリシー</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* インシデント対応 */}
      <section id="incident-response" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              インシデント対応プロセス
            </h2>
            
            <div className="relative">
              {/* プロセスフロー */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                {incidentResponseSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold mb-2">
                      {step.step}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-center">{step.phase}</h4>
                    <p className="text-sm text-gray-600 text-center max-w-32">{step.description}</p>
                    <span className="text-xs text-gray-500 mt-1">{step.duration}</span>
                  </div>
                ))}
              </div>

              {/* 24/7監視 */}
              <div className="card bg-red-50 border-l-4 border-red-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🚨 24/7 セキュリティ監視体制
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">リアルタイム監視</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• ログ分析とアラート</li>
                      <li>• 異常行動検知</li>
                      <li>• ネットワーク監視</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">自動対応</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 自動ブロック機能</li>
                      <li>• エスカレーション</li>
                      <li>• 復旧プロセス開始</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">人的対応</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• オンコール体制</li>
                      <li>• 専門家への連絡</li>
                      <li>• ステークホルダー通知</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティチーム */}
      <section id="security-team" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              セキュリティチーム構成
            </h2>
            
            <div className="grid gap-8">
              {securityTeam.map((member, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {member.role}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {member.responsibilities.map((responsibility, respIndex) => (
                      <div key={respIndex} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <span className="text-purple-500 mr-2">👥</span>
                        <span className="text-sm text-gray-700">{responsibility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ベストプラクティス */}
      <section id="best-practices" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              開発チーム向けセキュリティベストプラクティス
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🔧 開発時のセキュリティ
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">依存関係の脆弱性スキャン</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">静的解析ツール（Semgrep）の使用</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">シークレット情報の環境変数化</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">セキュアコーディング標準の遵守</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🚀 デプロイ時のセキュリティ
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className="text-gray-700">CI/CDでの自動セキュリティテスト</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className="text-gray-700">コンテナイメージのスキャン</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className="text-gray-700">Infrastructure as Codeのレビュー</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className="text-gray-700">デプロイ前のペネトレーションテスト</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* セキュリティチェックリスト */}
            <div className="card mt-8 bg-green-50 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📋 リリース前セキュリティチェックリスト
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">コード品質</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>□ 静的解析完了</li>
                    <li>□ 依存関係更新</li>
                    <li>□ コードレビュー完了</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">セキュリティテスト</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>□ SAST/DAST実行</li>
                    <li>□ 脆弱性スキャン</li>
                    <li>□ ペネトレーションテスト</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">設定確認</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>□ セキュリティヘッダー</li>
                    <li>□ TLS設定</li>
                    <li>□ アクセス制御</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* リソース・連絡先 */}
      <section id="resources" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              セキュリティリソース・連絡先
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📞 緊急連絡先
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-900">セキュリティインシデント</span>
                    <p className="text-gray-700">security-incident@unson.com</p>
                    <p className="text-sm text-gray-600">24時間対応・最優先で処理</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">脆弱性報告</span>
                    <p className="text-gray-700">security@unson.com</p>
                    <p className="text-sm text-gray-600">責任ある開示プログラム</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📚 関連ドキュメント
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/docs/security/api" className="text-blue-600 hover:text-blue-800">
                      API セキュリティガイド
                    </a>
                  </li>
                  <li>
                    <a href="/docs/security/data-protection" className="text-blue-600 hover:text-blue-800">
                      データ保護ポリシー
                    </a>
                  </li>
                  <li>
                    <a href="/docs/security/vulnerability-reporting" className="text-blue-600 hover:text-blue-800">
                      脆弱性報告手順
                    </a>
                  </li>
                  <li>
                    <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
                      プライバシーポリシー
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* バグバウンティプログラム */}
            <div className="card mt-8 bg-yellow-50 border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🏆 バグバウンティプログラム
              </h3>
              <p className="text-gray-700 mb-4">
                セキュリティ研究者の皆様からの責任ある脆弱性開示を歓迎し、報奨金を提供しています。
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-red-600">$5,000</span>
                  <span className="text-sm text-gray-600">Critical</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-orange-600">$2,500</span>
                  <span className="text-sm text-gray-600">High</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-yellow-600">$1,000</span>
                  <span className="text-sm text-gray-600">Medium</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-green-600">$500</span>
                  <span className="text-sm text-gray-600">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="安全なプラットフォームで開発を始めよう"
        subtitle="エンタープライズレベルのセキュリティ環境で、安心してマイクロSaaS開発に取り組みませんか？"
        actions={[
          { label: '開発を始める', href: '/waitlist' },
          { label: 'セキュリティ詳細', href: '/docs/security/overview', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-red-600 to-orange-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/tokenomics" className="text-red-600 hover:text-red-800">← トークノミクス</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/api/authentication" className="text-red-600 hover:text-red-800">API認証 →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-red-600 hover:text-red-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>

      {/* フィードバック・編集 */}
      <section className="py-6 bg-white border-t">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-sm text-gray-600">このページは役に立ちましたか？</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                👍 役に立った
              </button>
              <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                👎 改善が必要
              </button>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://github.com/unson/unson-os/edit/main/docs/technical/security-design.md" 
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                📝 編集
              </a>
              <a 
                href="/contact?type=feedback&page=security" 
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}