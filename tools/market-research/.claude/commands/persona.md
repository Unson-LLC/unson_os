---
description: "Execute Phase1 persona analysis with Instagram data"
---

persona-analyzerエージェントを使用してPhase1（ペルソナ分析・具体化）を実行します。

機能:
- Apify Instagram APIで実在ユーザーの行動分析
- 抽象的なターゲット記述から具体的ペルソナへの変換
- 年齢、居住地、職業、年収まで詳細設定
- 主要課題と副次的課題の特定

分析対象ターゲット: $ARGUMENTS（デフォルト: 20代のIT業界転職検討者）

出力ファイル:
- persona_analysis.md: メインペルソナ分析結果
- instagram_data.md: Instagram分析生データ

品質要件:
- 具体的年齢設定（「27歳」など）
- 居住地詳細（市区レベル）
- 職業詳細（業界・職種・経験年数）
- 具体的年収
- Instagram分析実在ユーザー5名以上

persona-analyzerエージェントで指定されたターゲットを具体的なペルソナに変換し、Instagram分析を含む高品質なペルソナ分析を実行してください。