# プレイブック駆動型構造 実装状況

## 完了項目 ✅

### 1. 基盤構築
- [x] **移行計画作成** (`/MIGRATION_PLAN.md`)
- [x] **プレイブック定義ディレクトリ** (`/docs/playbooks/`)
  - README.md（概要・命名規則・使用方法）
  - pb-001-lp-cvr-test.md（詳細手順・成功基準）
- [x] **テンプレート作成** (`/products/template/`)
  - product.yaml（プロダクト基本情報）
  - phases/01_LP_Validation/PhaseReview.md
  - phases/01_LP_Validation/PB001_CVR_Test/PlaybookLog.md
  - phases/01_LP_Validation/PB001_CVR_Test/ResultSummary.md

### 2. 実プロダクトの移行（全6プロダクト完了）
- [x] **MyWa** → `products/active/2025-08-001-mywa/`
  - 本番運用中プロダクトとして移行完了
  - LP検証フェーズの履歴を復元
- [x] **AI世代間ブリッジ** → `products/validation/2025-08-002-ai-bridge/`
  - LP検証中プロダクトとして配置済み
- [x] **AI自分時間コーチ** → `products/validation/2025-08-003-ai-coach/`
  - LP検証中プロダクトとして配置済み
- [x] **AIレガシー・クリエーター** → `products/validation/2025-08-004-ai-legacy-creator/`
  - LP検証中プロダクトとして配置済み
- [x] **AIパーソナルスタイリスト** → `products/validation/2025-08-005-ai-stylist/`
  - LP検証中プロダクトとして配置済み
- [x] **わたしコンパス** → `products/validation/2025-08-006-watashi-compass/`
  - LP検証中プロダクトとして配置済み

### 3. フォルダ構造の整理（完了）
- [x] **apps/landing → apps/portal** にリネーム
- [x] **products/*/service → products/*/lp** にリネーム
- [x] **重複フォルダ削除** (/src, /services, /shared)
- [x] **統一ブランドスタイルガイド** 実装

### 4. フォルダ構造の完全化（完了）
- [x] **discovery/** フォルダ作成（フェーズ0: 課題検知）
- [x] **development/** フォルダ作成（フェーズ2: MVP開発中）
- [x] 各プロダクトの **phases/** 構造を完全化

### 5. Convex/Neon連携基盤（完了）
- [x] **Convexスキーマ拡張**（playbooks、playbook_runs、phase_reviews テーブル）
- [x] **プレイブック管理API**（convex/playbooks.ts）
- [x] **Neon pgvector連携**（setup-neon-insights.js）
- [x] **初期データ投入スクリプト**（seed-playbooks.js）

## 未実装項目（次フェーズ）

### 6. データ同期・自動化
- [ ] Git → Convex 同期CI構築
- [ ] Front Matter抽出スクリプト
- [ ] OpenAI埋め込み生成

### 7. UI統合
- [x] `/apps/portal/src/data/products.ts` に全6プロダクト登録済み
- [ ] Convex API移行
- [ ] プロダクト管理ダッシュボード
- [ ] フェーズ移行承認フロー

## 新構造の核心要素

### データ管理の役割分担 🎯
- **Git（定義・監査）**: プレイブック手順、フェーズレビュー、スナップショット
- **Convex（実行・リアルタイム）**: KPI履歴、実行状況、UI表示用データ
- **Neon+pgvector（学習・検索）**: ナレッジベース、類似事例検索、教訓の蓄積

### プレイブック駆動のメリット 📈
1. **再現性**: 成功パターンの体系化・標準化
2. **学習性**: 失敗からの組織的学習サイクル
3. **スケール性**: 100-200個のプロダクト管理に対応
4. **自動化**: フェーズ移行判定の自動化基盤

### 実現したフォルダ構造 📁
```
products/
├── template/                     # ✅ 標準テンプレート
├── active/                       # ✅ 本番運用中
│   └── 2025-08-001-mywa/        # ✅ 配置完了
├── validation/                   # ✅ LP検証中
│   ├── 2025-08-002-ai-bridge/   # ✅ 配置完了
│   ├── 2025-08-003-ai-coach/    # ✅ 配置完了
│   ├── 2025-08-004-ai-legacy-creator/ # ✅ 配置完了
│   ├── 2025-08-005-ai-stylist/  # ✅ 配置完了
│   └── 2025-08-006-watashi-compass/ # ✅ 配置完了
├── development/                  # 🔄 MVP開発中（作成予定）
└── discovery/                    # ✅ 課題検知中（作成完了）

apps/
└── portal/                       # ✅ リネーム完了（旧landing）
    └── src/data/products.ts     # ✅ 全6プロダクト登録済み

docs/
└── playbooks/                    # ✅ プレイブック定義
    ├── README.md                # ✅ 概要・運用ルール
    └── pb-001-lp-cvr-test.md    # ✅ 具体的手順
```

## 次のアクション優先度

### 高優先度（実装完了 ✅）
1. ✅ **discovery/とdevelopment/フォルダ作成**
2. ✅ **各プロダクトのphases/構造完全化**
3. ✅ **Convexスキーマ拡張**（playbooks、playbook_runs テーブル）
4. ✅ **Neon pgvector連携**

### 中優先度（2週間以内）  
1. **Git→DB同期の実装**
2. **products.ts のConvex API移行**
3. **プレイブック PB-002, PB-003 の作成**

### 低優先度（1ヶ月以内）
1. **管理ダッシュボードUI**
2. **Neon pgvector連携**
3. **フェーズ移行自動化**

## 期待される効果

### 短期（1ヶ月）
- プロダクト情報の一元管理
- 新規プロダクト立ち上げの標準化
- LP検証プロセスの改善

### 中期（3ヶ月）
- 成功パターンの横展開
- 失敗要因の体系的分析
- プレイブック品質の向上

### 長期（6ヶ月）
- 100個プロダクト管理の実現
- AI による自動レコメンド
- 「Company-as-a-Product」の完成

---

この実装により、UnsonOSは真の意味での**「プレイブック駆動型プロダクト管理システム」**に進化します。