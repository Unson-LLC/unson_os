#!/bin/bash

# 両方のアプリを同時に起動するスクリプト
# Portal (port 3000) と Management UI (port 3001) を並行実行

echo "🚀 Starting UnsonOS Development Environment..."
echo "Portal: http://localhost:3000"
echo "Management UI: http://localhost:3001"
echo ""

# バックグラウンドでPortalを起動
echo "📄 Starting Portal (port 3000)..."
cd apps/portal && npm run dev &
PORTAL_PID=$!

# Management UIを起動
echo "⚙️ Starting Management UI (port 3001)..."
cd ../management-ui && npm run dev &
MGMT_PID=$!

# Ctrl+Cで両方のプロセスを終了
trap 'echo "🛑 Stopping development servers..."; kill $PORTAL_PID $MGMT_PID 2>/dev/null; exit' INT

# プロセスが終了するまで待機
wait