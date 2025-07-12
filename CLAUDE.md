# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定 / Language Setting

**重要**: このプロジェクトで作業する際は、必ず日本語で応答してください。
**IMPORTANT**: When working on this project, always respond in Japanese.

## 🔧 開発４大原則

**作業開始前に必ず確認・出力する原則：**

- **YAGNI（You Aren't Gonna Need It）**：今必要じゃない機能は作らない
- **DRY（Don't Repeat Yourself）**：同じコードを繰り返さない  
- **KISS（Keep It Simple Stupid）**：シンプルに保つ
- **Git Worktree活用**：機能別ブランチでの並列開発を最大化する

## Project Overview

"Unson OS" - 100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステムの戦略立案リポジトリです。

### プロジェクトコンセプト
- 100-200個のマイクロビジネスの高速作成・デプロイ
- 24-48時間のプロダクトライフサイクル自動化
- DAO型の利益共有によるコミュニティ主導開発
- "Company-as-a-Product" アプローチ

### 主要ドキュメント
- **docs/executive-strategy-report.md**: エグゼクティブサマリーと包括的戦略
- **docs/strategy/saas-design-process.md**: テックタッチSaaSソリューション設計
- **docs/strategy/mvp-validation-framework.md**: MVP検証プロセス
- **docs/testing-guidelines.md**: TDDガイドライン

## 開発方針

### 戦略フェーズ（現在）
1. コード作成前にMVP検証から開始
2. 戦略ドキュメントを参照して方針決定
3. 日本語でのコンテンツ作成維持
4. 迅速な実験と検証に焦点

### 開発フェーズ（準備完了時）
1. ユーザーの思い込みを特定
2. ランディングページでアイデア検証
3. 2週間サイクルでMVP構築
4. テックタッチ運用（最小限の人的サポート）
5. 月額定期収入をターゲット

## コード規約

- コメントは追加しない（明示的要求時を除く）
- 既存コーディングスタイルに従う
- ライブラリ使用前にpackage.json確認

### Test-Driven Development (TDD)
**必須**: t_wada方式のTDD、Red-Green-Refactorサイクル

**重要ルール**:
- Greenフェーズ：ベタ書き・ハードコード許容
- **Refactorフェーズ：ベタ書き・ハードコード必須除去**
- 最終コードにハードコード残存禁止

## 検証指標
- LP登録率：10%以上
- 有料転換率：10%以上  
- 7日後継続率：50%以上
- MRR成長率：20%/月以上

## 🔄 Claude Code ベストプラクティス

### 基本ワークフロー
1. **探索** → **計画** → **実装** → **コミット**
2. **Git Worktree活用**: 並行開発の最大化
3. **TDDサイクル**: Red-Green-Refactor厳守

### ⚡ 頻用コマンド
```bash
# 開発・テスト
npm run dev build test
npx playwright test
npm test -- --watch

# Git Worktree
git worktree add ../feature-branch -b feature/new-feature
git worktree list
git worktree remove ../feature-branch

# 品質チェック
npm run lint typecheck
npm audit fix
```

### 📋 コミット前チェックリスト
- [ ] テスト全通過
- [ ] TypeScript・ESLintエラーなし
- [ ] ビルド成功
- [ ] 開発４大原則準拠
- [ ] ベタ書き・ハードコード除去完了