---
description: "Complete automated PB-000 pipeline with MCP integration"
---

# PB-000 完全自動化実行（MCP統合版）

以下のフローで完全自動実行します：

## Phase 0: MCP データ取得（自動）
Instagram APIからリアルデータを取得し、自動保存します。
検索キーワード: "$2"（ターゲットペルソナ）
保存先: `/tmp/mcp_data_$1_$(date +%s).json`

## Phase 1-5: 全エージェント自動実行
取得したMCPデータを使用して以下を順次実行：

1. **data-manager**: プロジェクト「$1」作成
2. **persona-analyzer**: MCPデータ活用ペルソナ分析
3. **issue-detector**: 思い込み・課題検知
4. **idea-generator**: ソリューション生成
5. **competitive-analyzer**: 競合・市場分析
6. **positioning-integrator**: ポジショニング設計
7. **quality-assurance**: 品質保証チェック

## 実行方法
```
/pb000-mcp-auto "project-name" "target-persona"
```

## 出力
- 完全なPB-000実行結果
- リアルInstagramデータ統合分析
- Gate1準備完了レポート

**特徴**: ワンクリック実行、人間介入なし、MCP完全活用