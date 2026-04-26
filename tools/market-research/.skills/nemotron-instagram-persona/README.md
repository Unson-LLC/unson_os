# Nemotron-Instagram Persona Analyzer Skill

## 概要

このClaude Code Skillは、Nemotron-Personas-Japan (1M件) から統計的に最適なペルソナを選定し、Instagram実データで検証・統合する全自動ペルソナ分析システムです。

## 機能

### 完全自動化されたワークフロー

```
1. Nemotron (1M件)
   ↓ フィルタリング・スコアリング
2. 選定ペルソナ (3-10件)
   ↓ キーワード生成 (日本語70% + 英語30%)
3. Instagram検索クエリ
   ↓ Apify API 自動呼び出し
4. Instagram実データ (投稿・プロフィール)
   ↓ 統合・矛盾チェック
5. 統合ペルソナ (信頼性スコア100点満点付き)
```

## ファイル構成

```
.skills/nemotron-instagram-persona/
├── SKILL.md                          # Skill定義ファイル
├── README.md                         # このファイル
├── test_skill.py                     # テストスクリプト
├── core/                             # コアモジュール
│   ├── __init__.py
│   ├── apify_client.py               # Apify Instagram API クライアント
│   └── nemotron_instagram_pipeline.py # 全自動統合パイプライン
└── resources/                        # ドキュメント
    ├── workflow_guide.md             # 詳細ワークフローガイド
    ├── quality_criteria.md           # 品質基準
    └── troubleshooting.md            # トラブルシューティング
```

## セットアップ

### 1. 依存パッケージインストール

```bash
# 仮想環境推奨
python3 -m venv venv
source venv/bin/activate  # Windowsは venv\Scripts\activate

# 依存パッケージインストール
pip install datasets>=2.14.0 requests>=2.31.0 python-dotenv>=1.0.0
```

### 2. 環境変数設定

`.env` ファイルにApify APIトークンを設定:

```bash
APIFY_API_TOKEN=<your_apify_token>
```

トークン取得方法:
1. https://console.apify.com/ にサインアップ
2. "Settings" → "Integrations" → "Personal API tokens"
3. トークン生成してコピー

### 3. 動作確認

```bash
# テストスクリプト実行 (モックデータ使用)
python3 .skills/nemotron-instagram-persona/test_skill.py
```

## 使用方法

### 方法1: Claude Code自動起動 (推奨)

Claude Codeで以下のようにリクエストするだけで、Skillが自動起動します:

```
「30代のITエンジニアのペルソナを作成して」
「転職を検討している20代のInstagram分析をお願いします」
「東京在住のフリーランスデザイナーのペルソナを教えて」
```

### 方法2: Pythonスクリプト直接実行

```bash
# コマンドライン実行
python3 .skills/nemotron-instagram-persona/core/nemotron_instagram_pipeline.py \
  "30代のITエンジニア" \
  --max-personas 3 \
  --max-posts 20 \
  --output persona_report.md
```

### 方法3: Pythonコード内で使用

```python
from .skills.nemotron_instagram_persona.core import NemotronInstagramPipeline

# 初期化
pipeline = NemotronInstagramPipeline()

# 全自動実行
result = pipeline.run(
    target_description="30代のITエンジニア",
    max_personas=3,
    max_posts_per_keyword=20
)

# レポート保存
with open("persona_report.md", "w", encoding="utf-8") as f:
    f.write(result["markdown_report"])

# 結果確認
print(f"統合ペルソナ数: {result['total_personas']}")
print(f"平均信頼性スコア: {result['avg_trust_score']:.1f}/100")
```

## 出力例

```markdown
# Nemotron-Instagram ペルソナ分析レポート

**ターゲット**: 30代のITエンジニア
**分析日時**: 2025-01-19 15:30:45

## データソース
- Nemotron ペルソナ: 3件選定
- Instagram 投稿: 52件取得
- Instagram プロフィール: 10件取得
- 検索キーワード: #ITエンジニア, #転職, #キャリアチェンジ

## 統合結果サマリー
- 統合ペルソナ数: 3件
- 平均信頼性スコア: 85.0/100
  - 高信頼性 (80-100点): 2件
  - 中信頼性 (60-79点): 1件

---

## ペルソナ 1

### 信頼性スコア: 90/100

### 基本情報
- 年齢: 28歳
- 性別: 男性
- 居住地: 東京都 (関東)

### Instagram 投稿分析
- 投稿数: 52件
- 頻出ハッシュタグ: #ITエンジニア, #転職, #キャリアチェンジ, #プログラミング
- 平均いいね数: 125.3
- 平均コメント数: 8.7

### 実際の悩み・課題
1. 転職活動でスキルの棚卸しに苦労している...
2. 現職の将来性に不安がある...

### 整合性チェック
- ✅ 矛盾なし
```

## 信頼性スコア基準

| スコア | 評価 | 説明 |
|--------|------|------|
| 80-100点 | 高信頼性 | Nemotron + 豊富なInstagramデータ + 矛盾なし (即座に採用推奨) |
| 60-79点 | 中信頼性 | Instagramデータあり、軽微な矛盾または少量データ (条件付き採用) |
| 40-59点 | 低信頼性 | Nemotronのみ、またはInstagramデータ不足 (追加検証推奨) |

## よくある質問

### Q1: `APIFY_API_TOKEN が設定されていません` エラー

**回答**: `.env` ファイルにトークンを追加してください:

```bash
echo "APIFY_API_TOKEN=<your_apify_token>" > .env
```

### Q2: ペルソナが0件

**回答**: ターゲット記述を緩和してください:

```python
# 厳しすぎる
"25歳の東京在住ITエンジニアで転職希望者"  # ❌

# 緩和版
"20代のITエンジニア"  # ✅
```

### Q3: Instagram データが0件

**回答**: キーワードを手動指定してください:

```python
manual_keywords = ["IT", "エンジニア", "転職"]
result = pipeline.run(target, keywords=manual_keywords)
```

### Q4: 信頼性スコアが常に40点

**回答**: Instagram API呼び出しが失敗している可能性があります。APIトークンと実行ログを確認してください。

## トラブルシューティング

詳細なトラブルシューティングは `resources/troubleshooting.md` を参照してください。

## ドキュメント

- **SKILL.md**: Skill定義と概要
- **resources/workflow_guide.md**: 詳細ワークフローガイド
- **resources/quality_criteria.md**: 品質基準と合格判定基準
- **resources/troubleshooting.md**: トラブルシューティングガイド

## 既存モジュールとの関係

このSkillは以下の既存モジュールを統合したものです:

- `lib/nemotron_persona_selector.py` - Nemotronペルソナ選定
- `lib/instagram_keyword_generator.py` - Instagram検索キーワード生成
- `lib/persona_integrator.py` - データ統合・信頼性評価

Skillを使用することで、これらのモジュールを個別に呼び出す必要がなくなります。

## パフォーマンス

**標準設定での実行時間**:
- Nemotron選定: 60-120秒 (初回のみ、2回目以降は数秒)
- Instagram API: 60-180秒 (投稿数・キーワード数に依存)
- データ統合: 1-5秒
- **合計**: 約2-5分

**高速化のコツ**:
- ペルソナ数を1-2件に削減
- 投稿数を10-20件に削減
- Nemotron初回ロード後は再利用

## ライセンス

このSkillはUNSON OSマーケットリサーチプロジェクトの一部です。

## 更新履歴

- **2025-01-19**: 初版リリース
  - Nemotron選定、Instagram API、統合機能実装
  - 信頼性スコア算出ロジック実装
  - 矛盾検出機能実装
  - 完全自動化パイプライン実装

---

**サポート**: 問題が発生した場合は `resources/troubleshooting.md` を参照するか、プロジェクトのIssueを作成してください。
