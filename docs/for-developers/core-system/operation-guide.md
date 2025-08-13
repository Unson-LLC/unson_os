# データ駆動コアシステム運用ガイド

## 概要

本ガイドは、UnsonOSデータ駆動コアシステムの日常運用、トラブルシューティング、メンテナンス手順を説明します。

## 運用体制

### チーム構成と責任範囲

| ロール | 責任範囲 | 必要権限 |
|--------|---------|----------|
| **Platform Engineer** | インフラ管理、システム監視 | Admin |
| **Growth Lead** | プレイブック承認、KPI管理 | Approver |
| **Product Manager** | プレイブック作成、実験設計 | Editor |
| **Data Analyst** | 結果分析、CaseBook管理 | Analyst |
| **SRE** | 障害対応、パフォーマンス最適化 | Admin |

### 勤務体制

- **通常運用**: 平日 9:00-18:00 JST
- **高リスク変更**: 平日 10:00-16:00 JST のみ
- **緊急対応**: 24/7 オンコール体制

## 日常運用

### 朝のチェックリスト（9:00）

```bash
# 1. システムヘルスチェック
unson-cli health check --all

# 2. 夜間バッチ結果確認
unson-cli batch status --date yesterday

# 3. アラート確認
unson-cli alerts list --unresolved

# 4. 実験ステータス確認
unson-cli experiments status --active

# 5. リソース使用率確認
unson-cli resources usage --threshold 80
```

### プレイブックデプロイ手順

#### 1. 事前検証

```bash
# スキーマ検証
playbook validate new-playbook.yaml

# ドライラン（シミュレーション）
playbook simulate new-playbook.yaml \
  --events historical-events.json \
  --duration 7d

# 影響分析
playbook analyze new-playbook.yaml \
  --segments all \
  --estimate-exposure
```

#### 2. ステージング展開

```bash
# ステージング環境へデプロイ
playbook deploy new-playbook.yaml \
  --env staging \
  --canary 5

# モニタリング（1時間）
watch -n 60 playbook monitor PLB^new_playbook \
  --env staging \
  --metrics cvr,a1,ret7
```

#### 3. 本番展開

```bash
# Canary展開開始
playbook deploy new-playbook.yaml \
  --env production \
  --strategy canary \
  --steps 5,15,30,50,100 \
  --interval 2h

# 承認待ち（高リスクの場合）
playbook approve PLB^new_playbook \
  --approver growth-lead
```

### 実験モニタリング

#### リアルタイムダッシュボード

```bash
# ダッシュボード起動
unson-cli dashboard start \
  --port 3000 \
  --refresh 30s

# 特定実験の詳細
unson-cli experiment watch EXP^hero_copy_test \
  --metrics all \
  --segments JP-Web-SMB
```

#### 異常検知設定

```yaml
# monitoring-rules.yaml
rules:
  - name: cvr_drop_detection
    condition: |
      metric: CVR
      threshold: -20%
      window: 1h
      segments: all
    action:
      - alert: slack
      - rollback: auto
      
  - name: traffic_spike
    condition: |
      metric: impressions
      threshold: +300%
      window: 10m
    action:
      - alert: pagerduty
      - throttle: 50%
```

## トラブルシューティング

### よくある問題と対処法

#### 1. 配信量が急減した

```bash
# 診断コマンド
unson-cli diagnose low-traffic \
  --product saas_watashi_compass \
  --window 1h

# 一般的な原因と対処
1. Guard条件の誤判定
   → playbook inspect PLB^current --guards
   
2. Rollout設定が小さすぎる
   → playbook adjust-exposure PLB^current --increase 10
   
3. システムエラー
   → unson-cli logs error --component resolver --tail 100
```

#### 2. KPIが急落した

```bash
# 緊急ロールバック
playbook rollback PLB^problematic \
  --immediate \
  --reason "CVR dropped 30%"

# 原因調査
unson-cli investigate kpi-drop \
  --metric CVR \
  --start "2h ago" \
  --correlate all
```

#### 3. Resolver応答が遅い

```bash
# パフォーマンス分析
unson-cli perf analyze resolver \
  --duration 1h \
  --percentile 95

# キャッシュ状態確認
unson-cli cache stats \
  --component resolver

# 手動キャッシュクリア（慎重に）
unson-cli cache clear \
  --component resolver \
  --confirm
```

### エラーコード一覧

| コード | 説明 | 対処法 |
|--------|------|--------|
| ERR_001 | Playbook構文エラー | YAML構文を確認 |
| ERR_002 | Guard評価失敗 | メトリクスデータを確認 |
| ERR_003 | Rollout上限超過 | exposure設定を調整 |
| ERR_004 | Gate承認タイムアウト | 承認者に連絡 |
| ERR_005 | CaseBook書き込み失敗 | ストレージ容量確認 |

## メンテナンス

### 定期メンテナンス（週次）

```bash
# 毎週月曜 3:00 AM JST
0 3 * * 1 /usr/local/bin/unson-maintenance weekly
```

#### タスク内容
1. **ログローテーション**
2. **古いケースのアーカイブ**
3. **インデックス最適化**
4. **キャッシュ整理**
5. **バックアップ検証**

### データベースメンテナンス

```sql
-- 統計情報更新
ANALYZE casebook;
ANALYZE events;
ANALYZE assignments;

-- インデックス再構築
REINDEX INDEX idx_case_quality;
REINDEX INDEX idx_events_timestamp;

-- 不要データの削除
DELETE FROM events 
WHERE created_at < NOW() - INTERVAL '90 days'
AND archived = true;
```

### ベクトルDBメンテナンス

```python
# Qdrantコレクション最適化
from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")

# コレクション最適化
client.update_collection(
    collection_name="casebook",
    optimizer_config={
        "indexing_threshold": 20000,
        "memmap_threshold": 50000
    }
)

# ガベージコレクション
client.vacuum(collection_name="casebook")
```

## バックアップとリカバリ

### バックアップ戦略

| データ種別 | 頻度 | 保持期間 | 保存先 |
|-----------|------|----------|--------|
| Playbooks | リアルタイム | 無期限 | Git |
| CaseBook | 日次 | 90日 | S3 |
| Events | 時間毎 | 30日 | S3 Glacier |
| Vectors | 週次 | 30日 | S3 |

### バックアップ実行

```bash
# 手動フルバックアップ
unson-cli backup create \
  --type full \
  --components all \
  --destination s3://unsonos-backup/$(date +%Y%m%d)

# 差分バックアップ（自動）
0 */6 * * * unson-cli backup create --type incremental
```

### リストア手順

```bash
# 1. システム停止
unson-cli system stop --graceful

# 2. バックアップからリストア
unson-cli restore \
  --backup-id BKP_20250113_full \
  --components casebook,events \
  --verify

# 3. 整合性チェック
unson-cli integrity check --deep

# 4. システム再開
unson-cli system start --safe-mode
```

## 監視とアラート

### 主要メトリクス

```yaml
# metrics.yaml
slo:
  - name: api_latency
    target: 95
    threshold: 2000ms
    
  - name: decision_accuracy
    target: 95
    threshold: 0.95
    
  - name: rollback_time
    target: 99
    threshold: 5m
```

### アラート設定

```yaml
# alerts.yaml
alerts:
  - name: high_error_rate
    query: rate(errors[5m]) > 0.01
    severity: critical
    channels: [pagerduty, slack]
    
  - name: low_cache_hit
    query: cache_hit_rate < 0.8
    severity: warning
    channels: [slack]
```

### ダッシュボード

1. **システムヘルス**: CPU、メモリ、ディスク、ネットワーク
2. **ビジネスKPI**: CVR、A1、RET7、ARPU
3. **実験状況**: アクティブ実験、露出率、結果
4. **エラー率**: API、Resolver、CaseBook

## セキュリティ

### アクセス制御

```bash
# ユーザー権限確認
unson-cli auth check-permissions USER_ID

# ロール割り当て
unson-cli auth assign-role \
  --user USER_ID \
  --role growth-lead

# 監査ログ確認
unson-cli audit logs \
  --user USER_ID \
  --action playbook_deploy \
  --last 7d
```

### シークレット管理

```bash
# シークレットローテーション
unson-cli secrets rotate \
  --type api-key \
  --notify-users

# 暗号化状態確認
unson-cli encryption status \
  --component all
```

## 災害復旧（DR）

### RTO/RPO目標

- **RTO（復旧時間目標）**: 4時間
- **RPO（復旧時点目標）**: 1時間

### DR手順

1. **障害検知** (< 5分)
2. **影響評価** (< 15分)
3. **DR環境起動** (< 30分)
4. **データリストア** (< 2時間)
5. **検証** (< 30分)
6. **切り替え** (< 15分)
7. **通知** (< 5分)

## パフォーマンスチューニング

### Resolverチューニング

```yaml
# resolver-config.yaml
performance:
  cache:
    size: 10000
    ttl: 300
    strategy: lru
    
  connection_pool:
    min: 10
    max: 100
    timeout: 5000
    
  batch:
    size: 100
    interval: 100ms
```

### データベースチューニング

```sql
-- PostgreSQL設定
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET max_connections = 200;
```

## コスト最適化

### リソース使用状況分析

```bash
# コスト分析レポート
unson-cli cost analyze \
  --period month \
  --breakdown service

# 未使用リソース検出
unson-cli cost find-waste \
  --threshold 10
```

### 最適化施策

1. **Auto-scaling設定の調整**
2. **不要なログの削減**
3. **古いバックアップの削除**
4. **Reserved Instanceの活用**

## チェックリスト

### デプロイ前チェックリスト

- [ ] スキーマ検証完了
- [ ] ドライラン成功
- [ ] 影響分析レビュー済み
- [ ] ステージングテスト完了
- [ ] ロールバック計画準備
- [ ] 関係者への通知完了
- [ ] 監視アラート設定

### 障害対応チェックリスト

- [ ] 影響範囲の特定
- [ ] 緊急度の判定
- [ ] ステークホルダーへの連絡
- [ ] 一時対処の実施
- [ ] 根本原因の調査
- [ ] 恒久対処の計画
- [ ] ポストモーテムの実施

## 関連ドキュメント

- [データ駆動コアシステム](./data-driven-core.md)
- [プレイブックDSL仕様](./playbook-dsl-spec.md)
- [トラブルシューティングガイド](./troubleshooting.md)
- [SREハンドブック](../sre/handbook.md)