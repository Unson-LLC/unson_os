"""
Instagram キーワード生成モジュール

Nemotron ペルソナ属性から Instagram 検索用キーワードを自動生成します。
"""

import json
import re
from typing import List, Dict, Set
from pathlib import Path


class InstagramKeywordGenerator:
    """
    Nemotron ペルソナ属性から Instagram 検索キーワードを生成
    """

    def __init__(self, mapping_file: str = None):
        """
        初期化

        Args:
            mapping_file: キーワードマッピングJSONファイルのパス
        """
        if mapping_file is None:
            # デフォルトパス
            mapping_file = Path(__file__).parent.parent / "config" / "keyword_mapping.json"

        with open(mapping_file, 'r', encoding='utf-8') as f:
            self.mapping = json.load(f)

        print(f"✅ キーワードマッピング読み込み完了: {mapping_file}")

    def generate_keywords(
        self,
        persona: Dict,
        max_keywords: int = 10,
        japanese_ratio: float = 0.7
    ) -> List[str]:
        """
        ペルソナから Instagram 検索キーワードを生成

        Args:
            persona: Nemotron ペルソナデータ
            max_keywords: 最大キーワード数 (デフォルト: 10)
            japanese_ratio: 日本語ハッシュタグの割合 (デフォルト: 0.7)

        Returns:
            Instagram 検索用キーワードリスト
        """
        keywords = []

        # 優先順位1: 職業 + キャリア目標
        keywords.extend(self._extract_occupation_keywords(persona))
        keywords.extend(self._extract_career_goals_keywords(persona))

        # 優先順位2: 趣味・興味
        keywords.extend(self._extract_hobbies_keywords(persona))

        # 優先順位3: スキル
        keywords.extend(self._extract_skills_keywords(persona))

        # 優先順位4: 年齢・地域
        keywords.extend(self._extract_age_keywords(persona))
        keywords.extend(self._extract_prefecture_keywords(persona))

        # 重複削除
        unique_keywords = list(dict.fromkeys(keywords))

        # 日本語/英語バランス調整
        balanced_keywords = self._balance_language(unique_keywords, japanese_ratio)

        # 最大数まで絞り込み
        final_keywords = balanced_keywords[:max_keywords]

        print(f"📝 生成キーワード数: {len(final_keywords)} 件")
        return final_keywords

    def _extract_occupation_keywords(self, persona: Dict) -> List[str]:
        """職業からキーワード抽出"""
        keywords = []
        occupation = str(persona.get("occupation", ""))

        # マッピングからマッチング
        for key, hashtags in self.mapping["occupation_hashtags"].items():
            if key in occupation:
                keywords.extend(hashtags[:3])  # 上位3件
                break

        # 職業名を直接ハッシュタグ化
        if occupation and len(occupation) < 20:
            # 短い職業名のみ (長すぎるものは除外)
            occupation_clean = re.sub(r'\s+(大手|中小|中堅).*', '', occupation)
            if occupation_clean and len(occupation_clean) < 15:
                keywords.append(f"#{occupation_clean}")

        return keywords

    def _extract_career_goals_keywords(self, persona: Dict) -> List[str]:
        """キャリア目標からキーワード抽出"""
        keywords = []
        career_goals = str(persona.get("career_goals_and_ambitions", ""))

        for key, hashtags in self.mapping["career_goals_hashtags"].items():
            if key in career_goals:
                keywords.extend(hashtags[:2])  # 上位2件

        return keywords

    def _extract_hobbies_keywords(self, persona: Dict) -> List[str]:
        """趣味・興味からキーワード抽出"""
        keywords = []
        hobbies = str(persona.get("hobbies_and_interests", ""))

        for key, hashtags in self.mapping["hobbies_hashtags"].items():
            if key in hobbies:
                keywords.extend(hashtags[:2])  # 上位2件

        return keywords

    def _extract_skills_keywords(self, persona: Dict) -> List[str]:
        """スキルからキーワード抽出"""
        keywords = []
        skills = str(persona.get("skills_and_expertise", ""))

        for key, hashtags in self.mapping["skills_hashtags"].items():
            if key in skills:
                keywords.extend(hashtags[:1])  # 上位1件

        return keywords

    def _extract_age_keywords(self, persona: Dict) -> List[str]:
        """年齢からキーワード抽出"""
        keywords = []
        age = persona.get("age", 0)

        if 20 <= age <= 29:
            keywords.extend(self.mapping["age_hashtags"]["20代"][:1])
        elif 30 <= age <= 39:
            keywords.extend(self.mapping["age_hashtags"]["30代"][:1])
        elif 40 <= age <= 49:
            keywords.extend(self.mapping["age_hashtags"]["40代"][:1])
        elif 50 <= age <= 59:
            keywords.extend(self.mapping["age_hashtags"]["50代"][:1])

        return keywords

    def _extract_prefecture_keywords(self, persona: Dict) -> List[str]:
        """都道府県からキーワード抽出"""
        keywords = []
        prefecture = persona.get("prefecture", "")

        if prefecture in self.mapping["prefecture_hashtags"]:
            keywords.extend(self.mapping["prefecture_hashtags"][prefecture][:1])

        return keywords

    def _balance_language(self, keywords: List[str], japanese_ratio: float) -> List[str]:
        """
        日本語/英語のバランス調整

        Args:
            keywords: キーワードリスト
            japanese_ratio: 日本語の割合 (0.0-1.0)

        Returns:
            バランス調整後のキーワードリスト
        """
        japanese_keywords = []
        english_keywords = []

        for kw in keywords:
            # ハッシュタグを除去してチェック
            kw_clean = kw.replace('#', '')

            # 日本語含有チェック
            if re.search(r'[ぁ-んァ-ヶ一-龥]', kw_clean):
                japanese_keywords.append(kw)
            else:
                english_keywords.append(kw)

        # 目標比率に基づいて選択
        total = len(keywords)
        target_japanese = int(total * japanese_ratio)
        target_english = total - target_japanese

        selected_japanese = japanese_keywords[:target_japanese]
        selected_english = english_keywords[:target_english]

        # 不足分を補完
        if len(selected_japanese) < target_japanese and english_keywords:
            selected_english.extend(english_keywords[target_english:target_japanese - len(selected_japanese)])
        if len(selected_english) < target_english and japanese_keywords:
            selected_japanese.extend(japanese_keywords[target_japanese:target_english - len(selected_english)])

        # 結合
        balanced = selected_japanese + selected_english

        return balanced

    def generate_search_queries(self, keywords: List[str]) -> List[str]:
        """
        キーワードから Instagram 検索クエリを生成

        Args:
            keywords: キーワードリスト

        Returns:
            検索クエリリスト
        """
        queries = []

        # 単一キーワード検索
        for kw in keywords[:5]:  # 上位5件
            queries.append(kw)

        # 組み合わせ検索 (職業 + キャリア目標)
        occupation_kws = [kw for kw in keywords if any(
            occ in kw for occ in ["エンジニア", "デザイナー", "マーケター", "営業"]
        )]
        career_kws = [kw for kw in keywords if any(
            car in kw for car in ["転職", "起業", "フリーランス"]
        )]

        for occ in occupation_kws[:2]:
            for car in career_kws[:1]:
                combined = f"{occ} {car}"
                if combined not in queries:
                    queries.append(combined)

        return queries[:10]  # 最大10件

    def format_for_apify(self, keywords: List[str]) -> Dict:
        """
        Apify Instagram API 用にフォーマット

        Args:
            keywords: キーワードリスト

        Returns:
            Apify 入力フォーマット
        """
        search_queries = self.generate_search_queries(keywords)

        return {
            "hashtags": [kw.replace('#', '') for kw in keywords if kw.startswith('#')],
            "search_queries": search_queries,
            "resultsLimit": 50,
            "resultsType": "posts"
        }
