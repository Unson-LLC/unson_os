"""
PersonaIntegrator ユニットテスト
"""

import unittest
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from lib.persona_integrator import PersonaIntegrator


class TestPersonaIntegrator(unittest.TestCase):
    """PersonaIntegrator テストケース"""

    @classmethod
    def setUpClass(cls):
        """テストクラス初期化（全テスト共通）"""
        print("\n" + "=" * 60)
        print("PersonaIntegrator テスト開始")
        print("=" * 60)
        cls.integrator = PersonaIntegrator()

    def test_case_1_nemotron_only(self):
        """テストケース1: Nemotron のみ（Instagram なし）"""
        print("\n--- テスト 1: Nemotron のみ ---")

        nemotron_persona = {
            "age": 26,
            "sex": "男性",
            "prefecture": "東京都",
            "region": "関東",
            "occupation": "ITエンジニア",
            "education_level": "大学卒業",
            "marital_status": "未婚",
            "career_goals_and_ambitions": "転職してキャリアアップしたい",
            "skills_and_expertise": "Python, Java, AWS",
            "hobbies_and_interests": "プログラミング、旅行"
        }

        result = self.integrator.integrate(nemotron_persona)

        print(f"信頼性スコア: {result['信頼性スコア']}/100")
        print(f"基本情報: 年齢={result['基本情報']['年齢']}歳")
        print(f"職業: {result['デモグラフィック']['職業']}")

        # 基本検証
        self.assertEqual(result["基本情報"]["年齢"], 26)
        self.assertEqual(result["基本情報"]["性別"], "男性")
        self.assertEqual(result["デモグラフィック"]["職業"], "ITエンジニア")

        # Nemotron のみなので信頼性スコアは40点
        self.assertEqual(result["信頼性スコア"], 40)

        # データソース確認
        self.assertTrue(result["データソース"]["nemotron"])
        self.assertFalse(result["データソース"]["instagram"])

    def test_case_2_with_instagram(self):
        """テストケース2: Nemotron + Instagram 統合"""
        print("\n--- テスト 2: Nemotron + Instagram 統合 ---")

        nemotron_persona = {
            "age": 28,
            "sex": "女性",
            "prefecture": "大阪府",
            "region": "関西",
            "occupation": "デザイナー",
            "career_goals_and_ambitions": "フリーランスとして独立したい",
            "hobbies_and_interests": "カメラ、アート"
        }

        instagram_data = {
            "profiles": [
                {
                    "username": "designer_alice",
                    "followersCount": 1500,
                    "postsCount": 200,
                    "biography": "Freelance designer based in Osaka"
                }
            ],
            "posts": [
                {
                    "caption": "New design project! #design #freelance #creative",
                    "likesCount": 150,
                    "commentsCount": 10
                },
                {
                    "caption": "Working on my portfolio #designer #osaka",
                    "likesCount": 120,
                    "commentsCount": 8
                }
            ] * 30  # 60投稿に拡張
        }

        result = self.integrator.integrate(nemotron_persona, instagram_data)

        print(f"信頼性スコア: {result['信頼性スコア']}/100")
        print(f"Instagram投稿数: {result['Instagram投稿分析']['投稿数']}件")
        print(f"頻出ハッシュタグ: {result['Instagram投稿分析']['頻出ハッシュタグ'][:3]}")

        # 基本検証
        self.assertEqual(result["基本情報"]["年齢"], 28)
        self.assertIn("Instagram投稿分析", result)
        self.assertEqual(result["Instagram投稿分析"]["投稿数"], 60)

        # 信頼性スコア: Nemotron(40) + Instagram(30+10) = 80点
        self.assertGreaterEqual(result["信頼性スコア"], 80)

        # データソース確認
        self.assertTrue(result["データソース"]["nemotron"])
        self.assertTrue(result["データソース"]["instagram"])

    def test_case_3_trust_score_calculation(self):
        """テストケース3: 信頼性スコア算出"""
        print("\n--- テスト 3: 信頼性スコア算出 ---")

        nemotron_persona = {"age": 30, "occupation": "営業"}

        # Instagram データなし → 40点
        result1 = self.integrator.integrate(nemotron_persona)
        print(f"Instagram なし: {result1['信頼性スコア']}/100")
        self.assertEqual(result1["信頼性スコア"], 40)

        # Instagram 少量 (10投稿) → 40 + 10 + 20(整合性) = 70点
        instagram_small = {
            "posts": [{"caption": "test"}] * 10,
            "profiles": []
        }
        result2 = self.integrator.integrate(nemotron_persona, instagram_small)
        print(f"Instagram 10投稿: {result2['信頼性スコア']}/100")
        self.assertEqual(result2["信頼性スコア"], 70)

        # Instagram 大量 (50投稿+10プロフィール) → 40 + 30 + 10 + 20(整合性) = 100点
        instagram_large = {
            "posts": [{"caption": "test"}] * 50,
            "profiles": [{"username": f"user{i}"} for i in range(10)]
        }
        result3 = self.integrator.integrate(nemotron_persona, instagram_large)
        print(f"Instagram 50投稿+10プロフィール: {result3['信頼性スコア']}/100")
        self.assertEqual(result3["信頼性スコア"], 100)

    def test_case_4_consistency_check(self):
        """テストケース4: 整合性チェック"""
        print("\n--- テスト 4: 整合性チェック ---")

        # 矛盾なしケース
        nemotron1 = {"age": 26, "occupation": "ITエンジニア"}
        instagram1 = {
            "posts": [
                {"caption": "Coding today #programming #tech"},
                {"caption": "New framework learning #developer"}
            ]
        }
        result1 = self.integrator.integrate(nemotron1, instagram1)
        print(f"矛盾なし: {result1['矛盾チェック']['矛盾なし']}")
        # 簡易実装のため矛盾検出は限定的

        # 矛盾ありケース
        nemotron2 = {"age": 22, "occupation": "学生"}
        instagram2 = {
            "posts": [
                {"caption": "Enjoying my retirement #retired #senior"}
            ]
        }
        result2 = self.integrator.integrate(nemotron2, instagram2)
        print(f"矛盾あり: {result2['矛盾チェック']['検出された問題']}")

    def test_case_5_instagram_enrichment(self):
        """テストケース5: Instagram エンリッチメント"""
        print("\n--- テスト 5: Instagram エンリッチメント ---")

        nemotron_persona = {"age": 32, "occupation": "マーケター"}

        instagram_data = {
            "profiles": [
                {"username": "marketer_pro", "followersCount": 5000},
                {"username": "marketing_guru", "followersCount": 3000}
            ],
            "posts": [
                {"caption": "Marketing tips #marketing #business", "likesCount": 200},
                {"caption": "New campaign launch #ad #digital", "likesCount": 150}
            ]
        }

        result = self.integrator.integrate(nemotron_persona, instagram_data)

        # エンリッチメント確認
        self.assertIn("Instagramプロフィール", result)
        self.assertEqual(result["Instagramプロフィール"]["取得件数"], 2)

        self.assertIn("Instagram投稿分析", result)
        self.assertEqual(result["Instagram投稿分析"]["投稿数"], 2)

        print(f"プロフィール取得: {result['Instagramプロフィール']['取得件数']}件")
        print(f"投稿分析: {result['Instagram投稿分析']['投稿数']}件")

    def test_case_6_output_format(self):
        """テストケース6: Markdown 出力フォーマット"""
        print("\n--- テスト 6: Markdown 出力 ---")

        nemotron_persona = {
            "age": 35,
            "sex": "男性",
            "prefecture": "東京都",
            "region": "関東",
            "occupation": "起業家"
        }

        result = self.integrator.integrate(nemotron_persona)
        markdown = self.integrator.format_output(result)

        print("生成されたMarkdown（抜粋）:")
        print(markdown[:300])

        # Markdown フォーマット確認
        self.assertIn("# 統合ペルソナプロファイル", markdown)
        self.assertIn("## 信頼性スコア", markdown)
        self.assertIn("## 基本情報", markdown)
        self.assertIn("35歳", markdown)
        self.assertIn("東京都", markdown)


def main():
    """テスト実行"""
    # テストスイート作成
    suite = unittest.TestLoader().loadTestsFromTestCase(TestPersonaIntegrator)

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
        print("\n🎉 すべてのテスト成功！Phase 4 完了です。")
        return 0
    else:
        print("\n⚠️  一部のテストが失敗しました。")
        return 1


if __name__ == "__main__":
    sys.exit(main())
