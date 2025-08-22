# Templates Directory

マイクロSaaSランディングページの高速生成用テンプレート集です。

## テンプレート種類

### saas-basic/
基本的なSaaSサービス向けテンプレート
- シンプルなヒーロー・機能・価格設定
- BtoB・BtoC両対応

### ai-service/
AIサービス特化テンプレート  
- AI機能の説明に最適化
- デモ・試用機能組み込み

### diagnostic-tool/
診断ツール・アセスメント向け
- インタラクティブ要素重視
- リード獲得最適化

### consulting/
コンサルティング・サービス向け
- 信頼性・専門性訴求
- 相談フォーム・カレンダー連携

## 使用方法

```bash
# LP生成システム経由
cd apps/lp-generator
npm run generate --template=ai-service --service=new-service

# 手動コピー
cp -r templates/ai-service/ services/new-service/landing/
```

## テンプレート共通要素

- レスポンシブデザイン
- SEO最適化
- アナリティクス設定
- フォーム・CTA最適化
- Unson OSブランディング統一