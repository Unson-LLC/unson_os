# UNSON OS Market Research Playbook (PB-000)

UNSON OSマーケットリサーチプレイブック - Instagram実データ分析とGemini DeepSearchを活用した包括的なマーケットリサーチシステム

## 概要

このプロジェクトは、**Nemotron-Personas-Japan (1M件)** と **Instagram実データ** を統合したペルソナ分析から、**Gemini DeepSearch MCP** による競合調査、ソリューション開発、ポジショニング戦略まで、市場調査の全プロセスを自動化します。

## 主要機能

### 1. Instagram実データ統合ペルソナ分析
- **Nemotron-Personas-Japan**: 100万件の日本人ペルソナデータベース
- **Apify Instagram API**: 実際のInstagram投稿・プロフィールデータ取得
- **自動統合**: Nemotron統計データ + Instagram実データの信頼性評価
- **信頼性スコア**: 100点満点のスコアリングシステム

### 2. 完全自動化ワークフロー (PB-000)
```
Phase 1: ペルソナ分析 (Instagram実データ)
  ↓
Phase 2: 課題・思い込み検知
  ↓
Phase 3: ソリューションアイデア生成
  ↓
Phase 4: 競合・市場分析 (Gemini DeepSearch)
  ↓
Phase 5: ポジショニング設計・最終統合
  ↓
Quality Assurance: 品質保証チェック
```

### 3. Claude Code Skillsシステム

全7つの専門Skillsで完全自動化ワークフローを実現:

| # | Skill名 | Phase | 機能 |
|---|---------|-------|------|
| 1 | **nemotron-instagram-persona** | Phase1 | Nemotron + Instagram統合ペルソナ分析 |
| 2 | **issue-detector** | Phase2 | 思い込み・課題検知（10個以上特定） |
| 3 | **idea-generator** | Phase3 | MVV×課題でアイデア生成（5-10個） |
| 4 | **competitive-analyzer** | Phase4 | Gemini DeepSearch競合・市場分析 |
| 5 | **positioning-integrator** | Phase5 | STPポジショニング・LP開発 |
| 6 | **quality-assurance** | 全Phase | 品質保証チェック（QAレポート生成） |
| 7 | **data-manager** | 全Phase | ファイルベースデータ管理 |

各SkillはClaude Codeで**自然言語リクエストで自動起動**します。

## クイックスタート

### 前提条件
- Python 3.10+
- Apify APIトークン (Instagram分析用)
- Google API Key (Gemini DeepSearch用)

### セットアップ

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd unson-os-market-research

# 2. 仮想環境作成
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 依存パッケージインストール
pip install datasets requests python-dotenv

# 4. 環境変数設定
cat > .env <<EOF
APIFY_API_TOKEN=your_apify_token_here
GOOGLE_API_KEY=your_google_api_key_here
EOF

# 5. Claude Code Skill依存関係インストール
pip install -r .skills/nemotron-instagram-persona/requirements.txt
```

### 使用方法

#### 方法1: Claude Codeスラッシュコマンド (推奨)

```bash
# 完全自動実行 (全5フェーズ + QA)
/pb000-mcp-auto

# 個別フェーズ実行
/persona     # Phase 1: Instagram分析
/issues      # Phase 2: 課題検知
/ideas       # Phase 3: アイデア生成
/competitive # Phase 4: 競合分析
/positioning # Phase 5: 最終統合
/quality     # QA実行
```

#### 方法2: Pythonスクリプト直接実行

```bash
# Instagram統合ペルソナ分析
python .skills/nemotron-instagram-persona/core/nemotron_instagram_pipeline.py \
  "30代のITエンジニア" \
  --output persona_report.md
```

#### 方法3: Claude Codeでの自然言語リクエスト

```
「30代のITエンジニアのペルソナを作成して」
「転職を検討している20代のInstagram分析をお願いします」
```

→ Skillが自動起動し、全プロセスを実行

## プロジェクト構造

```
.
├── .claude/
│   ├── commands/          # スラッシュコマンド定義 (9個)
│   └── agents/            # 専門エージェント定義 (7個)
├── .skills/               # Claude Code Skills (7個) ✨ NEW
│   ├── nemotron-instagram-persona/  # Phase1: ペルソナ分析
│   ├── issue-detector/              # Phase2: 課題検知
│   ├── idea-generator/              # Phase3: アイデア生成
│   ├── competitive-analyzer/        # Phase4: 競合分析
│   ├── positioning-integrator/      # Phase5: ポジショニング
│   ├── quality-assurance/           # 全Phase: 品質保証
│   └── data-manager/                # 全Phase: データ管理
├── lib/                   # 共通ライブラリ
│   ├── nemotron_persona_selector.py
│   ├── instagram_keyword_generator.py
│   └── persona_integrator.py
├── config/                # 設定ファイル
├── docs/                  # ドキュメント
├── reports/               # 実行レポート ✨ NEW
├── tests/                 # テストコード
├── pb000_deliverables/    # 実行履歴・成果物
│   ├── executions/        # 実行履歴
│   └── quality_standards/ # 品質基準
└── scripts/               # ユーティリティスクリプト
```

### Skills詳細

各Skillは統一構造で独立動作:
```
.skills/{skill-name}/
├── SKILL.md              # Skill定義・使用方法
├── core/                 # コアモジュール
└── resources/            # ドキュメント
```

## 出力例

### Instagram統合ペルソナレポート

```markdown
# Nemotron-Instagram ペルソナ分析レポート

**ターゲット**: 30代のITエンジニア
**分析日時**: 2025-10-19 11:48:57

## データソース
- Nemotron ペルソナ: 2件選定
- Instagram 投稿: 200件取得
- 検索キーワード: #製造業, #ものづくり, #manufacturing

## 統合結果サマリー
- 統合ペルソナ数: 2件
- 平均信頼性スコア: 90.0/100
  - 高信頼性 (80-100点): 2件

## ペルソナ 1
### 信頼性スコア: 90/100
### 基本情報
- 年齢: 35歳
- 性別: 男
- 居住地: 滋賀県

### Instagram 投稿分析
- 投稿数: 200件
- 頻出ハッシュタグ: #製造業, #キャリアチェンジ
```

## 主要ドキュメント

- **CLAUDE.md**: プロジェクト全体のコンテキスト・使用方法
- **CHANGELOG.md**: 変更履歴
- **SKILL_VERIFICATION_REPORT.md**: Skill動作検証レポート
- **.skills/nemotron-instagram-persona/README.md**: Skill詳細ドキュメント

## パフォーマンス

| 処理 | 実行時間 | データ量 |
|------|---------|---------|
| Nemotron選定 | 約15秒 | 1M件 → 2件 |
| Instagram API | 約260秒 | 200件取得 |
| データ統合 | < 1秒 | 2ペルソナ統合 |
| **合計** | **約280秒** | - |

## 品質基準

| 基準 | 目標値 | 判定基準 |
|------|-------|---------|
| 信頼性スコア | 60点以上 | 80-100点: 高信頼性 |
| Instagram投稿数 | 20件以上 | 実データ必須 |
| 矛盾チェック | 重大な矛盾なし | 自動検出 |

## トラブルシューティング

### Q: `APIFY_API_TOKEN が設定されていません` エラー

**A**: `.env` ファイルにトークンを追加:
```bash
echo "APIFY_API_TOKEN=your_token" >> .env
```

### Q: ペルソナが0件

**A**: ターゲット記述を緩和:
```python
# 厳しすぎる
"25歳の東京在住ITエンジニアで転職希望者"  # ❌

# 緩和版
"20代のITエンジニア"  # ✅
```

詳細: `.skills/nemotron-instagram-persona/resources/troubleshooting.md`

## 技術スタック

- **Python 3.10+**
- **HuggingFace Datasets** (Nemotronデータ読み込み)
- **Apify API** (Instagram実データ取得)
- **Gemini DeepSearch MCP** (競合・市場調査)
- **Claude Code** (ワークフロー自動化)
- **MCP Servers** (外部ツール統合)

## ライセンス

UNSON OSマーケットリサーチプロジェクト

## 更新履歴

- **2025-10-19**:
  - 全7つのClaude Code Skills完成 (Agent→Skill完全移行)
  - Instagram実データ統合Skill完成、完全フロー動作確認
  - ファイル整理・プロジェクト構造最適化
- **2025-09-25**: PB-000自動化パイプライン実装
- **2025-09-22**: プロジェクト開始

---

**サポート**: 問題が発生した場合は `.skills/nemotron-instagram-persona/resources/troubleshooting.md` を参照してください。
