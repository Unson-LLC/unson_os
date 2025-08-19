#!/bin/bash

# 残りのサービスのAnalytics統合を一括更新

declare -A SERVICE_NAMES=(
  ["ai-stylist"]="AI Stylist - AIパーソナルスタイリストサービス"
  ["ai-legacy-creator"]="AI Legacy Creator - AI遺産継承サービス"
  ["ai-coach"]="AI Coach - AIパーソナルコーチサービス"
)

declare -A SERVICE_DESCRIPTIONS=(
  ["ai-stylist"]="AIがあなたの魅力を最大化するパーソナルスタイリング"
  ["ai-legacy-creator"]="大切な思い出と知識をAIで未来に継承"
  ["ai-coach"]="AIがサポートする個人成長とゴール達成"
)

for service in "${!SERVICE_NAMES[@]}"; do
  echo "🔧 $service を更新中..."
  
  # layout.tsx の更新
  LAYOUT_FILE="services/$service/src/app/layout.tsx"
  if [ -f "$LAYOUT_FILE" ]; then
    # バックアップ作成
    cp "$LAYOUT_FILE" "$LAYOUT_FILE.bak"
    
    # layout.tsxの内容を置換
    cat > "$LAYOUT_FILE" << EOF
import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics/Analytics'
import ScrollTracker from '@/components/Analytics/ScrollTracker'

export const metadata: Metadata = {
  title: '${SERVICE_NAMES[$service]}',
  description: '${SERVICE_DESCRIPTIONS[$service]}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics 
          serviceName="$service"
          ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
          clarityProjectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
        />
        <ScrollTracker />
      </body>
    </html>
  )
}
EOF
    echo "  ✅ layout.tsx を更新"
  fi
  
  # FormSection.tsx のimport追加
  FORM_FILE="services/$service/src/components/sections/FormSection.tsx"
  if [ -f "$FORM_FILE" ]; then
    # バックアップ作成
    cp "$FORM_FILE" "$FORM_FILE.bak"
    
    # import文を追加
    sed -i '' '3i\
import { trackFormSubmission, trackCTAClick } from '\''@/components/Analytics/Analytics'\''
' "$FORM_FILE"
    
    # フォーム送信成功時のイベント追跡を追加
    sed -i '' 's/      \/\/ フォーム送信成功イベントを追跡/      \/\/ フォーム送信成功イベントを追跡/g' "$FORM_FILE"
    sed -i '' 's/      trackFormSubmission('\''ai-bridge'\'', '\''contact'\'')/      trackFormSubmission('\'''"$service"''\'', '\''contact'\'')/g' "$FORM_FILE"
    
    # まだイベント追跡が追加されていない場合
    if ! grep -q "trackFormSubmission" "$FORM_FILE"; then
      sed -i '' '/if (!result\.success) {/,/setTimeout(() => setSubmitted(false), 5000)/ {
        /setTimeout(() => setSubmitted(false), 5000)/i\
      \
      // フォーム送信成功イベントを追跡\
      trackFormSubmission('\'''"$service"''\'', '\''contact'\'')\

      }' "$FORM_FILE"
    fi
    
    echo "  ✅ FormSection.tsx を更新"
  fi
  
  echo ""
done

echo "🎯 全サービスのAnalytics統合完了!"