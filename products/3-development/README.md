# Development フェーズ（フェーズ2: MVP開発中）

このディレクトリには、LP検証を通過してMVP開発段階に入ったプロダクトを配置します。

## 該当条件
- LP検証でCVR 10%以上達成
- 1,000セッション以上のデータ取得済み
- MVP構築中（課金システム実装含む）
- ベータテスト実施中

## フォルダ構造
```
development/
└── YYYY-MM-NNN-{product-name}/
    ├── product.yaml         # プロダクト基本情報
    ├── lp/                 # LP実装（validationから移動）
    ├── mvp/                # MVP実装コード
    └── phases/             # フェーズ履歴
        ├── 01_LP_Validation/  # 完了済み
        └── 02_MVP_Development/ # 進行中
```

## フェーズ移行条件
Development → Active への移行条件：
- 週次利用者200人以上
- 7日後残存率30%以上
- 転換率7%以上
- 基本機能動作確認完了