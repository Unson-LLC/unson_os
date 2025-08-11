#!/usr/bin/env python3
"""
Google Ads キーワード更新スクリプト
高パフォーマンスキーワード（AI系）を再有効化し、
低パフォーマンスキーワード（女性向け）を一時停止
"""

import os
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from dotenv import load_dotenv

load_dotenv('.env.local')

def get_google_ads_client():
    """Google Ads クライアントを初期化"""
    config = {
        "developer_token": os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"),
        "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
        "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
        "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
    }
    
    return GoogleAdsClient.load_from_dict(config)

def update_keywords(client, customer_id):
    """キーワードの更新処理"""
    
    ad_group_id = "183083066586"
    
    # 再有効化するキーワード（高パフォーマンスAI系）
    keywords_to_enable = [
        {"id": "434295812314", "text": "無料 ai", "bid": 15000000},
        {"id": "425314793514", "text": "ai 無料", "bid": 15000000},
        {"id": "844056995720", "text": "ai ツール 無料", "bid": 12000000},
        {"id": "384268653591", "text": "ai コンサル", "bid": 10000000},
        {"id": "629220687331", "text": "ai 情報", "bid": 10000000},
    ]
    
    # 一時停止するキーワード（低パフォーマンス女性向け）
    keywords_to_pause = [
        "1620479705755",  # 自分軸 作り方
        "2434297411093",  # 自己分析 女性
        "2434297411333",  # 価値観診断 アプリ
        "2435292655193",  # 自分らしく生きる 方法
        "2435292655353",  # 女性 価値観 見つける
        "2435292655393",  # 本当の自分 探す
        "2435292655433",  # 人生の選択 相談
        "2435292655593",  # 女性向け 自己分析
        "2435292655913",  # 価値観 明確にする
        "2435292656073",  # 結婚 仕事 選択
        "2324086873428",  # 女性 ライフデザイン
        "302569558508",   # 女性 キャリア 相談
        "357498403178",   # ワークライフバランス 悩み
        "391053625322",   # 自己理解 深める
    ]
    
    ad_group_criterion_service = client.get_service("AdGroupCriterionService")
    
    operations = []
    
    # 削除されたキーワードを再追加
    for keyword_data in keywords_to_enable:
        operation = client.get_type("AdGroupCriterionOperation")
        criterion = operation.create
        
        criterion.ad_group = f"customers/{customer_id}/adGroups/{ad_group_id}"
        criterion.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
        
        # キーワード設定
        criterion.keyword.text = keyword_data["text"]
        criterion.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
        
        # 入札単価設定
        criterion.cpc_bid_micros = keyword_data["bid"]
        
        operations.append(operation)
    
    # 既存キーワードの一時停止
    for criterion_id in keywords_to_pause:
        operation = client.get_type("AdGroupCriterionOperation")
        criterion = operation.update
        
        resource_name = f"customers/{customer_id}/adGroupCriteria/{ad_group_id}~{criterion_id}"
        criterion.resource_name = resource_name
        criterion.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
        
        operation.update_mask.paths.append("status")
        operations.append(operation)
    
    if operations:
        try:
            response = ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=customer_id,
                operations=operations
            )
            
            print(f"✅ {len(response.results)}件のキーワードを更新しました")
            
            for result in response.results:
                print(f"  - {result.resource_name}")
                
            return True
            
        except GoogleAdsException as ex:
            print(f"❌ エラーが発生しました:")
            for error in ex.failure.errors:
                print(f"  - {error.message}")
            return False

def main():
    client = get_google_ads_client()
    customer_id = os.getenv("GOOGLE_ADS_CUSTOMER_ID")
    
    print("🔄 キーワード更新を開始します...")
    print(f"  顧客ID: {customer_id}")
    
    if update_keywords(client, customer_id):
        print("\n✅ キーワード更新が完了しました")
        print("\n📊 実行内容:")
        print("  1. 高パフォーマンスAI系キーワードを再有効化")
        print("  2. 低パフォーマンス女性向けキーワードを一時停止")
        print("  3. 入札単価を最適化（10-15円）")
    else:
        print("\n❌ キーワード更新に失敗しました")

if __name__ == "__main__":
    main()