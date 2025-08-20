# LP自動生成テンプレートガイド

## 🚀 概要

コミュニティメンバーが開発した、JSONファイルの設定だけで簡単にランディングページ（LP）を自動生成できるテンプレートです。UnsonOSのMVP検証プロセスにおいて、高速でLPを作成・テストする際に活用できます。

**リポジトリ**: [https://github.com/Unson-LLC/lp-template](https://github.com/Unson-LLC/lp-template)

## 🎯 用途

### こんな時に便利
- MVP検証の第一段階でLPを素早く作成したい
- A/Bテスト用に複数のLPバリエーションを作りたい
- アイデア検証のためのシンプルなLPが必要
- 2週間サイクルでの高速検証を実現したい

### UnsonOSでの位置づけ
このテンプレートは、UnsonOSの**サービス生成パイプライン**のPhase 1（LP作成）で活用できます：

```
Phase 0: ペルソナ観察・思い込み検知
    ↓
Phase 1: LP作成 ← 🎯 ここで活用！
    ↓
Phase 2: MVP開発
    ↓
Phase 3: 収益化
```

## 📝 使い方

### 1. リポジトリのクローン
```bash
git clone https://github.com/Unson-LLC/lp-template.git
cd lp-template
```

### 2. 依存関係のインストール
```bash
npm install
# または
yarn install
```

### 3. config.jsonの編集
`configs/config.json`ファイルを編集して、LPの内容を設定します：

```json
{
  "title": "わたしコンパス",
  "headline": "AIがあなたの本当の価値観を見つけ出す",
  "subheadline": "5分の診断で、あなたが本当に大切にしているものが分かります",
  "features": [
    {
      "title": "簡単な質問に答えるだけ",
      "description": "20個の簡単な質問に答えるだけで診断完了"
    },
    {
      "title": "AI分析で深い洞察",
      "description": "最新のAI技術があなたの回答パターンを分析"
    },
    {
      "title": "具体的なアクションプラン",
      "description": "価値観に基づいた行動指針を提案"
    }
  ],
  "cta": {
    "text": "無料で診断を始める",
    "url": "/signup"
  },
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  }
}
```

### 4. LPの生成・プレビュー
```bash
npm run dev
# または
yarn dev
```

ブラウザで `http://localhost:3000` にアクセスして、生成されたLPを確認できます。

### 5. ビルド・デプロイ
```bash
npm run build
# または
yarn build
```

## 🔧 カスタマイズ

### 設定可能な項目
- **基本情報**: タイトル、ヘッドライン、サブヘッドライン
- **機能説明**: 複数の特徴・メリットをリスト形式で
- **CTA（コール・トゥ・アクション）**: ボタンテキストとリンク先
- **カラースキーム**: プライマリカラー、セカンダリカラー等
- **画像**: ヒーローイメージ、アイコン等（オプション）

### 高度なカスタマイズ
テンプレート自体をフォークして、独自のコンポーネントやスタイルを追加することも可能です。

## 📊 UnsonOSでの活用例

### ペルソナ別LP作成
```json
// 例：フリーランスデザイナー向け
{
  "title": "デザイナー向け契約書AIレビュー",
  "headline": "もう契約書で悩まない",
  "subheadline": "デザイナー特有の契約リスクをAIが瞬時にチェック"
  // ...
}
```

### A/Bテスト用バリエーション
同じサービスで異なるメッセージングのLPを複数作成：
- `configs/config-a.json` - 恐怖訴求型
- `configs/config-b.json` - ベネフィット訴求型
- `configs/config-c.json` - 社会的証明重視型

## 🤝 貢献方法

このテンプレートの改善に貢献したい場合：

1. [lp-templateリポジトリ](https://github.com/Unson-LLC/lp-template)にIssueを作成
2. Pull Requestを送信
3. [Discord](https://discord.gg/ubDYjDVC)の#dev-toolsチャンネルで議論

## 📚 関連ドキュメント

- [MVP検証フレームワーク](/docs/business-strategy/mvp-validation-framework.md)
- [サービス生成パイプライン](/docs/for-operators/service-generation/service-generation-pipeline.md)
- [ペルソナ観察ガイド](/docs/for-operators/persona-observation/)

## ⚡ Tips

- **高速イテレーション**: config.jsonを変更するだけで即座にLPが更新されるので、リアルタイムでチームとレビューしながら調整可能
- **バージョン管理**: 各LPのconfig.jsonをGitで管理することで、どのメッセージングが効果的だったか追跡可能
- **自動デプロイ**: Vercelと連携すれば、GitHubにpushするだけで自動デプロイ可能

---

*このテンプレートはコミュニティメンバーによって開発・メンテナンスされています。感謝！* 🙏