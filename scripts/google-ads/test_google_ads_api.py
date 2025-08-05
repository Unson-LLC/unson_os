#!/usr/bin/env python3
"""Google Ads API 動作テストスクリプト"""

import os
import sys
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from dotenv import load_dotenv

# .env.localから環境変数を読み込み
load_dotenv('.env.local')

def test_google_ads_connection():
    """Google Ads APIへの接続をテスト"""
    
    print("🔍 Google Ads API 動作テスト開始\n")
    
    # 環境変数の確認
    required_vars = [
        'GOOGLE_ADS_CLIENT_ID',
        'GOOGLE_ADS_CLIENT_SECRET', 
        'GOOGLE_ADS_REFRESH_TOKEN',
        'GOOGLE_ADS_DEVELOPER_TOKEN',
        'GOOGLE_ADS_CUSTOMER_ID',
        'GOOGLE_ADS_LOGIN_CUSTOMER_ID'
    ]
    
    print("1️⃣ 環境変数チェック:")
    all_vars_set = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"   ✅ {var}: 設定済み")
        else:
            print(f"   ❌ {var}: 未設定")
            all_vars_set = False
    
    if not all_vars_set:
        print("\n❌ 必要な環境変数が設定されていません。")
        return
    
    print("\n2️⃣ Google Ads クライアント初期化:")
    
    try:
        # 認証情報の設定
        credentials = {
            "developer_token": os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN'),
            "client_id": os.getenv('GOOGLE_ADS_CLIENT_ID'),
            "client_secret": os.getenv('GOOGLE_ADS_CLIENT_SECRET'),
            "refresh_token": os.getenv('GOOGLE_ADS_REFRESH_TOKEN'),
            "login_customer_id": os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID'),
            "use_proto_plus": True
        }
        
        # クライアントの初期化
        client = GoogleAdsClient.load_from_dict(credentials)
        print("   ✅ クライアント初期化成功")
        
    except Exception as e:
        print(f"   ❌ クライアント初期化エラー: {e}")
        return
    
    print("\n3️⃣ API接続テスト:")
    
    try:
        # Google Ads サービスを取得
        ga_service = client.get_service("GoogleAdsService")
        
        # 簡単なクエリでアカウント情報を取得
        query = """
            SELECT 
                customer.descriptive_name,
                customer.currency_code,
                customer.time_zone,
                customer.id
            FROM customer
            LIMIT 1
        """
        
        # MCCアカウントでクエリ実行を試みる
        mcc_customer_id = os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID').replace('-', '')
        print(f"   🔍 MCCアカウント {mcc_customer_id} で利用可能なアカウントを確認中...")
        
        # まずMCCアカウントで管理しているアカウント一覧を取得
        accessible_customers_query = """
            SELECT
                customer_client.client_customer,
                customer_client.descriptive_name,
                customer_client.level,
                customer_client.status
            FROM customer_client
            WHERE customer_client.level <= 1
        """
        
        try:
            # MCCアカウントで実行
            response = ga_service.search_stream(customer_id=mcc_customer_id, query=accessible_customers_query)
            print("   ✅ MCC接続成功！\n")
            print("4️⃣ 管理アカウント一覧:")
            
            accessible_accounts = []
            for batch in response:
                for row in batch.results:
                    client_customer = row.customer_client.client_customer
                    if client_customer:
                        accessible_accounts.append(client_customer.split('/')[-1])
                        print(f"   📊 {row.customer_client.descriptive_name} (ID: {client_customer.split('/')[-1]})")
                        print(f"      レベル: {row.customer_client.level}")
                        print(f"      状態: {row.customer_client.status.name}")
            
            # 子アカウントの情報を取得
            child_customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID').replace('-', '')
            if child_customer_id in accessible_accounts:
                print(f"\n   ✅ 子アカウント {child_customer_id} へのアクセス権を確認")
                customer_id = child_customer_id  # customer_id変数を設定
                response = ga_service.search_stream(customer_id=child_customer_id, query=query)
            else:
                print(f"\n   ⚠️  子アカウント {child_customer_id} が見つかりません")
                return
                
        except GoogleAdsException as ex:
            # MCCアカウントでアクセスできない場合は、直接子アカウントで試行
            print("   ℹ️  MCCアカウント情報を取得できません。子アカウントで直接接続を試みます...")
            customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID').replace('-', '')
            response = ga_service.search_stream(customer_id=customer_id, query=query)
        
        # 結果を表示
        print("   ✅ API接続成功！\n")
        print("4️⃣ アカウント情報:")
        
        for batch in response:
            for row in batch.results:
                print(f"   📊 アカウント名: {row.customer.descriptive_name}")
                print(f"   💱 通貨: {row.customer.currency_code}")
                print(f"   🕐 タイムゾーン: {row.customer.time_zone}")
                print(f"   🆔 顧客ID: {row.customer.id}")
        
        print("\n5️⃣ 最近のキャンペーン情報:")
        
        # キャンペーン情報を取得
        campaign_query = """
            SELECT 
                campaign.id,
                campaign.name,
                campaign.status,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros
            FROM campaign 
            WHERE segments.date DURING LAST_7_DAYS
            ORDER BY metrics.impressions DESC
            LIMIT 5
        """
        
        campaign_response = ga_service.search_stream(
            customer_id=customer_id, 
            query=campaign_query
        )
        
        has_campaigns = False
        for batch in campaign_response:
            for row in batch.results:
                has_campaigns = True
                cost_jpy = row.metrics.cost_micros / 1_000_000
                print(f"\n   📢 キャンペーン: {row.campaign.name}")
                print(f"      状態: {row.campaign.status.name}")
                print(f"      表示回数: {row.metrics.impressions:,}")
                print(f"      クリック数: {row.metrics.clicks:,}")
                print(f"      費用: ¥{cost_jpy:,.0f}")
        
        if not has_campaigns:
            print("   ℹ️  アクティブなキャンペーンがありません")
        
        print("\n✅ すべてのテストが成功しました！")
        print("🎉 Google Ads APIが正常に動作しています。")
        
    except GoogleAdsException as ex:
        print(f"   ❌ Google Ads APIエラー:")
        for error in ex.failure.errors:
            print(f"      エラー: {error.message}")
            if error.location:
                for field_path_element in error.location.field_path_elements:
                    print(f"      フィールド: {field_path_element.field_name}")
    except Exception as e:
        print(f"   ❌ 予期しないエラー: {e}")

if __name__ == "__main__":
    test_google_ads_connection()