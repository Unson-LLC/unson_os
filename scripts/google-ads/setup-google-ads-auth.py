#!/usr/bin/env python3
"""
Google Ads API 認証セットアップとキーワード修正スクリプト
"""

import os
import subprocess
import sys
import json
from pathlib import Path

def download_auth_script():
    """公式の認証スクリプトをダウンロード"""
    print("📥 Google Ads公式認証スクリプトをダウンロード中...")
    
    # generate_user_credentials.pyをダウンロード
    script_url = "https://raw.githubusercontent.com/googleads/google-ads-python/main/examples/authentication/generate_user_credentials.py"
    
    try:
        import requests
        response = requests.get(script_url)
        with open('generate_user_credentials.py', 'w') as f:
            f.write(response.text)
        print("✅ 認証スクリプトをダウンロードしました")
        return True
    except Exception as e:
        print(f"❌ ダウンロードエラー: {e}")
        return False

def create_oauth_credentials():
    """OAuth2認証情報の作成ガイド"""
    print("\n🔐 OAuth2認証情報の作成")
    print("\n以下の手順でGoogle Cloud ConsoleでOAuth2クライアントを作成してください：\n")
    print("1. https://console.cloud.google.com にアクセス")
    print("2. プロジェクトを作成または選択")
    print("3. 「APIとサービス」→「認証情報」")
    print("4. 「認証情報を作成」→「OAuth クライアント ID」")
    print("5. アプリケーションの種類：「デスクトップアプリ」を選択")
    print("6. 名前を付けて作成")
    print("7. JSONファイルをダウンロード")
    print("\nダウンロードしたJSONファイルを現在のディレクトリに配置してください。")
    
    # JSONファイルを探す
    json_files = list(Path('.').glob('client_secret*.json'))
    if json_files:
        print(f"\n✅ 認証ファイルを検出: {json_files[0]}")
        return str(json_files[0])
    else:
        json_path = input("\nOAuth2 JSONファイルのパスを入力してください: ")
        if os.path.exists(json_path):
            return json_path
        else:
            print("❌ ファイルが見つかりません")
            return None

def generate_refresh_token(client_secret_path):
    """Refresh Tokenを生成"""
    print("\n🔄 Refresh Tokenを生成中...")
    
    # 公式スクリプトを実行
    cmd = [
        sys.executable,
        'generate_user_credentials.py',
        '-c', client_secret_path,
        '--additional_scopes', 'https://www.googleapis.com/auth/adwords'
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print("\n✅ Refresh Tokenが生成されました")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ エラー: {e}")
        return False

def create_config_yaml():
    """google-ads.yamlを作成"""
    print("\n📝 google-ads.yaml設定ファイルを作成")
    
    # 既存の設定を確認
    if os.path.exists('google-ads.yaml'):
        overwrite = input("\n既存のgoogle-ads.yamlが見つかりました。上書きしますか？ (y/n): ")
        if overwrite.lower() != 'y':
            return
    
    print("\n以下の情報を入力してください：")
    
    developer_token = input("Developer Token (https://ads.google.com/aw/apicenter から取得): ")
    client_id = input("Client ID: ")
    client_secret = input("Client Secret: ")
    refresh_token = input("Refresh Token (上記で生成): ")
    login_customer_id = input("Login Customer ID (デフォルト: 4600539562): ") or "4600539562"
    
    config_content = f"""# Google Ads API設定
developer_token: {developer_token}
client_id: {client_id}
client_secret: {client_secret}
refresh_token: {refresh_token}
login_customer_id: {login_customer_id}
use_proto_plus: True
"""
    
    with open('google-ads.yaml', 'w') as f:
        f.write(config_content)
    
    print("✅ google-ads.yamlを作成しました")

def test_connection():
    """接続テスト"""
    print("\n🧪 接続テスト中...")
    
    test_script = """
from google.ads.googleads.client import GoogleAdsClient

try:
    client = GoogleAdsClient.load_from_storage('google-ads.yaml')
    googleads_service = client.get_service("GoogleAdsService")
    
    query = \"\"\"
        SELECT customer.id, customer.descriptive_name
        FROM customer
        LIMIT 1
    \"\"\"
    
    response = googleads_service.search_stream(
        customer_id="4600539562",
        query=query
    )
    
    for batch in response:
        for row in batch.results:
            print(f"✅ 接続成功！ Customer: {row.customer.descriptive_name}")
            break
        break
    
except Exception as e:
    print(f"❌ 接続エラー: {e}")
"""
    
    with open('test_connection.py', 'w') as f:
        f.write(test_script)
    
    subprocess.run([sys.executable, 'test_connection.py'])
    os.remove('test_connection.py')

def main():
    """メイン処理"""
    print("🚀 Google Ads API認証セットアップ\n")
    
    # 仮想環境の確認
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  仮想環境が有効ではありません")
        print("以下のコマンドで仮想環境を有効化してください:")
        print("source google-ads-env/bin/activate")
        return
    
    # ステップ1: 認証スクリプトのダウンロード
    if not os.path.exists('generate_user_credentials.py'):
        if not download_auth_script():
            return
    
    # ステップ2: OAuth2認証情報の作成
    client_secret_path = create_oauth_credentials()
    if not client_secret_path:
        return
    
    # ステップ3: Refresh Tokenの生成
    print("\n次のステップでブラウザが開きます。")
    print("Googleアカウントでログインし、アクセスを許可してください。")
    input("\n準備ができたらEnterキーを押してください...")
    
    if not generate_refresh_token(client_secret_path):
        return
    
    # ステップ4: 設定ファイルの作成
    create_config_yaml()
    
    # ステップ5: 接続テスト
    test_connection()
    
    print("\n🎉 セットアップ完了！")
    print("\n次のステップ:")
    print("1. キーワード修正スクリプト (fix-keywords.py) を実行")
    print("2. キャンペーンのパフォーマンスを監視")

if __name__ == "__main__":
    main()