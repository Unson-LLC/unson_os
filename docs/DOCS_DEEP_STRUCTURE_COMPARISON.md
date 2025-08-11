# docs/ フォルダ深層構造比較

## Option A: 二層アーキテクチャ明確化型（詳細版）

```
docs/
├── 00-overview/
│   ├── README.md                           # ドキュメント全体ガイド
│   ├── ARCHITECTURE_OVERVIEW.md            # システム全体像
│   ├── ROADMAP.md                          # ロードマップ
│   └── quickstart/
│       ├── for-developers.md
│       ├── for-operators.md
│       └── for-contributors.md
│
├── 01-core-system/                         # 🏗️ UnsonOS本体
│   ├── persona-engine/
│   │   ├── concepts/
│   │   │   ├── persona-definition.md       # ペルソナとは
│   │   │   ├── observation-methodology.md  # 観察手法
│   │   │   └── data-collection.md         # データ収集方法
│   │   ├── implementation/
│   │   │   ├── observation-api.md         # 観察API仕様
│   │   │   ├── behavior-tracking.md       # 行動追跡実装
│   │   │   └── pattern-recognition.md     # パターン認識
│   │   ├── personas/                      # 具体的ペルソナ
│   │   │   ├── freelancer-designer.md
│   │   │   ├── small-team-legal.md
│   │   │   └── startup-founder.md
│   │   └── examples/
│   │       └── tanaka-satomi-case.md      # 田中さとみケース
│   │
│   ├── assumption-breaker/
│   │   ├── theory/
│   │   │   ├── assumption-types.md        # 思い込みの分類
│   │   │   ├── breaking-strategies.md     # 破綻戦略
│   │   │   └── validation-methods.md      # 検証方法
│   │   ├── detection/
│   │   │   ├── signal-processing.md       # シグナル処理
│   │   │   ├── assumption-scoring.md      # 思い込み強度算出
│   │   │   └── breaking-possibility.md    # 破綻可能性計算
│   │   ├── catalog/                       # 思い込みカタログ
│   │   │   ├── ai-distrust/
│   │   │   │   ├── description.md
│   │   │   │   ├── detection-signals.md
│   │   │   │   └── breaking-approach.md
│   │   │   ├── tool-complexity/
│   │   │   │   └── [同様の構造]
│   │   │   └── price-sensitivity/
│   │   │       └── [同様の構造]
│   │   └── case-studies/
│   │       ├── successful-breaks.md
│   │       └── failed-attempts.md
│   │
│   ├── service-generator/
│   │   ├── pipeline/
│   │   │   ├── stage-0-detection.md       # ステージ0: 検知
│   │   │   ├── stage-1-lp-creation.md     # ステージ1: LP作成
│   │   │   ├── stage-2-mvp-dev.md         # ステージ2: MVP開発
│   │   │   ├── stage-3-monetization.md    # ステージ3: 課金
│   │   │   └── stage-4-scaling.md         # ステージ4: 拡張
│   │   ├── gates/                         # ゲート判定
│   │   │   ├── gate-1-lp-validation.md
│   │   │   ├── gate-2-mvp-validation.md
│   │   │   ├── gate-3-revenue-validation.md
│   │   │   └── gate-criteria-details.md
│   │   ├── automation/
│   │   │   ├── ai-agents.md               # AIエージェント設計
│   │   │   ├── human-checkpoints.md       # 人間介入ポイント
│   │   │   └── feedback-loops.md          # フィードバックループ
│   │   └── templates/
│   │       ├── lp-templates/
│   │       ├── mvp-templates/
│   │       └── deployment-templates/
│   │
│   ├── ui-admin/                          # 管理UI
│   │   ├── design/
│   │   │   ├── unson-os-mvp-storyboard.md
│   │   │   ├── product-generation-flow-ui.md
│   │   │   ├── revenue-analytics-ui.md
│   │   │   └── enhanced-flow-v3.md
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── persona-viewer/
│   │   │   ├── assumption-analyzer/
│   │   │   └── revenue-tracker/
│   │   └── implementation/
│   │       ├── frontend-stack.md
│   │       └── state-management.md
│   │
│   └── infrastructure/
│       ├── architecture/
│       │   ├── system-design.md
│       │   ├── database-schema.md
│       │   └── api-design.md
│       ├── deployment/
│       │   ├── vercel-config.md
│       │   ├── convex-setup.md
│       │   └── ci-cd-pipeline.md
│       └── monitoring/
│           ├── metrics-collection.md
│           ├── alerting-rules.md
│           └── performance-optimization.md
│
├── 02-generated-saas/                     # 🚀 生成されるSaaS
│   ├── framework/
│   │   ├── saas-lifecycle.md              # SaaSライフサイクル
│   │   ├── template-architecture.md       # テンプレート設計
│   │   └── customization-guide.md         # カスタマイズガイド
│   │
│   ├── templates/
│   │   ├── basic-saas/
│   │   │   ├── structure/
│   │   │   │   ├── frontend/
│   │   │   │   ├── backend/
│   │   │   │   └── database/
│   │   │   ├── features/
│   │   │   │   ├── authentication.md
│   │   │   │   ├── payment.md
│   │   │   │   └── core-functionality.md
│   │   │   └── deployment/
│   │   │       └── deployment-guide.md
│   │   ├── ai-powered-saas/
│   │   │   └── [同様の構造]
│   │   └── marketplace-saas/
│   │       └── [同様の構造]
│   │
│   ├── active-services/                   # 稼働中サービス
│   │   ├── contract-ai-reviewer/
│   │   │   ├── SERVICE_MANIFEST.json
│   │   │   ├── persona-target.md
│   │   │   ├── assumption-broken.md
│   │   │   ├── implementation/
│   │   │   ├── metrics/
│   │   │   └── revenue-report.md
│   │   └── value-compass/
│   │       └── [同様の構造]
│   │
│   └── incubating/                        # 孵化中サービス
│       └── [LP検証中のサービス]
│
├── 03-dao-community/                      # 👥 DAO・コミュニティ
│   ├── governance/
│   │   ├── structure/
│   │   │   ├── dao-constitution.md
│   │   │   ├── voting-mechanism.md
│   │   │   └── proposal-process.md
│   │   ├── roles/
│   │   │   ├── curator.md
│   │   │   ├── craftsman.md
│   │   │   └── supporter.md
│   │   └── decisions/
│   │       └── [過去の決定事項]
│   │
│   ├── tokenomics/
│   │   ├── token-design.md
│   │   ├── distribution-model.md
│   │   ├── revenue-sharing.md             # 45-15-40モデル
│   │   └── vesting-schedule.md
│   │
│   └── contribution/
│       ├── how-to-contribute.md
│       ├── contribution-tracking.md
│       └── reward-calculation.md
│
├── 04-development/                        # 💻 開発
│   ├── getting-started/
│   │   ├── prerequisites.md
│   │   ├── environment-setup.md
│   │   ├── first-contribution.md
│   │   └── development-workflow.md
│   │
│   ├── guides/
│   │   ├── core-development/
│   │   │   ├── persona-engine-dev.md
│   │   │   ├── assumption-breaker-dev.md
│   │   │   └── generator-dev.md
│   │   ├── saas-development/
│   │   │   ├── template-creation.md
│   │   │   ├── feature-implementation.md
│   │   │   └── testing-strategy.md
│   │   └── integration/
│   │       ├── api-integration.md
│   │       └── third-party-services.md
│   │
│   └── testing/
│       ├── unit-testing.md
│       ├── integration-testing.md
│       ├── e2e-testing.md
│       └── performance-testing.md
│
├── 05-operations/                         # 🔧 運用
│   ├── playbooks/
│   │   ├── incident-response.md
│   │   ├── scaling-procedures.md
│   │   └── maintenance-windows.md
│   │
│   ├── monitoring/
│   │   ├── dashboards/
│   │   ├── alerts/
│   │   └── sla-tracking/
│   │
│   └── analytics/
│       ├── persona-analytics.md
│       ├── assumption-analytics.md
│       └── revenue-analytics.md
│
└── 99-archives/                           # 📦 アーカイブ
    ├── deprecated/
    ├── legacy/
    └── experiments/
```

## Option B: ペルソナ・思い込み破綻中心型（詳細版）

```
docs/
├── 00-philosophy/                         # 🧠 理念・哲学
│   ├── core-beliefs/
│   │   ├── VISION.md
│   │   ├── MISSION.md
│   │   └── VALUES.md
│   │
│   ├── persona-first/
│   │   ├── why-persona-first.md           # なぜペルソナファーストか
│   │   ├── persona-philosophy.md          # ペルソナ哲学
│   │   └── observation-principles.md      # 観察原則
│   │
│   └── assumption-breaking/
│       ├── theory-of-assumptions.md       # 思い込み理論
│       ├── breaking-methodology.md        # 破綻方法論
│       └── value-creation-process.md      # 価値創造プロセス
│
├── 01-personas/                           # 👤 ペルソナ
│   ├── methodology/
│   │   ├── persona-creation.md            # ペルソナ作成法
│   │   ├── observation-techniques.md      # 観察技法
│   │   ├── behavior-analysis.md           # 行動分析
│   │   └── pattern-extraction.md          # パターン抽出
│   │
│   ├── archetypes/                        # ペルソナ原型
│   │   ├── freelancers/
│   │   │   ├── designer-satomi/
│   │   │   │   ├── profile.md
│   │   │   │   ├── daily-routine.md
│   │   │   │   ├── pain-points.md
│   │   │   │   ├── assumptions.md
│   │   │   │   └── opportunities.md
│   │   │   ├── developer-taro/
│   │   │   │   └── [同様の構造]
│   │   │   └── consultant-yuki/
│   │   │       └── [同様の構造]
│   │   │
│   │   ├── small-teams/
│   │   │   ├── legal-absent-team/
│   │   │   │   ├── team-profile.md
│   │   │   │   ├── workflow-issues.md
│   │   │   │   ├── assumptions.md
│   │   │   │   └── solutions.md
│   │   │   └── marketing-team/
│   │   │       └── [同様の構造]
│   │   │
│   │   └── enterprises/
│   │       └── [大企業ペルソナ]
│   │
│   ├── observations/                      # 観察記録
│   │   ├── real-time/
│   │   │   ├── current-observations.md
│   │   │   └── behavior-logs/
│   │   ├── historical/
│   │   │   ├── 2025-q1/
│   │   │   └── 2025-q2/
│   │   └── insights/
│   │       ├── emerging-patterns.md
│   │       └── trend-analysis.md
│   │
│   └── persona-db/                        # ペルソナDB
│       ├── schema.md
│       ├── queries.md
│       └── maintenance.md
│
├── 02-assumptions/                        # 💭 思い込み
│   ├── framework/
│   │   ├── assumption-lifecycle.md        # 思い込みライフサイクル
│   │   ├── detection-framework.md         # 検知フレームワーク
│   │   ├── validation-framework.md        # 検証フレームワーク
│   │   └── breaking-framework.md          # 破綻フレームワーク
│   │
│   ├── catalog/                           # 思い込みカタログ
│   │   ├── by-domain/                     # ドメイン別
│   │   │   ├── technology/
│   │   │   │   ├── ai-is-dangerous/
│   │   │   │   │   ├── assumption.md
│   │   │   │   │   ├── evidence.md
│   │   │   │   │   ├── counter-evidence.md
│   │   │   │   │   ├── breaking-strategy.md
│   │   │   │   │   └── success-cases.md
│   │   │   │   ├── tools-must-be-complex/
│   │   │   │   │   └── [同様の構造]
│   │   │   │   └── automation-replaces-jobs/
│   │   │   │       └── [同様の構造]
│   │   │   │
│   │   │   ├── business/
│   │   │   │   ├── must-have-office/
│   │   │   │   ├── need-large-team/
│   │   │   │   └── expensive-is-better/
│   │   │   │
│   │   │   └── lifestyle/
│   │   │       ├── work-life-balance/
│   │   │       └── career-progression/
│   │   │
│   │   ├── by-intensity/                  # 強度別
│   │   │   ├── deep-rooted/              # 根深い
│   │   │   ├── moderate/                 # 中程度
│   │   │   └── surface-level/            # 表層的
│   │   │
│   │   └── by-breakability/              # 破綻可能性別
│   │       ├── easy-to-break/
│   │       ├── challenging/
│   │       └── nearly-impossible/
│   │
│   ├── detection/                         # 検知
│   │   ├── signals/
│   │   │   ├── behavioral-signals.md
│   │   │   ├── verbal-signals.md
│   │   │   └── data-signals.md
│   │   ├── algorithms/
│   │   │   ├── signal-processing.md
│   │   │   ├── pattern-matching.md
│   │   │   └── scoring-logic.md
│   │   └── tools/
│   │       ├── detection-dashboard.md
│   │       └── monitoring-setup.md
│   │
│   └── breaking/                          # 破綻
│       ├── strategies/
│       │   ├── gradual-exposure.md        # 段階的露出
│       │   ├── proof-by-example.md        # 実例証明
│       │   ├── peer-influence.md          # 仲間の影響
│       │   └── experiential-learning.md   # 体験学習
│       ├── tactics/
│       │   ├── messaging/
│       │   ├── pricing/
│       │   └── feature-design/
│       └── measurement/
│           ├── breaking-metrics.md
│           └── success-criteria.md
│
├── 03-value-creation/                     # 💎 価値創造
│   ├── process/
│   │   ├── persona-to-assumption.md       # ペルソナ→思い込み
│   │   ├── assumption-to-solution.md      # 思い込み→解決策
│   │   ├── solution-to-service.md         # 解決策→サービス
│   │   └── service-to-revenue.md          # サービス→収益
│   │
│   ├── pipeline/
│   │   ├── stage-0-observation/
│   │   ├── stage-1-detection/
│   │   ├── stage-2-validation/
│   │   ├── stage-3-creation/
│   │   └── stage-4-scaling/
│   │
│   └── optimization/
│       ├── conversion-optimization.md
│       ├── retention-optimization.md
│       └── revenue-optimization.md
│
├── 04-system/                             # 🏗️ システム
│   ├── core/
│   │   ├── architecture/
│   │   ├── components/
│   │   └── infrastructure/
│   │
│   └── generated/
│       ├── templates/
│       └── services/
│
├── 05-execution/                          # ⚡ 実行
│   ├── development/
│   ├── deployment/
│   └── operations/
│
├── 06-community/                          # 👥 コミュニティ
│   ├── dao/
│   ├── contribution/
│   └── rewards/
│
└── 99-resources/                          # 📚 リソース
    ├── guides/
    ├── references/
    └── archives/
```

## Option C: 利用者別整理型（詳細版）

```
docs/
├── README.md                              # 🏠 ドキュメントホーム
├── QUICKSTART.md                          # 🚀 クイックスタート
├── NAVIGATION.md                          # 🗺️ ナビゲーションガイド
│
├── for-operators/                         # 👨‍💼 UnsonOS運営者向け
│   ├── getting-started/
│   │   ├── operator-onboarding.md         # 運営者オンボーディング
│   │   ├── daily-workflow.md              # 日次ワークフロー
│   │   ├── tools-and-access.md           # ツールとアクセス権
│   │   └── first-week-checklist.md       # 初週チェックリスト
│   │
│   ├── persona-observation/               # ペルソナ観察
│   │   ├── guide/
│   │   │   ├── observation-basics.md      # 観察の基本
│   │   │   ├── data-collection.md         # データ収集方法
│   │   │   ├── pattern-recognition.md     # パターン認識
│   │   │   └── insight-extraction.md      # インサイト抽出
│   │   ├── personas/
│   │   │   ├── active/                    # アクティブペルソナ
│   │   │   │   ├── tanaka-satomi/
│   │   │   │   │   ├── profile.md
│   │   │   │   │   ├── behaviors.md
│   │   │   │   │   ├── assumptions.md
│   │   │   │   │   └── opportunities.md
│   │   │   │   └── [他のアクティブペルソナ]
│   │   │   ├── potential/                 # ポテンシャルペルソナ
│   │   │   └── archived/                  # アーカイブ済み
│   │   ├── tools/
│   │   │   ├── observation-dashboard.md   # 観察ダッシュボード
│   │   │   ├── behavior-tracker.md        # 行動トラッカー
│   │   │   └── insight-generator.md       # インサイト生成
│   │   └── reports/
│   │       ├── weekly/                    # 週次レポート
│   │       └── monthly/                   # 月次レポート
│   │
│   ├── assumption-breaking/               # 思い込み破綻
│   │   ├── process/
│   │   │   ├── detection-process.md       # 検知プロセス
│   │   │   ├── validation-process.md      # 検証プロセス
│   │   │   ├── breaking-process.md        # 破綻プロセス
│   │   │   └── measurement-process.md     # 測定プロセス
│   │   ├── assumptions/
│   │   │   ├── active/                    # 取り組み中
│   │   │   │   ├── ai-distrust/
│   │   │   │   │   ├── hypothesis.md
│   │   │   │   │   ├── validation-plan.md
│   │   │   │   │   ├── experiments.md
│   │   │   │   │   └── results.md
│   │   │   │   └── [他の思い込み]
│   │   │   ├── validated/                 # 検証済み
│   │   │   └── rejected/                  # 棄却済み
│   │   ├── strategies/
│   │   │   ├── breaking-patterns.md       # 破綻パターン
│   │   │   ├── messaging-tactics.md       # メッセージング戦術
│   │   │   └── conversion-tactics.md      # コンバージョン戦術
│   │   └── metrics/
│   │       ├── assumption-strength.md     # 思い込み強度
│   │       ├── breaking-possibility.md    # 破綻可能性
│   │       └── success-rate.md           # 成功率
│   │
│   ├── service-generation/                # サービス生成
│   │   ├── pipeline/
│   │   │   ├── stage-0/                   # アイデア発見
│   │   │   │   ├── process.md
│   │   │   │   ├── criteria.md
│   │   │   │   └── tools.md
│   │   │   ├── stage-1/                   # LP作成
│   │   │   │   ├── lp-generation.md
│   │   │   │   ├── a-b-testing.md
│   │   │   │   └── gate-criteria.md
│   │   │   ├── stage-2/                   # MVP開発
│   │   │   │   ├── mvp-planning.md
│   │   │   │   ├── development.md
│   │   │   │   └── validation.md
│   │   │   ├── stage-3/                   # 収益化
│   │   │   │   ├── pricing-strategy.md
│   │   │   │   ├── payment-setup.md
│   │   │   │   └── conversion-optimization.md
│   │   │   └── stage-4/                   # スケーリング
│   │   │       ├── growth-tactics.md
│   │   │       ├── automation.md
│   │   │       └── optimization.md
│   │   ├── gates/                         # ゲート管理
│   │   │   ├── gate-1-lp.md
│   │   │   ├── gate-2-mvp.md
│   │   │   ├── gate-3-revenue.md
│   │   │   └── decision-framework.md
│   │   └── services/
│   │       ├── active/                    # 稼働中
│   │       ├── incubating/               # 孵化中
│   │       └── archived/                 # 終了済み
│   │
│   ├── revenue-management/                # 収益管理
│   │   ├── tracking/
│   │   │   ├── revenue-dashboard.md
│   │   │   ├── service-metrics.md
│   │   │   └── portfolio-analysis.md
│   │   ├── optimization/
│   │   │   ├── pricing-optimization.md
│   │   │   ├── churn-reduction.md
│   │   │   └── ltv-improvement.md
│   │   └── reporting/
│   │       ├── daily-reports.md
│   │       ├── weekly-reports.md
│   │       └── monthly-reports.md
│   │
│   └── dashboard-ui/                      # 管理UI
│       ├── designs/
│       │   ├── storyboard.md
│       │   ├── flow-diagrams.md
│       │   └── wireframes/
│       ├── components/
│       │   ├── persona-viewer/
│       │   ├── assumption-analyzer/
│       │   ├── service-monitor/
│       │   └── revenue-tracker/
│       └── usage-guide/
│           ├── navigation.md
│           ├── features.md
│           └── troubleshooting.md
│
├── for-developers/                        # 👩‍💻 開発者向け
│   ├── getting-started/
│   │   ├── prerequisites.md               # 前提条件
│   │   ├── environment-setup/
│   │   │   ├── macos-setup.md
│   │   │   ├── windows-setup.md
│   │   │   └── linux-setup.md
│   │   ├── first-contribution/
│   │   │   ├── find-an-issue.md
│   │   │   ├── make-changes.md
│   │   │   └── submit-pr.md
│   │   └── development-workflow.md
│   │
│   ├── core-system/                       # 中核システム開発
│   │   ├── architecture/
│   │   │   ├── system-overview.md
│   │   │   ├── component-design.md
│   │   │   └── data-flow.md
│   │   ├── persona-engine/
│   │   │   ├── api-reference.md
│   │   │   ├── implementation-guide.md
│   │   │   └── testing-guide.md
│   │   ├── assumption-breaker/
│   │   │   ├── algorithm-docs.md
│   │   │   ├── integration-guide.md
│   │   │   └── optimization-guide.md
│   │   ├── service-generator/
│   │   │   ├── generator-api.md
│   │   │   ├── template-system.md
│   │   │   └── deployment-automation.md
│   │   └── database/
│   │       ├── schema-design.md
│   │       ├── migration-guide.md
│   │       └── query-optimization.md
│   │
│   ├── saas-templates/                    # SaaSテンプレート開発
│   │   ├── creating-templates/
│   │   │   ├── template-structure.md
│   │   │   ├── required-features.md
│   │   │   └── best-practices.md
│   │   ├── existing-templates/
│   │   │   ├── basic-saas/
│   │   │   │   ├── README.md
│   │   │   │   ├── customization.md
│   │   │   │   └── deployment.md
│   │   │   ├── ai-powered/
│   │   │   └── marketplace/
│   │   └── template-testing/
│   │       ├── test-framework.md
│   │       └── validation-checklist.md
│   │
│   ├── testing/                           # テスト
│   │   ├── strategy/
│   │   │   ├── test-pyramid.md
│   │   │   └── coverage-goals.md
│   │   ├── unit-tests/
│   │   │   ├── writing-tests.md
│   │   │   └── mocking-guide.md
│   │   ├── integration-tests/
│   │   │   ├── api-testing.md
│   │   │   └── database-testing.md
│   │   ├── e2e-tests/
│   │   │   ├── playwright-guide.md
│   │   │   └── test-scenarios.md
│   │   └── performance/
│   │       ├── load-testing.md
│   │       └── optimization-guide.md
│   │
│   ├── deployment/                        # デプロイ
│   │   ├── environments/
│   │   │   ├── development.md
│   │   │   ├── staging.md
│   │   │   └── production.md
│   │   ├── ci-cd/
│   │   │   ├── github-actions.md
│   │   │   ├── deployment-pipeline.md
│   │   │   └── rollback-procedures.md
│   │   └── infrastructure/
│   │       ├── vercel-config.md
│   │       ├── convex-setup.md
│   │       └── monitoring-setup.md
│   │
│   └── api-reference/                     # APIリファレンス
│       ├── rest-api/
│       │   ├── authentication.md
│       │   ├── endpoints/
│       │   └── error-codes.md
│       ├── graphql/
│       │   ├── schema.md
│       │   └── queries-mutations.md
│       └── webhooks/
│           ├── event-types.md
│           └── payload-formats.md
│
├── for-community/                         # 🌍 コミュニティ向け
│   ├── welcome/
│   │   ├── community-intro.md             # コミュニティ紹介
│   │   ├── values-and-culture.md          # 価値観と文化
│   │   ├── code-of-conduct.md             # 行動規範
│   │   └── getting-involved.md            # 参加方法
│   │
│   ├── dao-governance/                    # DAOガバナンス
│   │   ├── structure/
│   │   │   ├── dao-overview.md
│   │   │   ├── roles-responsibilities.md
│   │   │   └── decision-making.md
│   │   ├── proposals/
│   │   │   ├── how-to-propose.md
│   │   │   ├── proposal-template.md
│   │   │   ├── active/                   # 進行中の提案
│   │   │   ├── voting/                   # 投票中
│   │   │   └── completed/                # 完了済み
│   │   └── treasury/
│   │       ├── fund-management.md
│   │       └── budget-allocation.md
│   │
│   ├── contribution-guide/                # 貢献ガイド
│   │   ├── ways-to-contribute/
│   │   │   ├── code-contributions.md
│   │   │   ├── documentation.md
│   │   │   ├── design-contributions.md
│   │   │   ├── community-building.md
│   │   │   └── idea-sharing.md
│   │   ├── contribution-process/
│   │   │   ├── getting-started.md
│   │   │   ├── submission-guidelines.md
│   │   │   └── review-process.md
│   │   └── recognition/
│   │       ├── contributor-levels.md
│   │       └── hall-of-fame.md
│   │
│   ├── reward-system/                     # 報酬システム
│   │   ├── tokenomics/
│   │   │   ├── token-design.md           # トークン設計
│   │   │   ├── distribution-model.md      # 45-15-40モデル
│   │   │   └── vesting-schedule.md        # ベスティング
│   │   ├── earning/
│   │   │   ├── contribution-rewards.md
│   │   │   ├── staking-rewards.md
│   │   │   └── bonus-programs.md
│   │   └── claiming/
│   │       ├── how-to-claim.md
│   │       └── tax-considerations.md
│   │
│   └── community-resources/               # コミュニティリソース
│       ├── events/
│       │   ├── upcoming-events.md
│       │   └── past-events/
│       ├── education/
│       │   ├── workshops/
│       │   └── tutorials/
│       └── support/
│           ├── faq.md
│           ├── help-channels.md
│           └── mentorship.md
│
├── for-saas-users/                       # 👤 生成SaaSエンドユーザー向け
│   ├── service-catalog/                   # サービスカタログ
│   │   ├── by-category/
│   │   │   ├── productivity/
│   │   │   ├── ai-tools/
│   │   │   └── business/
│   │   ├── by-persona/
│   │   │   ├── freelancers/
│   │   │   ├── small-teams/
│   │   │   └── enterprises/
│   │   └── all-services/
│   │       ├── [service-name]/
│   │       │   ├── overview.md
│   │       │   ├── features.md
│   │       │   ├── pricing.md
│   │       │   └── getting-started.md
│   │       └── [その他サービス]
│   │
│   ├── user-guides/                       # 利用ガイド
│   │   ├── common/
│   │   │   ├── account-creation.md
│   │   │   ├── subscription-management.md
│   │   │   └── billing.md
│   │   └── service-specific/
│   │       └── [各サービス固有ガイド]
│   │
│   └── support/                           # サポート
│       ├── help-center/
│       │   ├── faq.md
│       │   └── troubleshooting/
│       ├── contact/
│       │   ├── support-channels.md
│       │   └── response-times.md
│       └── feedback/
│           ├── feature-requests.md
│           └── bug-reports.md
│
├── system-design/                         # 🏗️ システム設計
│   ├── architecture/
│   │   ├── high-level-design.md
│   │   ├── detailed-design/
│   │   └── design-decisions/
│   │
│   ├── persona-framework/                 # ペルソナフレームワーク
│   │   ├── theoretical-foundation.md
│   │   ├── implementation-design.md
│   │   └── evolution-strategy.md
│   │
│   ├── assumption-framework/              # 思い込み破綻フレームワーク
│   │   ├── conceptual-model.md
│   │   ├── detection-algorithms.md
│   │   └── breaking-strategies.md
│   │
│   └── technical-specs/                   # 技術仕様
│       ├── api-specifications/
│       ├── database-schemas/
│       └── integration-specs/
│
├── business-strategy/                     # 📈 ビジネス戦略
│   ├── market-analysis/
│   │   ├── target-markets.md
│   │   ├── competitive-analysis.md
│   │   └── market-opportunities.md
│   │
│   ├── revenue-model/
│   │   ├── pricing-strategy.md
│   │   ├── revenue-streams.md
│   │   └── financial-projections.md
│   │
│   ├── growth-strategy/
│   │   ├── acquisition-channels.md
│   │   ├── retention-tactics.md
│   │   └── expansion-plans.md
│   │
│   └── metrics/
│       ├── kpi-definitions.md
│       ├── tracking-methodology.md
│       └── reporting-cadence.md
│
└── resources/                             # 📚 リソース
    ├── glossary/                          # 用語集
    │   ├── technical-terms.md
    │   ├── business-terms.md
    │   └── unsonos-specific.md
    │
    ├── faq/                               # FAQ
    │   ├── general-faq.md
    │   ├── technical-faq.md
    │   └── business-faq.md
    │
    ├── changelog/                         # 変更履歴
    │   ├── 2025/
    │   └── release-notes.md
    │
    ├── templates/                         # テンプレート
    │   ├── document-template.md
    │   ├── proposal-template.md
    │   └── report-template.md
    │
    └── archives/                          # アーカイブ
        ├── deprecated/
        ├── legacy/
        └── experiments/
```

---

## 📊 比較評価

### 評価基準と採点（5点満点）

| 評価項目 | Option A | Option B | Option C |
|---------|----------|----------|----------|
| **ペルソナ・思い込み破綻の明確性** | 3点 | 5点 | 4点 |
| **利用者の迷いにくさ** | 3点 | 3点 | 5点 |
| **中核システムvs生成SaaSの分離** | 5点 | 3点 | 4点 |
| **スケーラビリティ** | 4点 | 4点 | 5点 |
| **既存ファイルの移行容易性** | 4点 | 2点 | 5点 |
| **新規参加者の理解しやすさ** | 3点 | 3点 | 5点 |
| **100個のSaaS管理適性** | 4点 | 3点 | 4点 |
| **合計** | **26点** | **23点** | **32点** |

### 各オプションの特徴

**Option A: 二層アーキテクチャ明確化型**
- ✅ 技術的に最も整理されている
- ✅ 中核システムと生成SaaSの境界が明確
- ❌ ペルソナ・思い込み破綻が埋もれがち
- ❌ 番号プレフィックスが機械的

**Option B: ペルソナ・思い込み破綻中心型**
- ✅ UnsonOSの哲学が最も明確
- ✅ ペルソナファーストが構造に反映
- ❌ 実装詳細へのパスが長い
- ❌ 既存ファイルの配置が難しい

**Option C: 利用者別整理型**
- ✅ 誰向けか一目瞭然で迷わない
- ✅ 各利用者に最適化された構造
- ✅ 既存ファイルの移行が自然
- ✅ スケーラブルで拡張しやすい
- ❌ 若干冗長な部分がある

---

## 🎯 推奨

深い階層まで検討した結果、**Option C（利用者別整理型）**が最適です。

### 決定的な理由

1. **実用性**: `for-operators/persona-observation/`のように、誰が何をするかが明確
2. **ペルソナ中心の反映**: 運営者向けセクションにペルソナ観察と思い込み破綻を適切に配置
3. **段階的移行が可能**: 既存ファイルを自然に配置でき、混乱なく移行可能
4. **将来の拡張性**: 100個のSaaS管理時も`for-saas-users/service-catalog/`で整理可能

### 実装優先順位

1. **即実施**（今日）
   - `for-operators/`、`for-developers/`、`for-community/`の基本構造作成
   
2. **1週間以内**
   - 既存ファイルの移動
   - READMEによるナビゲーション強化
   
3. **2週間以内**
   - ペルソナ観察ガイドの作成
   - 思い込み破綻プロセスのドキュメント化