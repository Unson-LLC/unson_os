export interface TeamMember {
  name: string
  role: string
  bio: string
  expertise: string[]
  image?: string
}

export interface Value {
  title: string
  description: string
  icon: string
}

export interface Milestone {
  date: string
  title: string
  description: string
}

export interface Statistic {
  label: string
  value: string
}

export interface JobPosition {
  title: string
  type: string
  experience: string
  skills: string[]
  description: string
  salary: string
}

export interface Benefit {
  title: string
  description: string
  icon: string
}

export interface ContactMethod {
  title: string
  description: string
  icon: string
  value: string
  link: string
}

export interface Office {
  name: string
  address: string
  map?: string
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Hiroshi Tanaka',
    role: 'Founder & CEO',
    bio: 'AI研究者として10年以上の経験。自動化システムとマイクロサービスアーキテクチャの専門家。',
    expertise: ['AI/ML', 'システム設計', '起業'],
    image: '/team/hiroshi.jpg'
  },
  {
    name: 'Emily Chen',
    role: 'CTO',
    bio: 'Google出身のソフトウェアエンジニア。大規模分散システムの設計・構築に豊富な経験。',
    expertise: ['分散システム', 'クラウド', 'DevOps'],
    image: '/team/emily.jpg'
  },
  {
    name: 'Yuki Yamamoto',
    role: 'Head of Product',
    bio: 'スタートアップから大企業まで、プロダクト開発を主導。UXデザインとプロダクト戦略の専門家。',
    expertise: ['プロダクト戦略', 'UX設計', 'アジャイル'],
    image: '/team/yuki.jpg'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of DAO',
    bio: 'Web3とブロックチェーン技術の専門家。分散型組織の設計と運営において豊富な経験。',
    expertise: ['ブロックチェーン', 'DAO設計', 'トークノミクス'],
    image: '/team/marcus.jpg'
  }
]

export const companyValues: Value[] = [
  {
    title: '自動化による解放',
    description: '人間は創造的な仕事に集中し、反復的なタスクは自動化によって解決する',
    icon: '🤖'
  },
  {
    title: 'コミュニティ主導',
    description: 'DAOによる分散型意思決定で、より民主的で透明性のある組織を実現',
    icon: '🌐'
  },
  {
    title: '公正な価値分配',
    description: '貢献に応じた公正な収益分配で、全ての参加者が恩恵を受ける',
    icon: '⚖️'
  },
  {
    title: '持続可能な成長',
    description: '短期的な利益よりも長期的で持続可能な成長を重視',
    icon: '🌱'
  }
]

export const milestones: Milestone[] = [
  {
    date: '2024年1月',
    title: 'Unson OS構想開始',
    description: 'AIによるSaaS自動生成の可能性を探求開始'
  },
  {
    date: '2024年3月',
    title: 'プロトタイプ完成',
    description: '最初の自動生成SaaSプロトタイプが24時間で完成'
  },
  {
    date: '2024年5月',
    title: 'DAO設立',
    description: 'コミュニティ主導の分散型組織として正式にスタート'
  },
  {
    date: '2024年7月',
    title: 'βプラットフォーム公開',
    description: '限定メンバー向けにプラットフォームのβ版を公開'
  },
  {
    date: '2024年Q4',
    title: '正式ローンチ',
    description: '一般公開とエコシステムの本格運用開始（予定）'
  }
]

export const statistics: Statistic[] = [
  { label: '創設年', value: '2024' },
  { label: 'チームメンバー', value: '25+' },
  { label: '対応言語', value: '12' },
  { label: '本社所在地', value: '東京' }
]

export const jobPositions: JobPosition[] = [
  {
    title: 'AIエンジニア',
    type: '正社員',
    experience: '3年以上',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'LangChain'],
    description: 'SaaS自動生成のためのAIシステム設計・開発を担当',
    salary: '800万円 - 1,200万円'
  },
  {
    title: 'フルスタックデベロッパー',
    type: '正社員',
    experience: '2年以上',
    skills: ['TypeScript', 'React', 'Node.js', 'Next.js'],
    description: 'フロントエンドからバックエンドまで一貫した開発',
    salary: '600万円 - 1,000万円'
  },
  {
    title: 'プロダクトマネージャー',
    type: '正社員',
    experience: '3年以上',
    skills: ['プロダクト戦略', 'アジャイル', 'データ分析'],
    description: 'プロダクトの企画・戦略立案・開発推進',
    salary: '700万円 - 1,100万円'
  },
  {
    title: 'UIUXデザイナー',
    type: '正社員',
    experience: '2年以上',
    skills: ['Figma', 'Adobe Creative Suite', 'プロトタイピング'],
    description: 'ユーザー体験の設計とビジュアルデザイン',
    salary: '500万円 - 900万円'
  }
]

export const benefits: Benefit[] = [
  {
    title: 'リモートワーク',
    description: '完全リモートワーク可能。世界中どこからでも働けます',
    icon: '🏠'
  },
  {
    title: 'フレックス制',
    description: '自由な時間で最高のパフォーマンスを発揮',
    icon: '⏰'
  },
  {
    title: '学習支援',
    description: '書籍・研修費用の全額補助',
    icon: '📚'
  },
  {
    title: 'DAOトークン',
    description: 'UNSONトークンによる収益分配',
    icon: '💰'
  },
  {
    title: '健康サポート',
    description: '健康診断・ジム利用料補助',
    icon: '💪'
  },
  {
    title: 'チーム合宿',
    description: '年2回のチームビルディング合宿',
    icon: '🌴'
  }
]

export const contactMethods: ContactMethod[] = [
  {
    title: 'メールでのお問い合わせ',
    description: '24時間受付・営業日以内に返信',
    icon: '📧',
    value: 'support@unson.com',
    link: 'mailto:support@unson.com'
  },
  {
    title: '直接お電話でのお問い合わせ',
    description: '平日 9:00-18:00 (JST)',
    icon: '📞',
    value: '+81-3-1234-5678',
    link: 'tel:+81-3-1234-5678'
  },
  {
    title: 'チャットサポート',
    description: 'リアルタイムサポート',
    icon: '💬',
    value: 'チャットを開始',
    link: '#chat'
  }
]

export const offices: Office[] = [
  {
    name: '本社（東京）',
    address: '〒150-0002\n東京都渋谷区渋谷2-12-4\nネクサス青山ビル 5F',
    map: '#'
  },
  {
    name: 'グローバルオフィス',
    address: 'Remote-first organization\nWorldwide distributed team',
    map: '#'
  }
]