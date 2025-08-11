# Serena セットアップガイド

## 概要

Serenaは、AI（特にClaude）にプロジェクトコードを深く理解させるための賢い通訳者です。Language Server Protocol (LSP)を使用してコードを意味的に理解し、AIのトークン消費を劇的に削減しながら、精度の高いコード修正を可能にします。

## Serenaの主な利点

### 🚀 パフォーマンス向上
- **トークン消費の劇的削減**: 必要な部分のみをピンポイントで読み込み
- **高速レスポンス**: 事前インデックスにより即座に情報アクセス
- **精密な修正**: コードの依存関係を理解し、副作用を最小限に

### 🎯 高度な理解力
- **セマンティック検索**: コードを「意味」で理解
- **シンボル理解**: 関数、変数、クラスなどを構造的に把握
- **文脈理解**: プロジェクト全体の関連性を把握

### 🛡️ 安全性
- **ローカル処理**: すべての処理がローカルで完結
- **外部送信なし**: 大切なコードを外部に送信しない

## セットアップ手順

### 前提条件
- Claude Code（またはClaude Desktop）がインストールされていること
- uvツールがインストールされていること

### Step 1: uvのインストール

```bash
# uvをインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# パスを通す
source $HOME/.local/bin/env
```

### Step 2: SerenaをClaude Codeに追加

プロジェクトのルートディレクトリで以下のコマンドを実行：

```bash
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)
```

このコマンドの意味：
- `claude mcp add serena`: ClaudeにSerenaというMCPサーバーを追加
- `uvx --from git+https://github.com/oraios/serena`: GitHubからSerenaを取得
- `--context ide-assistant`: コーディング支援として設定
- `--project $(pwd)`: 現在のプロジェクトディレクトリを対象に

### Step 3: 動作確認

```bash
# インストールされたMCPサーバーを確認
claude mcp list
```

正常にインストールされていれば、`serena`が表示されます。

### Step 4: 初回オンボーディング

Claude Codeのチャット画面で以下のコマンドを実行：

```
/mcp__serena__initial_instructions
```

これにより、Serenaがプロジェクト全体をスキャンし、インデックスを作成します。
（この処理は各プロジェクトで初回のみ必要）

## 使い方

セットアップ完了後は、通常通りClaude Codeに質問するだけです。Serenaが自動的に：

1. 関連するコードを特定
2. 必要な部分のみをClaudeに提供
3. 精密な修正案を生成

### 使用例

❌ Before（Serenaなし）:
```
「このファイル全体を見て、バグを修正して」
→ 大量のトークン消費、時間がかかる、副作用のリスク
```

✅ After（Serenaあり）:
```
「このボタンのクリック処理がおかしいので修正して」
→ 関連箇所のみを参照、高速・正確な修正
```

## トラブルシューティング

### Serenaが接続できない場合

1. uvが正しくインストールされているか確認：
   ```bash
   which uvx
   ```

2. Serenaを再インストール：
   ```bash
   claude mcp remove serena
   claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)
   ```

### パフォーマンスが向上しない場合

1. 初回オンボーディングが完了しているか確認
2. プロジェクトのサイズが大きすぎる場合は、必要な部分に絞る

## 対応言語

Serenaは以下の言語をサポート：
- Python
- JavaScript/TypeScript
- Rust
- Go
- Java
- C/C++
- その他LSP対応言語

## 参考リンク

- [Serena GitHub Repository](https://github.com/oraios/serena)
- [MCP (Model Context Protocol) Documentation](https://modelcontextprotocol.io/)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)

## まとめ

Serenaを導入することで、AIとのコーディングが次のレベルに進化します：
- 💰 コスト削減（トークン消費を最小限に）
- ⚡ 高速化（必要な情報に即座にアクセス）
- 🎯 精度向上（コードの意味を理解した修正）
- 🛡️ 安全性（ローカル処理で情報漏洩なし）

UnsonOSプロジェクトでの開発効率を大幅に向上させるため、ぜひSerenaを活用してください！