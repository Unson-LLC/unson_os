# Products & Services フォルダ統合計画

## 目的

`products/`（プレイブック管理）と`services/`（実装コード）を統合し、プロダクト管理とコード実装を一元化する。

## 現状分析

### products/ フォルダ（管理層）
- product.yaml による統一管理
- プレイブック駆動のフェーズ管理
- KPI・メトリクス履歴

### services/ フォルダ（実装層）
- Next.js による実装コード
- LP生成システム
- Vercelデプロイ設定

## 統合後の構造

```
products/
├── template/
│   ├── product.yaml
│   ├── phases/
│   └── service/              # 🆕 テンプレートコード
│       ├── package.json
│       ├── src/
│       └── vercel.json
├── active/
│   └── 2024-12-001-mywa/
│       ├── product.yaml
│       ├── phases/
│       └── service/          # services/mywa/ → 移動
│           ├── package.json
│           ├── src/
│           └── vercel.json
├── development/              # 🆕 フェーズ2用
│   └── 2024-12-XXX-xxx/
│       ├── product.yaml
│       ├── phases/
│       └── service/
└── validation/
    ├── 2024-12-002-ai-bridge/
    │   ├── product.yaml
    │   └── service/          # services/ai-bridge/ → 移動
    ├── 2024-12-003-ai-coach/
    │   ├── product.yaml
    │   └── service/          # services/ai-coach/ → 移動
    ├── 2024-12-004-ai-legacy-creator/
    │   ├── product.yaml
    │   └── service/          # services/ai-legacy-creator/ → 移動
    └── 2024-12-005-ai-stylist/
        ├── product.yaml
        └── service/          # services/ai-stylist/ → 移動
```

## 移行ステップ

### フェーズ1: 基盤準備
1. **product.yamlにサービス実装情報を追加**
   ```yaml
   # 技術実装情報
   implementation:
     repository: "./service"     # サービスコードの相対パス
     framework: "nextjs"
     packageManager: "npm"
     buildCommand: "npm run build"
     devCommand: "npm run dev"
     deployTarget: "vercel"
   ```

2. **テンプレートサービスの作成**
   - services/内の共通構造をtemplate/service/に抽象化

### フェーズ2: プロダクト別移行
1. **MyWa** (active)
   - services/mywa/ → products/active/2024-12-001-mywa/service/
   - product.yamlのrepository情報更新

2. **LP検証中プロダクト** (validation)
   - services/ai-bridge/ → products/validation/2024-12-002-ai-bridge/service/
   - services/ai-coach/ → products/validation/2024-12-003-ai-coach/service/
   - services/ai-legacy-creator/ → products/validation/2024-12-004-ai-legacy-creator/service/
   - services/ai-stylist/ → products/validation/2024-12-005-ai-stylist/service/

### フェーズ3: インフラ更新
1. **ビルドスクリプト更新**
   ```bash
   # 新構造対応
   scripts/deploy-services.sh → scripts/deploy-products.sh
   ```

2. **Vercelプロジェクト設定更新**
   - Root Directory設定を新パスに変更
   - Environment Variables確認

3. **CI/CD更新**
   - GitHub Actions workflow更新
   - パス変更対応

### フェーズ4: クリーンアップ
1. **旧services/フォルダ削除**
2. **README・ドキュメント更新**
3. **package.jsonのscript更新**

## 実装上の注意点

### 1. Vercelデプロイ
- 現在: `services/mywa/` → `https://mywa.unson.jp`
- 移行後: `products/active/2024-12-001-mywa/service/` → 同じURL

### 2. Import/Export
- 相対パス変更によるimport error対応
- shared/フォルダとの連携確認

### 3. 開発体験
- npm workspace設定の見直し
- 開発サーバー起動コマンド統一

## 統合後のメリット

### 開発者体験
- プロダクト情報とコードが同一場所
- フェーズ移行時の自動リファクタリング可能
- Git履歴の一元管理

### 運用効率
- product.yamlからデプロイ自動化
- フェーズ移行とコードデプロイの連動
- KPIとコード変更の相関分析容易

### スケーラビリティ  
- 100-200プロダクトでも構造が破綻しない
- テンプレート適用による標準化
- 自動化CI/CDとの自然な統合

## リスク対策

### デプロイ停止リスク
- 段階的移行（1プロダクトずつ）
- 移行前のVercel設定バックアップ
- ロールバック手順の事前準備

### 開発中断リスク
- 移行中も従来パスで開発継続可能
- symlink による過渡期対応
- チーム通知とドキュメント整備

## 実行タイムライン

| 期間 | フェーズ | 主要作業 |
|------|----------|----------|
| Day 1-2 | フェーズ1 | product.yaml拡張、テンプレート作成 |
| Day 3-5 | フェーズ2 | プロダクト移行（1つずつ） |
| Day 6-7 | フェーズ3 | インフラ・CI/CD更新 |
| Day 8 | フェーズ4 | クリーンアップ・検証 |

---

この統合により、UnsonOSのプロダクト管理は「管理情報とコード実装の完全一体化」を実現し、真の意味でのプレイブック駆動開発が可能になります。