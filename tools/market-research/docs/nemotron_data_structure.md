# Nemotron-Personas-Japan データ構造ドキュメント

## 📋 概要

**データセット名**: Nemotron-Personas-Japan
**提供元**: NVIDIA
**ライセンス**: CC-BY-4.0
**HuggingFace URL**: https://huggingface.co/datasets/nvidia/Nemotron-Personas-Japan

### データセット規模
- **総ペルソナ数**: 1,000,000 件
- **総トークン数**: 約 14億トークン
- **フィールド数**: 22フィールド
- **データサイズ**: 1.73GB (初回ダウンロード時)
- **職業カテゴリー**: 1,500+ 種類
- **都道府県カバレッジ**: 全47都道府県

### 特徴
- ✅ 日本の人口統計に基づいた統計的裏付け
- ✅ 文化的妥当性（日本の教育制度、職業分布を反映）
- ✅ 多様性確保（年齢、性別、地域、職業の広範な分布）
- ✅ プライバシー保護（個人を特定できる情報なし）
- ✅ 合成データ（実在の人物ではない）

---

## 🗂️ フィールド構造 (22フィールド)

### 1. デモグラフィックフィールド (8)

#### 1.1 `age` (年齢)
- **型**: Integer
- **範囲**: 18-100 歳
- **制約**: 18歳未満なし
- **用途**: ペルソナ選定の主要フィルタ条件
- **例**: `26`, `34`, `42`

#### 1.2 `sex` (性別)
- **型**: String
- **値**: `男性`, `女性`
- **用途**: デモグラフィック分析
- **注意**: 国勢調査データに基づく生物学的性別

#### 1.3 `prefecture` (都道府県)
- **型**: String
- **値**: 全47都道府県
- **用途**: 地域ターゲティング
- **例**: `東京都`, `大阪府`, `北海道`, `沖縄県`

#### 1.4 `region` (地方)
- **型**: String
- **値**: 日本の地方区分
- **用途**: 広域地域分析
- **例**: `関東`, `関西`, `九州`, `東北`

#### 1.5 `country` (国)
- **型**: String
- **値**: `日本` (固定)
- **用途**: 将来の国際化対応時の拡張用

#### 1.6 `occupation` (職業)
- **型**: String
- **カテゴリー数**: 1,500+ 種類
- **用途**: Instagram キーワード生成の主要ソース
- **例**: `ITエンジニア`, `デザイナー`, `営業`, `教師`, `医師`

#### 1.7 `education_level` (学歴)
- **型**: String
- **値**: 日本の教育制度に基づく
- **用途**: ペルソナ詳細化
- **例**: `高校卒業`, `大学卒業`, `大学院卒業`, `専門学校卒業`

#### 1.8 `marital_status` (婚姻状況)
- **型**: String
- **値**: `未婚`, `既婚`, etc.
- **用途**: ライフステージ分析

---

### 2. ペルソナフィールド (6)

#### 2.1 `professional_persona` (プロフェッショナルペルソナ)
- **型**: String (長文)
- **内容**: 職業関連の詳細な人物像・ストーリー
- **用途**: ビジネス関連ペルソナの主要情報源
- **例**: "ITエンジニアとして10年のキャリアを持ち、現在はリーダーポジションを目指している..."

#### 2.2 `sports_persona` (スポーツペルソナ)
- **型**: String (長文)
- **内容**: スポーツ・健康関連の人物像
- **用途**: スポーツ関連ターゲティング
- **例**: "週3回のジョギングを習慣にしており、マラソン大会にも定期的に参加..."

#### 2.3 `arts_persona` (アーツペルソナ)
- **型**: String (長文)
- **内容**: 芸術・文化関連の人物像
- **用途**: クリエイティブ分野ターゲティング
- **例**: "美術館巡りが趣味で、週末は絵画鑑賞や陶芸教室に通っている..."

#### 2.4 `travel_persona` (トラベルペルソナ)
- **型**: String (長文)
- **内容**: 旅行関連の人物像
- **用途**: 旅行・観光関連ターゲティング
- **例**: "年に2-3回は国内旅行を楽しみ、地方の温泉地を巡るのが好き..."

#### 2.5 `culinary_persona` (カリナリーペルソナ)
- **型**: String (長文)
- **内容**: 料理・食文化関連の人物像
- **用途**: 飲食・グルメ関連ターゲティング
- **例**: "料理が趣味で、週末は新しいレシピに挑戦している。地元の食材を使った..."

#### 2.6 `general_persona` (一般ペルソナ)
- **型**: String (長文)
- **内容**: 総合的な人物像・ライフスタイル
- **用途**: 全般的なペルソナ理解
- **例**: "東京都在住の26歳ITエンジニア。仕事とプライベートのバランスを大切にし..."

---

### 3. 行動・興味関心フィールド (4)

#### 3.1 `hobbies_and_interests` (趣味・興味関心)
- **型**: String
- **用途**: Instagram キーワード生成のセカンダリーソース
- **例**: `プログラミング`, `旅行`, `カメラ`, `読書`

#### 3.2 `skills_and_expertise` (スキル・専門知識)
- **型**: String
- **用途**: Instagram キーワード生成のターシャリーソース
- **例**: `Python`, `デザイン思考`, `プロジェクトマネジメント`, `英語`

#### 3.3 `career_goals` (キャリア目標)
- **型**: String
- **用途**: Instagram キーワード生成の主要ソース（転職、起業等）
- **例**: `転職を検討している`, `フリーランスとして独立したい`, `マネジメント経験を積みたい`

#### 3.4 `cultural_background` (文化的背景)
- **型**: String
- **用途**: 文化的妥当性チェック
- **例**: 日本の文化的コンテキストに基づく情報

---

## 📊 データ分布

### 年齢分布
- 日本の実際の人口ピラミッドを反映
- 中高年層の割合が高い（現実の日本を反映）
- 若年層は相対的に少ない

### 性別分布
- 国勢調査データに基づく
- ほぼ均等（男性50%, 女性50%程度）

### 地域分布
- 全47都道府県をカバー
- 人口分布を反映（東京、大阪、愛知等の大都市圏が多い）

### 職業分布
- 1,500+ カテゴリー
- 日本の産業構造を反映
- IT、サービス業、製造業、医療・福祉等の多様性

---

## 🔧 使用方法

### データセット読み込み
```python
from datasets import load_dataset

# データセット読み込み
ds = load_dataset("nvidia/Nemotron-Personas-Japan", split="train")

# レコード数確認
print(f"Total records: {len(ds):,}")

# フィールド確認
print(f"Fields: {list(ds.features.keys())}")

# サンプル表示
print(ds[0])
```

### フィルタリング例
```python
# 20代でフィルタリング
young_personas = ds.filter(lambda x: 20 <= x["age"] <= 29)

# 東京都在住でフィルタリング
tokyo_personas = ds.filter(lambda x: x["prefecture"] == "東京都")

# ITエンジニアでフィルタリング
it_personas = ds.filter(lambda x: "IT" in x["occupation"] or "エンジニア" in x["occupation"])

# 複合条件
filtered = ds.filter(
    lambda x: 20 <= x["age"] <= 29 and x["prefecture"] == "東京都" and "IT" in x["occupation"]
)
```

### ランダムサンプリング
```python
# ランダムに10件抽出
import random
indices = random.sample(range(len(ds)), 10)
samples = ds.select(indices)
```

---

## 🎯 Instagram キーワード生成での活用

### 優先順位
1. **Primary (最優先)**: `occupation`, `career_goals`
2. **Secondary (次優先)**: `hobbies_and_interests`, `professional_persona`
3. **Tertiary (補助)**: `skills_and_expertise`, `age`
4. **Supplementary (追加)**: `sports_persona`, `travel_persona`, `culinary_persona`

### 活用例
```python
persona = ds[0]

# 職業から Instagram ハッシュタグ
occupation = persona["occupation"]  # "ITエンジニア"
hashtags = ["#エンジニア", "#SE", "#プログラマー"]

# キャリア目標から
career_goal = persona["career_goals"]  # "転職を検討している"
hashtags += ["#転職", "#キャリアチェンジ"]

# 趣味から
hobbies = persona["hobbies_and_interests"]  # "プログラミング、旅行"
hashtags += ["#プログラミング", "#旅行"]
```

---

## ⚠️ 注意事項

### 制約
1. **18歳未満なし**: 10代ターゲットは対応不可（Instagram のみで対応）
2. **日本市場特化**: 他国の市場分析には不適
3. **合成データ**: 実在の人物ではない（統計的に妥当だが個別の実在性はなし）

### ベストプラクティス
1. **Instagram データと統合**: Nemotron 単独ではなく、Instagram 実データと組み合わせる
2. **矛盾チェック**: Nemotron の属性と Instagram データの整合性を確認
3. **多様性確保**: 同一職業・地域のペルソナが偏らないようフィルタリング
4. **定期的更新**: データセットの更新をチェック（統計データの最新性）

---

## 📚 参考リンク

- [HuggingFace Dataset Page](https://huggingface.co/datasets/nvidia/Nemotron-Personas-Japan)
- [NVIDIA Blog Post](https://huggingface.co/blog/nvidia/nemotron-personas-japan)
- [実装計画書](../IMPLEMENTATION_PLAN.md)
- [フィールドマッピング定義](../config/nemotron_field_mapping.json)

---

**作成日**: 2025-10-10
**バージョン**: 1.0.0
**作成者**: Phase 1 Implementation Team
