#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Google Ads最適化案に基づくアセット追加スクリプト
"""

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import os
from dotenv import load_dotenv

# .env.localから環境変数を読み込み
load_dotenv('.env.local')
load_dotenv('../../.env.local')  # スクリプトの場所から相対パス

# 環境変数から認証情報を取得
client_config = {
    "client_id": os.environ.get("GOOGLE_ADS_CLIENT_ID"),
    "client_secret": os.environ.get("GOOGLE_ADS_CLIENT_SECRET"),
    "refresh_token": os.environ.get("GOOGLE_ADS_REFRESH_TOKEN"),
    "developer_token": os.environ.get("GOOGLE_ADS_DEVELOPER_TOKEN"),
    "login_customer_id": os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "2941328833"),
    "use_proto_plus": True,
}

# クライアント初期化
client = GoogleAdsClient.load_from_dict(client_config)

# アカウント情報
customer_id = "4600539562"
campaign_id = "22873791559"

def create_sitelink_assets(client, customer_id):
    """サイトリンクアセットを作成"""
    asset_service = client.get_service("AssetService")
    operations = []
    
    # サイトリンク1: 価値観診断について
    sitelink1 = client.get_type("Asset")
    sitelink1.sitelink_asset.link_text = "価値観診断とは"
    sitelink1.sitelink_asset.description1 = "5つの軸で自分を理解"
    sitelink1.sitelink_asset.description2 = "科学的アプローチで分析"
    sitelink1.final_urls.append("https://authentic-life-ai.vercel.app/#about")
    
    # サイトリンク2: 診断の流れ
    sitelink2 = client.get_type("Asset")
    sitelink2.sitelink_asset.link_text = "診断の流れ"
    sitelink2.sitelink_asset.description1 = "1日3分から始められる"
    sitelink2.sitelink_asset.description2 = "あなたのペースで進む"
    sitelink2.final_urls.append("https://authentic-life-ai.vercel.app/#how-it-works")
    
    # サイトリンク3: ベータテスター特典
    sitelink3 = client.get_type("Asset")
    sitelink3.sitelink_asset.link_text = "限定特典"
    sitelink3.sitelink_asset.description1 = "ベータテスター限定"
    sitelink3.sitelink_asset.description2 = "完全無料で全機能利用"
    sitelink3.final_urls.append("https://authentic-life-ai.vercel.app/#benefits")
    
    # サイトリンク4: よくある質問
    sitelink4 = client.get_type("Asset")
    sitelink4.sitelink_asset.link_text = "よくある質問"
    sitelink4.sitelink_asset.description1 = "プライバシーも安心"
    sitelink4.sitelink_asset.description2 = "疑問にお答えします"
    sitelink4.final_urls.append("https://authentic-life-ai.vercel.app/#faq")
    
    for sitelink in [sitelink1, sitelink2, sitelink3, sitelink4]:
        operation = client.get_type("AssetOperation")
        operation.create = sitelink
        operations.append(operation)
    
    response = asset_service.mutate_assets(
        customer_id=customer_id, operations=operations
    )
    
    return [result.resource_name for result in response.results]

def create_callout_assets(client, customer_id):
    """コールアウトアセットを作成"""
    asset_service = client.get_service("AssetService")
    operations = []
    
    callout_texts = [
        "完全無料",
        "限定100名",
        "1日3分から",
        "科学的診断",
        "女性専用",
        "プライバシー保護",
        "いつでも退会可",
        "専門家監修"
    ]
    
    for text in callout_texts:
        asset = client.get_type("Asset")
        asset.callout_asset.callout_text = text
        
        operation = client.get_type("AssetOperation")
        operation.create = asset
        operations.append(operation)
    
    response = asset_service.mutate_assets(
        customer_id=customer_id, operations=operations
    )
    
    return [result.resource_name for result in response.results]

def link_assets_to_campaign(client, customer_id, campaign_id, asset_resource_names, asset_type):
    """アセットをキャンペーンに関連付け"""
    campaign_asset_service = client.get_service("CampaignAssetService")
    operations = []
    
    # アセットタイプに応じたfield_typeを設定
    if asset_type == "sitelink":
        field_type = client.enums.AssetFieldTypeEnum.SITELINK
    elif asset_type == "callout":
        field_type = client.enums.AssetFieldTypeEnum.CALLOUT
    else:
        raise ValueError(f"Unknown asset type: {asset_type}")
    
    for asset_resource_name in asset_resource_names:
        campaign_asset = client.get_type("CampaignAsset")
        campaign_asset.campaign = f"customers/{customer_id}/campaigns/{campaign_id}"
        campaign_asset.asset = asset_resource_name
        campaign_asset.field_type = field_type
        
        operation = client.get_type("CampaignAssetOperation")
        operation.create = campaign_asset
        operations.append(operation)
    
    response = campaign_asset_service.mutate_campaign_assets(
        customer_id=customer_id, operations=operations
    )
    
    return response

def improve_responsive_search_ad(client, customer_id, ad_id="768045512823"):
    """レスポンシブ検索広告の改善（見出しと説明文を追加）"""
    ad_service = client.get_service("AdService")
    ad_group_ad_service = client.get_service("AdGroupAdService")
    
    # 新しい見出しと説明文を追加
    additional_headlines = [
        "あなたの価値観を言語化",
        "選択に迷わない人生へ",
        "自分らしさを再発見"
    ]
    
    additional_descriptions = [
        "20代〜40代女性のための価値観診断。転職・結婚・育児の選択に迷うあなたをサポート。今なら無料",
        "忙しい毎日でも続けられる。1日3分の質問に答えるだけ。あなたの本当の価値観が見えてきます。"
    ]
    
    # 注: 実際の実装では、既存の広告を更新するか、
    # 新しい広告を作成して古い広告を一時停止する必要があります
    print("広告強度を改善するために以下を追加することを推奨:")
    print("\n追加の見出し:")
    for headline in additional_headlines:
        print(f"- {headline}")
    print("\n追加の説明文:")
    for desc in additional_descriptions:
        print(f"- {desc}")

def main():
    try:
        print("1. サイトリンクアセットを作成中...")
        sitelink_assets = create_sitelink_assets(client, customer_id)
        print(f"作成されたサイトリンク: {len(sitelink_assets)}個")
        
        print("\n2. コールアウトアセットを作成中...")
        callout_assets = create_callout_assets(client, customer_id)
        print(f"作成されたコールアウト: {len(callout_assets)}個")
        
        print("\n3. アセットをキャンペーンに関連付け中...")
        link_assets_to_campaign(client, customer_id, campaign_id, sitelink_assets, "sitelink")
        link_assets_to_campaign(client, customer_id, campaign_id, callout_assets, "callout")
        
        print("\n4. レスポンシブ検索広告の改善提案:")
        improve_responsive_search_ad(client, customer_id)
        
        print("\n✅ 最適化が完了しました！")
        
    except GoogleAdsException as ex:
        print(f"Request with ID '{ex.request_id}' failed with status "
              f"'{ex.error.code().name}' and includes the following errors:")
        for error in ex.failure.errors:
            print(f"\tError with message '{error.message}'.")
            if error.location:
                for field_path_element in error.location.field_path_elements:
                    print(f"\t\tOn field: {field_path_element.field_name}")

if __name__ == "__main__":
    main()