# UnsonOS 技術スタック

## 概要

UnsonOSは、100個のマイクロSaaSを高速に開発・運営するため、最新かつ高性能な技術スタックを採用しています。すべての技術選定は「開発速度」「パフォーマンス」「AI親和性」を重視して行われています。

## 🔥 最重要決定事項

**データベース: Convex を採用**
- リアルタイムデータベース
- 卓越したDeveloper Experience
- AIによるコード生成と高い親和性

## 技術スタック一覧

### 共通基盤 (Common Foundation)

| レイヤー | 技術 | 選定理由 |
|---------|------|----------|
| **言語** | **TypeScript (TS 5/7)** | • フロント/バック共通でスキーマ共有<br>• 型安全でAIコード生成と相性抜群<br>• tsgo(TS7)で最大10×高速化 |
| **ランタイム** | **Bun** | • Node.jsの約3倍速度<br>• ネイティブTypeScript実行 |
| **バージョン管理** | **Proto** | • Rust製で最速<br>• 多言語対応 |
| **モノレポ** | **Moon** | • 超高速ビルド<br>• インテリジェントキャッシュ |
| **ビルドツール** | **Rolldown / Biome** (Rust) | • ネイティブ実装で圧倒的パフォーマンス |
| **データベース** | **Convex** | • リアルタイムDB<br>• 卓越したDX<br>• AI生成コードと好相性 |

### Web開発

| レイヤー | 技術 | 選定理由 |
|---------|------|----------|
| **静的サイト** | **Astro** | • 最高速パフォーマンス & SEO<br>• Partial Hydration (React Islands) |
| **SPA/アプリ** | **TanStack Starter** | • Vite + File-based Routing<br>• 高速DX、完全型チェック |
| **状態管理** | **XState Store** | • シンプル・強力<br>• FSM拡張容易 |
| **スタイリング** | **Tailwind + Lightning CSS** | • 高速プロトタイピング<br>• 最適化 |
| **UIキット** | **shadcn/ui**, **tweakcn**, **21st.dev** | • 基本〜高度UIまでカバー |
| **認証** | **BetterAuth / Clerk / WorkOS** | • 自前〜エンタープライズまで選択可 |
| **決済** | **RevenueCat + Stripe** | • サブスク最適化<br>• 分析内蔵 |
| **ホスティング** | **Vercel（初期）→ Cloudflare（成長後）** | • 開発速度重視 → コスト最適化<br>• 段階的移行戦略 |

### ネイティブアプリ開発

| レイヤー | 技術 | 選定理由 |
|---------|------|----------|
| **フレームワーク** | **Expo** | • OTA更新<br>• クロスプラットフォーム<br>• 最速開発 |
| **スタイリング** | **NativeWind** | • Tailwind準拠でWebと統一DX |
| **UIキット** | React Native Reusables / Gluestack / Legend List | • 再利用性<br>• 高速リスト |
| **状態管理** | **Legend State + MMKV** | • 最速・永続・リアクティブ |

**なぜExpo？**
- RevenueCat SDK対応
- 即ストア申請可能
- Web知識で開発可能

### テスト・デプロイ・運用

| レイヤー | 技術 | 用途 |
|---------|------|------|
| **ユニットテスト** | **Vitest / Bun test** | 単体テスト |
| **E2E Web** | **Playwright** | Webアプリのエンドツーエンドテスト |
| **E2E Native** | **Maestro** | ネイティブアプリのE2Eテスト |
| **負荷テスト** | **k6** | パフォーマンステスト |
| **IaC** | **Alchemy (Pure TS)** | TypeScriptによるインフラ管理 |
| **ホスティング** | **Vercel（初期）→ Cloudflare（成長後）** | 初期は開発速度、成長後はスケール性重視 |
| **監視** | **Sentry** (エラー)<br>**BetterStack** (ログ)<br>**Statsig** (アナリティクス) | 包括的な監視体制 |

⚠️ **重要**: RevenueCat統合を忘れずに！

## 技術選定の原則

### 1. 開発速度優先
- TypeScript統一による学習コスト削減
- AIコード生成との親和性
- 優れたDeveloper Experience

### 2. パフォーマンス重視
- Rust製ツールの積極採用
- Edge Computingの活用
- ネイティブ実装の優先

### 3. スケーラビリティ
- 100個のSaaSを効率的に管理
- 自動スケーリング対応
- モノレポによる統一管理

## 導入ロードマップ

1. **Phase 1**: 基盤構築（2025年Q1）
   - Convexセットアップ
   - Moonによるモノレポ構築
   - 基本的なCI/CD

2. **Phase 2**: MVP開発（2025年Q2）
   - Astro/TanStack Starterでの初期実装
   - RevenueCat統合
   - 基本的な監視体制

3. **Phase 3**: スケール対応（2025年Q3-）
   - 負荷テストと最適化
   - 本格的な自動化
   - AI統合の深化

## 🚀 テンプレート・スターターキット

### Web開発テンプレート
- **[UnsonOS Web Template](https://github.com/Unson-LLC/unson-os-web-template)**
  - 上記スタックを統合したWeb開発用テンプレート
  - すぐに開発を始められる設定済み環境
  - ベストプラクティスを組み込み済み

## 参考リンク

- [Convex Documentation](https://docs.convex.dev/)
- [Bun Documentation](https://bun.sh/)
- [Moon Documentation](https://moonrepo.dev/)
- [Astro Documentation](https://astro.build/)
- [TanStack Start](https://tanstack.com/start)
- [Expo Documentation](https://docs.expo.dev/)