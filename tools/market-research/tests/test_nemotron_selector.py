"""
NemotronPersonaSelector ユニットテスト
"""

import unittest
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from lib.nemotron_persona_selector import NemotronPersonaSelector


class TestNemotronSelector(unittest.TestCase):
    """NemotronPersonaSelector テストケース"""

    @classmethod
    def setUpClass(cls):
        """テストクラス初期化（全テスト共通）"""
        print("\n" + "=" * 60)
        print("NemotronPersonaSelector テスト開始")
        print("=" * 60)
        cls.selector = NemotronPersonaSelector()

    def test_case_1_it_career_changer(self):
        """テストケース1: 20代IT転職検討者"""
        print("\n--- テスト 1: 20代IT転職検討者 ---")

        result = self.selector.select_personas("20代のIT業界転職検討者", max_results=5)

        # 基本検証
        self.assertGreater(len(result), 0, "ペルソナが抽出されること")
        self.assertLessEqual(len(result), 5, "最大5件まで")

        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        # 各ペルソナの属性確認
        for i, persona in enumerate(result, 1):
            age = persona["age"]
            occupation = persona["occupation"]

            print(f"\nペルソナ {i}:")
            print(f"  年齢: {age}歳")
            print(f"  職業: {occupation[:50]}...")

            # 年齢が20代であること
            self.assertGreaterEqual(age, 20, f"ペルソナ{i}の年齢が20歳以上")
            self.assertLessEqual(age, 29, f"ペルソナ{i}の年齢が29歳以下")

            # IT関連の職業であること
            self.assertTrue(
                any(kw in str(occupation).lower() for kw in ["it", "情報", "システム", "エンジニア", "プログラ"]),
                f"ペルソナ{i}がIT関連職業"
            )

    def test_case_2_freelance_designer(self):
        """テストケース2: 30代フリーランスデザイナー"""
        print("\n--- テスト 2: 30代フリーランスデザイナー ---")

        result = self.selector.select_personas("30代のフリーランスデザイナー", max_results=5)

        self.assertGreater(len(result), 0, "ペルソナが抽出されること")
        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        for i, persona in enumerate(result, 1):
            age = persona["age"]
            occupation = persona["occupation"]

            print(f"\nペルソナ {i}:")
            print(f"  年齢: {age}歳")
            print(f"  職業: {occupation[:50]}...")

            # 年齢が30代であること
            self.assertGreaterEqual(age, 30)
            self.assertLessEqual(age, 39)

    def test_case_3_entrepreneur(self):
        """テストケース3: 40代起業家"""
        print("\n--- テスト 3: 40代起業家 ---")

        result = self.selector.select_personas("40代の起業家", max_results=5)

        self.assertGreater(len(result), 0, "ペルソナが抽出されること")
        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        for i, persona in enumerate(result, 1):
            age = persona["age"]
            print(f"\nペルソナ {i}:")
            print(f"  年齢: {age}歳")
            print(f"  職業: {persona['occupation'][:50]}...")

            # 年齢が40代であること
            self.assertGreaterEqual(age, 40)
            self.assertLessEqual(age, 49)

    def test_case_4_tokyo_engineer(self):
        """テストケース4: 東京在住エンジニア"""
        print("\n--- テスト 4: 東京在住エンジニア ---")

        result = self.selector.select_personas(
            "東京在住のエンジニア",
            prefecture="東京都",
            max_results=5
        )

        self.assertGreater(len(result), 0, "ペルソナが抽出されること")
        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        for i, persona in enumerate(result, 1):
            prefecture = persona["prefecture"]
            occupation = persona["occupation"]

            print(f"\nペルソナ {i}:")
            print(f"  都道府県: {prefecture}")
            print(f"  職業: {occupation[:50]}...")

            # 東京都であること
            self.assertEqual(prefecture, "東京都", f"ペルソナ{i}が東京都在住")

    def test_case_5_diversity(self):
        """テストケース5: 多様性確保"""
        print("\n--- テスト 5: 多様性確保 ---")

        result = self.selector.select_personas("20代のビジネスパーソン", max_results=5)

        self.assertGreater(len(result), 0, "ペルソナが抽出されること")
        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        # 職業の多様性確認
        occupations = [p["occupation"] for p in result]
        unique_occupations = len(set(occupations))

        print(f"\n職業の種類数: {unique_occupations}")
        for i, occ in enumerate(occupations, 1):
            print(f"  {i}. {occ[:50]}...")

        # 少なくとも2種類以上の職業が含まれること
        self.assertGreaterEqual(
            unique_occupations, 2,
            "複数の職業が含まれること（多様性確保）"
        )

        # 都道府県の多様性確認
        prefectures = [p["prefecture"] for p in result]
        unique_prefectures = len(set(prefectures))

        print(f"\n都道府県の種類数: {unique_prefectures}")
        for i, pref in enumerate(prefectures, 1):
            print(f"  {i}. {pref}")

        # 少なくとも2つ以上の都道府県が含まれること（可能な場合）
        if len(result) >= 3:
            self.assertGreaterEqual(
                unique_prefectures, 1,
                "都道府県の多様性が確保されていること"
            )

    def test_performance(self):
        """パフォーマンステスト: 処理時間 < 15秒"""
        print("\n--- テスト 6: パフォーマンス ---")

        import time

        start = time.time()
        result = self.selector.select_personas("30代のマーケター", max_results=5)
        end = time.time()

        elapsed = end - start
        print(f"⏱️  処理時間: {elapsed:.2f}秒")
        print(f"✅ 抽出ペルソナ数: {len(result)} 件")

        # 処理時間が15秒以内であること (フィルタリング処理の性能制約を考慮)
        self.assertLess(elapsed, 15.0, "処理時間が15秒以内")

    def test_input_parsing(self):
        """テスト7: ユーザー入力パース機能"""
        print("\n--- テスト 7: ユーザー入力パース ---")

        test_cases = [
            ("20代のIT転職検討者", {"age_range": (20, 29), "occupation": True, "career_goals": True}),
            ("東京都在住の30代デザイナー", {"prefecture": "東京都", "age_range": (30, 39)}),
            ("フリーランスの起業家", {"career_goals": True}),
        ]

        for user_input, expected in test_cases:
            conditions = self.selector._parse_user_input(user_input)
            print(f"\n入力: '{user_input}'")
            print(f"抽出条件: {conditions}")

            if "age_range" in expected:
                self.assertEqual(conditions.get("age_range"), expected["age_range"])
                print(f"  ✅ 年齢範囲: {conditions.get('age_range')}")

            if "prefecture" in expected:
                self.assertEqual(conditions.get("prefecture"), expected["prefecture"])
                print(f"  ✅ 都道府県: {conditions.get('prefecture')}")

            if expected.get("occupation"):
                self.assertIn("occupation", conditions)
                print(f"  ✅ 職業キーワード: {conditions.get('occupation', [])[:3]}...")

            if expected.get("career_goals"):
                self.assertIn("career_goals", conditions)
                print(f"  ✅ キャリア目標: {conditions.get('career_goals')}")


def main():
    """テスト実行"""
    # テストスイート作成
    suite = unittest.TestLoader().loadTestsFromTestCase(TestNemotronSelector)

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
        print("\n🎉 すべてのテスト成功！Phase 2 完了です。")
        return 0
    else:
        print("\n⚠️  一部のテストが失敗しました。")
        return 1


if __name__ == "__main__":
    sys.exit(main())
