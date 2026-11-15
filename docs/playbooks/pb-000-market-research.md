---
id: PB-000
version: 1.0.0
phase: Market_Research
title: 市場調査・ペルソナ・競合・ポジショニング統合プレイブック
owners: ["growth-team"]
tags: ["market-research", "persona", "competitive-analysis", "positioning", "LP"]
estimated_duration: "1-3 days"
success_criteria:
  - ペルソナ仮説が実データまたは一次情報で補強されている
  - 課題・導入障壁がLP/診断/営業に転用できる粒度で整理されている
  - 競合・代替手段との差別化軸が3つ以上ある
  - 次のLP/広告/診断フォームに反映する項目が明確である
failure_criteria:
  - 架空ペルソナだけでLP制作へ進む
  - 競合との差分が機能比較に閉じている
  - 調査結果がLP/Offer/計測に接続されていない
prerequisites:
  - 検証したい顧客セグメントが仮決めされている
  - 検証したいOfferまたはLP仮説がある
tooling:
  - tools/market-research
source_repo:
  - https://github.com/YL08140921/unson-os-market-research
---

# PB-000 Market Research Playbook

## 目的

LP制作、広告配信、診断フォーム設計の前に、`誰に・どの課題を・どの言葉で売るか` を固定する。

このプレイブックは、旧 `unson-os-market-research` リポジトリをUnsonOS monorepoへ取り込んだものを正本化するための入口である。

実装・Skill・過去成果物は以下に置く。

```text
tools/market-research
```

## 位置づけ

`tools/market-research` は、LP/API実装本体ではない。

役割は、UnsonOSの検証フローにおける最上流の調査工程:

```text
Market Research -> Persona -> Issue -> Competitive -> Positioning -> LP/Offer -> Measurement
```

PB-001以降のLP検証に入る前に、PB-000でペルソナ/課題/差別化の粗さを潰す。

## 標準フロー

### Phase 1: Persona

目的:
- ターゲット顧客の購買文脈、意思決定者、利用者、反対者を分ける

入力:
- 対象市場
- 対象職種/役職
- 解決したい課題仮説

出力:
- ペルソナ仮説
- 検索語/発信用語
- 購買トリガー

関連tool:
- `tools/market-research/lib/nemotron_persona_selector.py`
- `tools/market-research/lib/persona_integrator.py`

### Phase 2: Issue

目的:
- 表面課題、根本課題、思い込み、導入障壁を分ける

出力:
- 課題マップ
- LP Problem sectionの素材
- 診断フォームで聞くべき項目

### Phase 3: Idea

目的:
- 課題からOffer/PoC/診断メニュー候補へ変換する

出力:
- Offer候補
- 最小PoCスコープ
- 初回CTA

### Phase 4: Competitive

目的:
- 直接競合、間接競合、代替手段を分ける

出力:
- 競合/代替手段一覧
- 差別化軸
- FAQ/比較表素材

### Phase 5: Positioning

目的:
- LP、広告、営業で使う言葉を統合する

出力:
- STP
- 1行ポジショニング
- LP Hero/CTA
- 広告訴求

## B2B向け補正

旧repoはInstagram実データとB2C寄りのペルソナ分析に強い。

B2B高単価商材では、以下へ置き換える。

| 旧入力 | B2B向け入力 |
|---|---|
| Instagram投稿/プロフィール | X投稿、note、企業LP、採用ページ、導入事例、商談メモ |
| ハッシュタグ | 検索語、広告語、X反応語、商談質問 |
| 個人ペルソナ | 決裁者、推進者、利用者、反対者 |
| 投稿エンゲージメント | 診断予約、有効商談率、PoC提案率 |

## 実行ログ

各実行はプロダクト配下に残す。

```text
products/{product}/phases/00_Market_Research/PB000_{slug}/
```

推奨成果物:

```text
01_research_brief.md
02_persona_hypotheses.md
03_issue_map.md
04_competitor_map.md
05_positioning_strategy.md
06_lp_offer_implications.md
QA_Report.md
```

## AI社員化導線での使い方

`AI社員化診断` では、Instagram/Apifyを初期必須にしない。

初期入力:
- X反応
- 競合LP
- Claude Code法人導入/AIエージェント導入支援の検索語
- 商談で聞かれそうな質問
- Brainbase/Unsonの既存ドキュメント

初期出力:
- 経営者/事業責任者/PdM/DX責任者/営業責任者のペルソナ仮説
- Claude Code導入が研修止まりになる理由
- AI社員化PoCへ進める導入障壁
- LP/診断フォーム/広告コピーへの反映項目

## 関連

- Tooling: `tools/market-research/README.md`
- Original source: `https://github.com/YL08140921/unson-os-market-research`
- Next playbook: `docs/playbooks/pb-001-lp-cvr-test.md`
