#!/bin/bash

# LP Template Generator - スタンドアロンLP作成スクリプト
# 使用方法: ./create-standalone-lp.sh project-name config-file.json

set -e

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 引数チェック
PROJECT_NAME=$1
CONFIG_FILE=$2

if [ -z "$PROJECT_NAME" ] || [ -z "$CONFIG_FILE" ]; then
  echo -e "${RED}エラー: 引数が不足しています${NC}"
  echo "使用方法: ./create-standalone-lp.sh project-name config-file.json"
  echo "例: ./create-standalone-lp.sh my-awesome-lp examples/saas-startup.json"
  exit 1
fi

# 設定ファイルの存在確認
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}エラー: 設定ファイル '$CONFIG_FILE' が見つかりません${NC}"
  exit 1
fi

echo -e "${GREEN}📦 新しいLPプロジェクト '$PROJECT_NAME' を作成します...${NC}"

# プロジェクトディレクトリ作成
mkdir -p ../$PROJECT_NAME
cd ../$PROJECT_NAME

# package.jsonの作成
cat > package.json << 'EOF'
{
  "name": "lp-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.408.0",
    "next": "^15.4.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-config-next": "^15.4.4",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3"
  }
}
EOF

# 基本設定ファイルをコピー
cp ../lp-template-generator/tsconfig.json .
cp ../lp-template-generator/next.config.js .
cp ../lp-template-generator/tailwind.config.js .
cp ../lp-template-generator/postcss.config.js .
cp ../lp-template-generator/.eslintrc.json .
cp ../lp-template-generator/next-env.d.ts .

# ディレクトリ構造を作成
mkdir -p src/{app,components/{sections,templates,ui},lib,types}
mkdir -p public/images

# 必要なファイルをコピー
echo -e "${YELLOW}📁 コンポーネントをコピー中...${NC}"
cp -r ../lp-template-generator/src/components/sections/* src/components/sections/
cp -r ../lp-template-generator/src/components/templates/* src/components/templates/
cp ../lp-template-generator/src/lib/utils.ts src/lib/
cp ../lp-template-generator/src/lib/template-engine.ts src/lib/
cp ../lp-template-generator/src/lib/theme-generator.ts src/lib/
cp ../lp-template-generator/src/types/* src/types/
cp ../lp-template-generator/src/app/globals.css src/app/

# 設定ファイルをコピー
cp ../lp-template-generator/$CONFIG_FILE ./lp-config.json

# layout.tsxを生成
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'
import config from '../../lp-config.json'

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  keywords: config.meta.keywords.join(', '),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
EOF

# page.tsxを生成
cat > src/app/page.tsx << 'EOF'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import config from '../../lp-config.json'
import { TemplateConfig } from '@/types/template'

export default function HomePage() {
  return <LandingPageTemplate config={config as TemplateConfig} />
}
EOF

# .gitignoreを作成
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# READMEを作成
cat > README.md << EOF
# $PROJECT_NAME

このプロジェクトはLP Template Generatorから生成されました。

## セットアップ

\`\`\`bash
npm install
npm run dev
\`\`\`

## カスタマイズ

\`lp-config.json\`を編集してLPの内容をカスタマイズできます。

## デプロイ

### Vercel
\`\`\`bash
npx vercel
\`\`\`

### 静的エクスポート
\`\`\`bash
npm run build
\`\`\`

## ライセンス

MIT
EOF

echo -e "${GREEN}✅ プロジェクト '$PROJECT_NAME' を作成しました！${NC}"
echo ""
echo -e "${YELLOW}次のステップ:${NC}"
echo "  cd ../$PROJECT_NAME"
echo "  npm install"
echo "  npm run dev"
echo ""
echo -e "${GREEN}📝 カスタマイズ:${NC}"
echo "  lp-config.json を編集してLPの内容を変更できます"
echo ""
echo -e "${GREEN}🚀 デプロイ:${NC}"
echo "  npx vercel でVercelにデプロイできます"