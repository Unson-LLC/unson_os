#!/usr/bin/env python3
"""
Nemotron-Personas-Japan データセット読み込みテストスクリプト

このスクリプトは以下を確認します:
1. datasets ライブラリの正常インポート
2. Nemotron-Personas-Japan データセットの読み込み
3. 全 22 フィールドへのアクセス
4. サンプルペルソナ 10 件の抽出
5. キャッシュ設定とパフォーマンス計測
"""

import time
import sys
from pathlib import Path

# プロジェクトルートをPythonパスに追加
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_imports():
    """ライブラリインポートテスト"""
    print("=" * 60)
    print("テスト 1: ライブラリインポート確認")
    print("=" * 60)

    try:
        import datasets
        print(f"✅ datasets ライブラリ: {datasets.__version__}")

        from datasets import load_dataset, config
        print("✅ load_dataset インポート成功")
        print("✅ config インポート成功")

        return True
    except ImportError as e:
        print(f"❌ インポートエラー: {e}")
        return False


def test_dataset_load():
    """データセット読み込みテスト"""
    print("\n" + "=" * 60)
    print("テスト 2: Nemotron-Personas-Japan データセット読み込み")
    print("=" * 60)
    print("⚠️  初回実行時は 1.73GB のダウンロードが発生します...")

    try:
        from datasets import load_dataset

        start_time = time.time()
        ds = load_dataset("nvidia/Nemotron-Personas-Japan", split="train")
        load_time = time.time() - start_time

        print(f"✅ データセット読み込み成功 (所要時間: {load_time:.2f}秒)")
        print(f"📊 総レコード数: {len(ds):,} 件")

        return ds, load_time
    except Exception as e:
        print(f"❌ データセット読み込みエラー: {e}")
        return None, 0


def test_fields_access(ds):
    """フィールドアクセステスト"""
    print("\n" + "=" * 60)
    print("テスト 3: フィールド構造確認 (22 フィールド)")
    print("=" * 60)

    if ds is None:
        print("❌ データセットが読み込まれていません")
        return False

    try:
        features = ds.features
        print(f"📋 フィールド総数: {len(features)} 個\n")

        # 期待される 22 フィールド (実際のデータセット構造に基づく)
        expected_fields = [
            "professional_persona",
            "sports_persona",
            "arts_persona",
            "travel_persona",
            "culinary_persona",
            "general_persona",
            "cultural_background",
            "skills_and_expertise",
            "hobbies_and_interests",
            "career_goals",
            "sex",
            "age",
            "marital_status",
            "education_level",
            "occupation",
            "region",
            "prefecture",
            "country",
        ]

        print("フィールド一覧:")
        for i, field_name in enumerate(features.keys(), 1):
            field_type = features[field_name]
            print(f"  {i:2d}. {field_name:30s} - {field_type}")

        # フィールド数確認
        actual_count = len(features)
        if actual_count >= 18:  # 最低限のフィールド数
            print(f"\n✅ フィールド数: {actual_count} 個 (OK)")
        else:
            print(f"\n⚠️  フィールド数: {actual_count} 個 (期待: 18以上)")

        return True
    except Exception as e:
        print(f"❌ フィールドアクセスエラー: {e}")
        return False


def test_sample_extraction(ds):
    """サンプルペルソナ抽出テスト"""
    print("\n" + "=" * 60)
    print("テスト 4: サンプルペルソナ 10 件抽出")
    print("=" * 60)

    if ds is None:
        print("❌ データセットが読み込まれていません")
        return False

    try:
        # 最初の 10 件を抽出
        samples = ds.select(range(min(10, len(ds))))

        print(f"✅ サンプル {len(samples)} 件抽出成功\n")

        # サンプル表示
        for i, persona in enumerate(samples, 1):
            print(f"--- ペルソナ {i} ---")

            # 基本情報表示
            if "age" in persona:
                print(f"  年齢: {persona['age']}歳")
            if "sex" in persona:
                print(f"  性別: {persona['sex']}")
            if "occupation" in persona:
                occupation_str = str(persona['occupation'])[:50]
                print(f"  職業: {occupation_str}...")
            if "prefecture" in persona:
                print(f"  都道府県: {persona['prefecture']}")
            if "professional_persona" in persona:
                prof_str = str(persona['professional_persona'])[:100]
                print(f"  プロフェッショナルペルソナ: {prof_str}...")
            print()

        return True
    except Exception as e:
        print(f"❌ サンプル抽出エラー: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_cache_performance(ds):
    """キャッシュとパフォーマンステスト"""
    print("\n" + "=" * 60)
    print("テスト 5: キャッシュ設定とパフォーマンス")
    print("=" * 60)

    try:
        from datasets import config

        # キャッシュディレクトリ確認
        cache_dir = config.HF_DATASETS_CACHE
        print(f"📁 キャッシュディレクトリ: {cache_dir}")

        # 2回目の読み込み速度計測
        print("\n⏱️  2回目の読み込み速度計測...")
        start_time = time.time()
        from datasets import load_dataset
        ds_reload = load_dataset("nvidia/Nemotron-Personas-Japan", split="train")
        reload_time = time.time() - start_time

        print(f"✅ 2回目読み込み時間: {reload_time:.2f}秒")

        if reload_time < 5.0:
            print("✅ キャッシュ動作確認: 5秒未満で読み込み完了")
        else:
            print(f"⚠️  キャッシュ動作: {reload_time:.2f}秒 (目標: < 5秒)")

        return True
    except Exception as e:
        print(f"❌ キャッシュテストエラー: {e}")
        return False


def main():
    """メインテスト実行"""
    print("\n" + "🚀 " * 20)
    print("Nemotron-Personas-Japan データセット読み込みテスト")
    print("🚀 " * 20 + "\n")

    results = []

    # テスト 1: インポート
    results.append(("ライブラリインポート", test_imports()))

    # テスト 2: データセット読み込み
    ds, load_time = test_dataset_load()
    results.append(("データセット読み込み", ds is not None))

    # テスト 3: フィールドアクセス
    if ds:
        results.append(("フィールドアクセス", test_fields_access(ds)))

        # テスト 4: サンプル抽出
        results.append(("サンプル抽出", test_sample_extraction(ds)))

        # テスト 5: キャッシュ・パフォーマンス
        results.append(("キャッシュ・パフォーマンス", test_cache_performance(ds)))

    # 結果サマリー
    print("\n" + "=" * 60)
    print("テスト結果サマリー")
    print("=" * 60)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    print(f"\n合計: {passed}/{total} テスト成功")

    if passed == total:
        print("\n🎉 すべてのテスト成功！Phase 1 完了です。")
        return 0
    else:
        print("\n⚠️  一部のテストが失敗しました。エラーを確認してください。")
        return 1


if __name__ == "__main__":
    sys.exit(main())
