# コードスタイルと規約

## TypeScript設定
- **strict mode**: 有効
- **target**: ES5
- **module**: ESNext
- **moduleResolution**: bundler
- **パスエイリアス**: `@/*` → `./src/*`

## コーディング規約
1. **コメントは追加しない**（明示的要求時を除く）
2. 既存コーディングスタイルに従う
3. ライブラリ使用前にpackage.json確認
4. Reactコンポーネントは関数コンポーネント（forwardRef使用）

## 開発４大原則
- **YAGNI（You Aren't Gonna Need It）**：今必要じゃない機能は作らない
- **DRY（Don't Repeat Yourself）**：同じコードを繰り返さない
- **KISS（Keep It Simple Stupid）**：シンプルに保つ
- **Git Worktree活用**：機能別ブランチでの並列開発を最大化する

## TDD（Test-Driven Development）
- t_wada方式のTDD、Red-Green-Refactorサイクル
- Greenフェーズ：ベタ書き・ハードコード許容
- **Refactorフェーズ：ベタ書き・ハードコード必須除去**
- 最終コードにハードコード残存禁止