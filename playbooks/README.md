# プレイブックディレクトリ

UnsonOSデータ駆動コアシステムのプレイブック（意思決定フロー）を管理するディレクトリです。

## 📁 ディレクトリ構造

```
/playbooks
├── README.md           # このファイル
├── schemas/           # JSON Schema定義
│   └── playbook.schema.json
├── templates/         # 標準テンプレート
│   ├── onboarding/   # オンボーディング最適化
│   ├── pricing/      # 価格戦略
│   ├── copy/         # コピーテスト
│   └── retention/    # リテンション改善
├── staging/          # ステージング環境用
│   └── *.yaml
├── prod/            # 本番環境用
│   └── *.yaml
└── archive/         # アーカイブ（過去バージョン）
    └── *.yaml
```

## 🚀 使い方

### 1. 新しいプレイブック作成

```bash
# テンプレートからコピー
cp templates/onboarding/basic.yaml staging/my_new_playbook.yaml

# 編集
vim staging/my_new_playbook.yaml

# バリデーション
playbook validate staging/my_new_playbook.yaml
```

### 2. ステージングでテスト

```bash
# デプロイ
playbook deploy staging/my_new_playbook.yaml --env staging

# モニタリング
playbook monitor PLB^my_new_playbook --env staging
```

### 3. 本番へ昇格

```bash
# ステージングから本番へコピー
cp staging/my_new_playbook.yaml prod/

# 本番デプロイ（Canary）
playbook deploy prod/my_new_playbook.yaml --env production --canary
```

## 📝 命名規則

### ファイル名
```
{category}_{scenario}_{version}.yaml

例:
- onboarding_cvr_optimization_v1.yaml
- pricing_tier_test_v2.yaml
- copy_hero_message_v3.yaml
```

### プレイブックID
```
PLB^{category}_{scenario}

例:
- PLB^onboarding_default
- PLB^pricing_enterprise
- PLB^copy_landing
```

## 🔍 バリデーション

### ローカルバリデーション

```bash
# 構文チェック
yamllint playbooks/staging/*.yaml

# スキーマ検証
ajv validate -s schemas/playbook.schema.json -d staging/my_playbook.yaml

# グラフ構造検証
playbook validate staging/my_playbook.yaml --check-graph
```

### CI/CDパイプライン

GitHub Actionsで自動検証:
- 構文チェック
- スキーマ適合性
- グラフの到達可能性
- 循環参照の検出

## 📊 プレイブック例

### 基本的なA/Bテスト

```yaml
playbookId: PLB^copy_hero_test
version: 1.0.0
scope:
  tags: ["saas:*", "market:JP"]
nodes:
  - id: start
    type: Start
    next: test_hero
    
  - id: test_hero
    type: Action
    flags:
      "hero.variant": "B"
    rollout:
      strategy: "canary"
      steps: [0.5]
    next: outcome
    
  - id: outcome
    type: Outcome
    horizonDays: 7
    kpi: ["CVR"]
    writeBack: "casebook"
```

## ⚙️ ツール

### CLI コマンド

```bash
# リスト表示
playbook list --env staging

# 差分確認
playbook diff staging/v1.yaml prod/v1.yaml

# ドライラン
playbook dryrun staging/my_playbook.yaml

# ロールバック
playbook rollback PLB^my_playbook --to-version 1.0.0
```

### VSCode 拡張

`.vscode/settings.json`:
```json
{
  "yaml.schemas": {
    "./schemas/playbook.schema.json": "playbooks/**/*.yaml"
  }
}
```

## 🔒 セキュリティ

### アクセス制御
- `staging/`: 開発者全員
- `prod/`: PM以上の承認必要
- `archive/`: 読み取り専用

### 高リスクプレイブック
以下を含む場合はGate必須:
- 価格変更
- 大規模UI変更
- 50%以上の露出
- 外部API連携

## 📈 ベストプラクティス

1. **小さく始める**: まず5%のCanaryから
2. **明確な成功基準**: KPIと閾値を事前定義
3. **十分な評価期間**: 最低7日間の観測
4. **段階的展開**: 5% → 15% → 30% → 50% → 100%
5. **ロールバック準備**: 常に前バージョンを保持

## 🆘 トラブルシューティング

### プレイブックが動作しない
```bash
# デバッグモードで実行
playbook debug PLB^my_playbook --verbose

# ログ確認
playbook logs PLB^my_playbook --tail 100
```

### 緊急ロールバック
```bash
# 即座に前バージョンへ
playbook rollback PLB^my_playbook --immediate --skip-validation
```

## 📚 関連ドキュメント

- [プレイブックDSL仕様](../docs/for-developers/core-system/playbook-dsl-spec.md)
- [データ駆動コアシステム](../docs/for-developers/core-system/data-driven-core.md)
- [運用ガイド](../docs/for-developers/core-system/operation-guide.md)