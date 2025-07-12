import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'ユーザー思い込み調査 - Unson OS ドキュメント',
  description: 'ユーザーの無意識の思い込みを破綻させる潜在課題発見手法。諦めシグナル検索から思い込み破綻仮説設定まで。',
  openGraph: {
    title: 'ユーザー思い込み調査 - Unson OS ドキュメント',
    description: 'ユーザーの無意識の思い込みを破綻させる潜在課題発見手法。諦めシグナル検索から思い込み破綻仮説設定まで。',
  },
}

// 諦めシグナルキーワード
const resignationSignals = [
  {
    category: '基本パターン',
    keywords: [
      '○○は仕方ない',
      '○○するのが当たり前',
      '○○は諦めた',
      '○○は専門家じゃないと無理',
      '○○にはお金がかかって当然'
    ]
  },
  {
    category: '感情パターン',
    keywords: [
      '○○は我慢するしかない',
      '○○は時間がかかるもの',
      '○○は複雑で当然',
      '○○は初心者には無理'
    ]
  },
  {
    category: '英語系（AI分野例）',
    keywords: [
      '英語ができないとAI画像生成は諦めるしかない',
      'プロンプトは試行錯誤するのが当たり前',
      '商用利用の権利確認は面倒で仕方ない'
    ]
  }
]

// 調査プラットフォーム
const researchPlatforms = [
  {
    platform: 'Twitter/X調査',
    duration: '各分野45分',
    methods: [
      '「仕方ない」+分野キーワードで検索',
      '「諦めた」「無理」+分野キーワードで検索',
      '「当たり前」「普通」+分野キーワードで検索',
      'リプライ欄の「共感リプライ数」を重視'
    ],
    focus: 'いいね数よりも同意コメントの多さ'
  },
  {
    platform: 'Reddit「諦め投稿」調査',
    duration: '各分野60分',
    methods: [
      '"Is it just me or...?"（私だけ？系）',
      '"I guess I have to accept..."（諦め系）',
      '"That\'s just how it works"（当たり前系）',
      '"Probably impossible but..."（無理だけど系）'
    ],
    focus: '投稿者の過去履歴とコメント欄の「そうそう」系をカウント'
  },
  {
    platform: 'Discord「初心者あるある」調査',
    duration: '各分野45分',
    methods: [
      '#newbie / #beginner チャンネル',
      '#help / #questions チャンネル',
      '「初心者なので○○は無理ですよね？」',
      '「みんな○○で苦労してますよね？」'
    ],
    focus: '初心者の思い込みと諦め度合いの測定'
  }
]

// 思い込み構造解析
const assumptionStructure = [
  {
    level: '表面的思い込み',
    description: '○○は△△で当然',
    example: 'AI画像生成は英語必須',
    analysis: 'ユーザーが意識的に持っている認識'
  },
  {
    level: '根拠・理由',
    description: 'なぜなら□□だから',
    example: 'プロンプトが英語、海外ツールだから',
    analysis: '思い込みを支える論理的根拠'
  },
  {
    level: '代替案への阻害',
    description: '××は現実的じゃない',
    example: '日本語翻訳は精度が悪い',
    analysis: '新しい解決策への抵抗理由'
  },
  {
    level: '感情的要素',
    description: '恥ずかしい・面倒・不安',
    example: '英語苦手で恥ずかしい、毎回翻訳は面倒',
    analysis: '合理性を超えた心理的ブロック'
  }
]

// 思い込み破綻ポイント
const breakdownPoints = [
  {
    category: '技術的破綻',
    checklist: [
      'AIで自動化できる部分はないか？',
      'APIで簡単にできる作業はないか？',
      'UI/UXで複雑さを隠せないか？'
    ],
    example: '日本語→英語プロンプト変換の自動化'
  },
  {
    category: '心理的破綻',
    checklist: [
      '「専門性」への過度な敬意はないか？',
      '「初期投資」への思い込みはないか？',
      '「時間」への諦めはないか？'
    ],
    example: '「英語=高品質」という固定観念の破綻'
  },
  {
    category: '業界的破綻',
    checklist: [
      '他業界では既に解決されていないか？',
      '技術進歩で前提が変わっていないか？',
      '規制や慣習が実は不要ではないか？'
    ],
    example: '翻訳精度の飛躍的向上による前提変化'
  }
]

// ペルソナ設定例
const detailedPersona = {
  basic: {
    name: '田中 美咲（28歳）',
    job: 'フリーランスWebデザイナー',
    location: '東京都世田谷区（1人暮らし）',
    income: '月30-50万円（案件により変動）'
  },
  skills: [
    { skill: 'Photoshop', level: '上級（5年）' },
    { skill: 'Illustrator', level: '中級（3年）' },
    { skill: 'Figma', level: '中級（2年）' },
    { skill: 'コーディング', level: '初級（HTML/CSSのみ）' },
    { skill: '英語', level: '中学レベル（TOEIC 400点）' }
  ],
  dailySchedule: [
    '9:00 起床、SNSチェック',
    '10:00 クライアント作業開始',
    '12:00 昼食＋Youtube視聴',
    '15:00 素材探し・参考サイト調査',
    '17:00 クライアント連絡・見積作成',
    '20:00 スキルアップ学習（Youtube/Udemy）'
  ],
  painPoints: {
    surface: [
      '素材探しに1日2時間かかる',
      'クライアントの修正要求が多い',
      '単価が上がらない'
    ],
    deep: [
      'オリジナル画像は写真撮影かイラスト外注が当然',
      'AIツールは英語ができる人のもの',
      '新しいツールは覚えるのに時間がかかって当然'
    ]
  }
}

// 思い込み評価軸
const evaluationCriteria = [
  {
    criteria: '思い込み強度',
    weight: '30%',
    evaluation: [
      { score: 5, description: '誰もが当然と思っている' },
      { score: 4, description: '多くの人が諦めている' },
      { score: 3, description: '一部の人が不満に思っている' },
      { score: 2, description: '解決策を探している人がいる' },
      { score: 1, description: '既に代替案を知っている人がいる' }
    ]
  },
  {
    criteria: '破綻インパクト',
    weight: '25%',
    evaluation: [
      { score: 5, description: '業界の常識が根本的に変わる' },
      { score: 4, description: 'ユーザー行動が大きく変わる' },
      { score: 3, description: '作業効率が大幅改善' },
      { score: 2, description: '一部の不便が解消' },
      { score: 1, description: '微細な改善' }
    ]
  },
  {
    criteria: '実現性',
    weight: '25%',
    evaluation: [
      { score: 5, description: '既存技術で即実現可能' },
      { score: 4, description: '軽微な技術開発で実現' },
      { score: 3, description: '標準的な開発期間で実現' },
      { score: 2, description: '高度な技術開発が必要' },
      { score: 1, description: '現在の技術では困難' }
    ]
  },
  {
    criteria: '収益性',
    weight: '20%',
    evaluation: [
      { score: 5, description: '高単価で継続率も高い' },
      { score: 4, description: '適正単価で継続率が高い' },
      { score: 3, description: '低単価だが継続率が高い' },
      { score: 2, description: '単発利用が中心' },
      { score: 1, description: '無料でないと利用されない' }
    ]
  }
]

// 5ステップ調査プロセス
const fiveStepProcess = [
  {
    step: 1,
    title: '思い込み・諦め発見調査',
    duration: '1-2日目',
    description: '「諦めシグナル」の検索戦略で無意識の思い込みを発見',
    activities: [
      'Twitter/X「仕方ない」検索',
      'Reddit諦め投稿調査',
      'Discord初心者あるある調査',
      '共感度・諦めレベル測定'
    ],
    output: '思い込み発見シート',
    deliverable: '分野ごとの思い込み一覧と共感度データ'
  },
  {
    step: 2,
    title: '思い込み根拠分析・破綻ポイント探索',
    duration: '3日目',
    description: '思い込みの構造解析と破綻可能性の特定',
    activities: [
      '思い込みの4層構造分析',
      '技術的・心理的・業界的破綻ポイント探索',
      '他業界の解決事例調査',
      '新常識案の策定'
    ],
    output: '思い込み分析シート',
    deliverable: '各思い込みの根拠と破綻ポイント'
  },
  {
    step: 3,
    title: '詳細ペルソナ設定とヒアリング',
    duration: '4-5日目',
    description: '思い込み特化ヒアリングで深層心理を解明',
    activities: [
      'Primary/Secondary ペルソナ設定',
      '思い込み特化ヒアリング（1人20-25分）',
      '間接質問・仮定質問の活用',
      '理想状態と支払意向確認'
    ],
    output: 'ペルソナ&思い込みマップ',
    deliverable: '詳細ペルソナと思い込みの根深さデータ'
  },
  {
    step: 4,
    title: '思い込み破綻価値評価・絞り込み',
    duration: '6日目',
    description: '4軸評価による思い込み破綻価値のランキング',
    activities: [
      '思い込み強度×破綻インパクト×実現性×収益性',
      '重み付き評価（30%+25%+25%+20%）',
      '上位課題の選定',
      'ポートフォリオバランス考慮'
    ],
    output: '破綻価値ランキング',
    deliverable: '最優先思い込み破綻ターゲット'
  },
  {
    step: 5,
    title: '思い込み破綻型仮説設定',
    duration: '7日目',
    description: '検証可能な破綻仮説の策定と測定指標設定',
    activities: [
      '破綻仮説テンプレート作成',
      '新価値提案の言語化',
      '検証方法とKPI設定',
      'LP驚き率・トライアル率の目標値設定'
    ],
    output: '破綻仮説シート',
    deliverable: '検証可能な思い込み破綻仮説'
  }
]

export default function UserAssumptionResearchPage() {
  const readingTime = '約16分'
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-red-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              ユーザー思い込み調査
              <span className="block text-red-600 mt-2">
                無意識の思い込みを破綻させる革新的手法
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              市場調査で選定した3分野で「ユーザーの思い込みを壊す潜在課題」を10-15個発見。
              表面的な不満ではなく、諦めの奥にある真の機会を掘り起こします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/strategy/micro-business" variant="default" size="lg">
                マイクロビジネス戦略
              </NavigationLink>
              <NavigationLink href="/docs/strategy/mvp-validation" variant="outline" size="lg">
                MVP検証フレームワーク
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 基本方針の転換 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              基本方針の転換
            </h2>
            <p className="text-large text-gray-600 mb-8">
              従来の顕在化した不満から、無意識の思い込みへアプローチを転換
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">❌</span>
                従来アプローチ（避けるべき）
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-600">「○○が使いにくい」「○○が高い」など<strong>顕在化した不満</strong>を探す</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-600">既存の競合が対応済みの課題に注目する</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-600">ユーザーの現在の行動パターンに合わせたソリューションを考える</span>
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">✅</span>
                新アプローチ（推奨）
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-600">「仕方ない」「こういうものだ」とユーザーが<strong>諦めている常識</strong>を発見</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-600"><strong>無意識の思い込み</strong>の背後にある本質的な課題を特定</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-600">思い込みを壊した先にある<strong>新しい価値</strong>を設計</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 諦めシグナル検索戦略 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              「諦めシグナル」の検索戦略
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              ユーザーが無意識に発する諦めのシグナルを体系的に捕捉
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {resignationSignals.map((category, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.keywords.map((keyword, keywordIndex) => (
                    <li key={keywordIndex} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      「{keyword}」
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔍 具体的検索手順
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">基本検索パターン</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. <strong>「仕方ない」+分野キーワード</strong>で検索</li>
                  <li>2. <strong>「諦めた」「無理」+分野キーワード</strong>で検索</li>
                  <li>3. <strong>「当たり前」「普通」+分野キーワード</strong>で検索</li>
                  <li>4. <strong>リプライ欄を重点チェック</strong>：「そういうものだよね」的な同意コメント</li>
                  <li>5. <strong>いいね数よりも「共感リプライ数」</strong>を重視</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">記録項目（ツイートごと）</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>思い込み内容</strong>：「○○は△△で当然だ」の形で要約</li>
                  <li>• <strong>諦めレベル</strong>：高（完全諦め）/中（半分諦め）/低（不満あり）</li>
                  <li>• <strong>共感度</strong>：同じ思い込みを持つ人の多さ（リプライ分析）</li>
                  <li>• <strong>思い込みの根拠</strong>：なぜそう思っているかの背景</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 調査プラットフォーム */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              プラットフォーム別調査手法
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              各プラットフォームの特性を活かした思い込み発見手法
            </p>
          </div>
          
          <div className="space-y-8">
            {researchPlatforms.map((platform, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {platform.platform}
                  </h3>
                  <span className="text-sm text-red-600 font-medium">
                    {platform.duration}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">調査手法</h4>
                    <ul className="space-y-2">
                      {platform.methods.map((method, methodIndex) => (
                        <li key={methodIndex} className="text-sm text-gray-600">
                          • {method}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">重点ポイント</h4>
                    <p className="text-sm text-orange-700">{platform.focus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 思い込み構造解析 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              思い込みの構造解析
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              思い込みを4層に分解して本質的な課題を特定
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {assumptionStructure.map((level, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    {index < assumptionStructure.length - 1 && (
                      <div className="w-0.5 h-16 bg-red-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {level.level}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">構造</h4>
                          <p className="text-gray-600 mb-2">{level.description}</p>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-1">例</h5>
                            <p className="text-sm text-blue-700">「{level.example}」</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">分析観点</h4>
                          <p className="text-gray-600">{level.analysis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 思い込み破綻ポイント */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              思い込み破綻ポイント探索
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              3つの観点から思い込みの脆弱性を発見
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {breakdownPoints.map((point, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {point.category}
                </h3>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">チェックリスト</h4>
                  <ul className="space-y-2">
                    {point.checklist.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">□</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">破綻例</h4>
                  <p className="text-sm text-green-700">{point.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 詳細ペルソナ設定 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              詳細ペルソナ設定
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              思い込みの深層心理を理解するための詳細ペルソナ設計
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Primary Persona（詳細版）
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">基本情報</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>名前：</strong>{detailedPersona.basic.name}</p>
                    <p><strong>職業：</strong>{detailedPersona.basic.job}</p>
                    <p><strong>居住：</strong>{detailedPersona.basic.location}</p>
                    <p><strong>収入：</strong>{detailedPersona.basic.income}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">技術レベル</h4>
                  <div className="space-y-2">
                    {detailedPersona.skills.map((skill, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{skill.skill}</span>
                        <span className="text-gray-600">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">1日の行動パターン</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {detailedPersona.dailySchedule.map((schedule, index) => (
                      <li key={index}>• {schedule}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">痛みポイント</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">表面的痛み</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {detailedPersona.painPoints.surface.map((pain, index) => (
                          <li key={index}>• {pain}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">深層的思い込み</h5>
                      <ul className="space-y-1 text-sm text-red-600">
                        {detailedPersona.painPoints.deep.map((assumption, index) => (
                          <li key={index}>• {assumption}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 思い込み評価軸 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              思い込み破綻価値評価
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              4軸評価による思い込み破綻価値のランキング
            </p>
          </div>
          
          <div className="space-y-8">
            {evaluationCriteria.map((criteria, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {criteria.criteria}
                  </h3>
                  <span className="text-lg font-bold text-red-600">
                    {criteria.weight}
                  </span>
                </div>
                <div className="space-y-3">
                  {criteria.evaluation.map((level, levelIndex) => (
                    <div key={levelIndex} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                        {level.score}
                      </div>
                      <span className="text-gray-700">{level.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              総合スコア計算式
            </h3>
            <div className="text-center">
              <div className="text-lg font-mono text-red-700 mb-2">
                破綻価値 = (強度×0.3) + (インパクト×0.25) + (実現性×0.25) + (収益性×0.2)
              </div>
              <p className="text-sm text-gray-600">
                高いスコアほど「破綻させる価値の高い思い込み」を示します
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5ステップ調査プロセス */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              5ステップ調査プロセス
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              思い込み発見から破綻仮説設定まで、体系化された7日間プロセス
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {fiveStepProcess.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < fiveStepProcess.length - 1 && (
                      <div className="w-0.5 h-16 bg-red-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-red-600 font-medium">
                            {step.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {step.output}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">主要活動</h4>
                          <ul className="space-y-1">
                            {step.activities.map((activity, activityIndex) => (
                              <li key={activityIndex} className="text-sm text-gray-600">
                                • {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <h4 className="font-medium text-red-900 mb-1">成果物</h4>
                          <p className="text-sm text-red-700">{step.deliverable}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              合計実行時間：約15.5時間（1週間で完了）
            </h3>
            <p className="text-center text-gray-600">
              表面的な不満ではなく「ユーザーの無意識の思い込みを破綻させる」真の課題を発見し、
              差別化された価値提案に繋げることができます
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="ユーザー思い込み調査を実践しよう"
        subtitle="無意識の思い込みを破綻させて、革新的な価値提案を発見しませんか？"
        actions={[
          { label: 'マイクロビジネス戦略', href: '/docs/strategy/micro-business' },
          { label: 'MVP検証フレームワーク', href: '/docs/strategy/mvp-validation', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-red-600 to-orange-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/strategy/micro-business" className="text-blue-600 hover:text-blue-800">マイクロビジネス戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/mvp-validation" className="text-blue-600 hover:text-blue-800">MVP検証フレームワーク</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/saas-design" className="text-blue-600 hover:text-blue-800">SaaS設計プロセス</a>
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