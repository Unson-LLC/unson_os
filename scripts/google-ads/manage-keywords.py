#!/usr/bin/env python3
"""
Google Ads API汎用キーワード管理スクリプト
任意のキャンペーンのキーワードを追加・削除・管理できます
"""

import argparse
import yaml
import sys
from pathlib import Path
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

def load_config(config_file):
    """設定ファイルを読み込む"""
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"❌ エラー: 設定ファイル '{config_file}' が見つかりません")
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"❌ エラー: 設定ファイルの形式が正しくありません: {e}")
        sys.exit(1)

def get_client():
    """Google Ads APIクライアントを取得"""
    # まず同じディレクトリのgoogle-ads.yamlを探す
    script_dir = Path(__file__).parent
    local_config = script_dir / 'google-ads.yaml'
    
    if local_config.exists():
        return GoogleAdsClient.load_from_storage(str(local_config))
    else:
        # デフォルトの場所から読み込む
        return GoogleAdsClient.load_from_storage()

def get_existing_keywords(client, customer_id, campaign_id, ad_group_id):
    """現在のキーワードを取得"""
    googleads_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            ad_group_criterion.resource_name,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type
        FROM ad_group_criterion
        WHERE ad_group.id = {ad_group_id}
        AND ad_group_criterion.type = 'KEYWORD'
        AND campaign.id = {campaign_id}
        AND ad_group_criterion.status != 'REMOVED'
    """
    
    keywords = {}
    try:
        response = googleads_service.search_stream(
            customer_id=customer_id,
            query=query
        )
        
        for batch in response:
            for row in batch.results:
                keywords[row.ad_group_criterion.keyword.text] = row.ad_group_criterion.resource_name
    except GoogleAdsException as ex:
        print(f"❌ エラー: {ex}")
    
    return keywords

def remove_keywords(client, config):
    """指定されたキーワードを削除"""
    if 'keywords_to_remove' not in config or not config['keywords_to_remove']:
        print("  削除するキーワードは指定されていません")
        return
    
    customer_id = config['campaign']['customer_id']
    campaign_id = config['campaign']['campaign_id']
    ad_group_id = config['campaign']['ad_group_id']
    
    print(f"\n🗑️  キーワードを削除中...")
    print(f"   キャンペーン: {config['campaign']['name']}")
    
    # 現在のキーワードを取得
    existing_keywords = get_existing_keywords(client, customer_id, campaign_id, ad_group_id)
    
    # 削除操作を作成
    ad_group_criterion_service = client.get_service("AdGroupCriterionService")
    operations = []
    
    for keyword in config['keywords_to_remove']:
        if keyword in existing_keywords:
            operation = client.get_type("AdGroupCriterionOperation")
            operation.remove = existing_keywords[keyword]
            operations.append(operation)
            print(f"  削除予定: {keyword}")
    
    if operations:
        try:
            response = ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=customer_id,
                operations=operations
            )
            print(f"\n✅ {len(operations)}個のキーワードを削除しました")
        except GoogleAdsException as ex:
            print(f"❌ 削除エラー: {ex}")
    else:
        print("  削除対象のキーワードは見つかりませんでした")

def add_keywords(client, config):
    """指定されたキーワードを追加"""
    if 'keywords_to_add' not in config:
        print("  追加するキーワードは指定されていません")
        return
    
    customer_id = config['campaign']['customer_id']
    campaign_id = config['campaign']['campaign_id']
    ad_group_id = config['campaign']['ad_group_id']
    
    print(f"\n✨ キーワードを追加中...")
    print(f"   キャンペーン: {config['campaign']['name']}")
    
    # 既存のキーワードを取得
    existing_keywords = get_existing_keywords(client, customer_id, campaign_id, ad_group_id)
    
    # 追加操作を作成
    ad_group_criterion_service = client.get_service("AdGroupCriterionService")
    operations = []
    
    # マッチタイプごとに処理
    for match_type_key, match_type_enum in [
        ('exact', 'EXACT'),
        ('phrase', 'PHRASE'),
        ('broad', 'BROAD')
    ]:
        if match_type_key in config['keywords_to_add']:
            for keyword_config in config['keywords_to_add'][match_type_key]:
                text = keyword_config['text']
                if text not in existing_keywords:
                    operation = client.get_type("AdGroupCriterionOperation")
                    criterion = operation.create
                    criterion.ad_group = f"customers/{customer_id}/adGroups/{ad_group_id}"
                    criterion.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
                    criterion.keyword.text = text
                    criterion.keyword.match_type = getattr(
                        client.enums.KeywordMatchTypeEnum,
                        match_type_enum
                    )
                    # CPCが指定されていれば設定
                    if 'cpc_bid_micros' in keyword_config:
                        criterion.cpc_bid_micros = keyword_config['cpc_bid_micros']
                    operations.append(operation)
                    print(f"  追加予定: {text} ({match_type_enum})")
    
    if operations:
        try:
            response = ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=customer_id,
                operations=operations
            )
            print(f"\n✅ {len(operations)}個のキーワードを追加しました")
        except GoogleAdsException as ex:
            print(f"❌ 追加エラー: {ex}")
    else:
        print("  すべてのキーワードは既に追加済みです")

def list_keywords(client, config):
    """現在のキーワード一覧を表示"""
    customer_id = config['campaign']['customer_id']
    campaign_id = config['campaign']['campaign_id']
    
    print(f"\n📋 キーワード一覧")
    print(f"   キャンペーン: {config['campaign']['name']}")
    print("=" * 60)
    
    googleads_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            ad_group_criterion.cpc_bid_micros
        FROM ad_group_criterion
        WHERE campaign.id = {campaign_id}
        AND ad_group_criterion.type = 'KEYWORD'
    """
    
    try:
        response = googleads_service.search_stream(
            customer_id=customer_id,
            query=query
        )
        
        print(f"{'キーワード':<40} {'タイプ':<10} {'状態':<10} {'CPC':<10}")
        print("-" * 75)
        
        for batch in response:
            for row in batch.results:
                keyword = row.ad_group_criterion.keyword.text
                match_type = row.ad_group_criterion.keyword.match_type.name
                status = row.ad_group_criterion.status.name
                cpc = f"¥{row.ad_group_criterion.cpc_bid_micros / 1000000:.0f}" if row.ad_group_criterion.cpc_bid_micros else "自動"
                
                # REMOVEDは除外
                if status != 'REMOVED':
                    print(f"{keyword:<40} {match_type:<10} {status:<10} {cpc:<10}")
                
    except GoogleAdsException as ex:
        print(f"❌ エラー: {ex}")

def check_performance(client, config):
    """キャンペーンのパフォーマンスを確認"""
    customer_id = config['campaign']['customer_id']
    campaign_id = config['campaign']['campaign_id']
    
    print(f"\n📊 キャンペーンパフォーマンス")
    print(f"   キャンペーン: {config['campaign']['name']}")
    print("=" * 60)
    
    googleads_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros,
            metrics.average_cpc,
            metrics.ctr
        FROM campaign
        WHERE campaign.id = {campaign_id}
        AND segments.date DURING LAST_7_DAYS
    """
    
    try:
        response = googleads_service.search_stream(
            customer_id=customer_id,
            query=query
        )
        
        for batch in response:
            for row in batch.results:
                print(f"表示回数: {row.metrics.impressions:,}")
                print(f"クリック数: {row.metrics.clicks:,}")
                print(f"CTR: {row.metrics.ctr:.2%}")
                print(f"コンバージョン: {row.metrics.conversions}")
                if row.metrics.clicks > 0:
                    print(f"コンバージョン率: {row.metrics.conversions / row.metrics.clicks:.2%}")
                print(f"費用: ¥{row.metrics.cost_micros / 1000000:,.0f}")
                if row.metrics.clicks > 0:
                    print(f"平均CPC: ¥{row.metrics.average_cpc / 1000000:.0f}")
    except GoogleAdsException as ex:
        print(f"❌ エラー: {ex}")

def main():
    """メイン処理"""
    parser = argparse.ArgumentParser(description='Google Ads キーワード管理ツール')
    parser.add_argument('config', help='キャンペーン設定ファイル（YAML形式）')
    parser.add_argument('--list', action='store_true', help='現在のキーワード一覧を表示')
    parser.add_argument('--remove-only', action='store_true', help='キーワードの削除のみ実行')
    parser.add_argument('--add-only', action='store_true', help='キーワードの追加のみ実行')
    parser.add_argument('--performance', action='store_true', help='パフォーマンスを表示')
    
    args = parser.parse_args()
    
    print("🚀 Google Ads キーワード管理ツール\n")
    
    # 設定ファイルを読み込む
    config = load_config(args.config)
    
    try:
        # クライアントを初期化
        client = get_client()
        print("✅ Google Ads APIに接続しました")
        
        if args.list:
            # キーワード一覧を表示
            list_keywords(client, config)
        elif args.performance:
            # パフォーマンスを表示
            check_performance(client, config)
        else:
            # キーワードの追加・削除
            if not args.add_only:
                remove_keywords(client, config)
            if not args.remove_only:
                add_keywords(client, config)
            
            print("\n🎉 処理が完了しました！")
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        print("\ngoogle-ads.yamlの設定を確認してください")
        sys.exit(1)

if __name__ == "__main__":
    main()