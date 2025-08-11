# docs/ フォルダ構造改善プラン

## 🔍 現状の問題点

### 現在の構造
```
docs/
├── architecture/       # アーキテクチャ（中核？生成SaaS？混在）
├── development/        # 開発ガイド（誰向け？）
├── governance/         # DAO関連
├── marketing/          # マーケティング
├── project/           # プロジェクト情報
├── setup/             # セットアップ
├── strategy/          # 戦略
├── team/              # チーム
├── technical/         # 技術（architectureと重複？）
├── ui/                # UI設計（中核システムのみ）
└── updates/           # 更新履歴
```

### 主な課題
1. **分類が曖昧**: architectureとtechnicalの違いが不明確
2. **対象が不明確**: 中核システムvs生成SaaSの区別なし
3. **ペルソナ中心設計が見えない**: 思い込み破綻プロセスが埋もれている
4. **利用者別の整理なし**: 開発者/運営者/コミュニティの区別なし

---

## 🎯 新しいフォルダ構造提案

### Option A: 二層アーキテクチャ明確化型
```
docs/
├── 00-overview/                    # 🏠 全体概要
│   ├── README.md                   # ドキュメント全体ガイド
│   ├── ARCHITECTURE_OVERVIEW.md    # システム全体像
│   └── ROADMAP.md                  # ロードマップ
│
├── 01-core-system/                 # 🏗️ 中核システム（UnsonOS本体）
│   ├── persona-engine/             # ペルソナ観察エンジン
│   │   ├── observation-guide.md
│   │   └── persona-patterns.md
│   ├── assumption-breaker/         # 思い込み破綻システム
│   │   ├── detection-algorithm.md
│   │   └── breaking-strategies.md
│   ├── service-generator/          # SaaS自動生成
│   │   ├── generation-pipeline.md
│   │   └── validation-gates.md
│   ├── ui-admin/                   # 管理UI（現在のui/）
│   │   └── [現在のui/の内容]
│   └── architecture/               # 中核システムアーキテクチャ
│       ├── technical-stack.md
│       └── infrastructure.md
│
├── 02-generated-saas/              # 🚀 生成されるSaaS
│   ├── templates/                  # SaaSテンプレート
│   │   ├── basic-template.md
│   │   └── ai-powered-template.md
│   ├── examples/                   # 生成例
│   │   ├── contract-ai-reviewer.md
│   │   └── value-compass.md
│   └── design-patterns/            # 設計パターン
│       ├── ui-patterns.md
│       └── monetization-patterns.md
│
├── 03-dao-community/               # 👥 DAO・コミュニティ
│   ├── governance/                 # ガバナンス（現在のgovernance/）
│   ├── tokenomics/                 # トークノミクス
│   ├── contribution-guide/         # 貢献ガイド
│   └── rewards/                    # 報酬システム
│
├── 04-development/                 # 💻 開発者向け
│   ├── setup/                      # 環境構築（現在のsetup/）
│   ├── testing/                    # テスト
│   ├── deployment/                 # デプロイ
│   └── best-practices/             # ベストプラクティス
│
├── 05-operations/                  # 🔧 運用
│   ├── monitoring/                 # 監視
│   ├── analytics/                  # 分析
│   ├── optimization/               # 最適化
│   └── troubleshooting/            # トラブルシューティング
│
└── 99-archives/                    # 📦 アーカイブ
    ├── legacy/                     # 古いドキュメント
    └── deprecated/                 # 非推奨
```

### Option B: ペルソナ・思い込み破綻中心型
```
docs/
├── 00-philosophy/                  # 🧠 理念・哲学
│   ├── VISION.md                   # ビジョン
│   ├── persona-first-approach.md   # ペルソナファースト
│   └── assumption-breaking.md      # 思い込み破綻思想
│
├── 01-persona-driven/              # 👤 ペルソナ起点
│   ├── personas/                   # ペルソナ定義
│   │   ├── freelancer-designer.md
│   │   ├── small-team-legal.md
│   │   └── [その他ペルソナ]
│   ├── assumptions/                # 思い込みカタログ
│   │   ├── ai-distrust.md
│   │   ├── tool-complexity.md
│   │   └── [その他思い込み]
│   └── breaking-process/           # 破綻プロセス
│       ├── observation.md
│       ├── detection.md
│       └── solution-design.md
│
├── 02-system/                      # 🏗️ システム
│   ├── core/                       # 中核システム
│   │   ├── architecture/
│   │   ├── ui/
│   │   └── api/
│   └── generated/                  # 生成SaaS
│       ├── templates/
│       └── examples/
│
├── 03-execution/                   # ⚡ 実行
│   ├── development/                # 開発
│   ├── deployment/                 # デプロイ
│   ├── operations/                 # 運用
│   └── optimization/               # 最適化
│
├── 04-community/                   # 👥 コミュニティ
│   ├── dao/                        # DAO
│   ├── contribution/               # 貢献
│   └── rewards/                    # 報酬
│
└── 99-resources/                   # 📚 リソース
    ├── guides/                     # ガイド
    ├── references/                 # リファレンス
    └── archives/                   # アーカイブ
```

### Option C: 利用者別整理型（推奨）
```
docs/
├── README.md                       # 🏠 ドキュメントホーム
├── QUICKSTART.md                   # 🚀 クイックスタート
│
├── for-operators/                  # 👨‍💼 UnsonOS運営者向け
│   ├── persona-observation/        # ペルソナ観察
│   ├── assumption-breaking/        # 思い込み破綻
│   ├── service-generation/         # サービス生成
│   ├── revenue-management/         # 収益管理
│   └── dashboard-ui/               # 管理UI（現在のui/）
│
├── for-developers/                 # 👩‍💻 開発者向け
│   ├── getting-started/            # 開始方法
│   ├── core-system/                # 中核システム開発
│   ├── saas-templates/             # SaaSテンプレート開発
│   ├── testing/                    # テスト
│   └── deployment/                 # デプロイ
│
├── for-community/                  # 🌍 コミュニティ向け
│   ├── dao-governance/             # DAOガバナンス
│   ├── contribution-guide/         # 貢献方法
│   ├── reward-system/              # 報酬システム
│   └── proposals/                  # 提案
│
├── for-saas-users/                 # 👤 生成SaaSエンドユーザー向け
│   ├── service-catalog/            # サービスカタログ
│   ├── user-guides/                # 利用ガイド
│   └── support/                    # サポート
│
├── system-design/                  # 🏗️ システム設計
│   ├── architecture/               # アーキテクチャ
│   ├── persona-framework/          # ペルソナフレームワーク
│   ├── assumption-framework/       # 思い込み破綻フレームワーク
│   └── technical-specs/            # 技術仕様
│
├── business-strategy/              # 📈 ビジネス戦略
│   ├── market-analysis/            # 市場分析
│   ├── revenue-model/              # 収益モデル
│   ├── growth-strategy/            # 成長戦略
│   └── metrics/                    # メトリクス
│
└── resources/                      # 📚 リソース
    ├── glossary/                   # 用語集
    ├── faq/                        # FAQ
    ├── changelog/                  # 変更履歴
    └── archives/                   # アーカイブ
```

---

## 🔄 マイグレーション計画

### Phase 1: 即座に実行可能（1日）
```bash
# 1. 新構造の骨格作成
mkdir -p docs/for-operators/persona-observation
mkdir -p docs/for-developers/getting-started
mkdir -p docs/for-community/dao-governance
mkdir -p docs/system-design/persona-framework

# 2. READMEでナビゲーション強化
echo "ドキュメントナビゲーション" > docs/README.md
```

### Phase 2: 既存ファイル整理（1週間）
```
移動計画:
docs/ui/* → docs/for-operators/dashboard-ui/
docs/governance/* → docs/for-community/dao-governance/
docs/technical/* → docs/system-design/technical-specs/
docs/development/* → docs/for-developers/
docs/strategy/* → docs/business-strategy/
```

### Phase 3: 新規ドキュメント作成（2週間）
優先作成リスト:
1. for-operators/persona-observation/GUIDE.md
2. for-operators/assumption-breaking/PROCESS.md
3. system-design/persona-framework/DEFINITION.md
4. for-developers/getting-started/QUICKSTART.md

---

## 📊 評価基準

### 良い構造の条件
- ✅ 利用者が迷わない（3クリック以内で目的のドキュメントへ）
- ✅ 中核システムと生成SaaSが明確に分離
- ✅ ペルソナ起点の思い込み破綻プロセスが中心
- ✅ 新規参加者がすぐに貢献開始できる

### 成功指標
- ドキュメント検索時間: 30秒以内
- 新規参加者のオンボーディング: 30分以内
- ドキュメント重複率: 5%以下

---

## 🎯 推奨案

**Option C（利用者別整理型）を推奨します。**

理由:
1. **明確な対象**: 誰向けのドキュメントか一目瞭然
2. **ペルソナ思想の反映**: for-operators/にペルソナ観察を配置
3. **スケーラブル**: 将来の拡張に対応しやすい
4. **実用的**: 利用者は自分に必要な情報にすぐアクセス可能

---

## 📝 次のアクション

1. **合意形成**: チームでOption A/B/Cから選択
2. **移行計画確定**: 選択した構造への移行スケジュール決定
3. **実行開始**: Phase 1から順次実施
4. **ドキュメント更新**: 各ファイルのパスを新構造に合わせて更新