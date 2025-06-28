# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定 / Language Setting

**重要**: このプロジェクトで作業する際は、必ず日本語で応答してください。
**IMPORTANT**: When working on this project, always respond in Japanese.

## Project Overview

"Unson OS" - 100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステムの戦略立案リポジトリです。従来のソースコードではなく、日本語で書かれた戦略ドキュメントを中心に構成されています。

## プロジェクトコンセプト

Unson OSは以下の核心的概念を持つ自動SaaS生成プラットフォームです：
- 100-200個のマイクロビジネスの高速作成・デプロイ
- 24-48時間のプロダクトライフサイクル自動化
- DAO型の利益共有によるコミュニティ主導開発
- "Company-as-a-Product" アプローチ

## リポジトリ構成

```
unson_os/
├── README.md                                   # プロジェクト概要
├── CLAUDE.md                                   # Claude Code設定
├── docs/
│   ├── executive-strategy-report.md            # 包括的戦略レポート
│   ├── testing-guidelines.md                   # TDDガイドライン
│   └── strategy/
│       ├── saas-design-process.md              # SaaS設計プロセス
│       ├── micro-business-strategy.md          # マイクロビジネス戦略
│       ├── user-assumption-research.md         # ユーザーの思い込み調査手法
│       └── mvp-validation-framework.md         # MVP検証フレームワーク
└── .claude/                                    # Claude固有の設定
```

## 主要ドキュメント

- **docs/executive-strategy-report.md**: 自動SaaS生成プラットフォームのエグゼクティブサマリーと包括的戦略
- **docs/strategy/saas-design-process.md**: 問題特定と決済システムを含むテックタッチSaaSソリューション設計
- **docs/strategy/micro-business-strategy.md**: 1-2個の大型ビジネスから100-200個の小規模収益性ビジネスへの転換
- **docs/strategy/user-assumption-research.md**: 「破壊すべきユーザーの思い込み」を発見する調査手法
- **docs/strategy/mvp-validation-framework.md**: 開発前のランディングページとユーザーテストによるSaaSアイデア検証プロセス
- **docs/strategy/tokenomics-unified.md**: 統一されたトークノミクスと収益分配モデル（45-15-40）

## 開発方針

### 戦略フェーズのガイドライン

現在は戦略立案フェーズのため：
1. 実装について問われた場合、ビジョンとアプローチについて戦略ドキュメントを参照
2. コード作成を求められた場合、プロジェクトがアイデア段階であることを理解し、mvp-validation-framework.mdに記載のMVP検証から開始することを提案
3. すべてのコンテンツは日本語で記載 - ドキュメント編集時は言語の一貫性を維持
4. 構築前の迅速な実験と検証に焦点を当てる

### 開発フェーズのアプローチ（準備完了時）

戦略ドキュメントに基づき、将来の開発は以下に従うべき：
1. 破壊すべきユーザーの思い込みを特定（user-assumption-research.mdの手法）
2. まずランディングページでアイデアを検証（mvp-validation-framework.mdのプロセス）
3. 2週間サイクルでMVPを構築
4. テックタッチ運用を目指す（最小限の人的サポート）
5. 迅速な検証サイクルで月額定期収入をターゲット

## コード規約（開発開始時）

- コメントは追加しない（ユーザーが明示的に要求した場合を除く）
- 既存のコーディングスタイルに従う
- ライブラリの使用前に必ずpackage.jsonを確認（プロジェクト作成時）

### Test-Driven Development (TDD)
**必須**: t_wada方式のTDDに従ってください。テストを先に書き、Red-Green-Refactorサイクルを守ること。

**重要なルール**:
- Greenフェーズではベタ書き・ハードコードを許容する
- **Refactorフェーズで必ずベタ書き・ハードコードを除去すること**
- 最終的なコードにベタ書き・ハードコードが残ることは許されない

詳細: → `docs/testing-guidelines.md`

## 重要な開発指針

### MVP開発時の注意点
- 2週間でMVP完成を目標
- Stripe決済の早期実装
- ユーザーフィードバックの継続的収集
- DAU・転換率・継続率の計測

### 検証指標
- LP登録率：10%以上
- 有料転換率：10%以上  
- 7日後継続率：50%以上
- MRR成長率：20%/月以上