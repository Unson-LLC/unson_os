# UnsonOS MCP Google Ads セットアップガイド
## Claude経由でGoogle広告を自然言語操作するための完全セットアップ

## 🎯 概要
このガイドでは、MCP（Model Context Protocol）を使ってClaude経由でGoogle広告を自然言語で操作できるようにする手順を詳しく説明します。

## 📋 前提条件

### 必要なアカウント・ツール
- Google Cloudアカウント
- Google Adsアカウント（管理者権限）
- Claude Desktop または Cursor
- Python 3.10以上
- Git

### 推定作業時間
- **初回セットアップ**: 2-3時間
- **認証設定**: 30分
- **動作確認**: 30分

## 🚀 Step 1: Google Cloud設定

### 1.1 プロジェクト作成
```bash
# Google Cloud CLIでプロジェクト作成
gcloud projects create unson-ads-mcp --name="UnsonOS MCP Google Ads"
gcloud config set project unson-ads-mcp
```

### 1.2 Google Ads API有効化
```bash
# Google Ads APIを有効化
gcloud services enable googleads.googleapis.com
```

またはGoogle Cloud Console（https://console.cloud.google.com）で：
1. 「APIとサービス」→「ライブラリ」
2. 「Google Ads API」を検索
3. 「有効にする」をクリック

### 1.3 OAuth 2.0認証情報作成

#### Google Cloud Consoleでの設定
1. **「APIとサービス」→「認証情報」**に移動
2. **「認証情報を作成」→「OAuth クライアントID」**
3. **アプリケーションの種類**：「デスクトップアプリケーション」
4. **名前**：「UnsonOS MCP Client」
5. **作成**をクリック

#### 認証情報のダウンロード
- 作成したクライアントIDの**JSONファイルをダウンロード**
- ファイル名を`google_ads_credentials.json`に変更
- プロジェクトルートに配置

## 🔑 Step 2: Google Ads アカウント設定と開発者トークン取得

### 2.1 Google Adsアカウント作成・設定

#### 新規アカウント作成の場合
1. **Google Ads**（https://ads.google.com）にアクセス
2. **「今すぐ開始」**をクリック
3. **事業内容の設定**（スクリーンショット参照）：
   - **ビジネスの名前**: 「Unson LLC」
   - **広告をクリックしたユーザーに期待する行動**: 「自分のWebサイトに移動します」
   - **WebページのURL**: UnsonOSのランディングページURL（例：https://unson.jp）

#### アカウント設定完了後の手順
4. **支払い情報の設定**（クレジットカード等）
5. **初回キャンペーンの設定**（後でスキップ可能）
6. **アカウントの有効化確認**

### 2.2 開発者トークン申請

#### 申請手順
1. **Google Adsダッシュボード**にログイン
2. **「ツールと設定」⚙️ → 「セットアップ」→「API センター」**
3. **「開発者トークンを申請」**をクリック

   > ⚠️ **注意**: 新規アカウントの場合、APIセンターが表示されるまで24-48時間かかることがあります

#### 申請フォーム記入例
```
アプリケーション名: UnsonOS MCP Integration
会社・組織名: Unson LLC
ウェブサイト: https://unson.jp
アプリケーションの説明: 
AI-driven automated Google Ads management system for micro-SaaS products. 
Enables natural language interaction with Google Ads via Claude AI assistant 
for campaign optimization and performance analysis.

使用目的: 
- Campaign performance monitoring and analysis
- Automated keyword optimization suggestions  
- Cost-per-acquisition (CPA) optimization
- Budget allocation recommendations
- Real-time reporting for rapid product iteration cycles

API使用量予測: 
- 日次クエリ数: 100-500
- 月次クエリ数: 3,000-15,000
- 主な操作: 読み取り中心、最適化提案
```

### 2.3 開発者トークンのアクセスレベル

#### 基本アクセスレベル（即座に利用可能）
- **テストアカウント専用**
- **API制限**: 15,000 オペレーション/日
- **本番データアクセス**: 不可
- **MCP開発・テスト**: 十分

#### 標準アクセスレベル（審査必要）
- **本番アカウントアクセス可能**
- **API制限**: より高い上限
- **審査期間**: 1-3営業日
- **承認条件**: Google Adsポリシー準拠

### 2.4 承認状況の確認

#### 確認方法
1. **API センター**で現在のステータス確認
2. **Googleからのメール通知**をチェック
3. **開発者トークン**をコピー（承認後）

#### よくある承認遅延の原因
- 新規アカウント（実績不足）
- 不完全な申請情報
- ポリシー違反の疑い
- 使用目的の不明確さ

### 2.5 テスト環境での先行開発

承認待ちの間に以下を準備：
- MCPサーバーの実装
- テストアカウントでの動作確認
- 基本的な分析機能の開発

## 🐍 Step 3: MCPサーバーセットアップ

### 3.1 Python環境準備
```bash
# 仮想環境作成
python -m venv mcp_env
source mcp_env/bin/activate  # Windows: mcp_env\\Scripts\\activate

# 必要パッケージインストール
pip install google-ads mcp-python python-dotenv fastapi uvicorn
```

### 3.2 MCPサーバー実装

#### `mcp_google_ads_server.py`作成
```python
#!/usr/bin/env python3
"""UnsonOS MCP Google Ads Server"""

import os
import json
from typing import Any, Dict, List
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from mcp.server import Server
from mcp.types import Tool, TextContent
import asyncio
from dotenv import load_dotenv

# 環境変数読み込み
load_dotenv()

class GoogleAdsMCPServer:
    def __init__(self):
        self.server = Server("google-ads")
        self.client = None
        self.setup_client()
        self.register_tools()
    
    def setup_client(self):
        """Google Ads クライアント初期化"""
        try:
            # 認証情報設定
            credentials = {
                "developer_token": os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"),
                "client_id": os.getenv("GOOGLE_ADS_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_ADS_CLIENT_SECRET"),
                "refresh_token": os.getenv("GOOGLE_ADS_REFRESH_TOKEN"),
                "login_customer_id": os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
                "use_proto_plus": True
            }
            
            self.client = GoogleAdsClient.load_from_dict(credentials)
            print("Google Ads クライアント初期化完了")\n        
        except Exception as e:
            print(f"クライアント初期化エラー: {e}")
    
    def register_tools(self):
        """MCPツール登録"""
        
        @self.server.tool()
        async def get_campaigns(customer_id: str) -> List[Dict[str, Any]]:
            \"\"\"キャンペーン一覧取得\"\"\"
            try:
                ga_service = self.client.get_service("GoogleAdsService")
                query = \"\"\"
                    SELECT 
                        campaign.id,
                        campaign.name,
                        campaign.status,
                        metrics.clicks,
                        metrics.impressions,
                        metrics.cost_micros,
                        metrics.conversions
                    FROM campaign 
                    WHERE segments.date DURING LAST_30_DAYS
                \"\"\"
                
                response = ga_service.search_stream(
                    customer_id=customer_id, query=query
                )
                
                campaigns = []
                for batch in response:
                    for row in batch.results:
                        campaigns.append({
                            "id": row.campaign.id,
                            "name": row.campaign.name,
                            "status": row.campaign.status.name,
                            "clicks": row.metrics.clicks,
                            "impressions": row.metrics.impressions,
                            "cost": row.metrics.cost_micros / 1_000_000,
                            "conversions": row.metrics.conversions
                        })
                
                return campaigns
                
            except GoogleAdsException as ex:
                return [{"error": f"Google Ads API エラー: {ex}"}]
        
        @self.server.tool()
        async def analyze_performance(customer_id: str, period: str = "LAST_30_DAYS") -> Dict[str, Any]:
            \"\"\"パフォーマンス分析\"\"\"
            try:
                ga_service = self.client.get_service("GoogleAdsService")
                query = f\"\"\"
                    SELECT 
                        metrics.clicks,
                        metrics.impressions,
                        metrics.cost_micros,
                        metrics.conversions,
                        metrics.ctr,
                        metrics.average_cpc
                    FROM campaign 
                    WHERE segments.date DURING {period}
                \"\"\"
                
                response = ga_service.search_stream(
                    customer_id=customer_id, query=query
                )
                
                total_clicks = 0
                total_impressions = 0
                total_cost = 0
                total_conversions = 0
                
                for batch in response:
                    for row in batch.results:
                        total_clicks += row.metrics.clicks
                        total_impressions += row.metrics.impressions
                        total_cost += row.metrics.cost_micros / 1_000_000
                        total_conversions += row.metrics.conversions
                
                ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
                cpa = (total_cost / total_conversions) if total_conversions > 0 else 0
                
                return {
                    "period": period,
                    "clicks": total_clicks,
                    "impressions": total_impressions,
                    "cost": round(total_cost, 2),
                    "conversions": total_conversions,
                    "ctr": round(ctr, 2),
                    "cpa": round(cpa, 2)
                }
                
            except GoogleAdsException as ex:
                return {"error": f"分析エラー: {ex}"}
        
        @self.server.tool()
        async def get_keywords(customer_id: str, campaign_id: str) -> List[Dict[str, Any]]:
            \"\"\"キーワード取得\"\"\"
            try:
                ga_service = self.client.get_service("GoogleAdsService")
                query = f\"\"\"
                    SELECT 
                        ad_group_criterion.keyword.text,
                        ad_group_criterion.keyword.match_type,
                        metrics.clicks,
                        metrics.impressions,
                        metrics.cost_micros,
                        metrics.quality_score
                    FROM keyword_view 
                    WHERE campaign.id = {campaign_id}
                    AND segments.date DURING LAST_30_DAYS
                \"\"\"
                
                response = ga_service.search_stream(
                    customer_id=customer_id, query=query
                )
                
                keywords = []
                for batch in response:
                    for row in batch.results:
                        keywords.append({
                            "keyword": row.ad_group_criterion.keyword.text,
                            "match_type": row.ad_group_criterion.keyword.match_type.name,
                            "clicks": row.metrics.clicks,
                            "impressions": row.metrics.impressions,
                            "cost": row.metrics.cost_micros / 1_000_000,
                            "quality_score": row.metrics.quality_score
                        })
                
                return keywords
                
            except GoogleAdsException as ex:
                return [{"error": f"キーワード取得エラー: {ex}"}]

async def main():
    server_instance = GoogleAdsMCPServer()
    
    # サーバー起動
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (read_stream, write_stream):
        await server_instance.server.run(
            read_stream, write_stream, server_instance.server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
```

### 3.3 認証トークン取得スクリプト

#### `get_refresh_token.py`作成
```python
#!/usr/bin/env python3
"""Google Ads リフレッシュトークン取得"""

import os
from google_auth_oauthlib.flow import InstalledAppFlow
from dotenv import load_dotenv

load_dotenv()

def get_refresh_token():
    # スコープ設定
    SCOPES = ['https://www.googleapis.com/auth/adwords']
    
    # OAuth認証フロー
    flow = InstalledAppFlow.from_client_secrets_file(
        'google_ads_credentials.json', SCOPES)
    
    # 認証実行
    credentials = flow.run_local_server(port=0)
    
    print("認証情報:")
    print(f"GOOGLE_ADS_REFRESH_TOKEN={credentials.refresh_token}")
    print(f"GOOGLE_ADS_CLIENT_ID={credentials.client_id}")
    print(f"GOOGLE_ADS_CLIENT_SECRET={credentials.client_secret}")

if __name__ == "__main__":
    get_refresh_token()
```

## 🔧 Step 4: 環境変数設定

### 4.1 .env.localファイル更新
```bash
# 既存の設定を確認
cat .env.local

# 必要に応じて値を更新
```

### 4.2 認証トークン取得
```bash
# リフレッシュトークン取得
python get_refresh_token.py
```

## 🔗 Step 5: Claude Desktop設定

### 5.1 MCP設定ファイル作成

#### macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
#### Windows: `%APPDATA%\\Claude\\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "python",
      "args": ["/path/to/unson_os/mcp_google_ads_server.py"],
      "env": {
        "GOOGLE_ADS_CLIENT_ID": "your_client_id_here",
        "GOOGLE_ADS_CLIENT_SECRET": "your_client_secret_here",
        "GOOGLE_ADS_REFRESH_TOKEN": "your_refresh_token_here",
        "GOOGLE_ADS_DEVELOPER_TOKEN": "your_developer_token_here",
        "GOOGLE_ADS_CUSTOMER_ID": "your_customer_id_here",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "your_login_customer_id_here"
      }
    }
  }
}
```

### 5.2 Claude Desktop再起動
設定ファイル保存後、Claude Desktopを再起動

## ✅ Step 6: 動作確認

### 6.1 接続テスト
Claude Desktopで以下のプロンプトを試してください：

```
Google広告のキャンペーン一覧を表示してください
```

### 6.2 基本操作テスト
```
先月のパフォーマンス分析を表示してください
```

### 6.3 高度な操作テスト
```
CPAが一番高いキーワードを特定して改善提案してください
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. 「開発者トークンが無効」エラー
```
解決方法:
1. Google Adsで開発者トークンの承認状況確認
2. 基本アクセスレベルでテスト実行
3. 必要に応じて標準アクセスレベル申請
```

#### 2. 「認証エラー」
```
解決方法:
1. リフレッシュトークンの再取得
2. OAuth認証情報の確認
3. スコープ設定の確認
```

#### 3. 「MCPサーバー接続失敗」
```
解決方法:
1. Python仮想環境の確認
2. 必要パッケージのインストール確認
3. 設定ファイルのパス確認
```

#### 4. 「権限エラー」
```
解決方法:
1. Google Adsアカウントの管理者権限確認
2. カスタマーIDの正確性確認
3. ログインカスタマーIDの設定確認
```

## 📊 運用監視

### 監視項目
- API呼び出し数（日次・月次制限）
- エラー率
- レスポンス時間
- 認証トークンの有効期限

### アラート設定
```python
# 基本的なアラート設定例
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mcp_google_ads.log'),
        logging.StreamHandler()
    ]
)
```

## 🔒 セキュリティベストプラクティス

### 認証情報管理
1. **環境変数の暗号化**
2. **定期的なトークン更新**
3. **最小権限の原則**
4. **アクセスログの監視**

### 運用ガイドライン
1. **大幅な変更前の承認プロセス**
2. **バックアップと復旧手順**
3. **インシデント対応手順**

## 📈 活用例

### 日常運用でのプロンプト例
```
# 日次チェック
「昨日のパフォーマンスサマリーを作成して」

# 週次分析
「今週のCPAが悪化したキャンペーンとその原因を分析して」

# 月次最適化
「来月の予算配分を最適化提案して」

# 緊急対応
「現在CTRが急激に下がっているキーワードを特定して」
```

---

最終更新日: 2025年1月
関連ドキュメント: [メインガイド](./listing-ads-setup-guide.md) | [コピーライティング](./copywriting-guide.md) | [心理テクニック](./psychological-techniques-guide.md)