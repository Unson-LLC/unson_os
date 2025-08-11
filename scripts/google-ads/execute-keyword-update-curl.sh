#!/bin/bash

# Google Ads API キーワード更新 - cURL版

# 環境変数を読み込み
source .env.local

# アクセストークンを取得
echo "🔐 アクセストークンを取得中..."
ACCESS_TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -d "client_id=${GOOGLE_ADS_CLIENT_ID}" \
  -d "client_secret=${GOOGLE_ADS_CLIENT_SECRET}" \
  -d "refresh_token=${GOOGLE_ADS_REFRESH_TOKEN}" \
  -d "grant_type=refresh_token" | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ アクセストークンの取得に失敗しました"
  exit 1
fi

echo "✅ アクセストークンを取得しました"

# 変数設定
CUSTOMER_ID="4600539562"
AD_GROUP_ID="183083066586"
API_VERSION="v16"

# 1. 低パフォーマンスキーワードを一時停止
echo ""
echo "📌 低パフォーマンスキーワードを一時停止中..."

PAUSE_PAYLOAD='{
  "operations": [
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~1620479705755", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2434297411093", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2434297411333", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655193", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655353", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655393", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655433", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655593", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292655913", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2435292656073", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~2324086873428", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~302569558508", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~357498403178", "status": "PAUSED"}, "updateMask": "status"},
    {"update": {"resourceName": "customers/'$CUSTOMER_ID'/adGroupCriteria/'$AD_GROUP_ID'~391053625322", "status": "PAUSED"}, "updateMask": "status"}
  ]
}'

curl -s -X POST "https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/adGroupCriteria:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${GOOGLE_ADS_DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${GOOGLE_ADS_LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d "${PAUSE_PAYLOAD}" > pause_result.json

if grep -q "error" pause_result.json; then
  echo "⚠️ 一時停止でエラーが発生しました:"
  cat pause_result.json
else
  echo "✅ 14件のキーワードを一時停止しました"
fi

# 2. 高パフォーマンスキーワードを追加
echo ""
echo "📌 高パフォーマンスキーワードを追加中..."

ADD_PAYLOAD='{
  "operations": [
    {
      "create": {
        "adGroup": "customers/'$CUSTOMER_ID'/adGroups/'$AD_GROUP_ID'",
        "status": "ENABLED",
        "keyword": {"text": "無料 ai", "matchType": "BROAD"},
        "cpcBidMicros": "15000000"
      }
    },
    {
      "create": {
        "adGroup": "customers/'$CUSTOMER_ID'/adGroups/'$AD_GROUP_ID'",
        "status": "ENABLED",
        "keyword": {"text": "ai 無料", "matchType": "BROAD"},
        "cpcBidMicros": "15000000"
      }
    },
    {
      "create": {
        "adGroup": "customers/'$CUSTOMER_ID'/adGroups/'$AD_GROUP_ID'",
        "status": "ENABLED",
        "keyword": {"text": "ai ツール 無料", "matchType": "BROAD"},
        "cpcBidMicros": "12000000"
      }
    },
    {
      "create": {
        "adGroup": "customers/'$CUSTOMER_ID'/adGroups/'$AD_GROUP_ID'",
        "status": "ENABLED",
        "keyword": {"text": "ai コンサル", "matchType": "BROAD"},
        "cpcBidMicros": "10000000"
      }
    },
    {
      "create": {
        "adGroup": "customers/'$CUSTOMER_ID'/adGroups/'$AD_GROUP_ID'",
        "status": "ENABLED",
        "keyword": {"text": "ai 情報", "matchType": "BROAD"},
        "cpcBidMicros": "10000000"
      }
    }
  ]
}'

curl -s -X POST "https://googleads.googleapis.com/${API_VERSION}/customers/${CUSTOMER_ID}/adGroupCriteria:mutate" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "developer-token: ${GOOGLE_ADS_DEVELOPER_TOKEN}" \
  -H "login-customer-id: ${GOOGLE_ADS_LOGIN_CUSTOMER_ID}" \
  -H "Content-Type: application/json" \
  -d "${ADD_PAYLOAD}" > add_result.json

if grep -q "error" add_result.json; then
  echo "⚠️ 追加でエラーが発生しました:"
  cat add_result.json
else
  echo "✅ 5件のキーワードを追加しました"
fi

echo ""
echo "======================================"
echo "📊 更新完了:"
echo "  - 高パフォーマンスAI系キーワード5個を追加"
echo "  - 低パフォーマンス女性向けキーワード14個を一時停止"
echo "  - 入札単価を10-15円に最適化"
echo "======================================"

# 一時ファイルをクリーンアップ
rm -f pause_result.json add_result.json