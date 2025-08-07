# Google Ads API スクリプト

Google Ads APIを使用してキャンペーンを管理するための汎用Pythonスクリプト集です。

## ファイル構成

- `setup-google-ads-auth.py` - Google Ads API認証のセットアップスクリプト
- `manage-keywords.py` - 汎用キーワード管理スクリプト
- `campaign-config-template.yaml` - キャンペーン設定テンプレート
- `campaigns/` - キャンペーン別の設定ファイル
- `google-ads.yaml` - API認証設定ファイル（.gitignoreに追加済み）

## 使用方法

### 1. 仮想環境のセットアップ

```bash
python3 -m venv google-ads-env
source google-ads-env/bin/activate
pip install google-ads requests pyyaml
```

### 2. 認証設定（初回のみ）

```bash
python scripts/google-ads/setup-google-ads-auth.py
```

### 3. キャンペーン設定ファイルの作成

`campaign-config-template.yaml` をコピーして、キャンペーン用の設定ファイルを作成します：

```bash
cp campaign-config-template.yaml campaigns/my-campaign.yaml
# エディタで編集
```

### 4. キーワード管理

```bash
# キーワードの追加・削除
python scripts/google-ads/manage-keywords.py campaigns/my-campaign.yaml

# キーワード一覧の表示
python scripts/google-ads/manage-keywords.py campaigns/my-campaign.yaml --list

# キーワードの削除のみ
python scripts/google-ads/manage-keywords.py campaigns/my-campaign.yaml --remove-only

# キーワードの追加のみ
python scripts/google-ads/manage-keywords.py campaigns/my-campaign.yaml --add-only

# パフォーマンスの確認
python scripts/google-ads/manage-keywords.py campaigns/my-campaign.yaml --performance
```

## 主な機能

- 任意のキャンペーンのキーワードを管理
- キーワードの追加・削除を設定ファイルで管理
- マッチタイプ（完全一致、フレーズ一致、部分一致）に対応
- キーワードごとのCPC入札単価設定
- 現在のキーワード一覧表示
- キャンペーンパフォーマンスの確認

## 設定ファイルの書き方

`campaign-config-template.yaml` を参考に、以下の項目を設定します：

1. **campaign**: キャンペーン情報（customer_id, campaign_id, ad_group_id）
2. **keywords_to_remove**: 削除するキーワードのリスト
3. **keywords_to_add**: 追加するキーワード（マッチタイプ別）
4. **targeting**: ターゲティング設定（オプション）

## 注意事項

- `google-ads.yaml`には機密情報が含まれているため、絶対にコミットしないでください
- Developer Tokenが必要です（https://ads.google.com/aw/apicenter で取得）
- OAuth2認証情報が必要です（Google Cloud Consoleで作成）