#!/bin/bash

# Gemini 2.5 Flash Image PreviewでLP画像生成
# 使用方法: ./generate-lp-images.sh [service-name|--all]

set -e

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# APIキーチェック
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEYが設定されていません${NC}"
    echo ""
    echo "設定方法:"
    echo "  export GEMINI_API_KEY=\"your-api-key\""
    echo ""
    echo "または .env ファイルから読み込み:"
    echo "  source .env"
    exit 1
fi

echo -e "${GREEN}🎨 LP画像生成ツール (Gemini 2.5 Flash Image Preview)${NC}"
echo "============================================"

# 引数処理
if [ "$1" == "--all" ] || [ "$1" == "-a" ]; then
    echo -e "${YELLOW}📦 全サービスの画像を一括生成します${NC}"
    echo ""
    node scripts/batch-generate-lp-images.js
    
elif [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "使用方法:"
    echo "  ./generate-lp-images.sh <service-name>     # 特定サービスの画像生成"
    echo "  ./generate-lp-images.sh --all              # 全サービスの画像生成"
    echo "  ./generate-lp-images.sh --list             # 利用可能なサービス一覧"
    echo ""
    echo "例:"
    echo "  ./generate-lp-images.sh 2025-08-005-ai-stylist"
    echo "  ./generate-lp-images.sh --all"
    
elif [ "$1" == "--list" ] || [ "$1" == "-l" ]; then
    echo -e "${YELLOW}📋 利用可能なサービス:${NC}"
    echo ""
    echo "  - 2025-08-001-mywa         (MYWA - ニュースキュレーション)"
    echo "  - 2025-08-002-ai-bridge    (AIブリッジ - 世代間ギャップ解消)"
    echo "  - 2025-08-003-ai-coach     (AIコーチ - ライフコーチング)"
    echo "  - 2025-08-004-ai-legacy-creator (AIレガシークリエイター - 知識継承)"
    echo "  - 2025-08-005-ai-stylist   (AIスタイリスト - ファッション)"
    echo "  - 2025-08-006-watashi-compass (ワタシコンパス - キャリア開発)"
    
elif [ -n "$1" ]; then
    SERVICE_NAME=$1
    UPDATE_CONFIG=""
    
    if [ "$2" == "--update-config" ] || [ "$2" == "-u" ]; then
        UPDATE_CONFIG="--update-config"
        echo -e "${YELLOW}📝 設定ファイルも自動更新します${NC}"
    fi
    
    echo -e "${GREEN}🎯 サービス: $SERVICE_NAME${NC}"
    echo ""
    node scripts/generate-lp-images-gemini.js "$SERVICE_NAME" $UPDATE_CONFIG
    
else
    echo -e "${RED}❌ サービス名を指定してください${NC}"
    echo ""
    echo "使用方法: ./generate-lp-images.sh <service-name|--all|--help|--list>"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 処理完了！${NC}"