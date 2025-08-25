# LP品質チェックリスト（検証フェーズ用）

対象: 各プロダクトのLP（Next.js + Tailwind + JSONテンプレート）
目的: 検証フェーズでのCVR最大化と品質の均一化（価格表示は非表示、ベータ登録重視）

## コンテンツ
- 一貫性: H1・サブ・CTAの訴求を1テーマに統一
- ペルソナ語彙: ターゲットの言い回しを本文/見出しへ反映
- FAQ: 3–6項目で反論/不安を解消（短文＋具体例）
- 社会的証明: 実例/数値/比較を1画面に簡潔表示
- 検証モード: 価格・プラン表示を隠す（ベータ登録最優先）

## フォーム/コンバージョン
- 単一フォーム: Heroフォームを唯一の入力元に統一（Final CTAは同フォームに委譲）
- 最小項目: Eメール＋任意1項目まで（選択式推奨）
- 送信動作: 成功/失敗の即時フィードバック、連打/二重送信防止
- スパム対策: ハニーポット＋簡易レート制限（サーバー側）
- KPI: 登録率（CVR）10%以上を目標に可視化（PB-001参照）

## 分析/イベント計測
- PostHog: ヒートマップ/クリック/スクロールを有効化
- GA: ページビューとフォーム送信イベントを計測
- 命名規約: `lp.view` / `lp.form_submit` / `lp.scroll_75`
- 自動最適化: 4時間周期の改善は事前承認不要（後日レビューで把握）
- 検証: PC/モバイルでイベント発火をPreviewで確認

## UI/UX
- 1画面1目的: 各セクションのCTAはHeroフォームへスムーズスクロール
- モバイル最適化: 360px幅で折り返し/はみ出し/タップ領域44px以上
- ナビ抑制: 不要リンクを上部に置かない（離脱抑制）
- 可読性: 行間/余白/コントラスト（WCAG AA）
- フォント: 1–2種類、preconnectで遅延少なく

## アクセシビリティ
- 見出し階層: h1は1つ、論理順序
- 代替テキスト: 全画像に`alt`
- 入力ラベル: `label for`/`aria-label`、エラーに`aria-live`
- キーボード操作: フォーカス可視・Tabで送信まで可能

## パフォーマンス
- 画像最適化: jpg/webp＋適切サイズ（`public/images/generated`確認）
- CLS対策: 画像にwidth/height、フォントFOUT抑制
- 依存削減: 不要JS/CSS削除、必要に応じコード分割
- 目安: Lighthouse Performance≥90 / Accessibility≥95

## SEO/OG
- メタ: title/description/OGP（1200x630）
- カノニカル: 本番ドメインに設定
- robots: Previewは`noindex`、本番は`index`
- 構造化: 必要に応じBreadcrumb/FAQ JSON-LD

## 設定/環境
- 環境変数: GA/POSTHOG等を`.env`で管理（`NEXT_PUBLIC_`は公開前提に限る）
- Vercel: 環境ごとに変数設定、Previewは`noindex`
- ドメイン: カスタムドメイン割当はDashboardで手動（運用タスク化）
- `vercel.json`: 最低限のセキュリティヘッダ（CSP/Frame/Referrer）

## コード/テンプレ
- 価格ブロック: 検証では`config.content.pricing`を未設定/false
- イベント送信: `onFormSubmit`でPostHog/GAイベントを送信
- 単一フォーム原則: `LandingPageTemplate`のHeroフォームを唯一のソースに
- 型/バリデーション: `TemplateConfig`必須プロパティと`config.json`検証
- 画像パス: `public`配下の解決と404が無いこと

## QA/運用
- 対応ブラウザ: Chrome/Safari/Firefox/Edge（最新2ver）
- 端末/回線: iOS/Android主要端末、3G/Slow4Gで初回入力までの到達時間
- 失敗系UI: ネットワーク・送信失敗時の案内
- 初週タスク: ヒートマップ確認→改善サイクル登録
- 通知: CVR急低下/費用急増のアラート通知先を確認

---

参考
- PB-001: docs/playbooks/pb-001-lp-cvr-test.md
- LP生成ガイド: docs/for-operators/service-generation/lp-generation-tools.md
- LP検証ロードマップ: docs/lp-validation/phase2-roadmap.md

