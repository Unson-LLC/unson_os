#!/bin/bash

# 統一コレクションから環境変数を取得するスクリプト  
# Usage: source ./scripts/load-env-from-bitwarden.sh [environment] [output-file]

set -e

# 引数設定
ENVIRONMENT=${1:-"development"}
OUTPUT_FILE=${2:-".env.${ENVIRONMENT}"}

echo "🔐 Bitwarden統一コレクションから環境変数取得開始..."
echo "   環境: $ENVIRONMENT"  
echo "   出力ファイル: $OUTPUT_FILE"

# セッション確認
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

# 環境名を大文字に変換してコレクション名作成
ENVIRONMENT_UPPER=$(echo "$ENVIRONMENT" | tr '[:lower:]' '[:upper:]')
COLLECTION_NAME="Unson-OS-${ENVIRONMENT_UPPER}"

# 環境別コレクションID（実際の値）
case "$ENVIRONMENT" in
    "development"|"dev"|"Development"|"DEVELOPMENT")
        COLLECTION_ID="d886e98b-8967-488d-a99a-b33f00e7f76f"
        COLLECTION_NAME="Unson-OS-Development"
        ;;
    "production"|"prod"|"Production"|"PRODUCTION")  
        COLLECTION_ID="b760a3d6-ba25-4a59-9324-b33f00e80ba5"
        COLLECTION_NAME="Unson-OS-Production"
        ;;
    "staging"|"stage"|"Staging"|"STAGING")
        COLLECTION_ID="6ca4043e-4030-4864-b44c-b33f00e81f77"  
        COLLECTION_NAME="Unson-OS-Staging"
        ;;
    *)
        echo "❌ 未対応の環境: $ENVIRONMENT"
        echo "対応環境: development, production, staging"
        exit 1
        ;;
esac

echo "📥 Bitwardenデータ同期中..."
bw sync > /dev/null

# 一時ファイル作成
TEMP_ENV_FILE=$(mktemp)
echo "# 自動生成 - $(date)" > "$TEMP_ENV_FILE"
echo "# コレクション: $COLLECTION_NAME" >> "$TEMP_ENV_FILE"  
echo "# 環境: $ENVIRONMENT" >> "$TEMP_ENV_FILE"
echo "" >> "$TEMP_ENV_FILE"

# コレクション内のアイテム一覧取得
echo "📋 コレクション '$COLLECTION_NAME' からアイテム取得中..."

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
mv "$TEMP_ENV_FILE" "$OUTPUT_FILE"

echo "✅ 環境変数ファイル生成完了: $OUTPUT_FILE"
echo "📊 取得した環境変数数: $ITEM_COUNT"

# プラットフォーム共通とLP個別の分類表示
PLATFORM_COUNT=$(grep "^PLATFORM_" "$OUTPUT_FILE" | wc -l | tr -d ' ')
LP_COUNT=$(grep "^LP_" "$OUTPUT_FILE" | wc -l | tr -d ' ')

echo "📈 内訳:"
echo "   プラットフォーム共通: ${PLATFORM_COUNT}個"
echo "   LP個別設定: ${LP_COUNT}個"

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
echo "   使用方法: source $OUTPUT_FILE"
echo ""
echo "🚀 新しいLP追加時は以下の命名規則で登録："
echo "   LP_{PRODUCT_NAME}_{SERVICE}_{TYPE}"
echo "   例: LP_STYLIST_OPENAI_API_KEY"