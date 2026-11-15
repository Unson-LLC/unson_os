---
description: "PB-000実行フォルダのセットアップ"
arguments: "[project_name]"
---

# PB-000実行フォルダセットアップ

data-managerエージェントを使用して、新規PB-000実行用のフォルダ構造をセットアップします。

**機能**:
- 実行ID生成（YYYY-MM-DD_HHMMSS_project-name形式）
- execution_templateからのフォルダ・ファイル作成
- execution_index.mdへの実行記録追加
- 入力データテンプレートの準備

**引数**:
- `project_name`: プロジェクト名（実行IDに使用）

**作成される構造**:
```
pb000_deliverables/executions/{実行ID}/
├── execution_metadata.md
├── input_data.md
├── phase1_persona/
├── phase2_issues/
├── phase3_ideas/
├── phase4_competitive/
├── phase5_positioning/
├── quality_reports/
└── gate_handover.md
```

**次のステップ**:
1. input_data.mdに企業MVV・ターゲット情報を入力
2. 各Phaseエージェントを順次実行
3. quality-assuranceで品質確認

data-managerエージェントを使用して、以下のプロジェクト用の実行フォルダを作成してください：

**プロジェクト名**: ${1:-new-project}

フォルダ作成完了後、input_data.mdの編集と各Phase実行の準備を整えてください。