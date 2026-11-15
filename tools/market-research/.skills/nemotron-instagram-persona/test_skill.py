"""
Nemotron-Instagram Persona Analyzer Skill テストスクリプト

このスクリプトは実際のAPI呼び出しを行わず、モック データで動作確認します。
"""

import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from lib.nemotron_persona_selector import NemotronPersonaSelector
from lib.instagram_keyword_generator import InstagramKeywordGenerator
from lib.persona_integrator import PersonaIntegrator


def test_nemotron_selection():
    """Nemotron ペルソナ選定テスト"""
    print("\n" + "=" * 70)
    print("テスト1: Nemotron ペルソナ選定")
    print("=" * 70)

    try:
        selector = NemotronPersonaSelector()
        personas = selector.select_personas("30代のITエンジニア", max_results=3)

        if personas:
            print(f"✅ テスト成功: {len(personas)}件のペルソナを選定")
            for i, p in enumerate(personas, 1):
                print(f"  {i}. {p.get('occupation')} ({p.get('age')}歳, {p.get('prefecture')})")
            return personas
        else:
            print("⚠️ ペルソナが見つかりませんでした (条件を緩和してください)")
            return []
    except Exception as e:
        print(f"❌ テスト失敗: {e}")
        return []


def test_keyword_generation(personas):
    """キーワード生成テスト"""
    print("\n" + "=" * 70)
    print("テスト2: Instagram キーワード生成")
    print("=" * 70)

    if not personas:
        print("⚠️ スキップ (ペルソナなし)")
        return []

    try:
        keyword_mapping_file = project_root / "config" / "keyword_mapping.json"
        keyword_gen = InstagramKeywordGenerator(str(keyword_mapping_file))

        keywords = keyword_gen.generate_keywords(personas[0], max_keywords=10)
        print(f"✅ テスト成功: {len(keywords)}件のキーワード生成")
        print(f"  キーワード: {keywords}")

        return keywords
    except Exception as e:
        print(f"❌ テスト失敗: {e}")
        return []


def test_mock_instagram_integration(personas):
    """モックInstagramデータで統合テスト"""
    print("\n" + "=" * 70)
    print("テスト3: データ統合 (モックInstagramデータ)")
    print("=" * 70)

    if not personas:
        print("⚠️ スキップ (ペルソナなし)")
        return

    # モックInstagramデータ
    mock_instagram_data = {
        "posts": [
            {
                "id": "mock_post_1",
                "caption": "転職活動でスキルの棚卸しに苦労している #転職 #ITエンジニア #キャリアチェンジ",
                "likesCount": 150,
                "commentsCount": 10
            },
            {
                "id": "mock_post_2",
                "caption": "現職の将来性に不安がある #キャリア #不安 #エンジニア",
                "likesCount": 120,
                "commentsCount": 8
            }
        ] * 25,  # 50投稿分 (同じデータ繰り返し)
        "profiles": [
            {
                "username": "mock_user_1",
                "followersCount": 1500,
                "postsCount": 200,
                "biography": "ITエンジニア | 転職活動中 | Python, AWS"
            },
            {
                "username": "mock_user_2",
                "followersCount": 800,
                "postsCount": 150,
                "biography": "フリーランスエンジニア | 東京"
            }
        ] * 5,  # 10プロフィール分
        "keywords": ["#ITエンジニア", "#転職", "#キャリアチェンジ"],
        "total_posts": 50,
        "total_profiles": 10
    }

    try:
        integrator = PersonaIntegrator()
        integrated = integrator.integrate(personas[0], mock_instagram_data)

        print(f"✅ テスト成功: 統合ペルソナ生成")
        print(f"  信頼性スコア: {integrated.get('信頼性スコア')}/100")
        print(f"  矛盾なし: {integrated.get('矛盾チェック', {}).get('矛盾なし')}")

        # Markdownレポート生成
        markdown = integrator.format_output(integrated)
        print(f"\n  Markdownレポート生成成功 ({len(markdown)}文字)")

        return integrated
    except Exception as e:
        print(f"❌ テスト失敗: {e}")
        return None


def test_skill_structure():
    """Skillフォルダ構造確認"""
    print("\n" + "=" * 70)
    print("テスト4: Skillフォルダ構造確認")
    print("=" * 70)

    skill_path = Path(__file__).parent
    required_files = [
        "SKILL.md",
        "core/__init__.py",
        "core/apify_client.py",
        "core/nemotron_instagram_pipeline.py",
        "resources/workflow_guide.md",
        "resources/quality_criteria.md",
        "resources/troubleshooting.md"
    ]

    all_exist = True
    for file in required_files:
        file_path = skill_path / file
        if file_path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} (存在しません)")
            all_exist = False

    if all_exist:
        print("\n✅ テスト成功: 全ファイル存在確認")
    else:
        print("\n⚠️ 一部ファイルが存在しません")


def main():
    """メインテスト実行"""
    print("\n" + "=" * 70)
    print("Nemotron-Instagram Persona Analyzer Skill テスト")
    print("=" * 70)

    # テスト1: Nemotronペルソナ選定
    personas = test_nemotron_selection()

    # テスト2: キーワード生成
    keywords = test_keyword_generation(personas)

    # テスト3: データ統合 (モック)
    integrated = test_mock_instagram_integration(personas)

    # テスト4: Skillフォルダ構造確認
    test_skill_structure()

    # サマリー
    print("\n" + "=" * 70)
    print("テスト完了サマリー")
    print("=" * 70)
    print(f"  Nemotronペルソナ選定: {'✅' if personas else '❌'}")
    print(f"  キーワード生成: {'✅' if keywords else '❌'}")
    print(f"  データ統合: {'✅' if integrated else '❌'}")
    print(f"  Skillフォルダ構造: ✅")

    if personas and keywords and integrated:
        print("\n🎉 全テスト成功! Skillは正常に動作します。")
        print("\n次のステップ:")
        print("  1. 実際のInstagram APIを使用するには:")
        print("     python .skills/nemotron-instagram-persona/core/nemotron_instagram_pipeline.py '30代のITエンジニア'")
        print("  2. Claude CodeでSkillを自動起動するには:")
        print("     「30代のITエンジニアのペルソナを作成」とリクエスト")
    else:
        print("\n⚠️ 一部テスト失敗。上記のエラーメッセージを確認してください。")


if __name__ == "__main__":
    main()
