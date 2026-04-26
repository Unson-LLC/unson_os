# Nemotron-Instagram 統合ガイド

## 概要

このガイドでは、Nemotron-Personas-Japan データセットと Instagram データを統合して、信頼性の高いペルソナ分析を行う方法を説明します。

## システム構成

### 3つのコアモジュール

1. **NemotronPersonaSelector** (`lib/nemotron_persona_selector.py`)
   - 1M件の日本人ペルソナから条件に合致するペルソナを選定
   - スコアリング機能付き（0-100点）

2. **InstagramKeywordGenerator** (`lib/instagram_keyword_generator.py`)
   - Nemotronペルソナから Instagram 検索キーワードを生成
   - 日本語70%、英語30%の最適比率
   - Apify Instagram API フォーマット対応

3. **PersonaIntegrator** (`lib/persona_integrator.py`)
   - Nemotron と Instagram データを統合
   - 信頼性スコア算出（100点満点）
   - 矛盾検出機能

## クイックスタート

### 基本的な使い方

```python
from lib.nemotron_persona_selector import NemotronPersonaSelector
from lib.instagram_keyword_generator import InstagramKeywordGenerator
from lib.persona_integrator import PersonaIntegrator

# Step 1: Nemotron ペルソナ選定
selector = NemotronPersonaSelector()
personas = selector.select_personas("30代のITエンジニア", max_results=5)

# Step 2: Instagram キーワード生成
keyword_gen = InstagramKeywordGenerator()
first_persona = personas[0]
keywords = keyword_gen.generate_keywords(first_persona, max_keywords=10)

# Step 3: Apify フォーマットに変換（Instagram API用）
apify_input = keyword_gen.format_for_apify(keywords)
print(f"ハッシュタグ: {apify_input['hashtags']}")
print(f"検索クエリ: {apify_input['search_queries']}")

# Step 4: Instagram データ取得（Apify Instagram API を使用）
# ※実際のAPI呼び出しは別途実装が必要
# instagram_data = fetch_instagram_data(apify_input)

# Step 5: ペルソナ統合
integrator = PersonaIntegrator()
integrated = integrator.integrate(first_persona, instagram_data=None)

# Step 6: Markdown 出力
markdown = integrator.format_output(integrated)
print(markdown)
```

## 詳細ガイド

### 1. Nemotron ペルソナ選定

#### 基本的な選定

```python
selector = NemotronPersonaSelector()

# 職業で選定
personas = selector.select_personas("デザイナー", max_results=3)

# 年代と職業で選定
personas = selector.select_personas("20代のマーケター", max_results=5)

# 詳細条件で選定
personas = selector.select_personas(
    "東京在住の30代IT起業家",
    max_results=10
)
```

#### フィルタリング条件

NemotronPersonaSelector は以下のフィールドで検索可能：

- **年齢**: `age`
- **性別**: `sex`
- **都道府県**: `prefecture`
- **地方**: `region`
- **職業**: `occupation`
- **学歴**: `education_level`
- **婚姻状況**: `marital_status`
- **キャリア目標**: `career_goals_and_ambitions`
- **スキル**: `skills_and_expertise`
- **趣味**: `hobbies_and_interests`

#### スコアリング

選定されたペルソナは関連性スコア（0-100点）でソートされます：

```python
for persona in personas:
    print(f"スコア: {persona['_relevance_score']}/100")
    print(f"職業: {persona['occupation']}")
    print(f"年齢: {persona['age']}歳")
```

### 2. Instagram キーワード生成

#### キーワード生成戦略

```python
keyword_gen = InstagramKeywordGenerator()

# 基本生成（デフォルト5キーワード）
keywords = keyword_gen.generate_keywords(persona)

# カスタム数指定
keywords = keyword_gen.generate_keywords(persona, max_keywords=15)
```

#### 生成されるキーワードの種類

1. **職業系キーワード**（日本語70%）
   - 例: "ITエンジニア", "フリーランス", "デザイナー"

2. **興味・趣味系キーワード**（日本語70%）
   - 例: "カメラ", "旅行", "プログラミング"

3. **地域系キーワード**（日本語優先）
   - 例: "東京", "大阪", "関東"

4. **英語キーワード**（30%）
   - 例: "engineer", "freelance", "design"

#### Apify フォーマット変換

```python
apify_input = keyword_gen.format_for_apify(keywords)

# 出力例
{
    "hashtags": ["#ITエンジニア", "#フリーランス", "#engineer"],
    "search_queries": ["ITエンジニア", "フリーランス", "engineer"]
}
```

### 3. ペルソナ統合と信頼性スコア

#### 統合の基本

```python
integrator = PersonaIntegrator()

# Nemotron のみ（Instagram データなし）
integrated = integrator.integrate(nemotron_persona)
# → 信頼性スコア: 40/100

# Nemotron + Instagram データ
integrated = integrator.integrate(nemotron_persona, instagram_data)
# → 信頼性スコア: 最大100/100
```

#### 信頼性スコアの配点

| データソース | 配点 | 条件 |
|------------|------|------|
| Nemotron 統計的裏付け | 40点 | Nemotronペルソナ存在 |
| Instagram 投稿数 | 最大30点 | 50投稿以上=30点、20投稿以上=20点、10投稿以上=10点 |
| Instagram プロフィール数 | 最大10点 | 10プロフィール以上=10点、5プロフィール以上=5点 |
| 整合性チェック | 最大20点 | 矛盾なし=20点、軽微な矛盾=10点 |

**合計**: 最大100点

#### 信頼性スコアの解釈

- **80-100点**: 高信頼性 - Nemotron + Instagram 豊富なデータ + 矛盾なし
- **60-79点**: 中信頼性 - Instagram データあり、軽微な矛盾または少量データ
- **40-59点**: 低信頼性 - Nemotron のみ、または Instagram データ不足
- **0-39点**: 不完全 - データ不足（通常は発生しない）

#### Instagram データ形式

```python
instagram_data = {
    "profiles": [
        {
            "username": "user123",
            "followersCount": 1500,
            "postsCount": 200,
            "biography": "Freelance designer based in Tokyo"
        }
    ],
    "posts": [
        {
            "caption": "New design project! #design #freelance",
            "likesCount": 150,
            "commentsCount": 10
        }
    ]
}
```

### 4. 矛盾検出機能

統合時に自動的に矛盾をチェックします：

#### 検出される矛盾の例

1. **年齢と投稿内容の不一致**
   - 20代だが退職・老後関連の投稿
   - 50代以上だが学生関連の投稿

2. **職業とハッシュタグの不一致**
   - IT職だがIT関連投稿が全くない
   - デザイナーだがデザイン関連投稿なし

#### 矛盾チェック結果の確認

```python
integrated = integrator.integrate(nemotron_persona, instagram_data)

consistency = integrated["矛盾チェック"]
print(f"矛盾なし: {consistency['矛盾なし']}")
print(f"検出された問題: {consistency['検出された問題']}")
```

### 5. 出力フォーマット

#### Markdown 出力

```python
markdown = integrator.format_output(integrated)

# ファイルに保存
with open("persona_profile.md", "w", encoding="utf-8") as f:
    f.write(markdown)
```

#### 出力例

```markdown
# 統合ペルソナプロファイル

## 信頼性スコア: 90/100

## 基本情報
- **年齢**: 28歳
- **性別**: 女性
- **居住地**: 東京都 (関東)

## デモグラフィック
- **職業**: デザイナー
- **学歴**: 大学卒業
- **婚姻状況**: 未婚

## キャリア情報
- **キャリア目標**: フリーランスとして独立したい...
- **スキル**: Adobe Creative Suite, UI/UX...

## Instagram 投稿分析
- **投稿数**: 50件
- **頻出ハッシュタグ**: #design, #freelance, #creative, #portfolio
- **平均いいね数**: 135.5
- **平均コメント数**: 8.2

## 実際の悩み・課題
1. フリーランスの安定収入が不安...
2. クライアント獲得に苦労...

## データソース
- **Nemotron ペルソナ**: ✅
- **Instagram データ**: ✅

## 整合性チェック
- ✅ 矛盾なし
```

## ユースケース別ガイド

### ユースケース1: 新規サービスのターゲットペルソナ作成

```python
# 1. ターゲット層を定義
target = "30代の在宅ワーカー"

# 2. Nemotronペルソナ選定
personas = selector.select_personas(target, max_results=10)

# 3. 上位3名で Instagram 検証
for persona in personas[:3]:
    keywords = keyword_gen.generate_keywords(persona)
    apify_input = keyword_gen.format_for_apify(keywords)

    # Instagram データ取得（実装例）
    # instagram_data = apify_client.fetch(apify_input)

    # 統合
    integrated = integrator.integrate(persona, instagram_data)

    # 信頼性スコア80点以上のみ採用
    if integrated["信頼性スコア"] >= 80:
        print(integrator.format_output(integrated))
```

### ユースケース2: 競合分析のペルソナ特定

```python
# 1. 競合ユーザー層を推定
competitors_target = "20代のスタートアップ志向者"

# 2. ペルソナ選定
personas = selector.select_personas(competitors_target, max_results=5)

# 3. Instagram で実態確認
for persona in personas:
    keywords = keyword_gen.generate_keywords(persona, max_keywords=15)
    # Instagram データ取得 + 統合
    integrated = integrator.integrate(persona, instagram_data)

    # 実際の悩みを抽出
    pain_points = integrated.get("実際の悩み", [])
    print(f"ペルソナの悩み: {pain_points}")
```

### ユースケース3: コンテンツマーケティングのペルソナ検証

```python
# 1. 既存ペルソナ仮説
hypothesis = "40代の経営者層"

# 2. Nemotron で統計的検証
personas = selector.select_personas(hypothesis, max_results=3)

# 3. Instagram で実態検証
for persona in personas:
    keywords = keyword_gen.generate_keywords(persona)
    # データ取得 + 統合
    integrated = integrator.integrate(persona, instagram_data)

    # 頻出ハッシュタグで興味を確認
    hashtags = integrated.get("Instagram投稿分析", {}).get("頻出ハッシュタグ", [])
    print(f"興味トピック: {hashtags[:5]}")

    # 矛盾チェックで仮説検証
    if integrated["矛盾チェック"]["矛盾なし"]:
        print("✅ 仮説と実態が一致")
    else:
        print("⚠️ 仮説と実態に乖離あり")
```

## ベストプラクティス

### 1. ペルソナ選定のコツ

✅ **推奨**:
- 具体的な条件を指定（例: "30代の東京在住ITエンジニア"）
- max_results は 3-10 程度に設定
- スコア上位のペルソナを優先

❌ **非推奨**:
- 曖昧すぎる条件（例: "若者"）
- max_results を 50 以上に設定（処理時間増大）
- スコアを無視してランダム選択

### 2. Instagram データ量の目安

| 信頼性レベル | 投稿数 | プロフィール数 |
|------------|-------|--------------|
| 低 | 10-19 | 1-4 |
| 中 | 20-49 | 5-9 |
| 高 | 50+ | 10+ |

### 3. エラーハンドリング

```python
try:
    personas = selector.select_personas(user_input, max_results=5)

    if not personas:
        print("⚠️ マッチするペルソナが見つかりませんでした")
        # フォールバック処理

    for persona in personas:
        keywords = keyword_gen.generate_keywords(persona)

        # Instagram データ取得
        instagram_data = fetch_instagram_data(keywords)

        if not instagram_data or not instagram_data.get("posts"):
            print("⚠️ Instagram データ取得失敗、Nemotron のみで統合")
            integrated = integrator.integrate(persona)
        else:
            integrated = integrator.integrate(persona, instagram_data)

        # 信頼性スコアチェック
        if integrated["信頼性スコア"] < 60:
            print("⚠️ 信頼性スコアが低いため、追加検証を推奨")

except Exception as e:
    print(f"エラー発生: {e}")
```

### 4. パフォーマンス最適化

- **Nemotron データセットのキャッシュ**: 初回ロード後は再利用
- **並列処理**: 複数ペルソナを並列で処理
- **Instagram API レート制限**: Apify の制限を考慮して実装

```python
# 並列処理例（概念コード）
from concurrent.futures import ThreadPoolExecutor

def process_persona(persona):
    keywords = keyword_gen.generate_keywords(persona)
    # Instagram データ取得
    instagram_data = fetch_instagram_data(keywords)
    return integrator.integrate(persona, instagram_data)

with ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(process_persona, personas[:3]))
```

## トラブルシューティング

### Q1: "No matching personas found" エラー

**原因**: 検索条件が厳しすぎる

**解決策**:
- 条件を緩和（例: "25歳のデザイナー" → "20代のデザイナー"）
- 地域条件を削除
- 職業のみで検索

### Q2: 信頼性スコアが常に40点

**原因**: Instagram データが統合されていない

**解決策**:
- Instagram データ取得の実装を確認
- `instagram_data=None` でないことを確認
- Apify API の接続状態を確認

### Q3: 矛盾が多数検出される

**原因**: Nemotronペルソナと Instagram データのミスマッチ

**解決策**:
- キーワード生成を見直し（より具体的に）
- Instagram データのフィルタリング強化
- Nemotron ペルソナの選定条件を調整

### Q4: 処理時間が長い

**原因**: Nemotronデータセット初回ロードまたは大量ペルソナ処理

**解決策**:
- NemotronPersonaSelector の初期化を1回のみ実行
- max_results を 10 以下に制限
- Instagram データ取得の並列化

## API リファレンス

### NemotronPersonaSelector

```python
class NemotronPersonaSelector:
    def __init__(self):
        """HuggingFace から Nemotron データセットをロード"""

    def select_personas(
        self,
        query: str,
        max_results: int = 5
    ) -> List[Dict]:
        """
        Args:
            query: 検索クエリ（例: "30代のITエンジニア"）
            max_results: 最大返却数

        Returns:
            List[Dict]: ペルソナリスト（スコア降順）
        """
```

### InstagramKeywordGenerator

```python
class InstagramKeywordGenerator:
    def generate_keywords(
        self,
        persona: Dict,
        max_keywords: int = 5
    ) -> List[str]:
        """
        Args:
            persona: Nemotronペルソナ辞書
            max_keywords: 最大キーワード数

        Returns:
            List[str]: キーワードリスト（日本語70%、英語30%）
        """

    def format_for_apify(
        self,
        keywords: List[str]
    ) -> Dict:
        """
        Args:
            keywords: キーワードリスト

        Returns:
            Dict: {"hashtags": [...], "search_queries": [...]}
        """
```

### PersonaIntegrator

```python
class PersonaIntegrator:
    def integrate(
        self,
        nemotron_persona: Dict,
        instagram_data: Optional[Dict] = None
    ) -> Dict:
        """
        Args:
            nemotron_persona: Nemotronペルソナ辞書
            instagram_data: Instagram APIデータ（オプション）

        Returns:
            Dict: 統合ペルソナ（信頼性スコア、矛盾チェック含む）
        """

    def format_output(
        self,
        integrated: Dict
    ) -> str:
        """
        Args:
            integrated: 統合ペルソナ

        Returns:
            str: Markdown形式の文字列
        """
```

## まとめ

Nemotron-Instagram 統合システムは、以下の3ステップで高信頼性ペルソナを生成します：

1. **Nemotron 統計的ベースライン**: 1M件から最適ペルソナを選定
2. **Instagram 実データ検証**: 実際のユーザー行動でエンリッチメント
3. **統合と信頼性評価**: 矛盾検出 + 100点満点スコアリング

**推奨フロー**:
```
ターゲット定義 → Nemotron選定 → キーワード生成 → Instagram取得 → 統合 → スコア確認（80点以上採用）
```

このシステムにより、**抽象的なペルソナ仮説を、統計と実データの両面から検証された具体的なペルソナ**に変換できます。

---

**関連ドキュメント**:
- [実装計画](../IMPLEMENTATION_PLAN.md)
- [進捗レポート](../PROGRESS_REPORT.md)
- [テスト仕様](../tests/test_e2e_integration.py)

**サポート**:
- GitHub Issues: プロジェクトリポジトリ
- テストコード: `tests/` ディレクトリ参照
