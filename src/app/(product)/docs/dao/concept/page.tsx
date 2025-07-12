import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'DAOコンセプト設計書 - Unson OS ドキュメント',
  description: 'Unson OS DAOの包括的なコンセプト設計書。基本理念、トークンエコノミー、ガバナンス構造、技術アーキテクチャ、法的構造、実装ロードマップまでを詳細解説。',
  openGraph: {
    title: 'DAOコンセプト設計書 - Unson OS ドキュメント',
    description: 'Unson OS DAOの包括的なコンセプト設計書。基本理念、トークンエコノミー、ガバナンス構造、技術アーキテクチャ、法的構造、実装ロードマップまでを詳細解説。',
  },
}

const executiveSummary = {
  vision: '100個のマイクロSaaSプロダクト（3年目標）を自動生成・運用',
  approach: 'コミュニティ主導の開発と公平な利益分配を実現する分散型自律組織',
  concept: 'Company-as-a-Product',
  differentiator: '従来の株式会社モデルではなく、貢献度に基づいた動的な利益分配システム'
}

const coreValues = [
  {
    value: '透明性（Transparency）',
    description: 'すべての意思決定プロセスの可視化',
    details: ['収益・コストの完全公開', '貢献度計測の明確化'],
    icon: '👁️',
    color: 'blue'
  },
  {
    value: '公平性（Fairness）',
    description: '貢献度に基づく報酬分配',
    details: ['新規参加者への機会均等', '長期貢献者への適切な評価'],
    icon: '⚖️',
    color: 'green'
  },
  {
    value: '自律性（Autonomy）',
    description: 'スマートコントラクトによる自動執行',
    details: ['人的介入の最小化', '分散型意思決定'],
    icon: '🤖',
    color: 'purple'
  },
  {
    value: '持続可能性（Sustainability）',
    description: '長期的な価値創造',
    details: ['コミュニティの成長促進', 'リスク分散メカニズム'],
    icon: '🌱',
    color: 'emerald'
  }
]

const designPrinciples = [
  'Simple is Best: 複雑な仕組みより、シンプルで理解しやすい設計',
  'Incentive Alignment: 個人の利益とDAOの利益が一致する設計',
  'Gradual Decentralization: 段階的な分散化アプローチ',
  'Fail-Safe Mechanism: 失敗時の安全装置の組み込み'
]

const tokenStructure = {
  unson: {
    totalSupply: 100000000,
    purpose: 'ガバナンストークン',
    distribution: [
      { category: '創業チーム（雲孫GK）', percentage: 25, detail: '2年ベスティング' },
      { category: 'コミュニティトレジャリー', percentage: 40, detail: 'DAO管理' },
      { category: 'エコシステム開発', percentage: 20, detail: '開発助成金、パートナーシップ等' },
      { category: '流動性提供', percentage: 10, detail: 'DEXでの流動性確保' },
      { category: '予備', percentage: 5, detail: '将来の投資家等' }
    ]
  },
  profit: {
    purpose: '収益分配トークン',
    issuance: '各プロダクトの収益に応じて毎月発行',
    usage: '実際の収益分配に使用',
    exchangeRate: '1 PROFIT = 収益プールの比例分配権'
  }
}

const contributionCategories = [
  { category: '開発貢献', weight: 40, subcategories: ['コード貢献: 20%', 'バグ修正: 10%', 'レビュー: 5%', 'ドキュメント: 5%'] },
  { category: 'プロダクト貢献', weight: 30, subcategories: ['アイデア提案: 10%', '検証実施: 10%', 'UI/UXデザイン: 10%'] },
  { category: 'マーケティング貢献', weight: 20, subcategories: ['コンテンツ作成: 10%', 'SNS活動: 5%', 'コミュニティ管理: 5%'] },
  { category: 'ガバナンス貢献', weight: 10, subcategories: ['提案作成: 5%', '投票参加: 5%'] }
]

const qualityMultipliers = [
  { level: 'Exceptional', multiplier: 2.0, description: '例外的に優れた貢献' },
  { level: 'High', multiplier: 1.5, description: '高品質な貢献' },
  { level: 'Standard', multiplier: 1.0, description: '標準的な貢献' },
  { level: 'Low', multiplier: 0.5, description: '改善が必要な貢献' }
]

const revenueDistributionFlow = [
  { step: 1, title: '収益集計', date: '毎月1日', description: '全プロダクトの収益を集計し、コスト控除後の分配可能収益を確定' },
  { step: 2, title: '貢献度計算', date: '毎月5日', description: '過去30日間の貢献度を集計し、品質評価を反映した最終スコアを確定' },
  { step: 3, title: 'PROFIT発行', date: '毎月10日', description: '貢献度に応じてPROFITトークンを発行し、スマートコントラクトで自動配布' },
  { step: 4, title: '収益交換', date: '毎月15日以降', description: 'PROFITトークンをUSDCに交換可能（交換レート = 収益プール÷総PROFIT数）' }
]

const governanceProposalCategories = [
  { category: '運営提案', content: '日常的な運営判断', approval: '51%', participation: '10%' },
  { category: '技術提案', content: '新機能・アーキテクチャ変更', approval: '66%', participation: '20%' },
  { category: '経済提案', content: 'トークノミクス変更', approval: '75%', participation: '30%' },
  { category: '憲章変更', content: 'DAO基本ルール変更', approval: '80%', participation: '40%' }
]

const votingMechanism = {
  type: 'Quadratic Voting（二次投票）',
  formula: '投票力 = √(保有UNSONトークン数)',
  benefits: [
    '大口保有者の影響力を適度に制限',
    '小口保有者の声も反映',
    'より民主的な意思決定を実現'
  ]
}

const delegationSystem = [
  '専門知識を持つメンバーへの投票権委任',
  'カテゴリ別委任（技術、マーケティング等）',
  'いつでも委任解除可能'
]

const safeguardMechanisms = [
  {
    mechanism: '緊急停止メカニズム',
    details: ['セキュリティ脅威検知時の自動停止', 'マルチシグによる緊急対応', '72時間以内の対応義務']
  },
  {
    mechanism: '悪意ある提案の防止',
    details: ['提案には最低1,000 UNSON保有が必要', 'スパム提案者のトークン没収', 'コミュニティによる提案事前審査']
  }
]

const productLifecycle = [
  {
    phase: 'アイデア提案',
    period: '0-7日',
    description: 'コミュニティメンバーがアイデア提出、初期投票で上位10案を選定、選定案に開発リソース割当'
  },
  {
    phase: 'MVP開発',
    period: '7-21日',
    description: '2週間でMVP完成、開発者はGitHub貢献度で自動評価、テスター募集と初期フィードバック'
  },
  {
    phase: '市場検証',
    period: '21-28日',
    description: 'LP公開とユーザー獲得、KPI達成度の測定、継続/終了の自動判定'
  },
  {
    phase: '本格運用 or 終了',
    period: '28日以降',
    description: '成功なら自動スケーリング開始、失敗ならリソースを次プロダクトへ'
  }
]

const terminationConditions = [
  '30日間の収益が運営コストを下回る',
  'MAUが100人を下回る',
  '技術的メンテナンスコストが収益の50%を超える',
  'コミュニティ投票で70%以上が終了に賛成'
]

const technicalStack = {
  governance: [
    { tool: 'Snapshot', purpose: 'オフチェーン投票プラットフォーム', details: ['投票期間: 5日間', '可決条件: 66%以上の賛成 + 20%以上の参加率'] },
    { tool: 'Safe (Gnosis)', purpose: 'マルチシグウォレット', details: ['3/5署名による重要操作', 'タイムロック機能', '自動的な資金分流 (45/15/40%)'] }
  ],
  revenue: [
    { tool: 'Superfluid', purpose: 'リアルタイム収益ストリーミング', details: ['四半期配当の自動化', 'USDC → UNFホルダーへの直接分配'] },
    { tool: 'SafeTxBuilder', purpose: '自動取引実行', details: ['月次収益分配の自動化', '貢献度に基づく配当計算'] }
  ]
}

const smartContractComponents = [
  { component: 'UnsonDAO', description: 'メインDAO契約', features: ['ガバナンス機能', '収益分配機能', 'プロダクト管理', 'SubDAO管理'] },
  { component: 'UNSONToken', description: 'ガバナンストークン', features: ['ERC-20実装', '総供給量: 1億枚（追加発行なし）'] },
  { component: 'PROFITToken', description: '収益分配トークン', features: ['月次でmint', '収益と交換後burn'] }
]

const subDAOArchitecture = [
  {
    name: 'Ads-SubDAO',
    specialization: '広告運用特化',
    features: ['独自予算管理', 'ROAS≥150%のKPI', '2Q連続未達で親DAOに吸収']
  },
  {
    name: 'Data-SubDAO',
    specialization: 'データ統合特化',
    features: ['新API実装数がKPI', '利用率10%未満で解散', '独自ガバナンス']
  }
]

const monitoringSystem = [
  { type: '投票集中監視', description: '単一アドレスの20%超保有を検知' },
  { type: 'Treasury流出監視', description: 'SafeTx >10/分で緊急停止' },
  { type: 'SubDAO活動監視', description: '提案ゼロ30日で自動通知' }
]

const transparencyMeasures = [
  '全取引ハッシュを Discord#audit チャンネルに自動投稿',
  '月次財務報告の自動生成',
  'GitHub Issueとの自動連携'
]

const offchainIntegration = [
  { integration: 'GitHub API', purpose: 'コード貢献度の取得' },
  { integration: 'Analytics API', purpose: 'プロダクトメトリクス収集' },
  { integration: 'Oracle', purpose: '収益データのオンチェーン化' },
  { integration: 'Stripe Webhook', purpose: '自動収益分流' }
]

const securityMeasures = [
  {
    category: 'スマートコントラクト監査',
    measures: ['著名監査会社による定期監査', 'バグバウンティプログラム', '形式検証の実施']
  },
  {
    category: 'アクセス制御',
    measures: ['マルチシグウォレット採用', 'タイムロック機能', 'Role-Based Access Control']
  },
  {
    category: 'リスク管理',
    measures: ['段階的な資金解放', '緊急時の資産凍結機能', '保険プロトコルとの連携']
  }
]

const legalFramework = [
  {
    jurisdiction: 'Wyoming DAO LLC',
    timeline: '最短2週間で設立',
    cost: '約$2,000〜$5,000',
    benefits: ['収益型DAO向けに最適化', '米国内での法的保護', '有限責任']
  },
  {
    jurisdiction: 'Wyoming DUNA',
    timeline: '100人以上の公共DAOに最適',
    cost: '約$5,000〜$10,000',
    benefits: ['将来のパブリックグッズ化時に採用', 'より分散型のガバナンス構造']
  },
  {
    jurisdiction: '日本（合同会社雲孫）',
    timeline: '既存',
    cost: '設立済み',
    benefits: ['国内税務の一本化', '日本人中心プロジェクト向け', '親会社としての機能']
  }
]

const tokenClassification = [
  { token: 'UNSONトークン', classification: 'ユーティリティトークン', characteristics: 'ガバナンス機能中心' },
  { token: 'PROFITトークン', classification: '収益分配権（セキュリティトークンの可能性）', characteristics: '投資商品的側面' }
]

const investmentStructure = {
  mechanism: 'Token Warrant / SAFE+Token',
  terms: [
    '転換割引: 10%',
    'ロック期間: 24ヶ月',
    '議決権制限: 50%減',
    '流動性制限: 段階的解放'
  ]
}

const kycAmlCompliance = [
  { level: '基本参加', requirement: 'KYC不要', access: '投票権のみ' },
  { level: '収益受取', requirement: '簡易KYC必要', access: '配当受領可能' },
  { level: '大口取引', requirement: '完全KYC必要', access: '制限なし' }
]

const implementationRoadmap = [
  {
    phase: 'Phase 1: Foundation',
    period: '0-30日',
    milestones: ['Safe & UNF発行', 'Wyoming DAO LLC登記', '基本的なStripe Webhook設定', '初期コミュニティ形成（100人）'],
    tasks: ['Safe作成とマルチシグ設定', 'UNSONトークンのスマートコントラクト開発', '法人設立', 'コミュニティ構築']
  },
  {
    phase: 'Phase 2: Infrastructure',
    period: '30-60日',
    milestones: ['Snapshot・SubDAOテンプレート実装', '自動監視Bot開発', '基本的なガバナンス機能実装', '初期メンバーKYC対応'],
    tasks: ['Snapshot統合', 'GitHub API連携', 'SubDAOアーキテクチャ実装', 'セキュリティ監査']
  },
  {
    phase: 'Phase 3: Operations',
    period: '60-90日',
    milestones: ['Founder Bonus初回配当', '投票実績公開', '最初のSubDAO立ち上げ', '外部監査実施'],
    tasks: ['Superfluid自動配当システム', '透明性レポート自動生成', 'SubDAO実装', 'セキュリティ監査と修正']
  },
  {
    phase: 'Phase 4: Growth',
    period: '90-120日',
    milestones: ['Quadratic Funding Round #1開催', '外部投資家への提案', '国際展開の準備', 'エコシステムパートナーシップ'],
    tasks: ['Quadratic Funding実装', '法的整備', '多言語対応', '他DAOとの連携協定']
  }
]

const growthPlan = [
  { period: '0-6ヶ月', goals: ['スマートコントラクト開発', '初期コミュニティ形成（1,000人）', '最初の10プロダクトローンチ', '月間収益$10,000達成'] },
  { period: '6-12ヶ月', goals: ['50プロダクト運用', 'コミュニティ10,000人', '月間収益$100,000達成', '分散型ガバナンス本格始動'] },
  { period: '12-24ヶ月', goals: ['100プロダクト運用（3年目標）', 'グローバル展開', '月間収益$1,000,000達成', '他DAOとの連携'] },
  { period: '24ヶ月以降', goals: ['プロダクト間シナジー創出', 'AIによる段階的自動化', '新規事業領域への展開', 'IPO or M&Aの検討'] }
]

const daoKPIs = [
  { category: '財務KPI', metrics: ['月間総収益（MRR）', '利益率', 'トークン時価総額'] },
  { category: 'コミュニティKPI', metrics: ['アクティブメンバー数', '月間貢献者数', '提案採択率'] },
  { category: 'プロダクトKPI', metrics: ['稼働プロダクト数', '平均プロダクト寿命', '成功率（収益性達成率）'] }
]

const riskAnalysis = [
  {
    category: '技術的リスク',
    risks: [
      { risk: 'スマートコントラクトバグ', impact: '高', probability: '中', mitigation: '監査・保険・バグバウンティ' },
      { risk: 'スケーラビリティ問題', impact: '中', probability: '高', mitigation: 'L2ソリューション採用' },
      { risk: 'オラクル障害', impact: '中', probability: '低', mitigation: '複数オラクル使用' }
    ]
  },
  {
    category: '事業リスク',
    risks: [
      { risk: '規制強化', impact: '高', probability: '中', mitigation: '複数管轄地での運営' },
      { risk: '競合出現', impact: '中', probability: '高', mitigation: '先行者利益の最大化' },
      { risk: 'コミュニティ離反', impact: '高', probability: '低', mitigation: '透明性とインセンティブ強化' }
    ]
  },
  {
    category: '金融リスク',
    risks: [
      { risk: 'トークン価格暴落', impact: '高', probability: '中', mitigation: '買い戻しプログラム' },
      { risk: '流動性不足', impact: '中', probability: '中', mitigation: 'LP報酬プログラム' },
      { risk: '為替リスク', impact: '低', probability: '高', mitigation: 'ステーブルコイン活用' }
    ]
  }
]

const participationRequirements = [
  {
    step: 'STEP 0: 基本登録',
    conditions: ['Eメール & GitHub / Slack連携', '利用規約・コードオブコンダクトに署名'],
    purpose: 'Sybil（なりすまし）防止、最低限の行動規範共有'
  },
  {
    step: 'STEP 1: 本人確認',
    conditions: ['GitHubアカウント年齢 ≥ 30日', '法的に必要な国のみKYC'],
    purpose: 'Bot大量登録抑止、AML/OFACリスク回避'
  },
  {
    step: 'STEP 2: 初期貢献（Earn-to-Join）',
    conditions: ['コードPR 1本マージ', 'LP/広告クリエイティブ 1件採用', '翻訳500文字またはDocs修正2ページ'],
    purpose: '"タダ乗り"防止、最初の貢献による価値提供'
  },
  {
    step: 'STEP 3: 最小UNF保有（Stake-to-Vote）',
    conditions: ['100 UNF以上を保有・ロック（約10〜20 USDC想定）'],
    purpose: '投票の重み付け、Sybilコスト上昇'
  }
]

const permissionLevels = [
  { level: 'オブザーバー', requirements: 'STEP 0完了', access: ['透明性確保のため情報閲覧可能', '投票権なし', '配当権なし'] },
  { level: 'コントリビューター', requirements: 'STEP 0+1+2完了', access: ['貢献度に応じた配当権', '制限付き投票権', 'コミュニティ活動参加権'] },
  { level: 'フルメンバー', requirements: 'STEP 0+1+2+3完了', access: ['完全な投票権', '提案作成権', '最大配当権'] }
]

export default function DAOConceptPage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS DAO
              <span className="block text-indigo-600 mt-2">
                コンセプト設計書 📋
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約25分</span>
              <span>•</span>
              <span>🏷️ DAO・設計・技術仕様</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large text-gray-600 mb-8 max-w-3xl mx-auto">
              100-200個のマイクロSaaSプロダクトを自動生成・運用するプラットフォームにおける、
              コミュニティ主導の開発と公平な利益分配を実現する分散型自律組織の包括的設計書。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#executive-summary" variant="default" size="lg">
                📊 エグゼクティブサマリー
              </NavigationLink>
              <NavigationLink href="#technical-architecture" variant="outline" size="lg">
                ⚙️ 技術アーキテクチャ
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <a href="#executive-summary" className="block py-2 text-blue-600 hover:text-blue-800">1. エグゼクティブサマリー</a>
                <a href="#design-philosophy" className="block py-2 text-blue-600 hover:text-blue-800">2. DAO設計の基本理念</a>
                <a href="#token-economy" className="block py-2 text-blue-600 hover:text-blue-800">3. トークンエコノミー設計</a>
                <a href="#governance-structure" className="block py-2 text-blue-600 hover:text-blue-800">4. ガバナンス構造</a>
              </div>
              <div>
                <a href="#product-management" className="block py-2 text-blue-600 hover:text-blue-800">5. プロダクト管理とDAO</a>
                <a href="#technical-architecture" className="block py-2 text-blue-600 hover:text-blue-800">6. 技術アーキテクチャ</a>
                <a href="#legal-compliance" className="block py-2 text-blue-600 hover:text-blue-800">7. 法的コンプライアンス</a>
                <a href="#growth-strategy" className="block py-2 text-blue-600 hover:text-blue-800">8. 成長戦略とロードマップ</a>
              </div>
              <div>
                <a href="#risk-analysis" className="block py-2 text-blue-600 hover:text-blue-800">9. リスク分析と対策</a>
                <a href="#participation-conditions" className="block py-2 text-blue-600 hover:text-blue-800">10. DAO参加条件</a>
                <a href="#implementation-checklist" className="block py-2 text-blue-600 hover:text-blue-800">11. 実装チェックリスト</a>
                <a href="#conclusion" className="block py-2 text-blue-600 hover:text-blue-800">12. 結論</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="executive-summary" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              📊 エグゼクティブサマリー
            </h2>

            <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">ビジョン</h3>
                  <p className="text-gray-700">{executiveSummary.vision}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">アプローチ</h3>
                  <p className="text-gray-700">{executiveSummary.approach}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">コンセプト</h3>
                  <p className="text-gray-700">{executiveSummary.concept}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">差別化要因</h3>
                  <p className="text-gray-700">{executiveSummary.differentiator}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="design-philosophy" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              DAO設計の基本理念
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {coreValues.map((value, index) => (
                <div key={index} className={`card bg-${value.color}-50 border-l-4 border-${value.color}-500`}>
                  <div className="flex items-start mb-4">
                    <span className="text-4xl mr-4">{value.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.value}</h3>
                      <p className="text-gray-700 mb-3">{value.description}</p>
                      <ul className="space-y-1">
                        {value.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <span className="text-green-500 mr-2 text-sm">•</span>
                            <span className="text-sm text-gray-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card bg-yellow-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">設計原則</h3>
              <div className="space-y-3">
                {designPrinciples.map((principle, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="token-economy" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              トークンエコノミー設計
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">UNSONトークン（ガバナンストークン）</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総供給量:</span>
                    <span className="font-semibold">{tokenStructure.unson.totalSupply.toLocaleString()} UNSON</span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">初期配分:</h4>
                    {tokenStructure.unson.distribution.map((dist, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium text-gray-900">{dist.category}</span>
                          <p className="text-xs text-gray-600">{dist.detail}</p>
                        </div>
                        <span className="font-bold text-gray-900">{dist.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">PROFITトークン（収益分配トークン）</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">目的</h4>
                    <p className="text-gray-700">{tokenStructure.profit.purpose}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">発行</h4>
                    <p className="text-gray-700">{tokenStructure.profit.issuance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">用途</h4>
                    <p className="text-gray-700">{tokenStructure.profit.usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">交換レート</h4>
                    <p className="text-gray-700">{tokenStructure.profit.exchangeRate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">貢献度計測システム</h3>
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">貢献カテゴリと重み付け</h4>
                {contributionCategories.map((category, index) => (
                  <div key={index} className="card bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold text-gray-900">{category.category}</h5>
                      <span className="font-bold text-blue-600">{category.weight}%</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      {category.subcategories.map((sub, subIndex) => (
                        <div key={subIndex} className="text-sm text-gray-600">• {sub}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-purple-50 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">品質乗数（将来導入予定）</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {qualityMultipliers.map((multiplier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded">
                    <div>
                      <span className="font-semibold text-gray-900">{multiplier.level}</span>
                      <p className="text-xs text-gray-600">{multiplier.description}</p>
                    </div>
                    <span className="font-bold text-purple-600">{multiplier.multiplier}x</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-blue-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">月次収益分配フロー</h3>
              <div className="space-y-4">
                {revenueDistributionFlow.map((flow, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {flow.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{flow.title}</h4>
                        <span className="text-sm text-blue-600 font-medium">{flow.date}</span>
                      </div>
                      <p className="text-gray-700">{flow.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="governance-structure" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              ガバナンス構造
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">提案カテゴリと必要票数</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">カテゴリ</th>
                      <th className="px-4 py-2 text-left">内容</th>
                      <th className="px-4 py-2 text-left">必要賛成率</th>
                      <th className="px-4 py-2 text-left">最低投票率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {governanceProposalCategories.map((category, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-medium text-gray-900">{category.category}</td>
                        <td className="px-4 py-2 text-gray-700">{category.content}</td>
                        <td className="px-4 py-2 text-blue-600 font-semibold">{category.approval}</td>
                        <td className="px-4 py-2 text-green-600 font-semibold">{category.participation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{votingMechanism.type}</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <code className="text-sm text-gray-800">{votingMechanism.formula}</code>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">メリット:</h4>
                    <ul className="space-y-1">
                      {votingMechanism.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card bg-yellow-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">委任投票システム</h3>
                <ul className="space-y-3">
                  {delegationSystem.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">▶</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card bg-red-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">セーフガード機能</h3>
              <div className="space-y-6">
                {safeguardMechanisms.map((mechanism, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-3">{mechanism.mechanism}</h4>
                    <ul className="space-y-2">
                      {mechanism.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-management" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              プロダクト管理とDAO
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">プロダクトライフサイクル管理</h3>
              <div className="space-y-6">
                {productLifecycle.map((phase, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                        <span className="text-sm text-purple-600 font-medium">{phase.period}</span>
                      </div>
                      <p className="text-gray-700">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-red-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">自動終了メカニズム</h3>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">終了条件（以下のいずれか）</h4>
                <ul className="space-y-2">
                  {terminationConditions.map((condition, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">{index + 1}.</span>
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="technical-architecture" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              技術アーキテクチャ
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">ガバナンス・投票システム</h3>
                {technicalStack.governance.map((tool, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{tool.tool}</h4>
                    <p className="text-gray-700 mb-2">{tool.purpose}</p>
                    <ul className="space-y-1">
                      {tool.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-600">• {detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">収益分配システム</h3>
                {technicalStack.revenue.map((tool, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{tool.tool}</h4>
                    <p className="text-gray-700 mb-2">{tool.purpose}</p>
                    <ul className="space-y-1">
                      {tool.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-gray-600">• {detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">スマートコントラクト構成</h3>
              <div className="space-y-4">
                {smartContractComponents.map((contract, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{contract.component}</h4>
                    <p className="text-gray-700 mb-3">{contract.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {contract.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">SubDAOアーキテクチャ</h3>
              <div className="space-y-4">
                {subDAOArchitecture.map((subdao, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{subdao.name}</h4>
                    <p className="text-gray-700 mb-3">{subdao.specialization}</p>
                    <ul className="space-y-1">
                      {subdao.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">自動監視Bot</h3>
                <ul className="space-y-3">
                  {monitoringSystem.map((monitor, index) => (
                    <li key={index}>
                      <h4 className="font-semibold text-gray-900">{monitor.type}</h4>
                      <p className="text-sm text-gray-600">{monitor.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">透明性確保</h3>
                <ul className="space-y-2">
                  {transparencyMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">オフチェーン連携</h3>
                <div className="space-y-3">
                  {offchainIntegration.map((integration, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-900">{integration.integration}</span>
                      <span className="text-sm text-gray-600">{integration.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">セキュリティ対策</h3>
                <div className="space-y-4">
                  {securityMeasures.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                      <ul className="space-y-1">
                        {category.measures.map((measure, measureIndex) => (
                          <li key={measureIndex} className="text-sm text-gray-600">• {measure}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="legal-compliance" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              法的コンプライアンス
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">規制対応フレームワーク</h3>
              <div className="space-y-6">
                {legalFramework.map((framework, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{framework.jurisdiction}</h4>
                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">設立期間:</span>
                        <p className="font-medium">{framework.timeline}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">費用:</span>
                        <p className="font-medium">{framework.cost}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">メリット:</span>
                      <ul className="space-y-1 mt-1">
                        {framework.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="text-sm text-gray-700">• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">トークン分類</h3>
                <div className="space-y-4">
                  {tokenClassification.map((token, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <h4 className="font-semibold text-gray-900">{token.token}</h4>
                      <p className="text-sm text-blue-600">{token.classification}</p>
                      <p className="text-sm text-gray-600">{token.characteristics}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-yellow-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">外部投資の法的構造</h3>
                <p className="text-gray-700 mb-4">{investmentStructure.mechanism}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">投資条件例:</h4>
                  <ul className="space-y-1">
                    {investmentStructure.terms.map((term, index) => (
                      <li key={index} className="text-sm text-gray-700">• {term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">KYC/AML対応</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">参加レベル</th>
                      <th className="text-left py-2">KYC要件</th>
                      <th className="text-left py-2">アクセス権限</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycAmlCompliance.map((compliance, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{compliance.level}</td>
                        <td className="py-2">{compliance.requirement}</td>
                        <td className="py-2">{compliance.access}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="growth-strategy" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              成長戦略とロードマップ
            </h2>

            <div className="card mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">120日間の導入ロードマップ</h3>
              <div className="space-y-8">
                {implementationRoadmap.map((phase, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-6 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="card bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                          <span className="text-sm text-indigo-600 font-medium">{phase.period}</span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">マイルストーン</h5>
                            <ul className="space-y-1">
                              {phase.milestones.map((milestone, mIndex) => (
                                <li key={mIndex} className="text-sm text-gray-700 flex items-start">
                                  <span className="text-green-500 mr-2">□</span>
                                  {milestone}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">具体的なタスク</h5>
                            <ul className="space-y-1">
                              {phase.tasks.map((task, tIndex) => (
                                <li key={tIndex} className="text-sm text-gray-700 flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">フェーズ別成長計画</h3>
              <div className="space-y-6">
                {growthPlan.map((plan, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{plan.period}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plan.goals.map((goal, goalIndex) => (
                        <div key={goalIndex} className="flex items-start">
                          <span className="text-indigo-500 mr-2">▶</span>
                          <span className="text-gray-700">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-blue-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">KPI設定</h3>
              <div className="space-y-4">
                {daoKPIs.map((kpi, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-2">{kpi.category}</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {kpi.metrics.map((metric, metricIndex) => (
                        <span key={metricIndex} className="px-2 py-1 bg-white text-blue-700 text-sm rounded">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="risk-analysis" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              リスク分析と対策
            </h2>

            <div className="space-y-8">
              {riskAnalysis.map((category, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">リスク</th>
                          <th className="px-4 py-2 text-left">影響度</th>
                          <th className="px-4 py-2 text-left">発生確率</th>
                          <th className="px-4 py-2 text-left">対策</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {category.risks.map((risk, riskIndex) => (
                          <tr key={riskIndex}>
                            <td className="px-4 py-2 text-gray-900">{risk.risk}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                risk.impact === '高' ? 'bg-red-100 text-red-700' :
                                risk.impact === '中' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {risk.impact}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                risk.probability === '高' ? 'bg-red-100 text-red-700' :
                                risk.probability === '中' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {risk.probability}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-700">{risk.mitigation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="participation-conditions" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              DAO参加条件
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">段階的参加システム</h3>
              <div className="space-y-6">
                {participationRequirements.map((step, index) => (
                  <div key={index} className="card bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">{step.step}</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">条件</h5>
                        <ul className="space-y-1">
                          {step.conditions.map((condition, conditionIndex) => (
                            <li key={conditionIndex} className="text-sm text-gray-700">• {condition}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">目的</h5>
                        <p className="text-sm text-gray-700">{step.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-green-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">権限レベル</h3>
              <div className="space-y-4">
                {permissionLevels.map((level, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{level.level}</h4>
                      <span className="text-sm text-green-600 font-medium">{level.requirements}</span>
                    </div>
                    <ul className="space-y-1">
                      {level.access.map((access, accessIndex) => (
                        <li key={accessIndex} className="text-sm text-gray-700">• {access}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="implementation-checklist" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              実装チェックリスト
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">技術実装</h3>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">□</span> スマートコントラクト基本設計</li>
                  <li className="flex items-center"><span className="mr-2">□</span> トークンコントラクト実装</li>
                  <li className="flex items-center"><span className="mr-2">□</span> ガバナンスモジュール実装</li>
                  <li className="flex items-center"><span className="mr-2">□</span> 収益分配モジュール実装</li>
                  <li className="flex items-center"><span className="mr-2">□</span> オラクル連携実装</li>
                  <li className="flex items-center"><span className="mr-2">□</span> フロントエンド開発</li>
                  <li className="flex items-center"><span className="mr-2">□</span> 監査実施</li>
                  <li className="flex items-center"><span className="mr-2">□</span> メインネットデプロイ</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">運営準備</h3>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">□</span> 法人設立（各管轄地）</li>
                  <li className="flex items-center"><span className="mr-2">□</span> 法的文書作成</li>
                  <li className="flex items-center"><span className="mr-2">□</span> KYCプロバイダー選定</li>
                  <li className="flex items-center"><span className="mr-2">□</span> 初期資金調達</li>
                  <li className="flex items-center"><span className="mr-2">□</span> 初期チーム組成</li>
                  <li className="flex items-center"><span className="mr-2">□</span> コミュニティプラットフォーム構築</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">マーケティング準備</h3>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">□</span> ブランディング確定</li>
                  <li className="flex items-center"><span className="mr-2">□</span> Webサイト制作</li>
                  <li className="flex items-center"><span className="mr-2">□</span> ホワイトペーパー作成</li>
                  <li className="flex items-center"><span className="mr-2">□</span> SNSアカウント開設</li>
                  <li className="flex items-center"><span className="mr-2">□</span> インフルエンサー連携</li>
                  <li className="flex items-center"><span className="mr-2">□</span> PR戦略策定</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="conclusion" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-secondary mb-8">
              結論
            </h2>
            <p className="text-large text-gray-700 mb-8 max-w-3xl mx-auto">
              Unson OS DAOは、従来の会社組織の限界を超えて、真に分散化された価値創造システムを実現します。
              透明性、公平性、自律性、持続可能性の4つの柱に基づいて設計されたこのシステムは、
              参加者全員が利益を享受できる新しい経済圏を創出します。
            </p>
            <p className="text-large text-gray-700 max-w-3xl mx-auto">
              段階的な実装アプローチにより、リスクを最小化しながら着実に成長を実現し、
              最終的には完全自律型の組織として、人類の新しい協働モデルを提示することを目指します。
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Unson OS DAOの革新的な設計に参加しよう"
        subtitle="透明性・公平性・自律性・持続可能性を重視した分散型自律組織で、新しい価値創造システムを一緒に構築しませんか？"
        actions={[
          { label: 'DAOに参加する', href: '/waitlist' },
          { label: 'トークノミクス詳細', href: '/docs/dao/tokenomics', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-indigo-600 to-purple-600"
      />

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/capabilities" className="text-blue-600 hover:text-blue-800">← DAOでできること</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/tokenomics" className="text-blue-600 hover:text-blue-800">統一トークノミクス →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}