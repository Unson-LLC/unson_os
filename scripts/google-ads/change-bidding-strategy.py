#!/usr/bin/env python3
"""
Google Ads API を使用して入札戦略をクリック数最大化に変更
"""

import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

# .env.localから環境変数を読み込む
from dotenv import load_dotenv
load_dotenv('.env.local')

def change_bidding_strategy_to_maximize_clicks():
    """入札戦略をMAXIMIZE_CLICKSに変更"""
    
    # API認証情報を設定
    credentials = {
        "developer_token": os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"),
        "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
        "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
        "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
    }
    
    # クライアント初期化
    client = GoogleAdsClient.load_from_dict(credentials)
    campaign_service = client.get_service("CampaignService")
    
    customer_id = "4600539562"
    campaign_id = "22873791559"
    
    # キャンペーン更新オペレーションを作成
    campaign_operation = client.get_type("CampaignOperation")
    campaign = campaign_operation.update
    
    # リソース名を設定
    campaign.resource_name = campaign_service.campaign_path(
        customer_id, campaign_id
    )
    
    # 入札戦略をクリック数最大化に変更
    # maximize_clicksフィールドを設定
    campaign.maximize_clicks.CopyFrom(
        client.get_type("MaximizeClicks")
    )
    
    # 更新するフィールドを指定
    client.copy_from(
        campaign_operation.update_mask,
        client.get_type("FieldMask")(
            paths=["maximize_clicks"]
        )
    )
    
    try:
        # 変更を実行
        response = campaign_service.mutate_campaigns(
            customer_id=customer_id,
            operations=[campaign_operation]
        )
        
        print("✅ 入札戦略を正常に変更しました！")
        for result in response.results:
            print(f"   キャンペーン: {result.resource_name}")
            print(f"   新しい入札戦略: MAXIMIZE_CLICKS (クリック数最大化)")
            print(f"   予算: ¥4,000/日")
            print("\n⚡ 期待される効果:")
            print("   - 24時間以内に配信量が回復")
            print("   - 日100-130クリック獲得見込み")
            print("   - 予算消化率90%以上")
            
    except GoogleAdsException as ex:
        print(f"❌ エラーが発生しました:")
        for error in ex.failure.errors:
            print(f"   {error.message}")
            if error.location:
                for field_path_element in error.location.field_path_elements:
                    print(f"   フィールド: {field_path_element.field_name}")

if __name__ == "__main__":
    print("🔄 Google Ads API: 入札戦略変更スクリプト")
    print("   キャンペーン: わたしコンパス_ベータテスター募集_2025")
    print("   変更内容: MAXIMIZE_CONVERSIONS → MAXIMIZE_CLICKS")
    print("-" * 50)
    
    change_bidding_strategy_to_maximize_clicks()