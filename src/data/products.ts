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
    id: 1,
    name: 'TaskFlow Pro',
    category: '生産性',
    description: 'チーム向けタスク管理とワークフロー自動化プラットフォーム',
    longDescription: 'TaskFlow Proは、現代のチームが直面する複雑なタスク管理の課題を解決するために設計された革新的なプラットフォームです。AI駆動の自動タスク分配、直感的なワークフロー可視化、そして包括的なレポート自動生成機能により、チームの生産性を劇的に向上させます。',
    price: '¥2,980/月',
    users: '1,250+',
    rating: 4.8,
    status: 'active',
    features: ['自動タスク分配', 'ワークフロー可視化', 'レポート自動生成'],
    detailedFeatures: [
      {
        title: 'AI駆動タスク分配',
        description: 'チームメンバーのスキルと稼働状況を分析し、最適なタスク配分を自動実行',
        icon: '🤖'
      },
      {
        title: 'リアルタイム可視化',
        description: '直感的なダッシュボードでプロジェクトの進捗をリアルタイムに把握',
        icon: '📊'
      },
      {
        title: '自動レポート生成',
        description: 'カスタマイズ可能なレポートを自動生成し、ステークホルダーと共有',
        icon: '📋'
      }
    ],
    plans: [
      {
        name: 'スタータープラン',
        price: '¥1,980/月',
        features: ['5ユーザーまで', '基本タスク管理', 'メールサポート']
      },
      {
        name: 'プロプラン',
        price: '¥2,980/月',
        features: ['20ユーザーまで', 'AI自動分配', 'ワークフロー可視化', 'チャットサポート'],
        popular: true
      },
      {
        name: 'エンタープライズ',
        price: '¥4,980/月',
        features: ['無制限ユーザー', '全機能利用可能', '専任サポート', 'カスタム統合']
      }
    ],
    techSpecs: {
      api: 'REST API v2.0',
      integrations: ['Slack', 'Microsoft Teams', 'Google Workspace', 'Zapier'],
      security: 'SOC2 Type II準拠、ISO27001認証',
      uptime: '99.9%稼働率保証'
    },
    reviews: [
      {
        user: '田中様（プロジェクトマネージャー）',
        rating: 5,
        comment: 'チームの生産性が30%向上しました。直感的なUIで誰でも簡単に使えます。',
        date: '2024年6月'
      },
      {
        user: '佐藤様（スタートアップCEO）',
        rating: 5,
        comment: '小規模チームでも企業レベルのタスク管理ができるようになりました。',
        date: '2024年5月'
      }
    ]
  },
  {
    id: 2,
    name: 'DataSync Hub',
    category: 'データ管理',
    description: '複数システム間のリアルタイムデータ同期ソリューション',
    longDescription: 'DataSync Hubは、企業の複雑なデータエコシステムを統一するクラウドネイティブなデータ同期プラットフォームです。異なるシステム間でのリアルタイムデータ同期、包括的なAPI統合、そして高度なデータ変換機能を提供します。',
    price: '¥4,500/月',
    users: '890+',
    rating: 4.9,
    status: 'active',
    features: ['リアルタイム同期', 'API統合', 'データ変換'],
    detailedFeatures: [
      {
        title: 'リアルタイム同期',
        description: 'ミリ秒レベルでの高速データ同期を実現',
        icon: '⚡'
      },
      {
        title: '包括的API統合',
        description: '1000+のサービスとの事前構築済み連携',
        icon: '🔗'
      },
      {
        title: 'インテリジェントデータ変換',
        description: 'ノーコードでデータフォーマットを自動変換',
        icon: '🔄'
      }
    ],
    plans: [
      {
        name: 'ベーシック',
        price: '¥2,500/月',
        features: ['5システム連携', '基本同期機能', 'メールサポート']
      },
      {
        name: 'プロフェッショナル',
        price: '¥4,500/月',
        features: ['20システム連携', 'リアルタイム同期', 'データ変換', 'API統合'],
        popular: true
      },
      {
        name: 'エンタープライズ',
        price: '¥8,900/月',
        features: ['無制限連携', '専用インフラ', 'カスタム開発', '24/7サポート']
      }
    ],
    techSpecs: {
      api: 'GraphQL & REST API',
      integrations: ['Salesforce', 'HubSpot', 'Shopify', 'PostgreSQL', 'MongoDB'],
      security: 'エンドツーエンド暗号化、GDPR準拠',
      uptime: '99.95%稼働率保証'
    },
    reviews: [
      {
        user: '山田様（ITマネージャー）',
        rating: 5,
        comment: 'データ同期の複雑性が大幅に軽減されました。セットアップも簡単です。',
        date: '2024年6月'
      }
    ]
  },
  {
    id: 3,
    name: 'CustomerInsight AI',
    category: 'マーケティング',
    description: 'AI駆動の顧客行動分析とパーソナライゼーション',
    price: '¥3,200/月',
    users: '2,100+',
    rating: 4.7,
    status: 'active',
    features: ['行動予測', 'セグメント自動化', 'A/Bテスト']
  },
  {
    id: 4,
    name: 'SecureVault API',
    category: 'セキュリティ',
    description: 'エンタープライズ向け暗号化ストレージとアクセス管理',
    price: '¥5,800/月',
    users: '450+',
    rating: 4.9,
    status: 'active',
    features: ['エンドツーエンド暗号化', 'アクセス制御', '監査ログ']
  },
  {
    id: 5,
    name: 'ContentCraft Studio',
    category: 'コンテンツ',
    description: 'AI支援によるコンテンツ制作とマルチチャネル配信',
    price: '¥2,200/月',
    users: '3,400+',
    rating: 4.6,
    status: 'beta',
    features: ['AI文章生成', 'マルチ配信', 'SEO最適化']
  },
  {
    id: 6,
    name: 'EcoTracker',
    category: '環境',
    description: '企業向けカーボンフットプリント追跡と削減提案',
    price: '¥1,900/月',
    users: '720+',
    rating: 4.5,
    status: 'coming-soon',
    features: ['排出量計算', '削減提案', 'ESGレポート']
  }
]

export const categories = ['全て', '生産性', 'データ管理', 'マーケティング', 'セキュリティ', 'コンテンツ', '環境']

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