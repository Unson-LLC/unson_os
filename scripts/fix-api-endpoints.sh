#!/bin/bash

# 各サービスのFormSection.tsxを修正してメインAPIエンドポイントを呼ぶように変更

SERVICES=("mywa" "ai-stylist" "ai-legacy-creator" "ai-coach")
MAIN_API_URL="https://unson.vercel.app"

echo "🔧 Fixing API endpoints to point to main API..."

for service in "${SERVICES[@]}"; do
  echo "Updating $service..."
  
  FILE="services/$service/src/components/sections/FormSection.tsx"
  
  if [ -f "$FILE" ]; then
    # API URLを修正
    sed -i '' "s|'/api/service-application'|'$MAIN_API_URL/api/service-application'|g" "$FILE"
    
    echo "✅ Updated $service API endpoint"
  else
    echo "⚠️  File not found: $FILE"
  fi
done

echo ""
echo "✅ All FormSection files updated to use main API endpoint!"
echo "📍 API URL: $MAIN_API_URL/api/service-application"
echo ""
echo "Next: Redeploy each service to apply the changes"