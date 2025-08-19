#!/bin/bash

# Analytics実装を全LPサービスに展開するスクリプト

SERVICES=("ai-bridge" "ai-stylist" "ai-legacy-creator" "ai-coach")
SOURCE_SERVICE="mywa"

echo "🚀 Analytics実装を全LPサービスに展開中..."

for service in "${SERVICES[@]}"; do
  echo "📊 $service にAnalytics実装を展開中..."
  
  # Analyticsフォルダをコピー
  if [ -d "services/$SOURCE_SERVICE/src/components/Analytics" ]; then
    mkdir -p "services/$service/src/components/Analytics"
    cp -r "services/$SOURCE_SERVICE/src/components/Analytics/"* "services/$service/src/components/Analytics/"
    echo "  ✅ Analyticsコンポーネントをコピー"
  fi
  
  # .env.exampleをコピー
  if [ -f "services/$SOURCE_SERVICE/.env.example" ]; then
    cp "services/$SOURCE_SERVICE/.env.example" "services/$service/.env.example"
    echo "  ✅ 環境変数設定ファイルをコピー"
  fi
  
  # layout.tsx を確認・更新
  LAYOUT_FILE="services/$service/src/app/layout.tsx"
  if [ -f "$LAYOUT_FILE" ]; then
    # Analyticsのimportが存在するかチェック
    if ! grep -q "Analytics" "$LAYOUT_FILE"; then
      echo "  ⚠️  $service のlayout.tsxにAnalytics実装が必要です"
      echo "     手動で下記を追加してください:"
      echo "     - import Analytics from '@/components/Analytics/Analytics'"
      echo "     - import ScrollTracker from '@/components/Analytics/ScrollTracker'"
      echo "     - コンポーネントの追加"
    else
      echo "  ✅ layout.tsxは既にAnalytics対応済み"
    fi
  fi
  
  # FormSection.tsx の確認・更新
  FORM_FILE="services/$service/src/components/sections/FormSection.tsx"
  if [ -f "$FORM_FILE" ]; then
    if ! grep -q "trackFormSubmission" "$FORM_FILE"; then
      echo "  ⚠️  $service のFormSection.tsxにイベント追跡が必要です"
    else
      echo "  ✅ FormSection.tsxは既にイベント追跡対応済み"
    fi
  fi
  
  echo ""
done

echo "🎯 全LPサービスへのAnalytics展開完了!"
echo ""
echo "📋 次のステップ:"
echo "1. 各サービスの .env.local ファイルに実際のAnalytics IDを設定"
echo "2. Google Analytics 4 と Microsoft Clarity のアカウント設定"
echo "3. 各サービスを再デプロイ"
echo ""
echo "🔧 必要な環境変数:"
echo "   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX"
echo "   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx"