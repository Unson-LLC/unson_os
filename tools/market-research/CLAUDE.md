# Claude Code Project Context

## Project Overview
UNSON OS市場調査プレイブック (PB-000) を実行するための専門的なマーケットリサーチプロジェクト。**7つのClaude Code Skills**でInstagram実データ分析からGemini DeepSearch競合調査まで完全自動化。

## Project Structure
```
├── .claude/
│   ├── commands/          # スラッシュコマンド定義 (9個)
│   └── agents/            # 専門エージェント定義 (7個) - Skill起動用
├── .skills/               # Claude Code Skills (7個) ✨ 主要機能
│   ├── nemotron-instagram-persona/  # Phase1: ペルソナ分析
│   ├── issue-detector/              # Phase2: 課題検知
│   ├── idea-generator/              # Phase3: アイデア生成
│   ├── competitive-analyzer/        # Phase4: 競合分析
│   ├── positioning-integrator/      # Phase5: ポジショニング
│   ├── quality-assurance/           # 全Phase: 品質保証
│   └── data-manager/                # 全Phase: データ管理
├── lib/                   # 共通ライブラリ
├── config/                # 設定ファイル
├── reports/               # 実行レポート
├── pb000_deliverables/    # 実行履歴とデリバラブル
│   ├── executions/        # タイムスタンプ付き実行フォルダ
│   └── quality_standards/ # 品質基準
└── docs/                  # ドキュメント
```

## Key Technologies
- **Claude Code Skills**: 7つの専門Skills (自然言語で自動起動)
- **Instagram Analysis**: Apify Instagram API (実データ分析)
- **Competitive Research**: Gemini DeepSearch MCP (LangGraph統合)
- **Nemotron-Personas-Japan**: 100万件の日本人ペルソナDB

## Critical Workflows

### 1. PB-000 Complete Pipeline
```bash
/pb000-mcp-auto  # フル自動実行（全5フェーズ + QA）
/pb000           # マニュアル実行
```

### 2. Individual Phase Commands
- `/persona` - Phase1: Instagram実データからペルソナ分析
- `/issues` - Phase2: 思い込み・課題検知
- `/ideas` - Phase3: ソリューションアイデア生成
- `/competitive` - Phase4: 競合・市場分析（DeepSearch）
- `/positioning` - Phase5: ポジショニング設計・最終統合

### 3. Quality Gates
```bash
/quality  # 品質保証チェック実行
```

### 4. Data Management
```bash
/data-setup  # 実行フォルダセットアップ
```

## Skills Usage (自動起動)

### MUST USE Skills (自然言語で起動)

#### Phase1: ペルソナ分析
**Skill**: `nemotron-instagram-persona`
```
「30代のITエンジニアのペルソナを作成して」
「転職を検討している20代のInstagram分析をお願いします」
```
- Nemotron (1M件) からペルソナ選定
- Instagram実データ200件取得
- 信頼性スコア90/100達成

#### Phase2: 課題検知
**Skill**: `issue-detector`
```
「ペルソナの課題を分析して」
「思い込みを10個以上特定してください」
```
- 思い込み10個以上特定
- 課題4層階層化（表面→根本）
- Why-Why分析実行

#### Phase3: アイデア生成
**Skill**: `idea-generator`
```
「企業MVVと課題からソリューションアイデアを5個生成して」
「革新的なアイデアを10個お願いします」
```
- MVV×課題マトリックス
- 5-10個のアイデア生成
- 実現可能性80%以上

#### Phase4: 競合分析
**Skill**: `competitive-analyzer`
```
「Gemini DeepSearchで競合分析を実行して」
「直接競合2社、間接競合5社を徹底調査してください」
```
- DeepSearch MCP活用必須
- 直接競合2社以上
- 間接競合5社以上
- 差別化軸3つ以上特定

#### Phase5: 最終統合
**Skill**: `positioning-integrator`
```
「全フェーズの結果を統合してSTPポジショニングを完成させて」
「LP用メッセージングを開発してください」
```
- 全Phase統合必須
- STPポジショニング完成
- LP用メッセージング開発

#### 品質保証 (全Phase)
**Skill**: `quality-assurance`
```
「品質チェックを実行して」
「QAレポートを生成してください」
```
- MDファイル読み込み
- 品質基準チェック
- 合格/不合格判定

#### データ管理 (全Phase)
**Skill**: `data-manager`
```
「実行フォルダをセットアップして」
「ファイルを保存してください」
```
- フォルダ作成
- ファイル存在確認
- 実行履歴管理

## Agent vs Skills 使い分け

### Skills使用 (推奨)
Claude Codeでの**自然言語リクエスト**時:
```
「30代のITエンジニアのペルソナを作成して」
→ nemotron-instagram-persona Skill が自動起動
```

### Agent使用 (Task Tool経由)
スラッシュコマンドやTask Tool使用時:
```bash
/persona  # persona-analyzer agent を起動
```

**重要**: どちらの方法でも同じ機能が実行されます。Skillsは自動起動、Agentsは明示的起動の違いです。

## Environment Variables Required
```bash
APIFY_API_TOKEN=<Instagram API用>
GOOGLE_API_KEY=<Gemini DeepSearch用>
```

## File Naming Conventions
- `01_persona_insights.md` - ペルソナ分析結果
- `02_persona_profiles.md` - 詳細ペルソナプロファイル
- `03_issue_analysis.md` - 課題分析
- `04_solution_ideas.md` - ソリューションアイデア
- `05_competitive_analysis.md` - 競合分析
- `06_market_analysis.md` - 市場分析
- `07_positioning_strategy.md` - ポジショニング戦略
- `08_lp_messaging.md` - LP用メッセージング
- `QA_Report.md` - 品質保証レポート

## Best Practices

### DO
- ✅ **自然言語でSkill起動**: 「ペルソナを作成して」「競合分析をお願いします」
- ✅ **実データ使用必須**: Instagram実データ、DeepSearch実調査
- ✅ **各フェーズ後にQA実行**: `/quality`で品質確認
- ✅ **並列実行活用**: 独立したタスクは並列実行
- ✅ **環境変数設定**: APIFY_API_TOKEN, GOOGLE_API_KEY

### DON'T
- ❌ 架空データの使用禁止
- ❌ MCPツール未使用（DeepSearch必須）
- ❌ QAチェックリスト無視
- ❌ 実行履歴を`executions/`外に保存
- ❌ Skillsを使わず直接ツール呼び出し

## MCP Integration
```bash
# Apify MCP (Instagram分析)
- mcp__apify__apify-slash-rag-web-browser
- mcp__apify__fetch-actor-details
- mcp__apify__get-actor-output

# DeepSearch MCP (競合調査)
- mcp__langgraph-deep-search__deep_search    # 徹底調査
- mcp__langgraph-deep-search__quick_search   # クイック検索
```

## Performance Optimization
- **並列Skill起動**: 独立したPhaseは並列実行可能
- **キャッシュ活用**: Nemotronデータ2回目以降は5秒
- **Instagram API**: 約260秒（200件取得）
- **DeepSearch**: クエリ最適化で高速化
- **ファイル管理**: Glob/Grepで効率的検索

## Quality Criteria
各デリバラブルは以下を満たす必要がある:
- ✅ **実データ/実調査**: Instagram実データ、DeepSearch実調査
- ✅ **具体的数値**: 信頼性スコア、投稿数、競合数など
- ✅ **引用・ソース**: 実際のURL、レビュー引用
- ✅ **MVV整合性**: 企業価値観との一致100%
- ✅ **差別化明確**: 競合との差別化軸3つ以上

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Instagram API失敗** | `APIFY_API_TOKEN`確認、`.env`ファイル設定 |
| **DeepSearch未使用** | `competitive-analyzer` Skill使用、`deep_search` MCP実行 |
| **抽象的な分析** | 実データ要求を明示、具体的数値・引用を要求 |
| **Skill自動起動しない** | SKILL.mdのフロントマター確認、descriptionキーワード最適化 |
| **ペルソナ0件** | ターゲット記述を緩和（「25歳東京ITエンジニア」→「20代ITエンジニア」） |
| **環境変数読み込めない** | `.env`ファイル存在確認、改行コード確認 |

## Success Metrics
- ✅ 全8ファイル生成完了
- ✅ QAレポートで全項目合格
- ✅ 信頼性スコア60点以上（目標80点）
- ✅ Instagram実データ20件以上（目標200件）
- ✅ 競合分析: 直接2社+間接5社以上
- ✅ 差別化軸3つ以上特定
- ✅ LP用メッセージング完成

## Skills詳細ドキュメント

各Skillの詳細は以下を参照:
- `.skills/nemotron-instagram-persona/SKILL.md`
- `.skills/issue-detector/SKILL.md`
- `.skills/idea-generator/SKILL.md`
- `.skills/competitive-analyzer/SKILL.md`
- `.skills/positioning-integrator/SKILL.md`
- `.skills/quality-assurance/SKILL.md`
- `.skills/data-manager/SKILL.md`

## Quick Start Example

```bash
# 1. 環境設定
echo "APIFY_API_TOKEN=your_token" > .env
echo "GOOGLE_API_KEY=your_key" >> .env

# 2. 仮想環境セットアップ (初回のみ)
python3 -m venv venv
source venv/bin/activate
pip install datasets requests python-dotenv

# 3. Claude Codeで自然言語リクエスト
「30代のITエンジニアのペルソナを作成して」
→ nemotron-instagram-persona Skill 自動起動

「思い込みを10個特定してください」
→ issue-detector Skill 自動起動

「競合分析をお願いします」
→ competitive-analyzer Skill 自動起動

# 4. スラッシュコマンド (全自動)
/pb000-mcp-auto
→ 全5フェーズ + QA自動実行
```

## 更新履歴
- **2025-10-19**: 全7 Claude Code Skills完成、Agent→Skills完全移行
- **2025-09-25**: PB-000自動化パイプライン実装
- **2025-09-22**: プロジェクト開始

---

**Note**: このプロジェクトはClaude Code Skillsベースで設計されています。自然言語リクエストで自動起動するため、スラッシュコマンドやAgentを明示的に指定する必要はありません。
