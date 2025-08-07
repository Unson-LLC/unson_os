#!/usr/bin/env python3
"""
Google Ads APIでキーワードを修正するスクリプト
"""

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

# 設定
CUSTOMER_ID = '4600539562'
CAMPAIGN_ID = '22873791559'
AD_GROUP_ID = '183083066586'

def get_client():
    """Google Ads APIクライアントを取得"""
    return GoogleAdsClient.load_from_storage('google-ads.yaml')

def get_existing_keywords(client):
    """現在のキーワードを取得"""
    googleads_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            ad_group_criterion.resource_name,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type
        FROM ad_group_criterion
        WHERE ad_group.id = {AD_GROUP_ID}
        AND ad_group_criterion.type = 'KEYWORD'
        AND campaign.id = {CAMPAIGN_ID}
    """
    
    keywords = {}
    try:
        response = googleads_service.search_stream(
            customer_id=CUSTOMER_ID,
            query=query
        )
        
        for batch in response:
            for row in batch.results:
                keywords[row.ad_group_criterion.keyword.text] = row.ad_group_criterion.resource_name
    except GoogleAdsException as ex:
        print(f"❌ エラー: {ex}")
    
    return keywords

def remove_ai_keywords(client):
    """AI関連キーワードを削除"""
    print("\n🗑️  AI関連キーワードを削除中...")
    
    # 削除するキーワード
    ai_keywords = [
        'ai 企業', 'ai 会社', '人工 知能 企業', 'ai 将来', '人工 知能 会社',
        'ai 開発 企業', 'ai イベント', 'コンサル ai', 'ai of ai', 'ai 開発 会社',
        'ai to ai', '設計 ai', 'ai 使い方', 'ai 比較', 'ai コンサル',
        'ai イラストレーター 無料', 'ai コンサルティング', 'コンサルティング ai',
        'ai 一覧', 'ai 無料', '無料 ai', 'ai メーカー', 'sns ai', 'ai sns',
        'ai コンシェルジュ', 'gps ai', 'ai 特徴', 'ai カウンセリング', 'ai 情報',
        'コンシェルジュ ai', '将来 ai', 'イベント ai', 'ai ツール 無料',
        'モデル ai', 'ai の 会社', 'ai 本物', 'ai 価値', '人工 知能 今後 の 発展',
        'あなた ai', 'ai 人生'
    ]
    
    # 現在のキーワードを取得
    existing_keywords = get_existing_keywords(client)
    
    # 削除操作を作成
    ad_group_criterion_service = client.get_service("AdGroupCriterionService")
    operations = []
    
    for keyword in ai_keywords:
        if keyword in existing_keywords:
            operation = client.get_type("AdGroupCriterionOperation")
            operation.remove = existing_keywords[keyword]
            operations.append(operation)
            print(f"  削除予定: {keyword}")
    
    if operations:
        try:
            response = ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=CUSTOMER_ID,
                operations=operations
            )
            print(f"\n✅ {len(operations)}個のAI関連キーワードを削除しました")
        except GoogleAdsException as ex:
            print(f"❌ 削除エラー: {ex}")
    else:
        print("  削除対象のAIキーワードはありませんでした")

def add_targeted_keywords(client):
    """女性向けキーワードを追加"""
    print("\n✨ 女性向けキーワードを追加中...")
    
    # 追加するキーワード
    keywords_to_add = [
        # 完全一致
        {'text': '自分らしさ 診断', 'match_type': 'EXACT'},
        {'text': '価値観 女性', 'match_type': 'EXACT'},
        {'text': '人生相談 AI', 'match_type': 'EXACT'},
        {'text': '自己分析 女性', 'match_type': 'EXACT'},
        {'text': '価値観診断 アプリ', 'match_type': 'EXACT'},
        
        # フレーズ一致
        {'text': '自分らしく生きる 方法', 'match_type': 'PHRASE'},
        {'text': '女性 価値観 見つける', 'match_type': 'PHRASE'},
        {'text': '本当の自分 探す', 'match_type': 'PHRASE'},
        {'text': '人生の選択 相談', 'match_type': 'PHRASE'},
        {'text': '女性向け 自己分析', 'match_type': 'PHRASE'},
        {'text': '自分軸 作り方', 'match_type': 'PHRASE'},
        {'text': '価値観 明確にする', 'match_type': 'PHRASE'},
        
        # 部分一致
        {'text': '女性 ライフデザイン', 'match_type': 'BROAD'},
        {'text': 'ワークライフバランス 悩み', 'match_type': 'BROAD'},
        {'text': '結婚 仕事 選択', 'match_type': 'BROAD'},
        {'text': '女性 キャリア 相談', 'match_type': 'BROAD'},
        {'text': '自己理解 深める', 'match_type': 'BROAD'}
    ]
    
    # 既存のキーワードを取得
    existing_keywords = get_existing_keywords(client)
    
    # 追加操作を作成
    ad_group_criterion_service = client.get_service("AdGroupCriterionService")
    operations = []
    
    for keyword in keywords_to_add:
        if keyword['text'] not in existing_keywords:
            operation = client.get_type("AdGroupCriterionOperation")
            criterion = operation.create
            criterion.ad_group = f"customers/{CUSTOMER_ID}/adGroups/{AD_GROUP_ID}"
            criterion.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
            criterion.keyword.text = keyword['text']
            criterion.keyword.match_type = getattr(
                client.enums.KeywordMatchTypeEnum,
                keyword['match_type']
            )
            criterion.cpc_bid_micros = 50000000  # 50円
            operations.append(operation)
            print(f"  追加予定: {keyword['text']} ({keyword['match_type']})")
    
    if operations:
        try:
            response = ad_group_criterion_service.mutate_ad_group_criteria(
                customer_id=CUSTOMER_ID,
                operations=operations
            )
            print(f"\n✅ {len(operations)}個の女性向けキーワードを追加しました")
        except GoogleAdsException as ex:
            print(f"❌ 追加エラー: {ex}")
    else:
        print("  すべてのキーワードは既に追加済みです")

def update_campaign_targeting(client):
    """キャンペーンのターゲティング設定を更新"""
    print("\n⚙️  ターゲティング設定を更新中...")
    
    campaign_service = client.get_service("CampaignService")
    campaign_operation = client.get_type("CampaignOperation")
    
    campaign = campaign_operation.update
    campaign.resource_name = f"customers/{CUSTOMER_ID}/campaigns/{CAMPAIGN_ID}"
    
    # 性別ターゲティング（女性のみ）
    gender_info = campaign.targeting_setting.target_restrictions.add()
    gender_info.targeting_dimension = client.enums.TargetingDimensionEnum.GENDER
    gender_info.bid_only = False
    
    # 年齢ターゲティング（18-54歳）
    age_info = campaign.targeting_setting.target_restrictions.add()
    age_info.targeting_dimension = client.enums.TargetingDimensionEnum.AGE_RANGE
    age_info.bid_only = False
    
    client.copy_from(
        campaign_operation.update_mask,
        client.get_type("FieldMask")(paths=["targeting_setting.target_restrictions"])
    )
    
    try:
        response = campaign_service.mutate_campaigns(
            customer_id=CUSTOMER_ID,
            operations=[campaign_operation]
        )
        print("✅ ターゲティング設定を更新しました（女性、18-54歳）")
    except GoogleAdsException as ex:
        print(f"❌ ターゲティング更新エラー: {ex}")

def check_campaign_performance(client):
    """キャンペーンのパフォーマンスを確認"""
    print("\n📊 キャンペーンパフォーマンス:")
    
    googleads_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            campaign.name,
            campaign.status,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros,
            metrics.average_cpc
        FROM campaign
        WHERE campaign.id = {CAMPAIGN_ID}
        AND segments.date DURING TODAY
    """
    
    try:
        response = googleads_service.search_stream(
            customer_id=CUSTOMER_ID,
            query=query
        )
        
        for batch in response:
            for row in batch.results:
                print(f"\nキャンペーン: {row.campaign.name}")
                print(f"ステータス: {row.campaign.status.name}")
                print(f"表示回数: {row.metrics.impressions}")
                print(f"クリック数: {row.metrics.clicks}")
                print(f"コンバージョン: {row.metrics.conversions}")
                print(f"費用: ¥{row.metrics.cost_micros / 1000000:.0f}")
                if row.metrics.clicks > 0:
                    print(f"平均CPC: ¥{row.metrics.average_cpc / 1000000:.0f}")
    except GoogleAdsException as ex:
        print(f"❌ パフォーマンス取得エラー: {ex}")

def main():
    """メイン処理"""
    print("🚀 Google Ads キーワード最適化スクリプト\n")
    
    try:
        # クライアントを初期化
        client = get_client()
        print("✅ Google Ads APIに接続しました")
        
        # キーワードの修正
        remove_ai_keywords(client)
        add_targeted_keywords(client)
        
        # ターゲティング設定の更新
        update_campaign_targeting(client)
        
        # パフォーマンスの確認
        check_campaign_performance(client)
        
        print("\n🎉 最適化が完了しました！")
        print("\n次のステップ:")
        print("1. Google Ads管理画面で変更を確認")
        print("2. 30分〜1時間待って表示回数を確認")
        print("3. 必要に応じて入札単価を調整")
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        print("\ngoogle-ads.yamlの設定を確認してください")

if __name__ == "__main__":
    main()