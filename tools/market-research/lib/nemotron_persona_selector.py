"""
Nemotron-Personas-Japan ペルソナ選定モジュール

ユーザー入力から適切な Nemotron ペルソナを抽出するクラスを提供します。
"""

import re
from typing import List, Dict, Optional, Tuple
from datasets import load_dataset


class NemotronPersonaSelector:
    """
    Nemotron-Personas-Japan からユーザー入力に基づいてペルソナを抽出
    """

    def __init__(self, cache_dataset: bool = True):
        """
        初期化

        Args:
            cache_dataset: データセットをキャッシュするか (デフォルト: True)
        """
        print("📊 Nemotron-Personas-Japan データセット読み込み中...")
        self.dataset = load_dataset(
            "nvidia/Nemotron-Personas-Japan",
            split="train"
        )
        print(f"✅ データセット読み込み完了: {len(self.dataset):,} ペルソナ")

        # 年齢グループマッピング
        self.age_group_keywords = {
            "10代": (18, 19),  # 18歳未満なし
            "20代": (20, 29),
            "30代": (30, 39),
            "40代": (40, 49),
            "50代": (50, 59),
            "60代": (60, 69),
            "70代": (70, 100),
        }

        # 職業キーワードマッピング
        self.occupation_keywords = {
            "IT": ["IT", "エンジニア", "プログラマー", "システム", "ソフトウェア", "情報"],
            "エンジニア": ["エンジニア", "技術", "開発", "プログラマー"],
            "デザイナー": ["デザイナー", "デザイン", "クリエイター", "UI", "UX"],
            "営業": ["営業", "販売", "セールス"],
            "マーケター": ["マーケティング", "マーケター", "広告", "宣伝"],
            "教師": ["教師", "教員", "講師", "先生", "教育"],
            "医療": ["医師", "看護", "医療", "病院", "クリニック"],
            "起業": ["起業", "経営", "社長", "代表"],
            "フリーランス": ["フリーランス", "個人事業", "独立", "自営"],
        }

    def select_personas(
        self,
        user_input: str,
        age_range: Optional[Tuple[int, int]] = None,
        occupation_keywords: Optional[List[str]] = None,
        prefecture: Optional[str] = None,
        max_results: int = 5
    ) -> List[Dict]:
        """
        ユーザー入力からペルソナを選定

        Args:
            user_input: 抽象的なターゲット記述 (例: "20代IT転職検討者")
            age_range: 年齢範囲 (例: (20, 29))
            occupation_keywords: 職業キーワード (例: ["IT", "エンジニア"])
            prefecture: 都道府県 (例: "東京都")
            max_results: 最大抽出件数 (デフォルト: 5)

        Returns:
            ペルソナリスト (辞書形式)
        """
        print(f"\n🔍 ペルソナ選定開始: '{user_input}'")

        # ユーザー入力をパース
        conditions = self._parse_user_input(user_input)

        # 明示的なパラメータで上書き
        if age_range:
            conditions["age_range"] = age_range
        if occupation_keywords:
            conditions["occupation"] = occupation_keywords
        if prefecture:
            conditions["prefecture"] = prefecture

        print(f"📋 抽出条件: {conditions}")

        # フィルタリング
        filtered_dataset = self.dataset

        # 年齢フィルタ
        if "age_range" in conditions:
            min_age, max_age = conditions["age_range"]
            filtered_dataset = self._filter_by_age(filtered_dataset, (min_age, max_age))
            print(f"  年齢フィルタ後: {len(filtered_dataset):,} 件")

        # 職業フィルタ
        if "occupation" in conditions and conditions["occupation"]:
            filtered_dataset = self._filter_by_occupation(
                filtered_dataset, conditions["occupation"]
            )
            print(f"  職業フィルタ後: {len(filtered_dataset):,} 件")

        # 都道府県フィルタ
        if "prefecture" in conditions and conditions["prefecture"]:
            filtered_dataset = self._filter_by_prefecture(
                filtered_dataset, conditions["prefecture"]
            )
            print(f"  都道府県フィルタ後: {len(filtered_dataset):,} 件")

        # フィルタ結果が0件の場合
        if len(filtered_dataset) == 0:
            print("⚠️  条件に一致するペルソナが見つかりませんでした")
            return []

        # スコアリング
        scored_personas = []
        # 最大100件までスコアリング（パフォーマンス考慮）
        sample_size = min(len(filtered_dataset), 100)

        for i in range(sample_size):
            persona = filtered_dataset[i]
            score = self._score_relevance(persona, user_input, conditions)
            scored_personas.append((score, dict(persona)))

        # スコア順にソート
        scored_personas.sort(key=lambda x: x[0], reverse=True)

        # 上位を抽出
        top_personas = [p for _, p in scored_personas[:max_results * 3]]  # 多様性確保のため多めに

        # 多様性確保
        diverse_personas = self._ensure_diversity(top_personas, max_results)

        print(f"✅ {len(diverse_personas)} 件のペルソナを抽出")
        return diverse_personas

    def _parse_user_input(self, user_input: str) -> Dict:
        """
        ユーザー入力から検索条件を抽出

        Args:
            user_input: ユーザー入力文字列

        Returns:
            抽出条件の辞書
        """
        conditions = {}

        # 年齢範囲抽出
        for age_keyword, age_range in self.age_group_keywords.items():
            if age_keyword in user_input:
                conditions["age_range"] = age_range
                break

        # 職業キーワード抽出
        occupation_keywords = []
        for key, keywords in self.occupation_keywords.items():
            if any(kw in user_input for kw in keywords):
                occupation_keywords.extend(keywords)

        if occupation_keywords:
            conditions["occupation"] = list(set(occupation_keywords))  # 重複排除

        # 都道府県抽出（47都道府県）
        prefectures = [
            "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
            "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
            "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
            "岐阜県", "静岡県", "愛知県", "三重県",
            "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
            "鳥取県", "島根県", "岡山県", "広島県", "山口県",
            "徳島県", "香川県", "愛媛県", "高知県",
            "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
        ]

        for pref in prefectures:
            if pref in user_input:
                conditions["prefecture"] = pref
                break

        # キャリア目標キーワード
        career_keywords = []
        if "転職" in user_input:
            career_keywords.append("転職")
        if "起業" in user_input or "独立" in user_input:
            career_keywords.append("起業")
        if "フリーランス" in user_input:
            career_keywords.append("フリーランス")

        if career_keywords:
            conditions["career_goals"] = career_keywords

        return conditions

    def _filter_by_age(self, dataset, age_range: Tuple[int, int]):
        """年齢範囲でフィルタリング"""
        min_age, max_age = age_range
        return dataset.filter(lambda x: min_age <= x["age"] <= max_age)

    def _filter_by_occupation(self, dataset, keywords: List[str]):
        """職業キーワードでフィルタリング"""
        def occupation_match(example):
            occupation = str(example["occupation"]).lower()
            return any(kw.lower() in occupation for kw in keywords)

        return dataset.filter(occupation_match)

    def _filter_by_prefecture(self, dataset, prefecture: str):
        """都道府県でフィルタリング"""
        return dataset.filter(lambda x: x["prefecture"] == prefecture)

    def _score_relevance(
        self,
        persona: Dict,
        user_input: str,
        conditions: Dict
    ) -> float:
        """
        ペルソナと入力の関連度スコアリング (0-100)

        配点:
        - 年齢一致: +20
        - 職業一致: +30
        - キャリア目標一致: +20
        - 趣味・スキル一致: +15
        - 地域一致: +15
        """
        score = 0.0

        # 年齢スコア (20点)
        if "age_range" in conditions:
            min_age, max_age = conditions["age_range"]
            if min_age <= persona["age"] <= max_age:
                # 年齢範囲の中央に近いほど高スコア
                mid_age = (min_age + max_age) / 2
                age_diff = abs(persona["age"] - mid_age)
                age_range_size = max_age - min_age
                score += 20 * (1 - age_diff / (age_range_size / 2 + 1))

        # 職業スコア (30点)
        if "occupation" in conditions:
            occupation = str(persona["occupation"]).lower()
            matched_keywords = sum(
                1 for kw in conditions["occupation"] if kw.lower() in occupation
            )
            if matched_keywords > 0:
                score += 30 * min(matched_keywords / 2, 1.0)  # 最大30点

        # キャリア目標スコア (20点)
        if "career_goals" in conditions:
            career_goals = str(persona.get("career_goals_and_ambitions", "")).lower()
            matched_goals = sum(
                1 for goal in conditions["career_goals"] if goal.lower() in career_goals
            )
            if matched_goals > 0:
                score += 20 * min(matched_goals, 1.0)

        # 趣味・スキルスコア (15点)
        hobbies = str(persona.get("hobbies_and_interests", "")).lower()
        skills = str(persona.get("skills_and_expertise", "")).lower()

        if user_input:
            input_lower = user_input.lower()
            # ユーザー入力中のキーワードが趣味・スキルに含まれるか
            if any(word in hobbies or word in skills for word in input_lower.split()):
                score += 15

        # 地域スコア (15点)
        if "prefecture" in conditions:
            if persona.get("prefecture") == conditions["prefecture"]:
                score += 15

        return score

    def _ensure_diversity(self, personas: List[Dict], max_results: int) -> List[Dict]:
        """
        ペルソナの多様性確保 (類似ペルソナの排除)

        制約:
        - 同一職業: 最大2件まで
        - 同一都道府県: 最大2件まで
        - 年齢分散: ±3歳以内は1件のみ
        """
        diverse_personas = []
        occupation_count = {}
        prefecture_count = {}
        age_groups = {}

        for persona in personas:
            if len(diverse_personas) >= max_results:
                break

            occupation = persona.get("occupation", "")
            prefecture = persona.get("prefecture", "")
            age = persona.get("age", 0)
            age_group = age // 5 * 5  # 5歳刻みでグループ化

            # 同一職業チェック
            if occupation_count.get(occupation, 0) >= 2:
                continue

            # 同一都道府県チェック
            if prefecture_count.get(prefecture, 0) >= 2:
                continue

            # 年齢グループチェック
            if age_group in age_groups:
                # すでに同じ年齢グループがある場合、±3歳以内か確認
                existing_age = age_groups[age_group]
                if abs(age - existing_age) <= 3:
                    continue

            # 多様性条件をクリア
            diverse_personas.append(persona)
            occupation_count[occupation] = occupation_count.get(occupation, 0) + 1
            prefecture_count[prefecture] = prefecture_count.get(prefecture, 0) + 1
            age_groups[age_group] = age

        return diverse_personas
