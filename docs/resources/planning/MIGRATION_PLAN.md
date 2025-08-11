# docs/ フォルダ移動計画

## 📋 移動マッピング

### 1. for-operators/ (運営者向け)
```
docs/ui/* → docs/for-operators/dashboard-ui/
docs/technical/service-generation-pipeline.md → docs/for-operators/service-generation/
docs/strategy/mvp-validation-framework.md → docs/for-operators/service-generation/
docs/marketing/personas/* → docs/for-operators/persona-observation/personas/
```

### 2. for-developers/ (開発者向け)
```
docs/development/* → docs/for-developers/getting-started/
docs/setup/* → docs/for-developers/getting-started/setup/
docs/testing-guidelines.md → docs/for-developers/testing/
docs/technical/unson-os-architecture.md → docs/for-developers/core-system/architecture/
docs/technical/architecture-comparison.md → docs/for-developers/core-system/architecture/
docs/technical/multi-tenant-strategy.md → docs/for-developers/core-system/architecture/
```

### 3. for-community/ (コミュニティ向け)
```
docs/governance/* → docs/for-community/dao-governance/
docs/team/* → docs/for-community/community-resources/team/
docs/DISCORD_*.md → docs/for-community/community-resources/discord/
```

### 4. system-design/ (システム設計)
```
docs/architecture/* → docs/system-design/architecture/
docs/design-specification.md → docs/system-design/
```

### 5. business-strategy/ (ビジネス戦略)
```
docs/strategy/* → docs/business-strategy/
docs/marketing/* → docs/business-strategy/marketing/
docs/executive-strategy-report.md → docs/business-strategy/
```

### 6. resources/ (リソース)
```
docs/project/* → docs/resources/project-info/
docs/presentations/* → docs/resources/presentations/
docs/updates/* → docs/resources/changelog/
```

## 🔄 実行順序

### Phase 1: 即座に移動（構造が明確なもの）
1. ui → for-operators/dashboard-ui
2. governance → for-community/dao-governance
3. development → for-developers/getting-started

### Phase 2: 内容確認後移動
1. technical/* の振り分け
2. strategy/* の振り分け
3. marketing/* の振り分け

### Phase 3: 新規作成が必要
1. for-operators/persona-observation/README.md
2. for-operators/assumption-breaking/README.md
3. for-developers/core-system/README.md

## ⚠️ 注意事項
- リンクの更新が必要
- 既存のPRやIssueへの影響を確認
- CLAUDE.mdの更新も必要