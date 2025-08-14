# Google Ads API 実践プレイブック

## 概要
Google Ads APIを使用したキャンペーン管理の実践的なコード集。即座にコピー&ペーストで使用可能。

## 🔧 初期設定

### 環境変数（.env.local）
```bash
# Google Ads API設定
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
GOOGLE_ADS_LOGIN_CUSTOMER_ID=your_login_customer_id
```

## 📡 API v19 基本操作

### 1. アクセストークン取得
```bash
# アクセストークンを取得（有効期限1時間）
ACCESS_TOKEN=$(curl -s -X POST \
  "https://oauth2.googleapis.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}&grant_type=refresh_token" | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "✅ アクセストークン: ${ACCESS_TOKEN:0:20}..."
```

### 2. キャンペーン情報取得
```bash
# アクティブなキャンペーンを検索
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT campaign.resource_name, campaign.name, campaign.id, campaign.bidding_strategy_type, campaign.status FROM campaign WHERE campaign.status = \"ENABLED\""
  }'
```

## 🎯 キーワード管理

### キーワード一覧取得（全状態）
```bash
# 全キーワードを取得（ENABLED, PAUSED, REMOVED含む）
KEYWORDS_RESULT=$(curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.status FROM ad_group_criterion WHERE ad_group_criterion.type = \"KEYWORD\""
  }')

# 結果をパース
echo "$KEYWORDS_RESULT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'results' in data:
        for result in data['results']:
            criterion = result['adGroupCriterion']
            if 'keyword' in criterion:
                text = criterion['keyword'].get('text', 'N/A')
                status = criterion.get('status', 'N/A')
                resource = criterion.get('resourceName', 'N/A')
                print(f'{text}: {status} ({resource})')
except:
    print('JSONパースエラー')
"
```

### 有効なキーワードのみ取得
```bash
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT ad_group_criterion.keyword.text, ad_group_criterion.status FROM ad_group_criterion WHERE ad_group_criterion.type = \"KEYWORD\" AND ad_group_criterion.status = \"ENABLED\""
  }'
```

### キーワード追加
```bash
# 複数キーワードを一括追加
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/adGroupCriteria:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {"create": {"adGroup": "customers/'${CUSTOMER_ID}'/adGroups/'${AD_GROUP_ID}'", "keyword": {"text": "キャリア", "matchType": "BROAD"}, "status": "ENABLED"}},
      {"create": {"adGroup": "customers/'${CUSTOMER_ID}'/adGroups/'${AD_GROUP_ID}'", "keyword": {"text": "相談", "matchType": "BROAD"}, "status": "ENABLED"}},
      {"create": {"adGroup": "customers/'${CUSTOMER_ID}'/adGroups/'${AD_GROUP_ID}'", "keyword": {"text": "転職 相談", "matchType": "PHRASE"}, "status": "ENABLED"}}
    ]
  }'
```

### キーワード停止/有効化
```bash
# キーワードを停止（PAUSED）
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/adGroupCriteria:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {"update": {"resourceName": "'${KEYWORD_RESOURCE_NAME}'", "status": "PAUSED"}, "updateMask": "status"}
    ]
  }'

# キーワードを有効化（ENABLED）
# 上記のPAUSEDをENABLEDに変更
```

### キーワード削除
```bash
# キーワードを完全削除（REMOVED）
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/adGroupCriteria:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {"remove": "'${KEYWORD_RESOURCE_NAME}'"}
    ]
  }'
```

## 📈 入札戦略変更

### TARGET_SPEND（クリック数最大化）に変更
```bash
# キャンペーンの入札戦略を変更
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/campaigns:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "partialFailure": false,
    "operations": [
      {
        "update": {
          "resourceName": "customers/'${CUSTOMER_ID}'/campaigns/'${CAMPAIGN_ID}'",
          "targetSpend": {
            "cpcBidCeilingMicros": "200000000"
          }
        },
        "updateMask": "target_spend.cpc_bid_ceiling_micros"
      }
    ]
  }'
```

### MAXIMIZE_CONVERSIONS（コンバージョン最大化）に変更
```bash
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/campaigns:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {
        "update": {
          "resourceName": "customers/'${CUSTOMER_ID}'/campaigns/'${CAMPAIGN_ID}'",
          "maximizeConversions": {
            "targetCpaMicros": "5000000000"
          }
        },
        "updateMask": "maximize_conversions.target_cpa_micros"
      }
    ]
  }'
```

## 📊 レポート取得

### 日別パフォーマンス
```bash
# 過去7日間のパフォーマンス
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT segments.date, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.ctr, metrics.average_cpc FROM campaign WHERE segments.date BETWEEN \"2025-08-08\" AND \"2025-08-14\" ORDER BY segments.date DESC"
  }'
```

### キーワード別パフォーマンス
```bash
curl -s -X POST \
  "https://googleads.googleapis.com/v19/customers/${CUSTOMER_ID}/googleAds:search" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT ad_group_criterion.keyword.text, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.ctr FROM keyword_view WHERE segments.date BETWEEN \"2025-08-08\" AND \"2025-08-14\" ORDER BY metrics.clicks DESC"
  }'
```

## 🛠️ トラブルシューティング

### よくあるエラーと対処法

#### 1. 404 Not Found
```
原因: APIバージョンが間違っている
対処: v19を使用（2025年8月時点の最新）
```

#### 2. Invalid JSON payload
```
原因: フィールド名が間違っている
対処: snake_case（maximize_clicks）ではなくcamelCase（maximizeClicks）を使用
```

#### 3. OPERATION_NOT_PERMITTED_FOR_CONTEXT
```
原因: 設定できないフィールドを更新しようとしている
対処: updateMaskで正しいフィールドのみ指定
```

#### 4. Authentication failed
```
原因: アクセストークンの有効期限切れ
対処: refresh_tokenで新しいアクセストークンを取得
```

## 🎯 実践的なスクリプト例

### キーワード一括切り替えスクリプト
```bash
#!/bin/bash
# AI系キーワードを停止し、ペルソナ系を有効化

# 認証情報設定
source .env.local

# アクセストークン取得
ACCESS_TOKEN=$(curl -s -X POST \
  "https://oauth2.googleapis.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${GOOGLE_ADS_CLIENT_ID}&client_secret=${GOOGLE_ADS_CLIENT_SECRET}&refresh_token=${GOOGLE_ADS_REFRESH_TOKEN}&grant_type=refresh_token" | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# AI系キーワードのリソース名（事前に取得済み）
AI_KEYWORDS=(
  "customers/4600539562/adGroupCriteria/183083066586~384268653591"
  "customers/4600539562/adGroupCriteria/183083066586~425314793514"
)

# ペルソナ系キーワードのリソース名
PERSONA_KEYWORDS=(
  "customers/4600539562/adGroupCriteria/183083066586~302569558508"
  "customers/4600539562/adGroupCriteria/183083066586~357498403178"
)

# AI系を停止
for keyword in "${AI_KEYWORDS[@]}"; do
  curl -s -X POST \
    "https://googleads.googleapis.com/v19/customers/${GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria:mutate" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "developer-token: ${GOOGLE_ADS_DEVELOPER_TOKEN}" \
    -H "login-customer-id: ${GOOGLE_ADS_LOGIN_CUSTOMER_ID}" \
    -H "Content-Type: application/json" \
    -d "{
      \"operations\": [
        {\"update\": {\"resourceName\": \"$keyword\", \"status\": \"PAUSED\"}, \"updateMask\": \"status\"}
      ]
    }"
done

# ペルソナ系を有効化
for keyword in "${PERSONA_KEYWORDS[@]}"; do
  curl -s -X POST \
    "https://googleads.googleapis.com/v19/customers/${GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria:mutate" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "developer-token: ${GOOGLE_ADS_DEVELOPER_TOKEN}" \
    -H "login-customer-id: ${GOOGLE_ADS_LOGIN_CUSTOMER_ID}" \
    -H "Content-Type: application/json" \
    -d "{
      \"operations\": [
        {\"update\": {\"resourceName\": \"$keyword\", \"status\": \"ENABLED\"}, \"updateMask\": \"status\"}
      ]
    }"
done

echo "✅ キーワード切り替え完了"
```

## 📝 Python版サンプル

```python
import requests
import json
import os
from typing import List, Dict

class GoogleAdsAPIClient:
    def __init__(self):
        self.client_id = os.getenv('GOOGLE_ADS_CLIENT_ID')
        self.client_secret = os.getenv('GOOGLE_ADS_CLIENT_SECRET')
        self.refresh_token = os.getenv('GOOGLE_ADS_REFRESH_TOKEN')
        self.developer_token = os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN')
        self.customer_id = os.getenv('GOOGLE_ADS_CUSTOMER_ID')
        self.login_customer_id = os.getenv('GOOGLE_ADS_LOGIN_CUSTOMER_ID')
        self.access_token = None
        
    def get_access_token(self):
        """OAuth2アクセストークンを取得"""
        url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": self.refresh_token,
            "grant_type": "refresh_token"
        }
        response = requests.post(url, data=data)
        self.access_token = response.json()["access_token"]
        return self.access_token
    
    def search(self, query: str) -> Dict:
        """GAQLクエリを実行"""
        url = f"https://googleads.googleapis.com/v19/customers/{self.customer_id}/googleAds:search"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "developer-token": self.developer_token,
            "login-customer-id": self.login_customer_id,
            "Content-Type": "application/json"
        }
        data = {"query": query}
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    
    def mutate_keywords(self, operations: List[Dict]) -> Dict:
        """キーワードの追加/更新/削除"""
        url = f"https://googleads.googleapis.com/v19/customers/{self.customer_id}/adGroupCriteria:mutate"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "developer-token": self.developer_token,
            "login-customer-id": self.login_customer_id,
            "Content-Type": "application/json"
        }
        data = {"operations": operations}
        response = requests.post(url, headers=headers, json=data)
        return response.json()

# 使用例
client = GoogleAdsAPIClient()
client.get_access_token()

# キーワード一覧取得
query = "SELECT ad_group_criterion.keyword.text FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD'"
result = client.search(query)
print(json.dumps(result, indent=2, ensure_ascii=False))
```

## 🔗 関連ドキュメント

- [Google Ads API v19 リファレンス](https://developers.google.com/google-ads/api/rest/reference/rest/v19)
- [GAQLクエリビルダー](https://developers.google.com/google-ads/api/docs/query/overview)
- [認証設定ガイド](https://developers.google.com/google-ads/api/docs/oauth/overview)

---

*最終更新: 2025年8月14日*
*API Version: v19（v16は2025年2月5日にサンセット）*