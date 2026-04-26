# PB-000実行結果保存フォルダ

このフォルダはPB-000（市場調査プレイブック）の実行結果を体系的に保存・管理するためのものです。

## フォルダ構造

```
executions/
├── README.md                          # このファイル
├── execution_template/                # 新規実行時のテンプレート
│   ├── execution_metadata.md         # 実行メタデータテンプレート
│   ├── phase1_persona/               # Phase1用テンプレート
│   ├── phase2_issues/               # Phase2用テンプレート
│   ├── phase3_ideas/                # Phase3用テンプレート
│   ├── phase4_competitive/          # Phase4用テンプレート
│   ├── phase5_positioning/          # Phase5用テンプレート
│   └── quality_reports/             # 品質評価レポート用
├── {YYYY-MM-DD_HHMMSS}_{project}/   # 実際の実行結果フォルダ
│   ├── execution_metadata.md       # 実行の基本情報
│   ├── input_data.md              # 入力データ（企業MVV、ペルソナ記述等）
│   ├── phase1_persona/            # Phase1結果
│   ├── phase2_issues/             # Phase2結果
│   ├── phase3_ideas/              # Phase3結果
│   ├── phase4_competitive/        # Phase4結果
│   ├── phase5_positioning/        # Phase5結果
│   ├── quality_reports/           # 品質評価
│   ├── human_approval.md          # 人間承認記録
│   └── gate_handover.md           # Gate1引き継ぎデータ
└── execution_index.md              # 全実行履歴のインデックス
```

## 実行IDの命名規則

- フォーマット: `{YYYY-MM-DD_HHMMSS}_{project_name}`
- 例: `2024-12-20_143022_career-coach`
- 説明: 日時 + プロジェクト名で一意性を確保

## 各Phaseフォルダの内容

### phase1_persona/
- `persona_analysis.md`: メインペルソナ分析結果
- `instagram_data.md`: Instagram分析生データ
- `quality_check.md`: Phase1品質チェック結果

### phase2_issues/
- `issue_analysis.md`: 課題・思い込み分析結果
- `challenge_opportunities.md`: チャレンジ機会の特定
- `quality_check.md`: Phase2品質チェック結果

### phase3_ideas/
- `idea_generation.md`: 生成されたアイデア一覧
- `evaluation_matrix.md`: アイデア評価マトリックス
- `selected_ideas.md`: 選定されたアイデア
- `quality_check.md`: Phase3品質チェック結果

### phase4_competitive/
- `competitive_analysis.md`: 競合分析結果
- `market_sizing.md`: 市場規模分析
- `differentiation_analysis.md`: 差別化分析
- `quality_check.md`: Phase4品質チェック結果

### phase5_positioning/
- `positioning_analysis.md`: ポジショニング分析
- `messaging_framework.md`: メッセージング設計
- `stp_analysis.md`: STP分析結果
- `quality_check.md`: Phase5品質チェック結果

### quality_reports/
- `overall_quality.md`: 全体品質評価
- `phase_completion.md`: Phase別完了状況
- `recommendations.md`: 改善提案

## 使用方法

1. **新規実行開始**: `execution_template/`をコピーして新しい実行IDフォルダを作成
2. **実行中**: 各Phaseの結果をそれぞれのフォルダに保存
3. **完了後**: `execution_index.md`に実行記録を追加
4. **品質確認**: `quality_reports/`で品質基準達成を確認
5. **Gate移行**: `gate_handover.md`でGate1への引き継ぎデータを準備

## 注意事項

- 実行IDは重複しないよう注意
- 各Phaseの品質チェックは必ず実施
- 機密情報は適切にマスキング
- バックアップは定期的に実施