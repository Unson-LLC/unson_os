# LP品質チェックリスト（検証フェーズ用）

対象: 各プロダクトのLP（Next.js + Tailwind + JSONテンプレート）
目的: 検証フェーズでのCVR最大化と品質の均一化（価格表示は非表示、ベータ登録重視）

## コンテンツ
- [ ] 一貫性: H1・サブ・CTAの訴求を1テーマに統一
- [ ] ペルソナ語彙: ターゲットの言い回しを本文/見出しへ反映
- [ ] FAQ: 3–6項目で反論/不安を解消（短文＋具体例）
- [ ] 社会的証明: 実例/数値/比較を1画面に簡潔表示
- [ ] 検証モード: 価格・プラン表示を隠す（ベータ登録最優先）

## フォーム/コンバージョン
- [ ] 単一フォーム: Heroフォームを唯一の入力元に統一（Final CTAは同フォームに委譲）
- [ ] 最小項目: Eメール＋任意1項目まで（選択式推奨）
- [ ] 送信動作: 成功/失敗の即時フィードバック、連打/二重送信防止
- [ ] スパム対策: ハニーポット＋簡易レート制限（サーバー側）
- [ ] KPI: 登録率（CVR）10%以上を目標に可視化（PB-001参照）

## 分析/イベント計測
- [ ] PostHog: ヒートマップ/クリック/スクロールを有効化
- [ ] GA: ページビューとフォーム送信イベントを計測
- [ ] 命名規約: `lp.view` / `lp.form_submit` / `lp.scroll_75`
- [ ] 自動最適化: 4時間周期の改善は事前承認不要（後日レビューで把握）
- [ ] 検証: PC/モバイルでイベント発火をPreviewで確認

## UI/UX
- [ ] 1画面1目的: 各セクションのCTAはHeroフォームへスムーズスクロール
- [ ] モバイル最適化: 360px幅で折り返し/はみ出し/タップ領域44px以上
- [ ] ナビ抑制: 不要リンクを上部に置かない（離脱抑制）
- [ ] 可読性: 行間/余白/コントラスト（WCAG AA）
- [ ] フォント: 1–2種類、preconnectで遅延少なく

## アクセシビリティ
- [ ] 見出し階層: h1は1つ、論理順序
- [ ] 代替テキスト: 全画像に`alt`
- [ ] 入力ラベル: `label for`/`aria-label`、エラーに`aria-live`
- [ ] キーボード操作: フォーカス可視・Tabで送信まで可能

## パフォーマンス
- [ ] 画像最適化: jpg/webp＋適切サイズ（`public/images/generated`確認）
- [ ] CLS対策: 画像にwidth/height、フォントFOUT抑制
- [ ] 依存削減: 不要JS/CSS削除、必要に応じコード分割
- [ ] 目安: Lighthouse Performance≥90 / Accessibility≥95

## SEO/OG
- [ ] メタ: title/description/OGP（1200x630）
- [ ] カノニカル: 本番ドメインに設定
- [ ] robots: Previewは`noindex`、本番は`index`
- [ ] 構造化: 必要に応じBreadcrumb/FAQ JSON-LD

## 設定/環境
- [ ] 環境変数: GA/POSTHOG等を`.env`で管理（`NEXT_PUBLIC_`は公開前提に限る）
- [ ] Vercel: 環境ごとに変数設定、Previewは`noindex`
- [ ] ドメイン: カスタムドメイン割当はDashboardで手動（運用タスク化）
- [ ] `vercel.json`: 最低限のセキュリティヘッダ（CSP/Frame/Referrer）

## コード/テンプレ
- [ ] 価格ブロック: 検証では`config.content.pricing`を未設定/false
- [ ] イベント送信: `onFormSubmit`でPostHog/GAイベントを送信
- [ ] 単一フォーム原則: `LandingPageTemplate`のHeroフォームを唯一のソースに
- [ ] 型/バリデーション: `TemplateConfig`必須プロパティと`config.json`検証
- [ ] 画像パス: `public`配下の解決と404が無いこと

## QA/運用
- [ ] 対応ブラウザ: Chrome/Safari/Firefox/Edge（最新2ver）
- [ ] 端末/回線: iOS/Android主要端末、3G/Slow4Gで初回入力までの到達時間
- [ ] 失敗系UI: ネットワーク・送信失敗時の案内
- [ ] 初週タスク: ヒートマップ確認→改善サイクル登録
- [ ] 通知: CVR急低下/費用急増のアラート通知先を確認

---

参考
- PB-001: docs/playbooks/pb-001-lp-cvr-test.md
- LP生成ガイド: docs/for-operators/service-generation/lp-generation-tools.md
- LP検証ロードマップ: docs/lp-validation/phase2-roadmap.md

## コピー品質チェック（提供メモ反映）

目的: 読了率とCVRに効くコピー品質を均一化し、検証速度を上げる

- [ ] ターゲット明確化: 「誰に何を言うのか」を先に固定（万人狙いはNG）
- [ ] 五感に訴求: 抽象「集客できます」ではなく具体「申込み電話が鳴りやまない」
- [ ] ベネフィット・ファースト: 先に嬉しい未来→理由（特徴/証拠）の順で構成
- [ ] 数字で具体化: 10人中9人、3ヶ月待ち、1,980円など即イメージ可能な数値
- [ ] 1人に向ける: たった1人に刺さる表現＝近い100人に刺さる（広げない）
- [ ] 小見出し最適化: 小見出しだけで価値が伝わり、続きが読みたくなるか
- [ ] 質問で惹きつけ: ！より？（例: なぜ私は東大に？）で続きを促す
- [ ] 3の原則: 理由は最大3つ。言い訳に聞こえる羅列は避ける
- [ ] 読み手の言葉: 業界語/日常語など読者が使う語彙で書く（専門外は平易に）
- [ ] 失わない訴求: 得る訴求に加え損失回避の視点も検討（希少性/締切は誇大NG）
- [ ] リズム/冗長削減: 同語尾は連続3回まで、重複語の削除、短文化
- [ ] ひらがな/漢字の比: 目安 漢字30%/ひらがな70%で可読性を担保
- [ ] キャプション活用: 画像下の一文は本文へ引き込む導線に（説明だけは避ける）
- [ ] 構成テンプレ: キャッチ→リード→本文（証拠）→クロージング→レスポンス装置
- [ ] テスト原則: 一度に1要素だけをA/B（見出し、CTA文言など）
- [ ] 競合リサーチ軸: クリエイティブではなくターゲット/主ベネ/オファーを比較
- [ ] 段階適合: 認知/比較/未認知で訴求を切替（良条件/差別化/解決法）
- [ ] 禁止/注意: 他社の表層パクリ、根拠のない断定表現、過度な心理テクだけの運用

チェック用クイックQA
- [ ] この一文は何のためにある？（役割不明は削除/統合）
- [ ] 3秒で伝わる？（タイトル/ヒーロー内で価値が即理解できるか）
- [ ] 小見出しの流し読みで価値と流れが追えるか？
- [ ] 証拠（数値/事例/比較）は過不足ないか？捏造/誇張なし？
- [ ] CTAは「今する理由」が添えられているか？（ベータ枠/締切など倫理的に）

---

## 一発適用の実装手順（テンプレ適用ガイド）

目的: 本チェックリストの内容を、各LPフォルダで迷わず適用できるようにするための具体手順。以下のパスは例として `products/<path-to-lp>/lp` を前提。

1) Hero直下フォーム＋Quick Points
- `src/components/sections/HeroSection.tsx`
  - フォームをヒーロー内に埋め込む（id=`hero-survey`）
  - Quick Points（10秒要約）のブロックを追加（configから `content.hero.quickPoints: string[]` を読み込む）
  - CTAは `hero-survey` へスムーズスクロール（`block: 'center'`）
- `configs/config.json`
  - `content.hero.quickPoints` を3点程度で追加

2) Final CTAにも同一フォームを同梱
- `src/components/sections/FinalCtaSection.tsx`
  - Final CTAブロックの下に同じ `FormSection` を配置（Heroと同じ `formConfig`/`onFormSubmit`/`prefill` を渡す）

3) FormSectionのUI統一（ai-coach準拠）
- `src/components/sections/FormSection.tsx`
  - 見出しの可読性: 白背景カード（`bg-white/95 backdrop-blur shadow`）＋濃色文字（`text-gray-900/700`）
  - セレクト禁止: `select` を廃止し、ボタングループ（`role=radio`/`aria-checked`）で回答選択
  - コンパクト埋め込み: `compact` プロップを追加（ヒーロー/FinalCTA内に埋め込む時はセクション外枠を出さない）

4) テンプレの配線（フォームは単一ソース）
- `src/components/templates/LandingPageTemplate.tsx`
  - Heroに `formConfig`/`onFormSubmit`/`prefill` を渡して埋め込み、独立したフォームセクションは削除
  - FinalCTAにも同一フォームを渡す
  - `handleCta` は `#hero-survey` へスクロール
  - `ServiceSection` には `id="service"` を付与（「くわしく見る」誘導）

5) FAQの追加
- `src/components/sections/FaqSection.tsx` を追加（なければ作成）し、`content.faq` があれば表示
- `configs/config.json` に `content.faq` を追加（3〜5件）

6) 計測/SEOの共通化
- `src/app/page.tsx`
  - `<Head>` に `title/description/og:*/twitter:card/canonical/robots` を設定
  - `PostHogProvider`/`Analytics`/`ScrollTracker` を追加
  - イベント: `lp.view`（初回ロード）、`lp.form_submit`（送信）、`lp.scroll_75`（深度）
- 環境変数
  - `NEXT_PUBLIC_APP_URL`（canonical用）、`NEXT_PUBLIC_ROBOTS`（`index,follow` or `noindex,nofollow`）

7) セキュリティ/運用
- `vercel.json`
  - `headers` に最低限のセキュリティヘッダ（`X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`）を追加
  - 環境ごとの `NEXT_PUBLIC_ROBOTS` 設定で Preview は `noindex`

8) JSON定義の注意
- `configs/config.json`
  - 全ての引用符はJSONとして正しくエスケープ（例: 「すれ違い」などダブルクォートは全角/エスケープを使用）

9) 完了チェック（ファイル別）
- `HeroSection.tsx`: quickPoints表示、`hero-survey` に `FormSection compact`、背景上でも文字が読める
- `FinalCtaSection.tsx`: 同一フォームを埋め込み
- `FormSection.tsx`: セレクト廃止→ボタングループ、見出しカード化、ハニーポットあり
- `LandingPageTemplate.tsx`: 単一フォーム原則、`#service` アンカー、`handleCta` 修正
- `FaqSection.tsx`: 追加/表示OK
- `page.tsx`: Head/Analytics/Scroll OK
- `vercel.json`: セキュリティヘッダあり
- `configs/config.json`: `hero.quickPoints` と `content.faq`、引用符エラーなし

10) 既知の落とし穴
- セレクトUIの残存（見落とし）
- `quickPoints` でのダブルクォート未エスケープ
- フォームを複数設置して二重送信になる配線ミス（単一ソースに統一）
