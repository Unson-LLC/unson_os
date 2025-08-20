#!/bin/bash

# Vercelデプロイスクリプト
# 2つの独立したVercelプロジェクトをデプロイ

echo "🚀 UnsonOS Vercel Deployment Script"
echo "===================================="
echo ""

# 色付きメッセージ用の関数
print_info() {
    echo -e "\033[0;36m$1\033[0m"
}

print_success() {
    echo -e "\033[0;32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[0;31m❌ $1\033[0m"
}

# Vercel CLIのインストール確認
if ! command -v vercel &> /dev/null; then
    print_info "Vercel CLIがインストールされていません。インストールしますか？ (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        npm install -g vercel
    else
        print_error "Vercel CLIが必要です。手動でインストールしてください: npm install -g vercel"
        exit 1
    fi
fi

# デプロイタイプを選択
print_info "デプロイタイプを選択してください:"
echo "1) 両方のアプリ"
echo "2) Portal（メインサイト）のみ"
echo "3) Management UIのみ"
read -r deploy_choice

# 環境を選択
print_info "デプロイ環境を選択してください:"
echo "1) Production (本番)"
echo "2) Preview (プレビュー)"
read -r env_choice

if [[ "$env_choice" == "1" ]]; then
    DEPLOY_FLAG="--prod"
    ENV_NAME="Production"
else
    DEPLOY_FLAG=""
    ENV_NAME="Preview"
fi

# Portalのデプロイ
deploy_portal() {
    print_info "📄 Portal を $ENV_NAME にデプロイ中..."
    cd apps/portal
    
    if [ ! -f ".vercel/project.json" ]; then
        print_info "初回デプロイのためプロジェクトをリンクします..."
        vercel link --yes --project unson-os-portal
    fi
    
    vercel $DEPLOY_FLAG
    
    if [ $? -eq 0 ]; then
        print_success "Portal のデプロイが完了しました！"
    else
        print_error "Portal のデプロイに失敗しました"
        exit 1
    fi
    
    cd ../..
}

# Management UIのデプロイ
deploy_management() {
    print_info "⚙️ Management UI を $ENV_NAME にデプロイ中..."
    cd apps/management-ui
    
    if [ ! -f ".vercel/project.json" ]; then
        print_info "初回デプロイのためプロジェクトをリンクします..."
        vercel link --yes --project unson-os-management
    fi
    
    vercel $DEPLOY_FLAG
    
    if [ $? -eq 0 ]; then
        print_success "Management UI のデプロイが完了しました！"
    else
        print_error "Management UI のデプロイに失敗しました"
        exit 1
    fi
    
    cd ../..
}

# デプロイ実行
case $deploy_choice in
    1)
        deploy_portal
        echo ""
        deploy_management
        ;;
    2)
        deploy_portal
        ;;
    3)
        deploy_management
        ;;
    *)
        print_error "無効な選択です"
        exit 1
        ;;
esac

echo ""
print_success "デプロイが完了しました！"
echo ""
echo "📌 デプロイされたURL:"
echo "   Portal: https://unson-os-portal.vercel.app"
echo "   Management UI: https://unson-os-management.vercel.app"
echo ""
echo "📝 次のステップ:"
echo "   1. Vercel Dashboardで環境変数を設定"
echo "   2. カスタムドメインを設定"
echo "   3. Management UIのアクセス制限を設定"