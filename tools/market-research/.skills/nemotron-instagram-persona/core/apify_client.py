"""
Apify Instagram API 自動呼び出しクライアント

環境変数 APIFY_API_TOKEN が必要
"""

import os
import time
import requests
from typing import Dict, List, Optional
from dotenv import load_dotenv


class ApifyInstagramClient:
    """
    Apify Instagram API の自動呼び出しクライアント
    """

    def __init__(self, api_token: Optional[str] = None):
        """
        初期化

        Args:
            api_token: Apify APIトークン (省略時は環境変数から取得)
        """
        # 環境変数ロード
        load_dotenv()

        self.api_token = api_token or os.getenv("APIFY_API_TOKEN")
        if not self.api_token:
            raise ValueError("APIFY_API_TOKEN が設定されていません。.env ファイルまたは環境変数を確認してください。")

        self.base_url = "https://api.apify.com/v2"
        self.actor_id = "apify/instagram-scraper"

        print(f"✅ ApifyInstagramClient 初期化完了 (Token: {self.api_token[:20]}...)")

    def search_posts(
        self,
        search_query: str,
        max_posts: int = 50,
        include_metadata: bool = True,
        timeout: int = 120
    ) -> Dict:
        """
        Instagram 投稿検索

        Args:
            search_query: 検索クエリ (ハッシュタグまたはキーワード)
            max_posts: 最大取得投稿数
            include_metadata: メタデータを含むか
            timeout: タイムアウト秒数

        Returns:
            Instagram データ (投稿リスト等)
        """
        print(f"\n🔍 Instagram 検索開始: '{search_query}' (最大{max_posts}件)")

        # API入力
        actor_input = {
            "search": search_query,
            "resultsType": "posts",
            "maxPosts": max_posts,
            "includeMetadata": include_metadata,
            "language": "en"
        }

        # Actor実行
        run_response = self._run_actor(actor_input)
        run_id = run_response.get("data", {}).get("id")
        dataset_id = run_response.get("data", {}).get("defaultDatasetId")

        if not run_id or not dataset_id:
            raise Exception(f"Actor実行失敗: {run_response}")

        print(f"  ジョブID: {run_id}")
        print(f"  データセットID: {dataset_id}")

        # ジョブ完了待機
        self._wait_for_completion(run_id, timeout)

        # データ取得
        posts = self._get_dataset_items(dataset_id)

        print(f"✅ Instagram データ取得完了: {len(posts)}件")
        return {
            "posts": posts,
            "search_query": search_query,
            "total_count": len(posts)
        }

    def search_profiles(
        self,
        search_query: str,
        max_profiles: int = 10,
        timeout: int = 120
    ) -> Dict:
        """
        Instagram プロフィール検索

        Args:
            search_query: 検索クエリ
            max_profiles: 最大取得プロフィール数
            timeout: タイムアウト秒数

        Returns:
            プロフィールデータ
        """
        print(f"\n👤 Instagram プロフィール検索: '{search_query}' (最大{max_profiles}件)")

        actor_input = {
            "search": search_query,
            "resultsType": "profiles",
            "maxProfiles": max_profiles,
            "includeMetadata": True
        }

        run_response = self._run_actor(actor_input)
        run_id = run_response.get("data", {}).get("id")
        dataset_id = run_response.get("data", {}).get("defaultDatasetId")

        if not run_id or not dataset_id:
            raise Exception(f"Actor実行失敗: {run_response}")

        self._wait_for_completion(run_id, timeout)
        profiles = self._get_dataset_items(dataset_id)

        print(f"✅ プロフィール取得完了: {len(profiles)}件")
        return {
            "profiles": profiles,
            "search_query": search_query,
            "total_count": len(profiles)
        }

    def search_combined(
        self,
        keywords: List[str],
        max_posts_per_keyword: int = 20,
        max_profiles: int = 10,
        timeout: int = 180
    ) -> Dict:
        """
        複数キーワードで投稿とプロフィールを統合検索

        Args:
            keywords: 検索キーワードリスト
            max_posts_per_keyword: キーワードあたりの最大投稿数
            max_profiles: 最大プロフィール数
            timeout: タイムアウト秒数

        Returns:
            統合Instagram データ
        """
        print(f"\n🔎 統合検索開始: {len(keywords)}キーワード")

        all_posts = []
        all_profiles = []

        # キーワードごとに投稿検索
        for keyword in keywords[:5]:  # 最大5キーワード
            try:
                result = self.search_posts(
                    keyword,
                    max_posts=max_posts_per_keyword,
                    timeout=timeout
                )
                all_posts.extend(result.get("posts", []))
            except Exception as e:
                print(f"  ⚠️ キーワード '{keyword}' で検索失敗: {e}")

        # 最初のキーワードでプロフィール検索
        if keywords:
            try:
                result = self.search_profiles(
                    keywords[0],
                    max_profiles=max_profiles,
                    timeout=timeout
                )
                all_profiles = result.get("profiles", [])
            except Exception as e:
                print(f"  ⚠️ プロフィール検索失敗: {e}")

        # 重複削除
        unique_posts = self._deduplicate_posts(all_posts)
        unique_profiles = self._deduplicate_profiles(all_profiles)

        print(f"✅ 統合検索完了: 投稿{len(unique_posts)}件、プロフィール{len(unique_profiles)}件")

        return {
            "posts": unique_posts,
            "profiles": unique_profiles,
            "keywords": keywords,
            "total_posts": len(unique_posts),
            "total_profiles": len(unique_profiles)
        }

    def _run_actor(self, actor_input: Dict) -> Dict:
        """Actor実行"""
        # Actor IDの / を ~ に変換 (Apify API仕様)
        actor_id_formatted = self.actor_id.replace("/", "~")
        url = f"{self.base_url}/acts/{actor_id_formatted}/runs"
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=actor_input, headers=headers)
        response.raise_for_status()
        return response.json()

    def _wait_for_completion(self, run_id: str, timeout: int):
        """ジョブ完了待機"""
        url = f"{self.base_url}/actor-runs/{run_id}"
        headers = {"Authorization": f"Bearer {self.api_token}"}

        start_time = time.time()
        while time.time() - start_time < timeout:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            status = response.json().get("data", {}).get("status")

            if status == "SUCCEEDED":
                print(f"  ✅ ジョブ完了")
                return
            elif status in ["FAILED", "ABORTED", "TIMED-OUT"]:
                raise Exception(f"ジョブ失敗: {status}")

            print(f"  ⏳ 待機中... ({status})")
            time.sleep(10)

        raise TimeoutError(f"ジョブタイムアウト ({timeout}秒)")

    def _get_dataset_items(self, dataset_id: str) -> List[Dict]:
        """データセットアイテム取得"""
        url = f"{self.base_url}/datasets/{dataset_id}/items"
        headers = {"Authorization": f"Bearer {self.api_token}"}

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def _deduplicate_posts(self, posts: List[Dict]) -> List[Dict]:
        """投稿の重複削除"""
        seen_ids = set()
        unique_posts = []

        for post in posts:
            post_id = post.get("id") or post.get("shortCode")
            if post_id and post_id not in seen_ids:
                seen_ids.add(post_id)
                unique_posts.append(post)

        return unique_posts

    def _deduplicate_profiles(self, profiles: List[Dict]) -> List[Dict]:
        """プロフィールの重複削除"""
        seen_ids = set()
        unique_profiles = []

        for profile in profiles:
            profile_id = profile.get("id") or profile.get("username")
            if profile_id and profile_id not in seen_ids:
                seen_ids.add(profile_id)
                unique_profiles.append(profile)

        return unique_profiles
