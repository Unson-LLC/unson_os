#!/bin/bash

# EventSync Pro LP作成スクリプト
# 指定されたディレクトリにLPを生成

set -e

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 設定
CONFIG_FILE="eventsync-pro-config.json"
OUTPUT_DIR="/Users/ksato/Documents/GitHub/Unson-LLC/unson_os/products/2-validation/2025-09-011-eventsync-pro/lp"

echo -e "${GREEN}📦 EventSync Pro LPを作成します...${NC}"
echo -e "${YELLOW}出力先: $OUTPUT_DIR${NC}"

# 設定ファイルの存在確認
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}エラー: 設定ファイル '$CONFIG_FILE' が見つかりません${NC}"
  exit 1
fi

# 出力ディレクトリ作成
mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

# package.jsonの作成
cat > package.json << 'EOF'
{
  "name": "eventsync-pro-lp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "export": "next build && next export"
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
echo -e "${YELLOW}📁 設定ファイルをコピー中...${NC}"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/tsconfig.json .
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/next.config.js .
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/tailwind.config.js .
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/postcss.config.js .
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/next-env.d.ts .

# ディレクトリ構造を作成
mkdir -p src/{app,components/{sections,templates,ui},lib,types}
mkdir -p public/images

# 必要なファイルをコピー
echo -e "${YELLOW}📁 コンポーネントをコピー中...${NC}"
cp -r /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/components/sections/* src/components/sections/ 2>/dev/null || echo "sections not found"
cp -r /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/components/templates/* src/components/templates/ 2>/dev/null || echo "templates not found"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/lib/utils.ts src/lib/ 2>/dev/null || echo "utils.ts not found"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/lib/template-engine.ts src/lib/ 2>/dev/null || echo "template-engine.ts not found"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/lib/theme-generator.ts src/lib/ 2>/dev/null || echo "theme-generator.ts not found"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/types/* src/types/ 2>/dev/null || echo "types not found"
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/src/app/globals.css src/app/ 2>/dev/null || echo "globals.css not found"

# 設定ファイルをコピー
cp /Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-generator/$CONFIG_FILE ./lp-config.json

# 画像をコピー（既に生成済みの画像を使用）
if [ -d "./images" ]; then
  echo -e "${YELLOW}📁 画像をpublic/imagesにコピー中...${NC}"
  cp -r ./images/* public/images/ 2>/dev/null || echo "No images to copy"
fi

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
cat > README.md << 'EOF'
# EventSync Pro Landing Page

EventSync Proのランディングページです。LP Template Generatorから生成されました。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3001 を開いてください。

## カスタマイズ

`lp-config.json`を編集してLPの内容をカスタマイズできます。

## ビルド・デプロイ

### 開発サーバー
```bash
npm run dev
```

### プロダクションビルド
```bash
npm run build
npm start
```

### 静的エクスポート
```bash
npm run export
```

## ライセンス

MIT
EOF

echo -e "${GREEN}✅ EventSync Pro LPを作成しました！${NC}"
echo ""
echo -e "${YELLOW}次のステップ:${NC}"
echo "  cd $OUTPUT_DIR"
echo "  npm install"
echo "  npm run dev"
echo ""
echo -e "${GREEN}📝 カスタマイズ:${NC}"
echo "  lp-config.json を編集してLPの内容を変更できます"
echo ""
echo -e "${GREEN}🖼️  画像:${NC}"
echo "  既存の画像がpublic/imagesにコピーされました"