#!/usr/bin/env python3
"""
Google Ads キーワード更新スクリプト - 実行版
"""

import os
import sys
import json
from pathlib import Path

# 環境変数を.env.localから読み込み
env_path = Path(__file__).parent.parent.parent / '.env.local'
if env_path.exists():
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value.strip('"').strip("'")

# Google Ads API設定
CUSTOMER_ID = os.environ.get('GOOGLE_ADS_CUSTOMER_ID', '4600539562')
LOGIN_CUSTOMER_ID = os.environ.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID', '4600539562')
DEVELOPER_TOKEN = os.environ.get('GOOGLE_ADS_DEVELOPER_TOKEN')
CLIENT_ID = os.environ.get('GOOGLE_ADS_CLIENT_ID')
CLIENT_SECRET = os.environ.get('GOOGLE_ADS_CLIENT_SECRET')
REFRESH_TOKEN = os.environ.get('GOOGLE_ADS_REFRESH_TOKEN')

# OAuth2認証とAPI呼び出し
import requests

def get_access_token():
    """アクセストークンを取得"""
    url = 'https://oauth2.googleapis.com/token'
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': REFRESH_TOKEN,
        'grant_type': 'refresh_token'
    }
    response = requests.post(url, data=data)
    return response.json()['access_token']

def create_keywords():
    """高パフォーマンスキーワードを追加"""
    access_token = get_access_token()
    
    # Google Ads API v16エンドポイント
    url = f'https://googleads.googleapis.com/v16/customers/{CUSTOMER_ID}/adGroupCriteria:mutate'
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'developer-token': DEVELOPER_TOKEN,
        'login-customer-id': LOGIN_CUSTOMER_ID,
        'Content-Type': 'application/json'
    }
    
    # 追加するキーワード
    operations = []
    ad_group_id = '183083066586'
    
    keywords_to_add = [
        {'text': '無料 ai', 'cpc_bid': 15000000},
        {'text': 'ai 無料', 'cpc_bid': 15000000},
        {'text': 'ai ツール 無料', 'cpc_bid': 12000000},
        {'text': 'ai コンサル', 'cpc_bid': 10000000},
        {'text': 'ai 情報', 'cpc_bid': 10000000},
    ]
    
    for keyword in keywords_to_add:
        operations.append({
            'create': {
                'adGroup': f'customers/{CUSTOMER_ID}/adGroups/{ad_group_id}',
                'status': 'ENABLED',
                'keyword': {
                    'text': keyword['text'],
                    'matchType': 'BROAD'
                },
                'cpcBidMicros': str(keyword['cpc_bid'])
            }
        })
    
    # API呼び出し
    payload = {'operations': operations}
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        print(f"✅ {len(operations)}件のキーワードを追加しました")
        return True
    else:
        print(f"❌ エラー: {response.status_code}")
        print(response.text)
        return False

def pause_keywords():
    """低パフォーマンスキーワードを一時停止"""
    access_token = get_access_token()
    
    url = f'https://googleads.googleapis.com/v16/customers/{CUSTOMER_ID}/adGroupCriteria:mutate'
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'developer-token': DEVELOPER_TOKEN,
        'login-customer-id': LOGIN_CUSTOMER_ID,
        'Content-Type': 'application/json'
    }
    
    # 一時停止するキーワード
    ad_group_id = '183083066586'
    keywords_to_pause = [
        '1620479705755', '2434297411093', '2434297411333', '2435292655193',
        '2435292655353', '2435292655393', '2435292655433', '2435292655593',
        '2435292655913', '2435292656073', '2324086873428', '302569558508',
        '357498403178', '391053625322'
    ]
    
    operations = []
    for criterion_id in keywords_to_pause:
        operations.append({
            'update': {
                'resourceName': f'customers/{CUSTOMER_ID}/adGroupCriteria/{ad_group_id}~{criterion_id}',
                'status': 'PAUSED'
            },
            'updateMask': 'status'
        })
    
    payload = {'operations': operations}
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        print(f"✅ {len(operations)}件のキーワードを一時停止しました")
        return True
    else:
        print(f"❌ エラー: {response.status_code}")
        print(response.text)
        return False

def main():
    print("🔄 Google Ads キーワード更新を開始します...")
    print(f"顧客ID: {CUSTOMER_ID}")
    
    # 1. 低パフォーマンスキーワードを一時停止
    print("\n📌 低パフォーマンスキーワードを一時停止中...")
    pause_success = pause_keywords()
    
    # 2. 高パフォーマンスキーワードを追加
    print("\n📌 高パフォーマンスキーワードを追加中...")
    create_success = create_keywords()
    
    if pause_success and create_success:
        print("\n✅ すべての更新が完了しました!")
        print("📊 実行内容:")
        print("  - 高パフォーマンスAI系キーワード5個を追加")
        print("  - 低パフォーマンス女性向けキーワード14個を一時停止")
        print("  - 入札単価を10-15円に最適化")
    else:
        print("\n⚠️ 一部の更新に失敗しました")

if __name__ == "__main__":
    main()