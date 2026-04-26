---
description: "品質保証チェックを実行"
arguments: "[execution_id]"
---

# 品質保証チェック

quality-assuranceエージェントを使用して、PB-000実行結果の品質保証チェックを実行します。

**機能**:
- 全Phase成果物の品質基準照合
- 必須項目・推奨項目の完了率チェック
- Phase間一貫性の検証
- 総合品質スコア算出（PASS/FAIL判定）

**引数**:
- `execution_id`: 品質チェック対象の実行ID（省略時: 最新実行）

**出力**:
- `overall_quality.md`: 全体品質評価
- `phase_completion.md`: Phase別完了状況
- `recommendations.md`: 改善提案

**品質基準**:
- **PASS**: 必須項目100% + 総合スコア80点以上
- **CONDITIONAL_PASS**: 必須項目90%以上 + 総合スコア75点以上
- **FAIL**: 必須項目90%未満 または 総合スコア75点未満

**判定基準**:
- Phase1: ペルソナ品質80点以上
- Phase2: 思い込み特定5個以上
- Phase3: MVV整合性100%
- Phase4: 差別化軸3つ以上
- Phase5: 統合完成度85点以上

quality-assuranceエージェントを使用して、指定された実行IDの品質保証チェックを実行してください。

**対象実行ID**: ${1:-最新実行を自動検出}

全Phaseの成果物を詳細に検証し、Gate1移行可否の最終判定を実施してください。