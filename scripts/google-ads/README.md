# Google Ads API スクリプト

Google Ads APIを使用してキャンペーンを管理するためのPythonスクリプト集です。

## ファイル構成

- `setup-google-ads-auth.py` - Google Ads API認証のセットアップスクリプト
- `fix-keywords.py` - キーワードの追加・削除・最適化スクリプト
- `google-ads.yaml` - API認証設定ファイル（.gitignoreに追加済み）

## 使用方法

### 1. 仮想環境のセットアップ

```bash
python3 -m venv google-ads-env
source google-ads-env/bin/activate
pip install google-ads requests
```

### 2. 認証設定（初回のみ）

```bash
python scripts/google-ads/setup-google-ads-auth.py
```

### 3. キーワード最適化

```bash
python scripts/google-ads/fix-keywords.py
```

## 主な機能

- AI関連の不適切なキーワードを削除
- 女性向け価値観診断に関連するキーワードを追加
- キャンペーンのパフォーマンスを確認

## 注意事項

- `google-ads.yaml`には機密情報が含まれているため、絶対にコミットしないでください
- Developer Tokenが必要です（https://ads.google.com/aw/apicenter で取得）
- OAuth2認証情報が必要です（Google Cloud Consoleで作成）