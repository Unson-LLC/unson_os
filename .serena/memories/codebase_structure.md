# コードベース構造

## ルートディレクトリ
```
/
├── src/              # ソースコード
├── docs/             # ドキュメント
├── tests/            # テストコード
├── convex/           # Convexデータベース設定
├── public/           # 静的ファイル
├── scripts/          # ビルドスクリプト
├── .github/          # GitHub Actions
├── meetings/         # ミーティング記録
└── worktrees/        # Git worktree用

```

## src/ディレクトリ構造
```
src/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
│   ├── ui/          # 基本UIコンポーネント
│   ├── forms/       # フォームコンポーネント
│   ├── layout/      # レイアウトコンポーネント
│   ├── sections/    # セクションコンポーネント
│   ├── emails/      # メールテンプレート
│   ├── docs/        # ドキュメント用コンポーネント
│   └── interactive/ # インタラクティブコンポーネント
├── hooks/            # カスタムフック
├── lib/              # ライブラリ設定
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
├── config/           # 設定ファイル
├── data/             # 静的データ
└── mocks/            # モックデータ
```

## テスト構造
```
tests/
├── unit/             # ユニットテスト
├── integration/      # 統合テスト
└── e2e/              # E2Eテスト（Playwright）
```

## 主要ドキュメント
- `/docs/executive-strategy-report.md`: 包括的戦略レポート
- `/docs/strategy/`: 詳細戦略ドキュメント群
- `/docs/testing-guidelines.md`: TDDガイドライン
- `/CLAUDE.md`: Claude Code用ガイドライン