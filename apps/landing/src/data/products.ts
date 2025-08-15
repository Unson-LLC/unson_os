export interface Product {
  id: number
  name: string
  category: string
  description: string
  longDescription?: string
  price: string
  users: string
  rating: number
  status: 'active' | 'beta' | 'coming-soon'
  features: string[]
  detailedFeatures?: DetailedFeature[]
  plans?: Plan[]
  techSpecs?: TechSpecs
  reviews?: Review[]
  serviceUrl?: string
  lpUrl?: string
  advertisingLPs?: AdLP[]
  isReal?: boolean
  launchDate?: string
}

export interface AdLP {
  url: string
  title: string
  channel: string
  conversionRate?: string
}

export interface DetailedFeature {
  title: string
  description: string
  icon: string
}

export interface Plan {
  name: string
  price: string
  features: string[]
  popular?: boolean
}

export interface TechSpecs {
  api: string
  integrations: string[]
  security: string
  uptime: string
}

export interface Review {
  user: string
  rating: number
  comment: string
  date: string
}

export const products: Product[] = [
  {
    id: 0,
    name: 'MyWa（マイワ）',
    category: 'AI・ニュース',
    description: 'AI・ロボット分野に特化したパーソナライズドAIニュース配信サービス',
    longDescription: 'MyWaは、AI・ロボット技術の実用的な情報だけを厳選して配信するニュースサービスです。1記事1分で読める要約形式、Why-Chip（推薦理由）の表示、AIによるパーソナライズ学習など、忙しいビジネスパーソンが効率的に情報収集できる仕組みを提供しています。',
    price: '月額 ¥980',
    users: '開発中',
    rating: 5.0,
    status: 'beta',
    features: ['1分で読める要約ニュース', 'Why-Chip（推薦理由表示）', 'AIパーソナライズ学習'],
    detailedFeatures: [
      {
        title: '1分で読める実用記事',
        description: '要点＋背景・要素形式でまとめられた、実用的な情報だけを厳選配信',
        icon: '⚡'
      },
      {
        title: 'Why-Chip機能',
        description: 'なぜこの記事があなたに推薦されたのか、理由を毎記事に表示',
        icon: '💡'
      },
      {
        title: 'AIパーソナライズ',
        description: '初期診断と記事ごとの👍👎フィードバックで、あなた好みに即座に最適化',
        icon: '🤖'
      },
      {
        title: '意味がある日だけ配信',
        description: '本当に重要な情報がある時だけ通知。情報疲れを防ぐ効率重視の設計',
        icon: '🎯'
      }
    ],
    plans: [
      {
        name: 'フリープラン',
        price: '¥0/月',
        features: ['週3記事まで', '基本的なパーソナライズ', 'ブラウザ通知']
      },
      {
        name: 'プレミアムプラン',
        price: '¥980/月',
        features: ['無制限記事閲覧', '高度なAIパーソナライズ', '全配信チャネル対応', 'お気に入り機能', '記事解析レポート'],
        popular: true
      },
      {
        name: 'チームプラン',
        price: '¥2,980/月',
        features: ['5ユーザーまで', 'チーム共有機能', '業界別カスタマイズ', '専用サポート']
      }
    ],
    techSpecs: {
      api: '開発中',
      integrations: ['スマホアプリ', 'PWA', 'メールニュースレター（予定）'],
      security: 'SSL/TLS暗号化通信',
      uptime: '開発中'
    },
    serviceUrl: 'https://mywa.unson.jp/',
    lpUrl: 'https://mywa.unson.jp/',
    isReal: true,
    launchDate: '2024年12月（ベータ版）'
  },
  {
    id: 1,
    name: 'わたしコンパス',
    category: 'ライフスタイル',
    description: '価値観ベースの人生選択支援AIアシスタント',
    longDescription: 'わたしコンパス（Authentic Life AI）は、価値観という羅針盤で、あらゆる人生の選択において迷わない・後悔しない道筋を示すAIアシスタントです。情報過多による判断麻痺、他人軸での生き方、「べき論」の呪縛から解放し、本当に自分らしい人生を歩むサポートをします。',
    price: '月額 ¥1,680',
    users: 'ベータテスト中',
    rating: 4.9,
    status: 'coming-soon',
    features: ['価値観診断（120問）', 'リアルタイムAI相談', '価値観ベース支出分档分析'],
    detailedFeatures: [
      {
        title: '独自価値観診断',
        description: '5つの価値観軸（本物性・つながり・成長・安定・影響力）であなたを分析',
        icon: '🧭'
      },
      {
        title: 'リアルタイム相談',
        description: '職場、恋愛、買い物など、日常の選択を価値観ベースで即座にサポート',
        icon: '💬'
      },
      {
        title: '画像分析機能',
        description: '2つの選択肢を写真で比較。AIが価値観に基づいて最適な選択を提案',
        icon: '📷'
      },
      {
        title: '価値観マッチング',
        description: '支出を価値観で分析し、無駄遣いを減らして本当に大切なことに投資',
        icon: '💰'
      },
      {
        title: '成長レポート',
        description: '月次で価値観の変化を可視化。より自分らしい人生への成長をサポート',
        icon: '📈'
      }
    ],
    plans: [
      {
        name: 'Basic（無料版）',
        price: '¥0/月',
        features: ['基本的な価値観診断', '1日3回の選択アドバイス', '週次価値観レポート']
      },
      {
        name: 'プレミアム',
        price: '¥1,680/月',
        features: ['無制限の選択相談', 'リアルタイム価値観分析', '月次詳細レポート', '価値観マッチング機能'],
        popular: true
      },
      {
        name: 'プレミアムプラス',
        price: '¥2,980/月',
        features: ['専属コーチとの月2回面談', '年間ライフプラン設計', '限定コミュニティ', 'カスタムAIモデル']
      }
    ],
    techSpecs: {
      api: 'OpenAI GPT-4 + 独自価値観分析モデル',
      integrations: ['iOS', 'Android', 'PWA'],
      security: 'エンドツーエンド暗号化',
      uptime: '開発中'
    },
    reviews: [
      {
        user: '佐々木様（26歳・マーケティング）',
        rating: 5,
        comment: '転職で悩んでいた時、価値観診断で自分が「成長」を最重視していることに気づきました。迷いが晴れました！',
        date: '2024年7月'
      },
      {
        user: '田中様（24歳・エンジニア）',
        rating: 5,
        comment: '人間関係で悩んでいたけど、「本物性」と「つながり」のバランスが大事だと分かり、無理に合わせる必要がないと気づきました。',
        date: '2024年6月'
      }
    ],
    lpUrl: 'https://authentic-life-ai.vercel.app/',
    isReal: false,
    launchDate: '2025年予定（現在LP検証中）'
  }
]

export const categories = ['全て', 'AI・ニュース', 'ライフスタイル']

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  if (category === '全て') {
    return products
  }
  return products.filter(product => product.category === category)
}

export const getRelatedProducts = (currentProduct: Product, limit: number = 3): Product[] => {
  return products
    .filter(product => product.id !== currentProduct.id && product.category === currentProduct.category)
    .slice(0, limit)
}