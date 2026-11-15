---
description: "Phase4: 競合・市場分析を実行"
arguments: "[market_scope]"
---

# Phase4: 競合・市場分析

competitive-analyzerエージェントを使用してPhase4（競合・市場分析）を実行します。

**機能**:
- Web検索・ウェブフェッチによる直接競合・間接競合の徹底調査
- TAM/SAM/SOM市場規模算出
- 差別化軸の特定と競合優位性分析
- 参入障壁・市場リスクの評価

**引数**:
- `market_scope`: 市場分析範囲（省略時: "日本市場"）

**出力**:
- `competitive_analysis.md`: 競合分析結果
- `market_sizing.md`: 市場規模分析
- `differentiation_analysis.md`: 差別化分析

**品質要件**:
- 直接競合2社以上特定
- TAM/SAM/SOM算出
- 差別化軸3つ以上特定
- 市場成長性分析

competitive-analyzerエージェントを使用して、Phase3で選定されたアイデアの競合状況と市場ポテンシャルを分析してください。

**市場分析範囲**: ${1:-日本市場}

現実的な勝算と市場参入戦略を評価し、Phase5でのポジショニング設計に必要な競合・市場インサイトを提供してください。