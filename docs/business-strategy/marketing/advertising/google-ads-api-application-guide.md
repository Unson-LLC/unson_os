# Google Ads API 基本/標準アクセス申請ガイド

## 📋 申請フォーム記入のポイント

### 🎯 承認されやすくするための基本方針
1. **シンプルに**: 複雑な機能説明は避ける
2. **読み取り専用を強調**: 作成・変更機能は含めない
3. **内部利用のみ**: 外部ユーザーへの提供は避ける
4. **英語で記入**: すべて英語で記入する

### 📝 申請フォーム回答例

#### 3. Contact email
```
info@unson.jp
```
※会社ドメインのメールアドレスを使用

#### 5. Company website
```
https://unson.jp
```

#### 6. Business model and Google Ads usage
```
Unson LLC develops and operates multiple SaaS products. We use Google Ads to promote our own products and services.

How we use Google Ads:
- Managing search ad campaigns for our SaaS products
- Monitoring campaign performance and optimizing keywords
- Analyzing cost-per-acquisition to improve ROI
- A/B testing ad copies for better conversion rates

Primary API usage:
- Reading campaign performance data
- Analyzing keyword effectiveness
- Monitoring daily spend and conversions
- Generating performance reports for internal use
```

#### 7. Design documentation
**必須**: PDFファイルで以下を含める
- システム概要（1ページ）
- 簡単なアーキテクチャ図
- 読み取り専用であることの明記
- セキュリティ対策の説明

#### 8. Access type
**Internal users - employees only** を選択

#### 11. Campaign types
```
Search
```
※最初はSearchのみで申請

#### 12. Capabilities
選択するもの：
- ✅ Campaign Management
- ✅ Reporting

選択しないもの：
- ❌ Account Creation
- ❌ Campaign Creation
- ❌ Keyword Planning Services

### ⚠️ 重要な注意点

1. **MCCアカウントが必須**
   - 通常のGoogle Adsアカウントでは申請不可
   - 事前にMCCアカウントを作成

2. **設計書は必須**
   - PDFフォーマットで提出
   - 2-3ページで十分
   - 複雑な技術説明は不要

3. **承認までの期間**
   - 通常1-3営業日
   - 不備があると遅延する

4. **テスト環境での開発**
   - 承認待ちの間もテストアカウントで開発可能
   - 基本機能の実装を先に進める

### 🚫 避けるべきこと

- AI/ML/自動化の強調
- 外部ユーザーへのサービス提供
- 自動的な広告作成・入札調整
- 複雑な機能説明

### ✅ 強調すべきこと

- 自社製品の広告管理
- 読み取り専用の運用
- 内部使用のみ
- セキュリティ対策

---

最終更新日: 2025年1月