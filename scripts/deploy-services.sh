#!/bin/bash

# 各サービスLPをVercelにデプロイするスクリプト

echo "🚀 Deploying services to Vercel..."
echo "================================"

# サービスリスト
SERVICES=("mywa" "ai-bridge" "ai-stylist" "ai-legacy-creator" "ai-coach")

# Convex環境変数（共通）
CONVEX_URL="${NEXT_PUBLIC_CONVEX_URL:-https://gentle-lynx-280.convex.cloud}"
WORKSPACE_ID="${NEXT_PUBLIC_DEFAULT_WORKSPACE_ID:-unson_main}"

for service in "${SERVICES[@]}"; do
  echo ""
  echo "📦 Deploying $service..."
  echo "------------------------"
  
  cd "services/$service" || exit 1
  
  # vercel.jsonを作成
  cat > vercel.json << EOF
{
  "name": "unson-lp-$service",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_CONVEX_URL": "$CONVEX_URL",
    "NEXT_PUBLIC_DEFAULT_WORKSPACE_ID": "$WORKSPACE_ID",
    "NEXT_PUBLIC_SERVICE_NAME": "$service"
  },
  "rewrites": [
    {
      "source": "/api/service-application",
      "destination": "https://unson-os.vercel.app/api/service-application"
    }
  ]
}
EOF
  
  # プロジェクト名を設定してデプロイ
  echo "🔧 Setting up Vercel project..."
  vercel link --yes --project="unson-lp-$service" 2>/dev/null || true
  
  echo "🚀 Deploying to production..."
  vercel --prod --yes
  
  echo "✅ $service deployed successfully!"
  
  cd ../.. || exit 1
done

echo ""
echo "================================"
echo "✅ All services deployed!"
echo ""
echo "📝 Deployed URLs:"
echo "----------------"
for service in "${SERVICES[@]}"; do
  echo "- $service: https://unson-lp-$service.vercel.app"
done

echo ""
echo "⚠️  Important Notes:"
echo "-------------------"
echo "1. Make sure to set up environment variables in Vercel dashboard"
echo "2. API endpoint /api/service-application is proxied to main unson-os"
echo "3. Each LP runs as an independent Vercel project"
echo "4. Update DNS settings if using custom domains"