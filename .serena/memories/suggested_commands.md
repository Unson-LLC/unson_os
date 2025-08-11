# 推奨開発コマンド

## 開発サーバー起動
```bash
npm run dev           # Next.js開発サーバー
npm run dev:convex    # Convex開発（Node 18切り替え含む）
npm run dev:next      # Next.js開発（Node 20切り替え含む）
npx convex dev        # Convex直接起動
```

## ビルド・品質チェック
```bash
npm run build         # プロダクションビルド
npm run lint          # ESLintチェック
npm run type-check    # TypeScriptチェック
```

## テスト
```bash
npm test              # Jestテスト実行
npm test -- --watch   # Jestウォッチモード
npm test:coverage     # カバレッジ付きテスト
npm test:e2e          # Playwrightテスト
npm test:e2e:ui       # PlaywrightテストUI
npm test:all          # 全テスト実行
```

## Git Worktree（並行開発）
```bash
git worktree add ../feature-branch -b feature/new-feature
git worktree list
git worktree remove ../feature-branch
```

## セキュリティ・依存関係
```bash
npm audit fix         # セキュリティ脆弱性修正
```

## セットアップ確認
```bash
npm run setup:check   # 環境セットアップ確認
```