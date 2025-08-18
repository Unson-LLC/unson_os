# Shared Directory

全マイクロSaaSランディングページで共有するリソースを管理するディレクトリです。

## 構造

```
shared/
├── components/              # 共通LPコンポーネント
├── styles/                  # 共通スタイル・テーマ
├── assets/                  # Unsonブランド共通素材
└── configs/                 # LP共通設定
```

## components/
再利用可能なReactコンポーネント
- ヒーローセクション
- 機能紹介カード
- 価格表示
- フォーム要素
- フッター・ヘッダー

## styles/
ブランド統一スタイル
- カラーパレット
- タイポグラフィ
- スペーシング
- アニメーション

## assets/
Unsonブランド共通素材
- ロゴ・アイコン
- ブランドイメージ
- 背景素材
- IllustrationsGPT生成画像

## configs/
LP共通設定
- SEO設定テンプレート
- アナリティクス設定
- メタデータ
- サイトマップ

## 使用方法

```typescript
// 共通コンポーネント使用例
import { HeroSection, FeatureCard } from '@/shared/components';
import { colors, typography } from '@/shared/styles';

// 各サービスLPで活用
export default function ServiceLanding() {
  return (
    <HeroSection 
      title="サービス名"
      theme={colors.ai} 
    />
  );
}
```