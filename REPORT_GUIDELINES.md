# 📋 レポート管理ガイドライン

## ⚠️ 重要：機密情報の取り扱い

このリポジトリはオープンソースです。機密情報を含むレポートは**絶対にコミットしないでください**。

## 🚫 コミット禁止ファイル

`reports/`フォルダ内のすべてのファイルは`.gitignore`に登録されており、自動的にGitの追跡対象外となります。

### 機密情報の例
- Discord投稿用レポート（メンバー向け情報）
- Google Ads実績データ（具体的な数値）
- 顧客獲得データ（個人情報の可能性）
- 内部戦略文書

## ✅ 正しいレポート管理方法

### 1. 機密レポート（reports/フォルダ）
```bash
# ローカルでのみ管理
reports/discord-report-*.md
reports/google-ads-weekly-*.md
reports/*-internal-*.md
```

**用途:**
- Discord/Slack投稿用
- 内部共有用
- 実績数値を含むレポート

### 2. 公開可能なドキュメント（docs/フォルダ）
```bash
# コミット可能
docs/business-strategy/*.md
docs/technical/*.md
docs/guides/*.md
```

**用途:**
- 戦略フレームワーク
- 技術仕様
- 一般的なガイドライン

## 📝 レポート作成時のチェックリスト

レポート作成前に確認:

- [ ] 機密情報が含まれていないか？
- [ ] 具体的な売上・コスト数値は？
- [ ] 顧客の個人情報は？
- [ ] APIキー・認証情報は？

→ **1つでも該当する場合は`reports/`フォルダに保存**

## 🔄 既存ファイルの移行

もし誤って機密情報をコミットしてしまった場合:

```bash
# 1. ファイルを削除
git rm --cached reports/sensitive-file.md

# 2. .gitignoreに追加（既に追加済み）

# 3. コミット履歴から完全削除（必要に応じて）
git filter-branch --tree-filter 'rm -f reports/sensitive-file.md' HEAD
```

## 📊 レポートタイプ別の保存先

| レポートタイプ | 保存先 | Git追跡 | 例 |
|--------------|--------|---------|-----|
| Discord投稿 | `reports/` | ❌ | discord-report-*.md |
| 週次実績 | `reports/` | ❌ | weekly-report-*.md |
| 戦略文書 | `docs/business-strategy/` | ✅ | mvp-framework.md |
| 技術仕様 | `docs/technical/` | ✅ | architecture.md |
| コスト分析 | `docs/` または `reports/` | 状況による | cost-analysis.md |

## 🛡️ セキュリティベストプラクティス

1. **定期的な確認**
   ```bash
   # gitに追跡されているファイルを確認
   git ls-files | grep report
   ```

2. **コミット前の確認**
   ```bash
   # ステージングエリアを確認
   git status
   git diff --staged
   ```

3. **自動チェック**
   - pre-commitフックの設定を検討
   - CI/CDでの機密情報スキャン

## 📢 チームへの周知

新メンバーには必ず以下を伝える:

1. このガイドラインの存在
2. `reports/`フォルダは自動的にGit無視
3. 機密情報の判断基準
4. 間違えた場合の対処法

## 🆘 サポート

判断に迷った場合は、**コミット前に**チームに相談してください。

「公開してもよいか分からない」場合は、**公開しない**を選択。

---

*最終更新: 2025年8月13日*