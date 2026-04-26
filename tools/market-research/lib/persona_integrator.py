"""
ペルソナ統合モジュール

Nemotron ペルソナと Instagram データを統合し、信頼性の高いペルソナを生成します。
"""

from typing import Dict, List, Optional
from datetime import datetime


class PersonaIntegrator:
    """
    Nemotron ペルソナと Instagram データを統合
    """

    def __init__(self):
        """初期化"""
        print("✅ PersonaIntegrator 初期化完了")

    def integrate(
        self,
        nemotron_persona: Dict,
        instagram_data: Optional[Dict] = None
    ) -> Dict:
        """
        Nemotron ペルソナと Instagram データを統合

        Args:
            nemotron_persona: Nemotron ペルソナデータ
            instagram_data: Instagram API からのデータ (オプション)

        Returns:
            統合ペルソナ
        """
        # ベースライン: Nemotron ペルソナ
        integrated = {
            "基本情報": self._extract_basic_info(nemotron_persona),
            "デモグラフィック": self._extract_demographic(nemotron_persona),
            "キャリア情報": self._extract_career(nemotron_persona),
            "ライフスタイル": self._extract_lifestyle(nemotron_persona),
            "データソース": {
                "nemotron": True,
                "instagram": instagram_data is not None
            },
            "信頼性スコア": 0
        }

        # Instagram データでエンリッチメント
        if instagram_data:
            integrated = self._enrich_with_instagram(integrated, instagram_data)

        # 信頼性スコア算出
        integrated["信頼性スコア"] = self._calculate_trust_score(
            integrated,
            nemotron_persona,
            instagram_data
        )

        # 矛盾チェック
        integrated["矛盾チェック"] = self._check_consistency(
            integrated,
            nemotron_persona,
            instagram_data
        )

        return integrated

    def _extract_basic_info(self, persona: Dict) -> Dict:
        """基本情報抽出"""
        return {
            "年齢": persona.get("age"),
            "性別": persona.get("sex"),
            "居住地": {
                "都道府県": persona.get("prefecture"),
                "地方": persona.get("region"),
                "国": persona.get("country", "日本")
            }
        }

    def _extract_demographic(self, persona: Dict) -> Dict:
        """デモグラフィック情報抽出"""
        return {
            "職業": persona.get("occupation"),
            "学歴": persona.get("education_level"),
            "婚姻状況": persona.get("marital_status")
        }

    def _extract_career(self, persona: Dict) -> Dict:
        """キャリア情報抽出"""
        return {
            "キャリア目標": persona.get("career_goals_and_ambitions"),
            "スキル": persona.get("skills_and_expertise"),
            "プロフェッショナルペルソナ": persona.get("professional_persona")
        }

    def _extract_lifestyle(self, persona: Dict) -> Dict:
        """ライフスタイル情報抽出"""
        return {
            "趣味・興味": persona.get("hobbies_and_interests"),
            "スポーツペルソナ": persona.get("sports_persona"),
            "旅行ペルソナ": persona.get("travel_persona"),
            "料理ペルソナ": persona.get("culinary_persona"),
            "アーツペルソナ": persona.get("arts_persona"),
            "一般ペルソナ": persona.get("general_persona")
        }

    def _enrich_with_instagram(
        self,
        integrated: Dict,
        instagram_data: Dict
    ) -> Dict:
        """Instagram データでエンリッチメント"""

        # Instagram プロフィール情報
        if "profiles" in instagram_data:
            integrated["Instagramプロフィール"] = {
                "取得件数": len(instagram_data["profiles"]),
                "代表的なユーザー": self._extract_representative_users(
                    instagram_data["profiles"]
                )
            }

        # Instagram 投稿分析
        if "posts" in instagram_data:
            integrated["Instagram投稿分析"] = {
                "投稿数": len(instagram_data["posts"]),
                "主要トピック": self._extract_topics(instagram_data["posts"]),
                "頻出ハッシュタグ": self._extract_hashtags(instagram_data["posts"]),
                "エンゲージメント平均": self._calculate_engagement(instagram_data["posts"])
            }

        # 実際の悩み・課題
        if "posts" in instagram_data:
            integrated["実際の悩み"] = self._extract_pain_points(
                instagram_data["posts"]
            )

        return integrated

    def _extract_representative_users(self, profiles: List[Dict]) -> List[Dict]:
        """代表的なユーザー抽出"""
        if not profiles:
            return []

        # フォロワー数でソート
        sorted_profiles = sorted(
            profiles,
            key=lambda p: p.get("followersCount", 0),
            reverse=True
        )

        # 上位3名
        return [
            {
                "ユーザー名": p.get("username"),
                "フォロワー数": p.get("followersCount"),
                "投稿数": p.get("postsCount"),
                "バイオ": p.get("biography", "")[:100]
            }
            for p in sorted_profiles[:3]
        ]

    def _extract_topics(self, posts: List[Dict]) -> List[str]:
        """主要トピック抽出"""
        topics = []
        for post in posts[:20]:  # 上位20投稿
            caption = post.get("caption", "")
            if caption:
                # 簡易トピック抽出 (実装を簡略化)
                words = caption.split()
                topics.extend([w for w in words if len(w) > 5][:3])

        # 頻度順
        from collections import Counter
        topic_counts = Counter(topics)
        return [t for t, _ in topic_counts.most_common(10)]

    def _extract_hashtags(self, posts: List[Dict]) -> List[str]:
        """頻出ハッシュタグ抽出"""
        hashtags = []
        for post in posts:
            caption = post.get("caption", "")
            # #で始まる単語を抽出
            tags = [word for word in caption.split() if word.startswith('#')]
            hashtags.extend(tags)

        from collections import Counter
        tag_counts = Counter(hashtags)
        return [t for t, _ in tag_counts.most_common(10)]

    def _calculate_engagement(self, posts: List[Dict]) -> Dict:
        """エンゲージメント平均算出"""
        if not posts:
            return {"likes": 0, "comments": 0}

        total_likes = sum(p.get("likesCount", 0) for p in posts)
        total_comments = sum(p.get("commentsCount", 0) for p in posts)

        return {
            "likes": total_likes / len(posts),
            "comments": total_comments / len(posts)
        }

    def _extract_pain_points(self, posts: List[Dict]) -> List[str]:
        """実際の悩み・課題抽出"""
        pain_keywords = [
            "悩", "困", "不安", "課題", "問題", "難し", "悩み", "迷",
            "challenge", "difficult", "problem", "issue", "struggle"
        ]

        pain_points = []
        for post in posts:
            caption = post.get("caption", "")
            # 悩みキーワード含む投稿を抽出
            if any(kw in caption.lower() for kw in pain_keywords):
                pain_points.append(caption[:100])

        return pain_points[:5]  # 上位5件

    def _calculate_trust_score(
        self,
        integrated: Dict,
        nemotron_persona: Dict,
        instagram_data: Optional[Dict]
    ) -> int:
        """
        信頼性スコア算出 (100点満点)

        配点:
        - Nemotron 統計的裏付け: 40点
        - Instagram 実データ検証: 40点
        - 整合性: 20点
        """
        score = 0

        # Nemotron 統計的裏付け (40点)
        if nemotron_persona:
            score += 40  # Nemotron データがある時点で40点

        # Instagram 実データ検証 (40点)
        if instagram_data:
            posts_count = len(instagram_data.get("posts", []))
            profiles_count = len(instagram_data.get("profiles", []))

            # 投稿数によるスコア (最大30点)
            if posts_count >= 50:
                score += 30
            elif posts_count >= 20:
                score += 20
            elif posts_count >= 10:
                score += 10

            # プロフィール数によるスコア (最大10点)
            if profiles_count >= 10:
                score += 10
            elif profiles_count >= 5:
                score += 5

        # 整合性 (20点) - 矛盾チェック前に呼ばれるため、Instagramデータがあれば加点
        if instagram_data:
            consistency_check = self._check_consistency(
                {"基本情報": {"年齢": nemotron_persona.get("age")}},
                nemotron_persona,
                instagram_data
            )
            if consistency_check.get("矛盾なし", False):
                score += 20
            elif consistency_check.get("軽微な矛盾", False):
                score += 10

        return min(score, 100)  # 最大100点

    def _check_consistency(
        self,
        integrated: Dict,
        nemotron_persona: Dict,
        instagram_data: Optional[Dict]
    ) -> Dict:
        """整合性チェック"""
        issues = []

        # 年齢と投稿内容の整合性
        age = nemotron_persona.get("age")
        if instagram_data and age:
            # 簡易チェック (実装を簡略化)
            if age < 25 and "retirement" in str(instagram_data).lower():
                issues.append("年齢と投稿内容の不一致: 若年層だが退職関連投稿")
            if age > 50 and "student" in str(instagram_data).lower():
                issues.append("年齢と投稿内容の不一致: 中高年だが学生関連投稿")

        # 職業とハッシュタグの整合性
        occupation = nemotron_persona.get("occupation", "")
        if instagram_data and occupation:
            posts = instagram_data.get("posts", [])
            hashtags = []
            for post in posts:
                caption = post.get("caption", "")
                hashtags.extend([w for w in caption.split() if w.startswith('#')])

            # IT職だがIT関連ハッシュタグなし等
            if "IT" in occupation and not any("tech" in h.lower() or "it" in h.lower() for h in hashtags):
                issues.append("職業とハッシュタグの不一致: IT職だがIT関連投稿なし")

        return {
            "矛盾なし": len(issues) == 0,
            "軽微な矛盾": 0 < len(issues) <= 2,
            "重大な矛盾": len(issues) > 2,
            "検出された問題": issues
        }

    def format_output(self, integrated: Dict) -> str:
        """
        統合ペルソナを Markdown 形式で出力

        Args:
            integrated: 統合ペルソナ

        Returns:
            Markdown 形式の文字列
        """
        output = []
        output.append("# 統合ペルソナプロファイル\n")

        # 信頼性スコア
        score = integrated.get("信頼性スコア", 0)
        output.append(f"## 信頼性スコア: {score}/100\n")

        # 基本情報
        basic = integrated.get("基本情報", {})
        output.append("## 基本情報\n")
        output.append(f"- **年齢**: {basic.get('年齢')}歳\n")
        output.append(f"- **性別**: {basic.get('性別')}\n")
        location = basic.get("居住地", {})
        output.append(f"- **居住地**: {location.get('都道府県')} ({location.get('地方')})\n")

        # デモグラフィック
        demo = integrated.get("デモグラフィック", {})
        output.append("\n## デモグラフィック\n")
        output.append(f"- **職業**: {demo.get('職業')}\n")
        output.append(f"- **学歴**: {demo.get('学歴')}\n")
        output.append(f"- **婚姻状況**: {demo.get('婚姻状況')}\n")

        # キャリア情報
        career = integrated.get("キャリア情報", {})
        output.append("\n## キャリア情報\n")
        career_goals = career.get('キャリア目標') or ''
        skills = career.get('スキル') or ''
        output.append(f"- **キャリア目標**: {career_goals[:100] if career_goals else 'N/A'}...\n")
        output.append(f"- **スキル**: {skills[:100] if skills else 'N/A'}...\n")

        # Instagram 分析
        if "Instagram投稿分析" in integrated:
            insta = integrated["Instagram投稿分析"]
            output.append("\n## Instagram 投稿分析\n")
            output.append(f"- **投稿数**: {insta.get('投稿数')}件\n")
            output.append(f"- **頻出ハッシュタグ**: {', '.join(insta.get('頻出ハッシュタグ', [])[:5])}\n")

            engagement = insta.get("エンゲージメント平均", {})
            output.append(f"- **平均いいね数**: {engagement.get('likes', 0):.1f}\n")
            output.append(f"- **平均コメント数**: {engagement.get('comments', 0):.1f}\n")

        # 実際の悩み
        if "実際の悩み" in integrated:
            pains = integrated["実際の悩み"]
            if pains:
                output.append("\n## 実際の悩み・課題\n")
                for i, pain in enumerate(pains[:3], 1):
                    output.append(f"{i}. {pain}\n")

        # データソース
        source = integrated.get("データソース", {})
        output.append("\n## データソース\n")
        output.append(f"- **Nemotron ペルソナ**: {'✅' if source.get('nemotron') else '❌'}\n")
        output.append(f"- **Instagram データ**: {'✅' if source.get('instagram') else '❌'}\n")

        # 矛盾チェック
        consistency = integrated.get("矛盾チェック", {})
        output.append("\n## 整合性チェック\n")
        if consistency.get("矛盾なし"):
            output.append("- ✅ 矛盾なし\n")
        elif consistency.get("軽微な矛盾"):
            output.append("- ⚠️ 軽微な矛盾あり\n")
        else:
            output.append("- ❌ 重大な矛盾あり\n")

        issues = consistency.get("検出された問題", [])
        if issues:
            output.append("\n検出された問題:\n")
            for issue in issues:
                output.append(f"- {issue}\n")

        output.append(f"\n---\n*生成日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n")

        return "".join(output)
