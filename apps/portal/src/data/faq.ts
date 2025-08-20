export interface FAQ {
  question: string
  answer: string
}

export interface FAQCategory {
  title: string
  icon: string
  faqs: FAQ[]
}

export const faqCategories: FAQCategory[] = [
  {
    title: 'アカウント・料金',
    icon: '💳',
    faqs: [
      {
        question: '無料トライアルはありますか？',
        answer: 'はい、全てのプロダクトで14日間の無料トライアルを提供しています。クレジットカードの登録は不要です。'
      },
      {
        question: '料金プランの変更はいつでもできますか？',
        answer: 'はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。'
      },
      {
        question: 'UNSONトークンとは何ですか？',
        answer: 'UNSONトークンは、DAOガバナンスと収益分配に使用されるプラットフォーム独自のトークンです。貢献に応じてトークンを獲得できます。'
      }
    ]
  },
  {
    title: 'プロダクト利用',
    icon: '🚀',
    faqs: [
      {
        question: 'プロダクトの統合にどのくらい時間がかかりますか？',
        answer: 'ほとんどのプロダクトは30分以内でセットアップが完了します。複雑な統合でも最大2時間程度です。'
      },
      {
        question: 'カスタムプロダクトの開発は可能ですか？',
        answer: 'はい、DAOコミュニティでアイデアが承認されれば、2週間サイクルでカスタムプロダクトの開発が可能です。'
      },
      {
        question: 'データのエクスポートはできますか？',
        answer: 'はい、全てのプロダクトでデータの完全エクスポート機能を提供しています。CSV、JSON、API経由での取得が可能です。'
      }
    ]
  },
  {
    title: '技術的問題',
    icon: '🔧',
    faqs: [
      {
        question: 'APIの制限はありますか？',
        answer: 'プランに応じて異なりますが、スタータープランでも月間100万リクエストまで利用可能です。'
      },
      {
        question: 'システムの稼働率はどの程度ですか？',
        answer: '99.9%以上の稼働率を保証しており、メンテナンス時間も事前に通知いたします。'
      },
      {
        question: 'セキュリティ対策について教えてください',
        answer: 'SOC2 Type II準拠、ISO27001認証取得済み。全データは暗号化され、定期的なセキュリティ監査を実施しています。'
      }
    ]
  },
  {
    title: 'DAO・トークン',
    icon: '🏛️',
    faqs: [
      {
        question: 'DAOに参加するにはどうすればよいですか？',
        answer: 'Discordコミュニティに参加し、貢献を開始することでUNSONトークンを獲得できます。トークン保有により投票権を得られます。'
      },
      {
        question: '収益分配はどのように行われますか？',
        answer: '毎月の収益の40%がDAOメンバーに分配されます。分配額は貢献度に応じて決定されます。'
      },
      {
        question: 'トークンの購入方法を教えてください',
        answer: '現在、トークンは直接購入できません。貢献活動によってのみ獲得可能です。将来的には取引所での取引も検討しています。'
      }
    ]
  }
]

export const getAllFAQs = (): FAQ[] => {
  return faqCategories.reduce((allFAQs: FAQ[], category) => {
    return allFAQs.concat(category.faqs)
  }, [])
}

export const searchFAQs = (query: string): FAQ[] => {
  const allFAQs = getAllFAQs()
  const searchTerm = query.toLowerCase()
  
  return allFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm) ||
    faq.answer.toLowerCase().includes(searchTerm)
  )
}