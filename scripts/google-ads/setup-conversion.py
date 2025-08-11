#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
ベータテスター登録コンバージョンアクションの設定スクリプト
"""

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import os
from dotenv import load_dotenv

# .env.localから環境変数を読み込み
load_dotenv('../../.env.local')

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

def create_beta_tester_conversion(client, customer_id):
    """ベータテスター登録コンバージョンを作成"""
    conversion_action_service = client.get_service("ConversionActionService")
    
    # コンバージョンアクションの作成
    conversion_action = client.get_type("ConversionAction")
    conversion_action.name = "ベータテスター登録完了"
    conversion_action.type_ = client.enums.ConversionActionTypeEnum.WEBPAGE
    conversion_action.category = client.enums.ConversionActionCategoryEnum.SIGNUP
    conversion_action.status = client.enums.ConversionActionStatusEnum.ENABLED
    
    # カウント設定
    conversion_action.counting_type = client.enums.ConversionActionCountingTypeEnum.ONE_PER_CLICK
    # include_in_conversions_metric は作成時に設定できないため、作成後に更新する
    
    # 価値設定
    conversion_action.value_settings.default_value = 3000.0  # 3,000円
    conversion_action.value_settings.default_currency_code = "JPY"
    conversion_action.value_settings.always_use_default_value = True
    
    # アトリビューション設定
    conversion_action.attribution_model_settings.attribution_model = (
        client.enums.AttributionModelEnum.GOOGLE_SEARCH_ATTRIBUTION_DATA_DRIVEN
    )
    
    # ルックバックウィンドウ設定（デフォルト）
    conversion_action.click_through_lookback_window_days = 30
    conversion_action.view_through_lookback_window_days = 1
    
    # オペレーション作成
    operation = client.get_type("ConversionActionOperation")
    operation.create = conversion_action
    
    # 実行
    response = conversion_action_service.mutate_conversion_actions(
        customer_id=customer_id, operations=[operation]
    )
    
    return response.results[0].resource_name

def disable_pageview_conversion(client, customer_id, conversion_action_id="7248195500"):
    """既存のページビューコンバージョンを無効化"""
    conversion_action_service = client.get_service("ConversionActionService")
    
    # 更新するコンバージョンアクションのリソース名
    resource_name = f"customers/{customer_id}/conversionActions/{conversion_action_id}"
    
    # コンバージョンアクションの更新
    conversion_action = client.get_type("ConversionAction")
    conversion_action.resource_name = resource_name
    conversion_action.include_in_conversions_metric = False  # コンバージョン指標から除外
    
    # オペレーション作成
    operation = client.get_type("ConversionActionOperation")
    operation.update = conversion_action
    operation.update_mask.paths.append("include_in_conversions_metric")
    
    # 実行
    response = conversion_action_service.mutate_conversion_actions(
        customer_id=customer_id, operations=[operation]
    )
    
    return response.results[0].resource_name

def get_conversion_tag_snippet(client, customer_id, resource_name):
    """作成したコンバージョンのタグスニペットを取得"""
    ga_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT 
            conversion_action.id,
            conversion_action.name,
            conversion_action.tag_snippets
        FROM conversion_action
        WHERE conversion_action.resource_name = '{resource_name}'
    """
    
    response = ga_service.search(customer_id=customer_id, query=query)
    
    for row in response:
        print("\n=== コンバージョンタグ情報 ===")
        print(f"ID: {row.conversion_action.id}")
        print(f"名前: {row.conversion_action.name}")
        print("\n--- グローバルサイトタグ (全ページに設置) ---")
        for snippet in row.conversion_action.tag_snippets:
            if snippet.type_ == client.enums.TrackingCodeTypeEnum.WEBPAGE and snippet.page_format == client.enums.TrackingCodePageFormatEnum.HTML:
                print(snippet.global_site_tag)
                print("\n--- イベントスニペット (登録完了ページに設置) ---")
                print(snippet.event_snippet)
                break

def main():
    try:
        print("1. ベータテスター登録コンバージョンを作成中...")
        beta_tester_resource = create_beta_tester_conversion(client, customer_id)
        print(f"✅ 作成完了: {beta_tester_resource}")
        
        print("\n2. 既存のページビューコンバージョンを無効化中...")
        disabled_resource = disable_pageview_conversion(client, customer_id)
        print(f"✅ 無効化完了: {disabled_resource}")
        
        print("\n3. タグスニペットを取得中...")
        get_conversion_tag_snippet(client, customer_id, beta_tester_resource)
        
        print("\n=== 設定完了 ===")
        print("上記のタグをサイトに設置してください：")
        print("1. グローバルサイトタグ → <head>タグ内（全ページ）")
        print("2. イベントスニペット → 登録完了ページまたはサンキューページ")
        
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