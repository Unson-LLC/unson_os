# Node.js バージョン管理ガイド

## 🚨 重要な制約事項

### Vercel Node 18 廃止 vs Convex Node Actions

**背景**: 
- **Vercel**: 2025年8月1日にNode 18サポート廃止予定
- **Convex Node Actions**: Node 18固定（AWS Lambda制約）

## 📊 影響分析

| フェーズ | 実行環境 | 必要バージョン | 影響 |
|---------|----------|----------------|------|
| ビルド/デプロイ | Vercel CI | Node 20 (推奨) | ✅ 問題なし |
| フロントエンド実行 | Vercel Edge/Functions | Node 20 | ✅ 問題なし |
| Node Actions実行(本番) | Convex Cloud (AWS Lambda) | Node 18固定 | ⚠️ Convex側で管理 |
| ローカル開発 | 開発マシン | Node 18必須 | ⚠️ nvm必要 |

**結論**: **リスクはほぼない**が、ローカル開発でnvm運用が必要

## 🛠️ セットアップ手順

### 1. nvm インストール（未インストールの場合）
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Windows
# https://github.com/coreybutler/nvm-windows
```

### 2. Node.js バージョンインストール
```bash
# Node 18 (Convex用)
nvm install 18.18.0

# Node 20 (Next.js用)  
nvm install 20.10.0

# デフォルトバージョン設定
nvm alias default 20.10.0
```

### 3. プロジェクト用 .nvmrc 作成済み
```bash
# プロジェクトルートに作成済み
cat .nvmrc
# 18.18.0
```

## 🔄 開発フローガイド

### オプション1: npm scripts使用（推奨）
```bash
# Convex開発（Node 18に自動切替）
npm run dev:convex

# Next.js開発（Node 20に自動切替）
npm run dev:next
```

### オプション2: 手動切替
```bash
# Convex開発時
nvm use 18.18.0
npx convex dev

# Next.js開発時
nvm use 20.10.0
npm run dev
```

### オプション3: 自動切替設定
```bash
# シェル設定に追加（.zshrc/.bashrc）
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## 🎯 チーム開発でのベストプラクティス

### 新メンバーのオンボーディング
```markdown
# 開発環境セットアップチェックリスト

- [ ] nvm インストール確認: `nvm --version`
- [ ] Node 18 インストール: `nvm install 18.18.0`
- [ ] Node 20 インストール: `nvm install 20.10.0`
- [ ] プロジェクトクローン: `git clone ...`
- [ ] Convex開発テスト: `npm run dev:convex`
- [ ] Next.js開発テスト: `npm run dev:next`
```

### VS Code / Cursor 最適化設定
```json
// .vscode/settings.json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.env.osx": {
    "NVM_DIR": "$HOME/.nvm"
  },
  "eslint.nodePath": "${workspaceFolder}/node_modules",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### 開発用タスク設定
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Convex Dev",
      "type": "shell",
      "command": "npm run dev:convex",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Next.js Dev", 
      "type": "shell",
      "command": "npm run dev:next",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always", 
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

## ⚠️ トラブルシューティング

### よくある問題と解決法

#### 問題1: `convex dev` でNode バージョンエラー
```bash
# エラー例
Error: Node.js v20.10.0 is not supported. Please use Node.js v18.

# 解決方法
nvm use 18.18.0
npx convex dev
```

#### 問題2: package-lock.json の競合
```bash
# Node 18 と 20 で異なるlock ファイルが生成される場合
rm package-lock.json
nvm use 18.18.0
npm install
```

#### 問題3: 依存関係のバージョン問題
```bash
# Node バージョン固有の依存関係エラー
npm cache clean --force
rm -rf node_modules package-lock.json
nvm use 18.18.0
npm install
```

## 🔮 将来のアップグレード計画

### Node 18 EOL 対応タイムライン
- **Node 18 EOL**: 2025年4月30日
- **Convex予想アップグレード**: 2025年Q2-Q3
- **準備期間**: 2025年2月〜4月

### 監視すべき情報源
```bash
# Convex リリースノート
https://docs.convex.dev/changelog

# Node.js リリーススケジュール  
https://nodejs.org/en/about/releases/

# Convex GitHub Discussions
https://github.com/get-convex/convex-js/discussions
```

### アップグレード時のチェックリスト
- [ ] Convex CLI アップデート: `npm update convex`
- [ ] Node Actions テスト実行
- [ ] 依存関係の互換性確認
- [ ] CI/CD パイプラインの動作確認
- [ ] 本番環境デプロイテスト

## 🚨 緊急時の代替案

### Node Actions を使わない設計
```typescript
// ❌ Node Actions使用（Node 18必須）
"use node";
export const sendEmail = action({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Node.js専用ライブラリを使用
    const nodemailer = require('nodemailer');
    // ...
  },
});

// ✅ 外部API使用（Node 20対応）
export const sendEmail = mutation({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Fetch API使用（ブラウザ互換）
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}` },
      body: JSON.stringify({ /* ... */ }),
    });
    // ...
  },
});
```

### 外部サービス移行オプション
- **メール送信**: SendGrid, Resend, AWS SES
- **決済処理**: Stripe, PayPal
- **画像処理**: Cloudinary, ImageKit  
- **ファイル処理**: AWS S3, Google Cloud Storage
- **通知**: Pusher, Ably, WebSocket

---

この運用により、Node.js バージョンの制約に影響されることなく、安定した開発・本番運用が可能になります。