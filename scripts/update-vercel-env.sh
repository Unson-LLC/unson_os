#!/bin/bash

# Vercel環境変数更新スクリプト
# 使用方法: source .env.local && ./scripts/update-vercel-env.sh

echo "Discord関連の環境変数を更新中..."

# 環境変数チェック
if [ -z "$DISCORD_BOT_TOKEN" ] || [ -z "$DISCORD_CHANNEL_ID" ] || [ -z "$DISCORD_SERVER_ID" ]; then
  echo "エラー: 必要な環境変数が設定されていません"
  echo "source .env.local を実行してから再度お試しください"
  exit 1
fi

# DISCORD_INVITE_LINKを削除（存在する場合）
echo "既存のDISCORD_INVITE_LINKを削除中..."
vercel env rm DISCORD_INVITE_LINK production --yes 2>/dev/null || true

# Discord Bot Token
echo "DISCORD_BOT_TOKENを設定中..."
printf "$DISCORD_BOT_TOKEN" | vercel env add DISCORD_BOT_TOKEN production --force

# Discord Channel ID
echo "DISCORD_CHANNEL_IDを設定中..."
printf "$DISCORD_CHANNEL_ID" | vercel env add DISCORD_CHANNEL_ID production --force

# Discord Server ID
echo "DISCORD_SERVER_IDを設定中..."
printf "$DISCORD_SERVER_ID" | vercel env add DISCORD_SERVER_ID production --force

echo "環境変数の更新が完了しました！"
echo "変更を反映するには再デプロイが必要です。"