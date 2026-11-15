# トラブルシューティングガイド

## よくある問題と解決策

### 1. 環境設定関連

#### Q1-1: `APIFY_API_TOKEN が設定されていません` エラー

**症状**:
```
ValueError: APIFY_API_TOKEN が設定されていません。.env ファイルまたは環境変数を確認してください。
```

**原因**:
- `.env` ファイルが存在しない
- `.env` ファイルに `APIFY_API_TOKEN` が記載されていない
- 環境変数が読み込まれていない

**解決策**:
```bash
# 1. .env ファイル作成
cd /home/koma/unson/unson-os-market-research
touch .env

# 2. APIトークン追加
echo "APIFY_API_TOKEN=<your_apify_token>" >> .env

# 3. 確認
cat .env

# 4. 環境変数読み込み確認
source .env
echo $APIFY_API_TOKEN
```

---

#### Q1-2: `datasets` モジュールが見つからない

**症状**:
```
ModuleNotFoundError: No module named 'datasets'
```

**原因**:
- HuggingFace `datasets` パッケージ未インストール

**解決策**:
```bash
# pipでインストール
pip install datasets>=2.14.0

# または requirements.txt から
pip install -r requirements.txt
```

---

#### Q1-3: `keyword_mapping.json` が見つからない

**症状**:
```
FileNotFoundError: [Errno 2] No such file or directory: 'config/keyword_mapping.json'
```

**原因**:
- `config/keyword_mapping.json` ファイルが存在しない
- パスが間違っている

**解決策**:
```bash
# 1. ファイル存在確認
ls config/keyword_mapping.json

# 2. 存在しない場合、既存ファイルをコピー
cp .skills/nemotron-instagram-persona/config/keyword_mapping.json config/

# 3. または、Skillフォルダ内のファイルを直接指定
# (パイプライン初期化時に明示的にパス指定)
```

---

### 2. Nemotronペルソナ選定関連

#### Q2-1: 条件に一致するペルソナが見つかりません

**症状**:
```
⚠️ 条件に一致するペルソナが見つかりませんでした
```

**原因**:
- ターゲット記述が厳しすぎる
- 複数条件の組み合わせでマッチ0件

**解決策**:

**ステップ1**: 条件を緩和
```python
# 厳しすぎる例
"25歳の東京在住ITエンジニアで転職希望者"  # ❌

# 緩和版
"20代の東京在住ITエンジニア"  # ✅
```

**ステップ2**: 地域条件を削除
```python
# 地域条件あり
"東京在住の30代デザイナー"  # マッチ少ない可能性

# 地域条件なし
"30代のデザイナー"  # マッチ増加
```

**ステップ3**: 職業のみで検索
```python
# シンプル版
"ITエンジニア"  # 最も広い検索
```

---

#### Q2-2: スコアが低いペルソナばかり返ってくる

**症状**:
- 全ペルソナのスコアが30点以下

**原因**:
- ユーザー入力とNemotronデータの語彙ミスマッチ
- キーワードマッピングに該当なし

**解決策**:

**ステップ1**: より一般的な用語を使用
```python
# 特殊用語
"SaaSエンジニア"  # マッチしにくい

# 一般用語
"ITエンジニア"  # マッチしやすい
```

**ステップ2**: `max_results` を増やす
```python
personas = selector.select_personas(
    "ターゲット",
    max_results=10  # デフォルト5から増やす
)
```

---

### 3. Instagram API関連

#### Q3-1: Instagram API タイムアウト

**症状**:
```
TimeoutError: ジョブタイムアウト (180秒)
```

**原因**:
- Apify Actorの処理時間超過
- ネットワーク遅延
- Instagram側のレート制限

**解決策**:

**ステップ1**: タイムアウト延長
```python
# デフォルト180秒
instagram_data = apify_client.search_posts(
    "検索クエリ",
    timeout=300  # 5分に延長
)
```

**ステップ2**: 投稿数を減らす
```python
# デフォルト50件
instagram_data = apify_client.search_posts(
    "検索クエリ",
    max_posts=20  # 20件に削減
)
```

**ステップ3**: リトライロジック追加
```python
import time

for attempt in range(3):  # 3回リトライ
    try:
        instagram_data = apify_client.search_posts(...)
        break
    except TimeoutError:
        print(f"リトライ {attempt + 1}/3")
        time.sleep(30)
```

---

#### Q3-2: Instagram データが0件

**症状**:
```
✅ Instagram データ取得完了: 0件
```

**原因**:
- 検索キーワードが厳しすぎる
- Instagram上に該当データなし
- Apify Actor実行失敗

**解決策**:

**ステップ1**: キーワード確認
```python
# 生成されたキーワードを確認
keywords = keyword_gen.generate_keywords(persona)
print(f"検索キーワード: {keywords}")

# 汎用的すぎる、または特殊すぎるキーワードを修正
```

**ステップ2**: 手動キーワード指定
```python
# 自動生成をスキップして手動指定
manual_keywords = ["IT", "エンジニア", "転職"]
instagram_data = apify_client.search_combined(manual_keywords)
```

**ステップ3**: Actorログ確認
```bash
# Apify ダッシュボードでジョブログを確認
# https://console.apify.com/actors/runs
```

---

#### Q3-3: API認証エラー

**症状**:
```
requests.exceptions.HTTPError: 401 Client Error: Unauthorized
```

**原因**:
- APIトークンが無効
- トークンの権限不足
- トークン期限切れ

**解決策**:

**ステップ1**: トークン確認
```bash
# 環境変数確認
echo $APIFY_API_TOKEN

# .envファイル確認
cat .env | grep APIFY_API_TOKEN
```

**ステップ2**: Apifyダッシュボードでトークン再生成
1. https://console.apify.com/account/integrations にアクセス
2. "Personal API tokens" セクション
3. 既存トークンの権限確認または新規生成

**ステップ3**: トークン更新
```bash
# .env ファイル更新
echo "APIFY_API_TOKEN=新しいトークン" > .env
```

---

### 4. データ統合関連

#### Q4-1: 信頼性スコアが常に40点

**症状**:
- 全ペルソナの信頼性スコアが40点固定

**原因**:
- Instagram データ統合失敗
- `instagram_data=None` で統合実行

**解決策**:

**ステップ1**: Instagram データ取得確認
```python
# Instagram データ取得後に確認
if instagram_data is None:
    print("⚠️ Instagram データ取得失敗")
else:
    print(f"投稿: {len(instagram_data.get('posts', []))}件")
    print(f"プロフィール: {len(instagram_data.get('profiles', []))}件")
```

**ステップ2**: フォールバック処理確認
```python
# エラーハンドリング追加
try:
    instagram_data = apify_client.search_combined(keywords)
except Exception as e:
    print(f"Instagram取得失敗: {e}")
    instagram_data = None  # Nemotronのみで続行
```

---

#### Q4-2: 矛盾が多数検出される

**症状**:
```
検出された問題:
- 年齢と投稿内容の不一致: 若年層だが退職関連投稿
- 職業とハッシュタグの不一致: IT職だがIT関連投稿なし
```

**原因**:
- Nemotronペルソナとinstagram検索結果のミスマッチ
- キーワード生成が不適切

**解決策**:

**ステップ1**: キーワード生成見直し
```python
# より具体的なキーワード生成
keywords = keyword_gen.generate_keywords(
    persona,
    max_keywords=15  # デフォルト10から増やす
)
```

**ステップ2**: Instagramデータフィルタリング強化
```python
# 投稿内容でフィルタリング (将来実装)
filtered_posts = [
    post for post in instagram_data['posts']
    if any(kw in post.get('caption', '') for kw in relevant_keywords)
]
```

**ステップ3**: Nemotronペルソナ再選定
```python
# より厳密な条件で再選定
personas = selector.select_personas(
    "30代のITエンジニアで転職検討中",  # 条件を具体化
    max_results=5
)
```

---

### 5. パフォーマンス関連

#### Q5-1: 処理時間が長すぎる (5分以上)

**症状**:
- パイプライン実行に5分以上かかる

**原因**:
- Nemotronデータセット初回ロード (1-2分)
- Instagram API待機時間 (2-3分)
- 大量ペルソナ処理

**解決策**:

**ステップ1**: Nemotronキャッシュ確認
```python
# NemotronPersonaSelectorは初回のみデータセットロード
# 2回目以降は高速化されるはず
```

**ステップ2**: ペルソナ数削減
```python
# デフォルト3件
result = pipeline.run(
    "ターゲット",
    max_personas=1  # 1件のみ (高速化)
)
```

**ステップ3**: Instagram投稿数削減
```python
result = pipeline.run(
    "ターゲット",
    max_posts_per_keyword=10  # デフォルト20から削減
)
```

---

#### Q5-2: メモリ不足エラー

**症状**:
```
MemoryError
```

**原因**:
- Nemotronデータセット (1M件) のメモリ消費
- Instagram大量データ保持

**解決策**:

**ステップ1**: Pythonメモリ制限確認
```bash
# メモリ使用量確認
python -c "import psutil; print(f'Available: {psutil.virtual_memory().available / (1024**3):.2f} GB')"
```

**ステップ2**: データセットストリーミング (将来実装)
```python
# HuggingFace datasets のストリーミングモード
# (現在は未実装、将来的に対応)
```

---

### 6. レポート生成関連

#### Q6-1: Markdownレポートが文字化け

**症状**:
- 日本語が正しく表示されない

**原因**:
- ファイル保存時のエンコーディング問題

**解決策**:
```python
# UTF-8エンコーディング明示
with open("report.md", "w", encoding="utf-8") as f:
    f.write(result["markdown_report"])
```

---

#### Q6-2: レポートに実際の悩みが含まれない

**症状**:
```
## 実際の悩み・課題
(なし)
```

**原因**:
- Instagram投稿に悩みキーワードなし
- 悩みキーワードリストに該当なし

**解決策**:

**ステップ1**: 悩みキーワード追加 (将来実装)
```python
# PersonaIntegratorの_extract_pain_points()メソッドを拡張
pain_keywords = [
    "悩", "困", "不安", "課題", "問題", "難し",
    "迷い", "ストレス", "苦労"  # 追加
]
```

**ステップ2**: Instagram検索キーワードに悩み系追加
```python
# 悩み関連キーワードを明示的に追加
keywords.extend(["#転職悩み", "#キャリア不安"])
```

---

## デバッグ手順

### 一般的なデバッグフロー

```python
# ステップバイステップデバッグ
from .core.nemotron_instagram_pipeline import NemotronInstagramPipeline

# 1. 初期化確認
pipeline = NemotronInstagramPipeline()
# → エラー出る場合: 環境変数、依存パッケージ確認

# 2. Nemotron選定確認
personas = pipeline.nemotron_selector.select_personas("30代ITエンジニア")
print(f"選定数: {len(personas)}")
# → 0件の場合: 条件緩和

# 3. キーワード生成確認
keywords = pipeline.keyword_generator.generate_keywords(personas[0])
print(f"キーワード: {keywords}")
# → 0件の場合: keyword_mapping.json確認

# 4. Instagram API確認
instagram_data = pipeline.apify_client.search_posts(keywords[0], max_posts=5)
print(f"投稿数: {len(instagram_data['posts'])}")
# → エラーの場合: APIトークン確認

# 5. 統合確認
integrated = pipeline.integrator.integrate(personas[0], instagram_data)
print(f"信頼性スコア: {integrated['信頼性スコア']}")
```

---

## サポートリソース

### ログ確認

```python
# 詳細ログ出力
import logging
logging.basicConfig(level=logging.DEBUG)

# パイプライン実行
result = pipeline.run("ターゲット")
```

### エラーレポート

エラー報告時は以下を含めてください:
1. エラーメッセージ全文
2. 実行環境 (Python バージョン、OS)
3. 使用したターゲット記述
4. `APIFY_API_TOKEN` 設定状況 (トークン値は含めない)
5. Nemotronデータセット読み込み成功/失敗

---

## クイックリファレンス

| 問題 | 解決策 |
|------|--------|
| APIFY_TOKEN未設定 | `.env`ファイルにトークン追加 |
| ペルソナ0件 | 条件緩和、地域削除 |
| Instagram 0件 | キーワード見直し、手動指定 |
| タイムアウト | `timeout`延長、投稿数削減 |
| 信頼性スコア40点固定 | Instagram取得確認 |
| 矛盾多数 | キーワード具体化、ペルソナ再選定 |
| 処理時間長い | ペルソナ数削減、投稿数削減 |

---

*詳細なワークフローは `workflow_guide.md` を参照*
*品質基準は `quality_criteria.md` を参照*
