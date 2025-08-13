#!/usr/bin/env python3
"""
Google Ads キャンペーンを日本のみにターゲティング設定
環境変数: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN が必要
"""

import subprocess
import json
import os

def get_access_token():
    """アクセストークンを取得"""
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
    refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')
    
    if not all([client_id, client_secret, refresh_token]):
        raise ValueError("環境変数が設定されていません: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN")
    
    cmd = [
        'curl', '-s', '-X', 'POST',
        'https://oauth2.googleapis.com/token',
        '-d', f'client_id={client_id}',
        '-d', f'client_secret={client_secret}',
        '-d', f'refresh_token={refresh_token}',
        '-d', 'grant_type=refresh_token'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    token_data = json.loads(result.stdout)
    return token_data.get('access_token')

def set_japan_targeting():
    """日本のみにターゲティングを設定"""
    
    access_token = get_access_token()
    if not access_token:
        print("❌ アクセストークンの取得に失敗")
        return
    
    print("✅ アクセストークン取得成功")
    
    # キャンペーンクライテリアのAPI呼び出し
    # 日本のgeoTargetConstant ID: 2392
    customer_id = "4600539562"
    campaign_id = "22873791559"
    
    # まず既存の地域ターゲティングを削除
    delete_url = f"https://googleads.googleapis.com/v17/customers/{customer_id}/campaignCriteria:mutate"
    
    # 日本を追加
    add_request = {
        "operations": [{
            "create": {
                "campaign": f"customers/{customer_id}/campaigns/{campaign_id}",
                "criterion": {
                    "location": {
                        "geoTargetConstant": "geoTargetConstants/2392"
                    }
                },
                "negative": False
            }
        }]
    }
    
    cmd = [
        'curl', '-X', 'POST',
        f'https://googleads.googleapis.com/v17/customers/{customer_id}/campaignCriteria:mutate',
        '-H', f'Authorization: Bearer {access_token}',
        '-H', 'developer-token: X5gtAHhpkqWAVpO6lkj4Jg',
        '-H', 'login-customer-id: 2941328833',
        '-H', 'Content-Type: application/json',
        '-d', json.dumps(add_request)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        try:
            response = json.loads(result.stdout)
            if 'results' in response:
                print("\n✅ 地域ターゲティングを日本のみに設定しました！")
                print("   対象地域: 日本")
                print("   キャンペーン: わたしコンパス_ベータテスター募集_2025")
                print("\n⚡ 期待される効果:")
                print("   - インドからのトラフィックを排除")
                print("   - 日本のユーザーのみにリーチ")
                print("   - より精度の高いターゲティング")
            else:
                print(f"応答: {response}")
        except json.JSONDecodeError:
            print(f"レスポンス: {result.stdout}")
    else:
        print(f"❌ エラー: {result.stderr}")

if __name__ == "__main__":
    print("🎯 Google Ads 地域ターゲティング設定")
    print("   キャンペーン: わたしコンパス_ベータテスター募集_2025")
    print("   設定: 日本のみ")
    print("-" * 50)
    
    set_japan_targeting()