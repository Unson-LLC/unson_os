"""
Nemotron-Instagram 統合パイプライン

全自動でペルソナ選定からInstagram分析、統合レポート生成まで実行
"""

import sys
import os
from pathlib import Path
from typing import Dict, List, Optional

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

# Skillコアモジュールをパスに追加
skill_core = Path(__file__).parent
sys.path.insert(0, str(skill_core))

from lib.nemotron_persona_selector import NemotronPersonaSelector
from lib.instagram_keyword_generator import InstagramKeywordGenerator
from lib.persona_integrator import PersonaIntegrator
from apify_client import ApifyInstagramClient


class NemotronInstagramPipeline:
    """
    Nemotron-Instagram 統合パイプライン

    1. Nemotron ペルソナ選定
    2. Instagram キーワード生成
    3. Apify API でデータ取得
    4. データ統合・信頼性評価
    5. Markdown レポート生成
    """

    def __init__(
        self,
        apify_token: Optional[str] = None,
        keyword_mapping_file: Optional[str] = None
    ):
        """
        初期化

        Args:
            apify_token: Apify APIトークン (省略時は環境変数)
            keyword_mapping_file: キーワードマッピングファイル
        """
        print("=" * 70)
        print("🚀 Nemotron-Instagram パイプライン初期化中...")
        print("=" * 70)

        # モジュール初期化
        self.nemotron_selector = NemotronPersonaSelector()

        # キーワード生成器 (デフォルトパス使用)
        if keyword_mapping_file is None:
            keyword_mapping_file = project_root / "config" / "keyword_mapping.json"
        self.keyword_generator = InstagramKeywordGenerator(str(keyword_mapping_file))

        self.apify_client = ApifyInstagramClient(apify_token)
        self.integrator = PersonaIntegrator()

        print("✅ パイプライン初期化完了\n")

    def run(
        self,
        target_description: str,
        max_personas: int = 3,
        max_posts_per_keyword: int = 20,
        max_profiles: int = 10,
        min_trust_score: int = 60
    ) -> Dict:
        """
        全自動パイプライン実行

        Args:
            target_description: ターゲット記述 (例: "30代のITエンジニア")
            max_personas: 最大選定ペルソナ数
            max_posts_per_keyword: キーワードあたりの最大投稿数
            max_profiles: 最大プロフィール数
            min_trust_score: 最低信頼性スコア (この値以上のペルソナのみ採用)

        Returns:
            統合結果 (ペルソナリスト、Markdownレポート等)
        """
        print("=" * 70)
        print(f"📊 ターゲット: '{target_description}'")
        print("=" * 70)

        # ステップ1: Nemotron ペルソナ選定
        print("\n【ステップ1/5】Nemotron ペルソナ選定")
        personas = self.nemotron_selector.select_personas(
            target_description,
            max_results=max_personas
        )

        if not personas:
            return {
                "success": False,
                "error": "条件に一致するペルソナが見つかりませんでした",
                "personas": [],
                "markdown_report": "# エラー\n\n条件に一致するペルソナが見つかりませんでした。"
            }

        print(f"\n選定ペルソナ: {len(personas)}件")
        for i, p in enumerate(personas, 1):
            print(f"  {i}. {p.get('occupation')} ({p.get('age')}歳, {p.get('prefecture')})")

        # ステップ2: Instagram キーワード生成
        print("\n【ステップ2/5】Instagram キーワード生成")

        # 統合キーワードリスト (複数ペルソナから生成)
        all_keywords = []
        for persona in personas[:2]:  # 上位2ペルソナ
            keywords = self.keyword_generator.generate_keywords(persona, max_keywords=10)
            all_keywords.extend(keywords)

        # 重複削除
        unique_keywords = list(dict.fromkeys(all_keywords))[:15]  # 最大15キーワード
        print(f"生成キーワード: {unique_keywords}")

        # ステップ3: Instagram データ取得
        print("\n【ステップ3/5】Instagram データ取得 (Apify API)")

        instagram_data = None
        try:
            instagram_data = self.apify_client.search_combined(
                keywords=unique_keywords,
                max_posts_per_keyword=max_posts_per_keyword,
                max_profiles=max_profiles,
                timeout=180
            )
        except Exception as e:
            print(f"⚠️ Instagram データ取得失敗: {e}")
            print("  → Nemotron のみで統合を続行します (信頼性スコア低下)")

        # ステップ4: データ統合
        print("\n【ステップ4/5】データ統合・信頼性評価")

        integrated_personas = []
        for persona in personas:
            integrated = self.integrator.integrate(persona, instagram_data)
            trust_score = integrated.get("信頼性スコア", 0)

            print(f"  ペルソナ: {persona.get('occupation')} → 信頼性スコア: {trust_score}/100")

            # 最低スコア以上のみ採用
            if trust_score >= min_trust_score:
                integrated_personas.append(integrated)
            else:
                print(f"    ⚠️ スコア不足 (最低{min_trust_score}点必要)")

        if not integrated_personas:
            print(f"\n⚠️ 信頼性スコア{min_trust_score}点以上のペルソナがありません")
            print("  → 最低スコアを下げるか、Instagram データを改善してください")

        # ステップ5: Markdown レポート生成
        print("\n【ステップ5/5】Markdown レポート生成")

        markdown_reports = []
        for i, integrated in enumerate(integrated_personas, 1):
            report = self.integrator.format_output(integrated)
            markdown_reports.append(f"## ペルソナ {i}\n\n{report}\n\n---\n")

        # 統合レポート
        full_report = self._generate_summary_report(
            target_description,
            personas,
            instagram_data,
            integrated_personas
        )
        full_report += "\n\n" + "\n\n".join(markdown_reports)

        print("\n" + "=" * 70)
        print("✅ パイプライン完了")
        print("=" * 70)

        return {
            "success": True,
            "target_description": target_description,
            "nemotron_personas": personas,
            "instagram_data": instagram_data,
            "integrated_personas": integrated_personas,
            "markdown_report": full_report,
            "total_personas": len(integrated_personas),
            "avg_trust_score": sum(p.get("信頼性スコア", 0) for p in integrated_personas) / len(integrated_personas) if integrated_personas else 0
        }

    def _generate_summary_report(
        self,
        target: str,
        nemotron_personas: List[Dict],
        instagram_data: Optional[Dict],
        integrated_personas: List[Dict]
    ) -> str:
        """サマリーレポート生成"""
        report = []
        report.append("# Nemotron-Instagram ペルソナ分析レポート")
        report.append("")
        report.append(f"**ターゲット**: {target}")
        report.append(f"**分析日時**: {self._get_timestamp()}")
        report.append("")

        # データソース情報
        report.append("## データソース")
        report.append(f"- **Nemotron ペルソナ**: {len(nemotron_personas)}件選定")

        if instagram_data:
            report.append(f"- **Instagram 投稿**: {instagram_data.get('total_posts', 0)}件取得")
            report.append(f"- **Instagram プロフィール**: {instagram_data.get('total_profiles', 0)}件取得")
            report.append(f"- **検索キーワード**: {', '.join(instagram_data.get('keywords', [])[:5])}")
        else:
            report.append("- **Instagram データ**: 取得失敗")

        report.append("")

        # 統合結果サマリー
        report.append("## 統合結果サマリー")
        report.append(f"- **統合ペルソナ数**: {len(integrated_personas)}件")

        if integrated_personas:
            avg_score = sum(p.get("信頼性スコア", 0) for p in integrated_personas) / len(integrated_personas)
            report.append(f"- **平均信頼性スコア**: {avg_score:.1f}/100")

            # 信頼性レベル分布
            high_trust = sum(1 for p in integrated_personas if p.get("信頼性スコア", 0) >= 80)
            medium_trust = sum(1 for p in integrated_personas if 60 <= p.get("信頼性スコア", 0) < 80)
            low_trust = sum(1 for p in integrated_personas if p.get("信頼性スコア", 0) < 60)

            report.append(f"  - 高信頼性 (80-100点): {high_trust}件")
            report.append(f"  - 中信頼性 (60-79点): {medium_trust}件")
            report.append(f"  - 低信頼性 (0-59点): {low_trust}件")

        report.append("")
        report.append("---")
        report.append("")

        return "\n".join(report)

    def _get_timestamp(self) -> str:
        """タイムスタンプ取得"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# CLI エントリーポイント
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Nemotron-Instagram ペルソナ分析パイプライン"
    )
    parser.add_argument(
        "target",
        type=str,
        help="ターゲット記述 (例: '30代のITエンジニア')"
    )
    parser.add_argument(
        "--max-personas",
        type=int,
        default=3,
        help="最大選定ペルソナ数 (デフォルト: 3)"
    )
    parser.add_argument(
        "--max-posts",
        type=int,
        default=20,
        help="キーワードあたりの最大投稿数 (デフォルト: 20)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="persona_report.md",
        help="出力ファイル名 (デフォルト: persona_report.md)"
    )

    args = parser.parse_args()

    # パイプライン実行
    pipeline = NemotronInstagramPipeline()
    result = pipeline.run(
        target_description=args.target,
        max_personas=args.max_personas,
        max_posts_per_keyword=args.max_posts
    )

    # レポート保存
    if result["success"]:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(result["markdown_report"])

        print(f"\n📄 レポート保存: {args.output}")
        print(f"📊 統合ペルソナ数: {result['total_personas']}件")
        print(f"⭐ 平均信頼性スコア: {result['avg_trust_score']:.1f}/100")
    else:
        print(f"\n❌ エラー: {result.get('error')}")
        sys.exit(1)
