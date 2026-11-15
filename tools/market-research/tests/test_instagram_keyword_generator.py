"""
InstagramKeywordGenerator ユニットテスト
"""

import unittest
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from lib.instagram_keyword_generator import InstagramKeywordGenerator


class TestInstagramKeywordGenerator(unittest.TestCase):
    """InstagramKeywordGenerator テストケース"""

    @classmethod
    def setUpClass(cls):
        """テストクラス初期化（全テスト共通）"""
        print("\n" + "=" * 60)
        print("InstagramKeywordGenerator テスト開始")
        print("=" * 60)
        cls.generator = InstagramKeywordGenerator()

    def test_case_1_it_engineer(self):
        """テストケース1: ITエンジニアペルソナ"""
        print("\n--- テスト 1: ITエンジニアペルソナ ---")

        persona = {
            "age": 26,
            "occupation": "ITエンジニア 大手",
            "career_goals_and_ambitions": "転職を検討している",
            "hobbies_and_interests": "プログラミング、旅行",
            "skills_and_expertise": "Python、Java",
            "prefecture": "東京都"
        }

        keywords = self.generator.generate_keywords(persona, max_keywords=10)

        print(f"生成キーワード数: {len(keywords)}")
        for i, kw in enumerate(keywords, 1):
            print(f"  {i}. {kw}")

        # 基本検証
        self.assertGreater(len(keywords), 0, "キーワードが生成されること")
        self.assertLessEqual(len(keywords), 10, "最大10件まで")

        # 職業関連キーワードが含まれること
        occupation_found = any("IT" in kw or "エンジニア" in kw for kw in keywords)
        self.assertTrue(occupation_found, "職業関連キーワードが含まれること")

        # キャリア目標キーワードが含まれること
        career_found = any("転職" in kw for kw in keywords)
        self.assertTrue(career_found, "キャリア目標キーワードが含まれること")

    def test_case_2_freelance_designer(self):
        """テストケース2: フリーランスデザイナー"""
        print("\n--- テスト 2: フリーランスデザイナー ---")

        persona = {
            "age": 34,
            "occupation": "デザイナー 中小",
            "career_goals_and_ambitions": "フリーランスとして独立したい",
            "hobbies_and_interests": "カメラ、アート",
            "skills_and_expertise": "デザイン、UI/UX",
            "prefecture": "大阪府"
        }

        keywords = self.generator.generate_keywords(persona, max_keywords=8)

        print(f"生成キーワード数: {len(keywords)}")
        for i, kw in enumerate(keywords, 1):
            print(f"  {i}. {kw}")

        self.assertGreater(len(keywords), 0)
        self.assertLessEqual(len(keywords), 8)

        # デザイナー関連
        designer_found = any("デザイナー" in kw or "デザイン" in kw for kw in keywords)
        self.assertTrue(designer_found, "デザイナー関連キーワードが含まれること")

        # フリーランス関連
        freelance_found = any("フリーランス" in kw or "独立" in kw for kw in keywords)
        self.assertTrue(freelance_found, "フリーランス関連キーワードが含まれること")

    def test_case_3_entrepreneur(self):
        """テストケース3: 起業家"""
        print("\n--- テスト 3: 起業家 ---")

        persona = {
            "age": 42,
            "occupation": "小売業 中堅 経営",
            "career_goals_and_ambitions": "起業して新規事業を立ち上げる",
            "hobbies_and_interests": "ビジネス書、ゴルフ",
            "skills_and_expertise": "マネジメント、企画",
            "prefecture": "神奈川県"
        }

        keywords = self.generator.generate_keywords(persona)

        print(f"生成キーワード数: {len(keywords)}")
        for i, kw in enumerate(keywords, 1):
            print(f"  {i}. {kw}")

        self.assertGreater(len(keywords), 0)

        # 起業関連
        entrepreneur_found = any("起業" in kw for kw in keywords)
        self.assertTrue(entrepreneur_found, "起業関連キーワードが含まれること")

    def test_language_balance(self):
        """テストケース4: 日本語/英語バランス"""
        print("\n--- テスト 4: 日本語/英語バランス ---")

        persona = {
            "age": 28,
            "occupation": "ITエンジニア",
            "career_goals_and_ambitions": "転職",
            "hobbies_and_interests": "旅行",
            "skills_and_expertise": "Python",
            "prefecture": "東京都"
        }

        # 日本語70%で生成
        keywords = self.generator.generate_keywords(persona, japanese_ratio=0.7)

        japanese_count = sum(1 for kw in keywords if any(
            c for c in kw.replace('#', '') if '\u3040' <= c <= '\u30ff' or '\u4e00' <= c <= '\u9faf'
        ))
        english_count = len(keywords) - japanese_count

        print(f"日本語キーワード: {japanese_count} 件")
        print(f"英語キーワード: {english_count} 件")
        print(f"日本語比率: {japanese_count / len(keywords) * 100:.1f}%")

        # おおよそ70%前後であること（完全一致は難しいので50%以上で判定）
        self.assertGreater(japanese_count / len(keywords), 0.5, "日本語キーワードが優先されること")

    def test_search_queries(self):
        """テストケース5: 検索クエリ生成"""
        print("\n--- テスト 5: 検索クエリ生成 ---")

        keywords = [
            "#ITエンジニア",
            "#転職",
            "#プログラマー",
            "#キャリアチェンジ",
            "#Python"
        ]

        queries = self.generator.generate_search_queries(keywords)

        print(f"生成クエリ数: {len(queries)}")
        for i, q in enumerate(queries, 1):
            print(f"  {i}. {q}")

        self.assertGreater(len(queries), 0, "検索クエリが生成されること")
        self.assertLessEqual(len(queries), 10, "最大10件まで")

        # 組み合わせクエリが含まれること
        combined_found = any(' ' in q for q in queries)
        self.assertTrue(combined_found, "組み合わせクエリが含まれること")

    def test_apify_format(self):
        """テストケース6: Apify フォーマット"""
        print("\n--- テスト 6: Apify フォーマット ---")

        keywords = [
            "#ITエンジニア",
            "#転職",
            "#プログラマー",
            "#20代",
            "#東京"
        ]

        apify_input = self.generator.format_for_apify(keywords)

        print(f"Apify 入力フォーマット:")
        print(f"  ハッシュタグ数: {len(apify_input['hashtags'])}")
        print(f"  検索クエリ数: {len(apify_input['search_queries'])}")
        print(f"  結果制限: {apify_input['resultsLimit']}")

        # 必須フィールド確認
        self.assertIn("hashtags", apify_input)
        self.assertIn("search_queries", apify_input)
        self.assertIn("resultsLimit", apify_input)

        # ハッシュタグから#が除去されていること
        for tag in apify_input["hashtags"]:
            self.assertNotIn("#", tag, "ハッシュタグから#が除去されていること")

    def test_keyword_uniqueness(self):
        """テストケース7: キーワード重複排除"""
        print("\n--- テスト 7: キーワード重複排除 ---")

        persona = {
            "age": 30,
            "occupation": "ITエンジニア",
            "career_goals_and_ambitions": "IT業界でキャリアアップ",
            "hobbies_and_interests": "IT関連の勉強",
            "skills_and_expertise": "IT技術",
            "prefecture": "東京都"
        }

        keywords = self.generator.generate_keywords(persona)

        # 重複チェック
        unique_keywords = list(set(keywords))

        print(f"生成キーワード数: {len(keywords)}")
        print(f"ユニークキーワード数: {len(unique_keywords)}")

        self.assertEqual(len(keywords), len(unique_keywords), "キーワードが重複していないこと")


def main():
    """テスト実行"""
    # テストスイート作成
    suite = unittest.TestLoader().loadTestsFromTestCase(TestInstagramKeywordGenerator)

    # テスト実行
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 結果サマリー
    print("\n" + "=" * 60)
    print("テスト結果サマリー")
    print("=" * 60)
    print(f"実行: {result.testsRun} テスト")
    print(f"成功: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"失敗: {len(result.failures)}")
    print(f"エラー: {len(result.errors)}")

    if result.wasSuccessful():
        print("\n🎉 すべてのテスト成功！Phase 3 完了です。")
        return 0
    else:
        print("\n⚠️  一部のテストが失敗しました。")
        return 1


if __name__ == "__main__":
    sys.exit(main())
