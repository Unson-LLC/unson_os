export interface CopywritingTip {
  id: string;
  category: string;
  title: string;
  description: string;
  examples?: string[];
  tags: string[];
}

export const copywritingTips: CopywritingTip[] = [
  // 基本原則
  {
    id: "sensory-appeal",
    category: "基本原則",
    title: "五感に訴えよう",
    description: "視覚、聴覚、触覚、味覚、嗅覚を刺激する言葉を使って、読者の体験を豊かにする",
    examples: ["サクサク動作", "滑らかな操作感", "クリアな音質"],
    tags: ["感覚", "体験", "表現"]
  },
  {
    id: "target-focus", 
    category: "基本原則",
    title: "ターゲットを絞るのは近道",
    description: "明確なターゲット設定により、響くメッセージを作る",
    examples: ["30代共働き夫婦向け", "IT業界3年目エンジニア専用"],
    tags: ["ターゲティング", "セグメント", "ペルソナ"]
  },
  {
    id: "benefit-over-feature",
    category: "基本原則", 
    title: "機能ではなくベネフィットを",
    description: "「何ができるか」ではなく「どんな価値を得られるか」を伝える",
    examples: ["AIが分析→時間を70%短縮", "自動化→毎月20時間の自由時間"],
    tags: ["価値提案", "ベネフィット", "成果"]
  },
  {
    id: "emotion-first",
    category: "基本原則",
    title: "感情が先、理屈は後",
    description: "感情的な訴求で興味を引き、論理的な根拠で納得させる",
    examples: ["もう残業で悩まない→導入企業95%が効率化実現"],
    tags: ["感情", "論理", "説得"]
  },

  // 心理トリガー
  {
    id: "social-proof",
    category: "心理トリガー",
    title: "社会的証明の力",
    description: "他者の行動や承認を示して信頼性を高める",
    examples: ["10,000社導入", "業界No.1シェア", "満足度98%"],
    tags: ["社会証明", "実績", "信頼性"]
  },
  {
    id: "scarcity-urgency",
    category: "心理トリガー",
    title: "希少性と緊急性",
    description: "限定性や時間制限で行動を促す",
    examples: ["先着100名限定", "48時間限定", "在庫残りわずか"],
    tags: ["希少性", "緊急性", "限定性"]
  },
  {
    id: "authority-trust",
    category: "心理トリガー",
    title: "権威への信頼",
    description: "専門性や権威のある情報源を活用する",
    examples: ["東大教授推薦", "業界専門誌掲載", "特許取得技術"],
    tags: ["権威", "専門性", "信頼"]
  },
  {
    id: "reciprocity-principle",
    category: "心理トリガー",
    title: "返報性の原理",
    description: "先に価値を提供して、返したい気持ちを生み出す",
    examples: ["無料診断実施中", "30日間お試し", "限定資料プレゼント"],
    tags: ["返報性", "無料提供", "先行価値"]
  },

  // 価格・オファー戦略
  {
    id: "anchor-pricing",
    category: "価格戦略",
    title: "アンカリング効果",
    description: "最初に高い価格を見せてから実際の価格を提示する",
    examples: ["通常価格￥50,000→今なら￥19,800", "他社比較：A社￥30,000 当社￥15,000"],
    tags: ["アンカリング", "価格比較", "お得感"]
  },
  {
    id: "bundle-pricing",
    category: "価格戦略",
    title: "バンドル価格の魅力",
    description: "複数のサービスをセットにして価値を高める",
    examples: ["基本プラン￥9,800＋サポート￥5,000→セットで￥12,000"],
    tags: ["バンドル", "セット価格", "付加価値"]
  },
  {
    id: "loss-frame",
    category: "価格戦略",
    title: "損失回避の心理",
    description: "失うものの大きさを強調して行動を促す",
    examples: ["今やらないと年間240万円の機会損失", "競合に先を越される前に"],
    tags: ["損失回避", "機会損失", "競争優位"]
  },

  // ヘッドライン・コピー
  {
    id: "curiosity-gap",
    category: "ヘッドライン",
    title: "好奇心のギャップ",
    description: "知りたい気持ちを刺激する情報の隙間を作る",
    examples: ["なぜ彼らは3ヶ月で売上を2倍にできたのか？", "この方法を知らないと損をします"],
    tags: ["好奇心", "ギャップ", "興味喚起"]
  },
  {
    id: "specific-numbers",
    category: "ヘッドライン",
    title: "具体的な数字の力",
    description: "曖昧な表現より具体的な数値で信頼性を高める",
    examples: ["売上300%UP", "平均17分で完了", "1日たった5分"],
    tags: ["具体性", "数値", "信憑性"]
  },
  {
    id: "emotional-words",
    category: "ヘッドライン",
    title: "感情を動かす言葉選び",
    description: "強い感情を呼び起こす形容詞や動詞を使用する",
    examples: ["革命的", "驚異的", "画期的", "爆発的", "劇的改善"],
    tags: ["感情語", "インパクト", "印象的"]
  },

  // ストーリーテリング
  {
    id: "hero-journey",
    category: "ストーリー",
    title: "ヒーローズジャーニー",
    description: "困難→解決→成功の物語構造で共感を生む",
    examples: ["課題発見→解決方法→成果達成の流れ"],
    tags: ["物語", "共感", "成長"]
  },
  {
    id: "transformation",
    category: "ストーリー", 
    title: "変化・変身の魅力",
    description: "Before/Afterの劇的変化を描く",
    examples: ["手作業3時間→自動化で5分", "赤字続き→黒字転換"],
    tags: ["変化", "変身", "ギャップ"]
  },
  {
    id: "customer-voice",
    category: "ストーリー",
    title: "顧客の声で語る",
    description: "実際の利用者の体験談で説得力を高める",
    examples: ["「導入後3ヶ月で効率が2倍に」田中様（IT企業CEO）"],
    tags: ["お客様の声", "体験談", "実績"]
  },

  // CTA最適化
  {
    id: "action-verbs",
    category: "CTA",
    title: "行動を促す動詞",
    description: "強い行動喚起の動詞でクリックを促す",
    examples: ["今すぐ始める", "無料で試す", "限定特典を受け取る"],
    tags: ["行動喚起", "動詞", "クリック率"]
  },
  {
    id: "risk-removal",
    category: "CTA",
    title: "リスク除去",
    description: "不安要素を取り除いて行動しやすくする",
    examples: ["30日間返金保証", "いつでもキャンセル可能", "無料お試し"],
    tags: ["リスク軽減", "保証", "安心感"]
  },
  {
    id: "instant-gratification",
    category: "CTA",
    title: "即座の満足感",
    description: "すぐに得られる価値を強調する",
    examples: ["今すぐダウンロード", "即時アクセス", "60秒で完了"],
    tags: ["即効性", "スピード", "満足感"]
  },

  // ページ構造・レイアウト
  {
    id: "inverted-pyramid",
    category: "構造",
    title: "逆ピラミッド構造",
    description: "最も重要な情報を最初に、詳細を後に配置",
    examples: ["結論→理由→詳細の順序"],
    tags: ["情報設計", "構造", "優先順位"]
  },
  {
    id: "visual-hierarchy", 
    category: "構造",
    title: "視覚的階層",
    description: "サイズ、色、位置で情報の重要度を表現",
    examples: ["見出し→小見出し→本文のサイズ差"],
    tags: ["視覚デザイン", "階層", "読みやすさ"]
  },
  {
    id: "white-space",
    category: "構造",
    title: "余白の活用",
    description: "適切な余白で読みやすさと注目度を上げる",
    examples: ["重要な要素の周りに十分な余白"],
    tags: ["余白", "読みやすさ", "注目"]
  },

  // 信頼性構築
  {
    id: "credentials",
    category: "信頼性",
    title: "資格・認定の表示",
    description: "公的な認定や資格で専門性をアピール",
    examples: ["ISO認証取得", "プライバシーマーク", "各種認定資格"],
    tags: ["資格", "認定", "専門性"]
  },
  {
    id: "media-mention",
    category: "信頼性", 
    title: "メディア掲載実績",
    description: "著名メディアでの露出で権威性を示す",
    examples: ["日経新聞掲載", "テレビ出演", "業界誌インタビュー"],
    tags: ["メディア", "露出", "権威性"]
  },
  {
    id: "company-info",
    category: "信頼性",
    title: "会社情報の透明性",
    description: "運営会社の詳細情報で信頼感を高める",
    examples: ["代表者名", "設立年", "資本金", "従業員数"],
    tags: ["透明性", "会社情報", "信頼"]
  },

  // モバイル最適化
  {
    id: "thumb-friendly",
    category: "モバイル",
    title: "親指で操作しやすく",
    description: "スマホの片手操作を考慮したUI設計",
    examples: ["下部にCTAボタン", "大きめのタップエリア"],
    tags: ["モバイル", "操作性", "UI"]
  },
  {
    id: "speed-optimization",
    category: "モバイル",
    title: "ページ速度重視",
    description: "特にモバイルでの読み込み速度を最適化",
    examples: ["画像圧縮", "不要なスクリプト削除", "CDN活用"],
    tags: ["速度", "パフォーマンス", "モバイル"]
  },

  // 検証・最適化の観点
  {
    id: "single-variable",
    category: "テスト",
    title: "一度に一つの要素",
    description: "検証では変更要素を一つに絞る",
    examples: ["ヘッドラインのみ変更", "CTAボタンの色のみ変更"],
    tags: ["検証", "変数統制", "効果測定"]
  },
  {
    id: "statistical-significance",
    category: "テスト",
    title: "統計的有意性",
    description: "十分なサンプル数で結果の信頼性を確保",
    examples: ["最低1000コンバージョン", "95%信頼区間"],
    tags: ["統計", "有意性", "信頼性"]
  },

  // 業界別カスタマイズ
  {
    id: "industry-language",
    category: "業界対応",
    title: "業界特有の言葉",
    description: "ターゲット業界の専門用語や慣習を理解して使用",
    examples: ["IT業界：アジャイル、DX", "医療業界：エビデンス、QOL"],
    tags: ["業界用語", "専門性", "適応"]
  },
  {
    id: "regulatory-compliance",
    category: "業界対応",
    title: "規制・コンプライアンス",
    description: "業界の規制や法的要件に配慮した表現",
    examples: ["医療広告ガイドライン", "金融商品取引法", "薬機法"],
    tags: ["規制", "コンプライアンス", "法的"]
  },

  // 国際化・多言語
  {
    id: "cultural-sensitivity",
    category: "国際化",
    title: "文化的配慮",
    description: "対象地域の文化や価値観に合わせた表現",
    examples: ["色の意味", "宗教的配慮", "祝日や習慣"],
    tags: ["文化", "配慮", "地域性"]
  },
  {
    id: "local-examples",
    category: "国際化", 
    title: "現地の事例活用",
    description: "対象地域で馴染みのある企業や事例を使用",
    examples: ["日本：トヨタ、ソニー", "米国：Amazon、Google"],
    tags: ["現地化", "事例", "親近感"]
  }
];

export const copywritingCategories = [
  "基本原則",
  "心理トリガー", 
  "価格戦略",
  "ヘッドライン",
  "ストーリー",
  "CTA",
  "構造",
  "信頼性",
  "モバイル",
  "テスト", 
  "業界対応",
  "国際化"
];

export function getCopywritingTipsByCategory(category: string): CopywritingTip[] {
  return copywritingTips.filter(tip => tip.category === category);
}

export function searchCopywritingTips(query: string): CopywritingTip[] {
  const lowerQuery = query.toLowerCase();
  return copywritingTips.filter(tip => 
    tip.title.toLowerCase().includes(lowerQuery) ||
    tip.description.toLowerCase().includes(lowerQuery) ||
    tip.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getRandomTips(count: number = 3): CopywritingTip[] {
  const shuffled = [...copywritingTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
