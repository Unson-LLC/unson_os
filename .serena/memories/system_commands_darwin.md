# Darwin（macOS）システムコマンド

## 基本的なファイル操作
```bash
ls -la              # ファイル一覧（隠しファイル含む）
cd <directory>      # ディレクトリ移動
pwd                 # カレントディレクトリ表示
mkdir -p <dir>      # ディレクトリ作成（親ディレクトリも作成）
rm -rf <dir>        # ディレクトリ削除（再帰的）
cp -r <src> <dst>   # ディレクトリコピー
mv <src> <dst>      # 移動/リネーム
```

## ファイル検索
```bash
find . -name "*.ts"              # ファイル名で検索
find . -type f -name "*.tsx"     # ファイルのみ検索
find . -type d -name "src"       # ディレクトリのみ検索
```

## テキスト検索（ripgrep推奨）
```bash
rg "pattern"                     # ripgrep（高速検索）
rg -i "pattern"                  # 大文字小文字を無視
rg -t ts "pattern"               # TypeScriptファイルのみ
rg -g "*.tsx" "pattern"          # glob指定
```

## Git操作
```bash
git status                       # ステータス確認
git diff                         # 差分確認
git log --oneline -n 10          # 最近のコミット10件
git branch -a                    # ブランチ一覧
```

## プロセス管理
```bash
ps aux | grep node               # Node.jsプロセス確認
lsof -i :3000                    # ポート3000使用プロセス
kill -9 <PID>                    # プロセス強制終了
```

## 注意事項
- macOSではGNU版とBSD版のコマンドで挙動が異なる場合がある
- `grep`より`rg`（ripgrep）の使用を推奨
- `find`の代わりに`fd`も利用可能（高速）