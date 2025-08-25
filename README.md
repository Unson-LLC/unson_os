# Unson OS

100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステムの戦略立案リポジトリ

## 概要

Unson OSは、従来の「1つの大きなビジネス」ではなく、「100-200個の小さな収益性の高いビジネス」を自動的に生成・運用することを目指すプロジェクトです。

### 主要コンセプト

- **24-48時間のプロダクトライフサイクル**: 高速な立ち上げと検証
- **DAO型の利益共有**: コミュニティ主導の開発と収益分配
- **"Company-as-a-Product"**: 会社そのものを製品として捉える新しいアプローチ
- **テックタッチ運用**: 人的サポートを最小限に抑えた自動化

## 📚 ドキュメント

詳細なドキュメントは [`/docs/`](docs/) にあります：

### 利用者別ガイド
- 👨‍💼 [`for-operators/`](docs/for-operators/) - UnsonOS運営者向け
- 👩‍💻 [`for-developers/`](docs/for-developers/) - 開発者向け
- 🌍 [`for-community/`](docs/for-community/) - コミュニティ向け
- 📈 [`business-strategy/`](docs/business-strategy/) - ビジネス戦略

### 主要ドキュメント
- [`エグゼクティブ戦略レポート`](docs/business-strategy/executive-strategy-report.md) - 包括的戦略（全10章）
- [`MVP検証フレームワーク`](docs/business-strategy/mvp-validation-framework.md) - 2週間サイクル検証
- [`DAO構造`](docs/for-community/dao-governance/dao-structure.md) - 収益分配モデル

## 🛠️ ツール & テンプレート

### LP自動生成テンプレート
コミュニティメンバーが開発した、JSONファイルの設定だけでLPを自動生成できるツール：
- 🔗 **リポジトリ**: [https://github.com/Unson-LLC/lp-template](https://github.com/Unson-LLC/lp-template)
- 📖 **使い方**: [`LP自動生成ガイド`](docs/for-developers/saas-templates/lp-template-guide.md)
- ⚡ **特徴**: config.jsonを編集するだけで即座にLP生成

### Microsoft Clarity 分析ツール
5つのランディングページのユーザー行動分析を自動セットアップ：
- 🔧 **セットアップ**: `npm run clarity:setup`
- 📖 **ガイド**: [`CLARITY_SETUP_GUIDE.md`](CLARITY_SETUP_GUIDE.md)
- 🤖 **自動化**: Playwright使用でブラウザ操作を自動化

## 開発方針

詳細な開発ガイドラインは[`CLAUDE.md`](CLAUDE.md)を参照してください。

## プロジェクトステータス

現在は戦略立案フェーズです。実装を開始する前に：

1. ユーザーの思い込みを特定（[調査手法](docs/strategy/user-assumption-research.md)）
2. LPでアイデアを検証（[検証フレームワーク](docs/strategy/mvp-validation-framework.md)）
3. 2週間でMVPを構築
4. 迅速な検証サイクルで改善

## ライセンス

このプロジェクトのライセンスについては、後日決定予定です。
# Vercel環境変数設定完了
# Vercelトークン更新完了
# 自動デプロイテスト
