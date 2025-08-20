#!/bin/bash

# Bitwarden環境変数自動取得スクリプト
# Usage: source ./scripts/bitwarden-env-loader.sh [collection-name] [env-file]

set -e

# 引数チェック
COLLECTION_NAME=${1:-"Unson-OS-Platform"}
ENV_FILE=${2:-".env.local"}

echo "🔐 Bitwarden環境変数取得開始..."
echo "   コレクション: $COLLECTION_NAME"
echo "   出力ファイル: $ENV_FILE"

# Bitwardenセッション確認
if [ -z "$BW_SESSION" ]; then
    echo "❌ Bitwardenセッションが見つかりません"
    echo "以下のコマンドを実行してください："
    echo "export BW_SESSION=\$(bw unlock --raw)"
    exit 1
fi

# セッション有効性確認
if ! bw status | grep -q "unlocked"; then
    echo "❌ Bitwardenセッションが無効です"
    echo "再度アンロックしてください："
    echo "export BW_SESSION=\$(bw unlock --raw)"
    exit 1
fi

# Convexから同期
echo "📥 Bitwardenデータ同期中..."
bw sync > /dev/null

# 一時ファイル作成
TEMP_ENV_FILE=$(mktemp)
echo "# 自動生成 - $(date)" > "$TEMP_ENV_FILE"
echo "# コレクション: $COLLECTION_NAME" >> "$TEMP_ENV_FILE"
echo "" >> "$TEMP_ENV_FILE"

# コレクション内のアイテム一覧取得
echo "📋 コレクション '$COLLECTION_NAME' からアイテム取得中..."

# コレクションIDを取得
COLLECTION_ID=$(bw list collections --search "$COLLECTION_NAME" | jq -r '.[0].id // empty')

if [ -z "$COLLECTION_ID" ]; then
    echo "❌ コレクション '$COLLECTION_NAME' が見つかりません"
    echo "利用可能なコレクション："
    bw list collections | jq -r '.[] | "  - \(.name)"'
    rm "$TEMP_ENV_FILE"
    exit 1
fi

# アイテム取得と環境変数生成
ITEMS=$(bw list items --collectionid "$COLLECTION_ID")
ITEM_COUNT=$(echo "$ITEMS" | jq '. | length')

if [ "$ITEM_COUNT" -eq 0 ]; then
    echo "⚠️  コレクションにアイテムがありません"
    rm "$TEMP_ENV_FILE"
    exit 1
fi

echo "📝 $ITEM_COUNT 個の環境変数を処理中..."

echo "$ITEMS" | jq -r '.[] | 
    if .name != null and .name != "" then
        if .login.password != null and .login.password != "" then
            "\(.name)=\"\(.login.password)\""
        else
            "# \(.name)=\(.notes // "値が空です")"
        end
    else
        "# 名前なし=\(.notes // "不明")"
    end' >> "$TEMP_ENV_FILE"

# ファイル移動
mv "$TEMP_ENV_FILE" "$ENV_FILE"

echo "✅ 環境変数ファイル生成完了: $ENV_FILE"
echo "📊 取得した環境変数数: $ITEM_COUNT"

# .gitignoreチェック
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.env" .gitignore; then
        echo "⚠️  .gitignoreに.envファイルを追加することを推奨します"
        echo "以下を追加してください："
        echo ".env*"
    fi
fi

echo ""
echo "🎉 環境変数の取得が完了しました！"
echo "   使用方法: source $ENV_FILE"