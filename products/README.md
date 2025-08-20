# UnsonOS プロダクト管理（統合版）

このディレクトリは、UnsonOSで開発・管理するすべてのマイクロSaaSプロダクトの情報とコード実装を一元管理します。

## ディレクトリ構造

```
products/
├── README.md                           # このファイル
├── template/                           # プロダクト作成テンプレート
│   ├── product.yaml                   # 設定テンプレート
│   ├── phases/                        # フェーズ管理テンプレート
│   └── lp/                            # LPコードテンプレート
├── active/                            # フェーズ3: 拡張・改善中
│   └── 2025-08-001-mywa/             # MyWa（本格運用中）
│       ├── product.yaml              # プロダクト管理情報
│       ├── phases/                   # フェーズ履歴
│       └── lp/                       # Next.js LP実装
├── development/                       # フェーズ2: MVP開発中（課金込み）
│   └── (該当プロダクトなし)
├── validation/                        # フェーズ1: LP検証中  
│   ├── 2025-08-006-watashi-compass/  # わたしコンパス
│   ├── 2025-08-002-ai-bridge/        # AI世代間ブリッジ
│   ├── 2025-08-003-ai-coach/         # AI自分時間コーチ
│   ├── 2025-08-004-ai-legacy-creator/ # AIレガシー・クリエーター
│   └── 2025-08-005-ai-stylist/       # AIパーソナルスタイリスト
└── discovery/                         # フェーズ0: 課題検知中
    └── (新規課題検知予定)

```

## プロダクトステージ（戦略レポート準拠）

### フェーズ0: Discovery（課題検知）
- SNS・検索語・GitHub課題のクロール
- LLMによる類似度クラスタリング
- スコア上位課題の評価・選定

### フェーズ1: Validation（LP検証）
- LP作成・公開
- 広告テスト・CVR測定
- ユーザーフィードバック収集
- **ゲート基準**: CVR 10%以上、1,000セッション以上

### フェーズ2: Development（MVP開発・課金込み）
- MVP構築・課金システム実装
- ベータテスト・ユーザー獲得
- **ゲート基準**: 週次利用者200人以上、7日後残存率30%以上、転換率7%以上

### フェーズ3: Active（拡張・改善）
- 本格運用・機能拡張
- スケーリング・グロース施策
- 継続的改善

## 現在のプロダクト一覧

### 🟢 Active（フェーズ3: 拡張・改善中）
| プロダクト名 | URL | 収益状況 | 管理フォルダ |
|------------|-----|----------|-------------|
| MyWa（マイワ） | https://mywa.unson.jp/ | ベータ版運用中 | `active/2025-08-001-mywa/` |

### 🟡 Validation（フェーズ1: LP検証中）
| プロダクト名 | LP URL | CVR状況 | 管理フォルダ |
|------------|--------|---------|-------------|
| わたしコンパス | https://authentic-life-ai.vercel.app | 測定中 | `validation/2025-08-006-watashi-compass/` |
| AI世代間ブリッジ | https://unson-lp-ai-bridge.vercel.app | 測定中 | `validation/2025-08-002-ai-bridge/` |
| AI自分時間コーチ | https://unson-lp-ai-coach.vercel.app | 測定中 | `validation/2025-08-003-ai-coach/` |
| AIレガシー・クリエーター | https://unson-lp-ai-legacy-creator.vercel.app | 測定中 | `validation/2025-08-004-ai-legacy-creator/` |
| AIパーソナルスタイリスト | https://unson-lp-ai-stylist.vercel.app | 測定中 | `validation/2025-08-005-ai-stylist/` |

### 🔄 Development（フェーズ2: MVP開発中）
現在該当プロダクトなし

### 🔵 Discovery（フェーズ0: 課題検知中）
新規課題検知予定

## 統合管理方針

### 1. **プレイブック駆動型管理**
各プロダクトフォルダの構成：
- `product.yaml`: 統一設定ファイル（KPI、フェーズ履歴、実装情報）
- `phases/`: フェーズレビューとプレイブック実行履歴  
- `service/`: Next.jsサービス実装コード（統合後追加）

### 2. **フェーズ移行ゲート基準**
- **Discovery → Validation**: 課題有効性確認、LP完成、広告配信準備完了
- **Validation → Development**: CVR 10%以上、1,000セッション以上達成
- **Development → Active**: 週次利用者200人以上、転換率7%以上、基本機能動作確認

### 3. **コードとデプロイ管理**
- LP実装: `{product}/lp/` フォルダ
- Vercelデプロイ: product.yamlの実装情報から自動化
- 開発コマンド: `npm run dev` (各lpフォルダ内)

### 4. **情報更新ルール**
- **リアルタイム**: KPI値をConvexDBと同期
- **週次**: product.yamlのmetrics更新
- **フェーズ移行時**: PhaseReview.md作成、playbookHistory更新
- **四半期**: ポートフォリオ全体評価

## 開発者向け情報

### サービス起動方法
```bash
# MyWa開発サーバー起動
cd products/active/2025-08-001-mywa/lp
npm run dev

# AI-Bridge LP開発  
cd products/validation/2025-08-002-ai-bridge/lp
npm run dev
```

### 新規プロダクト作成
1. `template/` フォルダをコピー
2. `product.yaml` を編集
3. フェーズ0→1の移行手続き実行

---

**この統合により、プロダクト管理とコード実装が完全に一体化され、100-200プロダクトの効率的な管理が可能になります。**