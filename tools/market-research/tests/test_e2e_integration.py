"""
E2E 統合テスト

Nemotron ペルソナ選定 → キーワード生成 → 統合の一連のフローをテスト
"""

import unittest
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from lib.nemotron_persona_selector import NemotronPersonaSelector
from lib.instagram_keyword_generator import InstagramKeywordGenerator
from lib.persona_integrator import PersonaIntegrator


class TestE2EIntegration(unittest.TestCase):
    """E2E 統合テストケース"""

    @classmethod
    def setUpClass(cls):
        """テストクラス初期化（全テスト共通）"""
        print("\n" + "=" * 60)
        print("E2E 統合テスト開始")
        print("=" * 60)

        cls.selector = NemotronPersonaSelector()
        cls.keyword_gen = InstagramKeywordGenerator()
        cls.integrator = PersonaIntegrator()

    def test_e2e_case_1_it_job_seeker(self):
        """E2Eテスト1: 20代IT転職検討者の完全フロー"""
        print("\n--- E2Eテスト 1: 20代IT転職検討者 ---")

        # Step 1: Nemotron ペルソナ選定
        print("Step 1: Nemotron ペルソナ選定")
        user_input = "20代のIT業界転職検討者"
        personas = self.selector.select_personas(user_input, max_results=3)

        self.assertGreater(len(personas), 0, "ペルソナが選定されること")
        print(f"  選定ペルソナ数: {len(personas)}件")

        # Step 2: Instagram キーワード生成
        print("Step 2: Instagram キーワード生成")
        first_persona = personas[0]
        keywords = self.keyword_gen.generate_keywords(first_persona, max_keywords=8)

        self.assertGreater(len(keywords), 0, "キーワードが生成されること")
        print(f"  生成キーワード数: {len(keywords)}件")
        print(f"  キーワード例: {keywords[:3]}")

        # Step 3: ペルソナ統合（Instagramデータなし）
        print("Step 3: ペルソナ統合")
        integrated = self.integrator.integrate(first_persona)

        self.assertIn("信頼性スコア", integrated)
        self.assertEqual(integrated["信頼性スコア"], 40)  # Nemotronのみなので40点
        print(f"  信頼性スコア: {integrated['信頼性スコア']}/100")

        # Step 4: Markdown 出力
        print("Step 4: Markdown 出力")
        markdown = self.integrator.format_output(integrated)

        self.assertIn("統合ペルソナプロファイル", markdown)
        print(f"  Markdown出力: {len(markdown)}文字")

        print("✅ E2Eフロー完了")

    def test_e2e_case_2_freelance_designer(self):
        """E2Eテスト2: 30代フリーランスデザイナーの完全フロー"""
        print("\n--- E2Eテスト 2: 30代フリーランスデザイナー ---")

        # Step 1: Nemotron ペルソナ選定
        user_input = "30代のフリーランスデザイナー"
        personas = self.selector.select_personas(user_input, max_results=2)

        self.assertGreater(len(personas), 0)
        print(f"  選定ペルソナ数: {len(personas)}件")

        # Step 2: キーワード生成
        persona = personas[0]
        keywords = self.keyword_gen.generate_keywords(persona, max_keywords=10)

        self.assertGreater(len(keywords), 0)
        print(f"  生成キーワード数: {len(keywords)}件")

        # デザイナー関連キーワードが含まれること
        has_design_keyword = any("デザイン" in kw or "design" in kw.lower() for kw in keywords)
        self.assertTrue(has_design_keyword, "デザイン関連キーワードが含まれること")

        # Step 3: Instagram データ模擬統合
        mock_instagram_data = {
            "profiles": [
                {"username": "designer_sample", "followersCount": 2000}
            ],
            "posts": [
                {"caption": "New design project #design #freelance", "likesCount": 100}
            ] * 25  # 25投稿
        }

        integrated = self.integrator.integrate(persona, mock_instagram_data)

        # Instagram データありなので信頼性スコア > 40
        self.assertGreater(integrated["信頼性スコア"], 40)
        print(f"  信頼性スコア: {integrated['信頼性スコア']}/100")

        print("✅ E2Eフロー完了")

    def test_e2e_case_3_entrepreneur(self):
        """E2Eテスト3: 40代起業家の完全フロー"""
        print("\n--- E2Eテスト 3: 40代起業家 ---")

        # Step 1: Nemotron ペルソナ選定
        user_input = "40代の起業家"
        personas = self.selector.select_personas(user_input, max_results=2)

        self.assertGreater(len(personas), 0)

        # Step 2: キーワード生成 + Apify フォーマット
        persona = personas[0]
        keywords = self.keyword_gen.generate_keywords(persona)
        apify_input = self.keyword_gen.format_for_apify(keywords)

        self.assertIn("hashtags", apify_input)
        self.assertIn("search_queries", apify_input)
        print(f"  Apify ハッシュタグ数: {len(apify_input['hashtags'])}件")
        print(f"  Apify 検索クエリ数: {len(apify_input['search_queries'])}件")

        # Step 3: 統合とMarkdown出力
        integrated = self.integrator.integrate(persona)
        markdown = self.integrator.format_output(integrated)

        self.assertIn("起業家", markdown)
        print("✅ E2Eフロー完了")

    def test_performance(self):
        """パフォーマンステスト: 全フロー60秒以内"""
        print("\n--- パフォーマンステスト ---")

        import time
        start = time.time()

        # 全フロー実行
        user_input = "30代のマーケター"
        personas = self.selector.select_personas(user_input, max_results=1)

        if personas:
            keywords = self.keyword_gen.generate_keywords(personas[0])
            integrated = self.integrator.integrate(personas[0])
            markdown = self.integrator.format_output(integrated)

        elapsed = time.time() - start
        print(f"  処理時間: {elapsed:.2f}秒")

        # 60秒以内であること
        self.assertLess(elapsed, 60.0, "全フロー処理時間が60秒以内")

    def test_error_handling_empty_input(self):
        """エラーハンドリングテスト: 空入力"""
        print("\n--- エラーハンドリング: 空入力 ---")

        # 空文字列入力
        personas = self.selector.select_personas("", max_results=1)

        # エラーにならず、結果が0件であること
        self.assertIsInstance(personas, list)
        print(f"  結果: {len(personas)}件（正常）")

    def test_error_handling_no_match(self):
        """エラーハンドリングテスト: マッチなし"""
        print("\n--- エラーハンドリング: マッチなし ---")

        # マッチしない条件
        personas = self.selector.select_personas(
            "10代の宇宙飛行士",  # Nemotronに存在しない
            max_results=1
        )

        # エラーにならず、結果が0件または少数であること
        self.assertIsInstance(personas, list)
        print(f"  結果: {len(personas)}件（正常）")


def main():
    """テスト実行"""
    # テストスイート作成
    suite = unittest.TestLoader().loadTestsFromTestCase(TestE2EIntegration)

    # テスト実行
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # 結果サマリー
    print("\n" + "=" * 60)
    print("E2E統合テスト結果サマリー")
    print("=" * 60)
    print(f"実行: {result.testsRun} テスト")
    print(f"成功: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"失敗: {len(result.failures)}")
    print(f"エラー: {len(result.errors)}")

    if result.wasSuccessful():
        print("\n🎉 すべてのE2Eテスト成功！システム統合完了です。")
        return 0
    else:
        print("\n⚠️  一部のテストが失敗しました。")
        return 1


if __name__ == "__main__":
    sys.exit(main())
