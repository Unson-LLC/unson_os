# LP品質チェックリスト（検証フェーズ用）

対象: このLP（ai-coach）
目的: 検証フェーズでのCVR最大化と品質の均一化（価格表示は非表示、ベータ登録重視）

## コンテンツ
- [x] 一貫性: H1・サブ・CTAの訴求を1テーマに統一
- [x] FAQ: 3–6項目で反論/不安を解消（短文＋具体例）
- [x] 社会的証明: 実例/数値/比較を1画面に簡潔表示
- [x] 検証モード: 価格・プラン表示を隠す（ベータ登録最優先）

## フォーム/コンバージョン
- [x] 単一フォーム: Heroフォームを唯一の入力元に統一（Final CTAは同フォームに委譲）
- [x] 最小項目: Eメール＋任意1項目まで（選択式推奨）
- [x] 送信動作: 成功/失敗の即時フィードバック、二重送信防止
- [x] スパム対策: ハニーポット＋簡易レート制限（サーバー側）

## 分析/イベント計測
- [x] PostHog/GAの導入（lp.view / lp.form_submit / lp.scroll_75）
- [x] Preview/本番でのイベント発火確認

## UI/UX
- [x] 1画面1目的: 各セクションのCTAはHeroフォームへスムーズスクロール
- [x] モバイル最適化: 360px幅で折り返し/タップ領域44px以上
- [x] 可読性: 行間/余白/コントラスト（WCAG AA）

## アクセシビリティ
- [x] 見出し階層: h1は1つ、論理順序
- [x] 代替テキスト: 全画像にalt
- [x] キーボード操作: フォーカス可視・Tabで送信まで可能

## パフォーマンス
- [x] 画像最適化 / CLS対策 / Lighthouse 目標達成

## SEO/OG
- [x] Head: title/description/OGP/Twitter/canonical/robots

## 設定/環境
- [x] 環境変数（NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_ROBOTS など）
- [x] `vercel.json`: セキュリティヘッダ（X-Frame-Options / Referrer-Policy / X-Content-Type-Options）

## コード/テンプレ
- [x] 価格ブロック: 検証では非表示
- [x] 単一フォーム原則: Heroフォームを唯一のソースに
- [x] 型/バリデーション: `config.json`基本検証

---

メモ
- 本LPはHero/FinalCTAともフォームを同梱の構成（ai-coach基準）
- Quick Pointsあり、FAQあり
- 追加でSEO/計測/セキュリティを導入すると更に統一されます

参考
- 一発適用ガイド: docs/for-operators/service-generation/lp-quality-checklist.md
