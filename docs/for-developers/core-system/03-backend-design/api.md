# UnsonOS コアシステム API設計書

## 概要

UnsonOSダッシュボードシステムのバックエンドAPI設計。
100-200個のマイクロSaaSプロダクトの監視・管理に最適化されたRESTful API + WebSocket。

## 設計原則

### API設計原則
- **RESTful設計**: HTTP動詞とステータスコードの適切な使用
- **DAGベースアーキテクチャ**: PKGシステムと連携したエンドポイント
- **リアルタイム対応**: WebSocketによる即座の更新通知
- **スケーラビリティ**: 100-200個のマイクロSaaS同時管理対応

### 技術スタック
- Node.js + Express.js（API Server）
- PostgreSQL（メインDB）
- Redis（Cache + Session）
- WebSocket（リアルタイム通信）
- JWT（認証）

## 1. 認証・認可API

### POST /api/auth/login
**概要**: ユーザーログイン

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "佐藤太郎",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_abc123..."
  }
}
```

### POST /api/auth/refresh
**概要**: トークン更新

**Request:**
```json
{
  "refreshToken": "rt_abc123..."
}
```

### POST /api/auth/logout
**概要**: ログアウト

**Headers:**
```
Authorization: Bearer {token}
```

## 2. SaaS管理API

### GET /api/saas
**概要**: SaaSプロダクト一覧取得

**Query Parameters:**
- `lifecycle`: ライフサイクルフィルター (LAUNCH|GROWTH|STABLE|CRISIS)
- `pkgStatus`: PKG実行ステータス (running|pending|completed|failed)
- `priority`: 優先度フィルター (critical|high|medium|low)
- `page`: ページ番号 (default: 1)
- `limit`: 取得件数 (default: 50, max: 100)
- `sort`: ソート (name|lifecycle|mrr|last_pkg_execution|updated_at)
- `order`: ソート順 (asc|desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "saas": [
      {
        "id": "saas-123",
        "name": "猫カフェ予約システム",
        "lifecycle": "GROWTH",
        "pkgStatus": "running",
        "currentPKG": "GROWTH_VIRAL_SCALE",
        "kpis": {
          "mrr": 45000,
          "dau": 120,
          "retention_day7": 0.35,
          "nps": 8.2
        },
        "alerts": {
          "critical": 0,
          "warning": 1,
          "info": 3
        },
        "dagProcessing": {
          "layer1Complete": true,
          "layer2Result": "SCALE_READY",
          "layer3Status": "executing"
        },
        "pkgHistory": [
          {
            "pkgId": "LAUNCH_LOWPMF_IMPROVE",
            "executedAt": "2025-01-10T10:00:00Z",
            "result": "success"
          }
        ],
        "lastUpdated": "2025-01-15T10:30:00Z",
        "createdAt": "2024-12-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 87,
      "page": 1,
      "limit": 50,
      "totalPages": 2
    },
    "summary": {
      "totalCount": 87,
      "lifecycleDistribution": {
        "LAUNCH": 35,
        "GROWTH": 31,
        "STABLE": 18,
        "CRISIS": 3
      },
      "pkgDistribution": {
        "running": 12,
        "pending": 5,
        "completed": 68,
        "failed": 2
      },
      "priorityDistribution": {
        "critical": 5,
        "high": 18,
        "medium": 42,
        "low": 22
      }
    }
  }
}
```

### GET /api/saas/:id
**概要**: 特定SaaS詳細取得

**Response:**
```json
{
  "success": true,
  "data": {
    "saas": {
      "id": "saas-123",
      "name": "猫カフェ予約システム",
      "description": "猫カフェオーナー向けの予約管理・顧客管理システム",
      "lifecycle": "GROWTH",
      "pkgStatus": "running",
      "currentPKG": {
        "id": "GROWTH_VIRAL_SCALE",
        "name": "Growth Viral Scale Package",
        "startedAt": "2025-01-15T10:00:00Z",
        "progress": 0.65,
        "estimatedCompletion": "2025-01-15T12:30:00Z"
      },
      "kpis": {
        "mrr": 45000,
        "dau": 120,
        "retention_day7": 0.35,
        "nps": 8.2,
        "cac": 2800,
        "ltv": 18000,
        "ltv_cac_ratio": 6.4
      },
      "lifecycleHistory": [
        {
          "lifecycle": "LAUNCH",
          "startedAt": "2024-11-01T00:00:00Z",
          "completedAt": "2024-12-01T00:00:00Z",
          "duration": 30,
          "pkgsExecuted": ["LAUNCH_MARKET_RESEARCH", "LAUNCH_MVP_BUILD"]
        },
        {
          "lifecycle": "GROWTH",
          "startedAt": "2024-12-01T00:00:00Z",
          "completedAt": null,
          "duration": 45,
          "pkgsExecuted": ["GROWTH_USER_ACQUISITION", "GROWTH_VIRAL_SCALE"]
        }
      ],
      "dagStatus": {
        "layer1Symbols": {
          "B_MRR": 0.45,
          "U_DAU_MAU": 0.62,
          "M_TREND": 0.78,
          "lastUpdated": "2025-01-15T10:30:00Z"
        },
        "layer2Functions": {
          "L2_PMF_CHECK": true,
          "L2_SCALE_READY": true,
          "L2_PIVOT_DECISION": false,
          "lastEvaluated": "2025-01-15T10:30:00Z"
        },
        "layer3Selection": {
          "selectedPKG": "GROWTH_VIRAL_SCALE",
          "confidence": 0.89,
          "alternatives": ["GROWTH_ORGANIC_SCALE"]
        }
      },
      "pkgRequirements": {
        "current": [
          {
            "id": "growth_ltv_cac",
            "title": "LTV/CAC 3倍以上",
            "status": "met",
            "target": 3.0,
            "actual": 4.2
          },
          {
            "id": "growth_retention",
            "title": "7日後継続率 50%以上",
            "status": "met", 
            "target": 0.5,
            "actual": 0.58
          },
          {
            "id": "growth_uptime",
            "title": "アップタイム 99%以上",
            "status": "met",
            "target": 0.99,
            "actual": 0.998
          }
        ]
      },
      "alerts": [
        {
          "id": "alert-456",
          "severity": "warning",
          "title": "Layer2判定アラート",
          "message": "L2_SCALE_READY関数が不安定な結果を返しています",
          "createdAt": "2025-01-14T15:30:00Z"
        }
      ]
    }
  }
}
```

### POST /api/saas
**概要**: 新規SaaS作成

**Request:**
```json
{
  "name": "ペットシッター予約アプリ",
  "description": "ペットオーナーとシッターをマッチングするサービス",
  "targetMarket": "都市部のペットオーナー",
  "businessModel": "マッチング手数料（15%）",
  "initialLifecycle": "LAUNCH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "saas": {
      "id": "saas-124",
      "name": "ペットシッター予約アプリ",
      "lifecycle": "LAUNCH",
      "pkgStatus": "pending",
      "initialPKG": "LAUNCH_MARKET_RESEARCH",
      "createdAt": "2025-01-15T12:00:00Z"
    }
  }
}
```

### PUT /api/saas/:id
**概要**: SaaS情報更新

**Request:**
```json
{
  "name": "猫カフェ予約システム Pro",
  "description": "更新された説明",
  "lifecycle": "STABLE"
}
```

### DELETE /api/saas/:id
**概要**: SaaS削除（LIFECYCLE_END_CLEANUP PKG実行）

**Response:**
```json
{
  "success": true,
  "message": "SaaSプロダクトを削除しました"
}
```

## 3. KPI・メトリクスAPI

### GET /api/saas/:id/kpis
**概要**: 特定SaaSのKPI取得

**Query Parameters:**
- `period`: 期間 (day|week|month|quarter|year)
- `from`: 開始日 (YYYY-MM-DD)
- `to`: 終了日 (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "current": {
      "mrr": 45000,
      "dau": 120,
      "retention_day7": 0.35,
      "nps": 8.2,
      "cac": 2800,
      "ltv": 18000
    },
    "previous": {
      "mrr": 38000,
      "dau": 98,
      "retention_day7": 0.32,
      "nps": 7.8,
      "cac": 3200,
      "ltv": 16500
    },
    "trend": {
      "mrr": 18.4,
      "dau": 22.4,
      "retention_day7": 9.4,
      "nps": 5.1,
      "cac": -12.5,
      "ltv": 9.1
    },
    "timeSeries": [
      {
        "date": "2025-01-01",
        "mrr": 38000,
        "dau": 98
      },
      {
        "date": "2025-01-15", 
        "mrr": 45000,
        "dau": 120
      }
    ]
  }
}
```

### GET /api/kpis/aggregate
**概要**: 全SaaS集計KPI取得

**Query Parameters:**
- `phase`: フェーズフィルター
- `period`: 期間

**Response:**
```json
{
  "success": true,
  "data": {
    "total": {
      "saasCount": 87,
      "totalMrr": 2340000,
      "averageMrr": 26897,
      "totalDau": 12400
    },
    "byPhase": {
      "research": {
        "count": 12,
        "averageCompletionTime": 18
      },
      "lp": {
        "count": 23,
        "averageCvr": 0.084,
        "totalSpend": 340000
      },
      "mvp": {
        "count": 31,
        "averageRetention": 0.28,
        "averageNps": 7.2
      },
      "monetization": {
        "count": 18,
        "totalMrr": 890000,
        "averageLtvCac": 4.2
      },
      "scale": {
        "count": 3,
        "totalMrr": 1450000,
        "averageGrowthRate": 0.35
      }
    }
  }
}
```

## 4. フェーズ管理API

### POST /api/saas/:id/phase/advance
**概要**: フェーズ進行（Gate承認）

**Request:**
```json
{
  "toPhase": "monetization",
  "gateApproval": {
    "checklist": {
      "mvp_retention": true,
      "mvp_nps": true,
      "mvp_feedback": true
    },
    "reasoning": "すべてのKPI目標を達成し、ユーザーフィードバックも良好なため次フェーズに進行",
    "approvedBy": "admin-user-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "saas": {
      "id": "saas-123",
      "phase": "monetization",
      "phaseChangedAt": "2025-01-15T14:30:00Z"
    },
    "gateRecord": {
      "id": "gate-789",
      "fromPhase": "mvp",
      "toPhase": "monetization",
      "approvedAt": "2025-01-15T14:30:00Z",
      "approvedBy": "admin-user-123"
    }
  }
}
```

### POST /api/saas/:id/phase/kill
**概要**: Kill判定（プロダクト終了）

**Request:**
```json
{
  "reason": "市場需要が想定より低く、3ヶ月間のMVPテストで改善が見られないため",
  "killedBy": "admin-user-123"
}
```

## 5. DAGステータス・実行API

### GET /api/saas/:id/dag/status
**概要**: 特定SaaSのDAG処理状況取得

**Response:**
```json
{
  "success": true,
  "data": {
    "saasId": "saas-123",
    "saasName": "猫カフェ予約システム",
    "dagStatus": {
      "lastExecuted": "2025-01-15T10:30:00Z",
      "nextScheduled": "2025-01-15T12:00:00Z",
      "executionId": "dag-exec-456789",
      "currentCycle": "24h",
      "status": "running"
    },
    "layer1": {
      "symbolCount": 148,
      "lastUpdated": "2025-01-15T10:30:00Z",
      "symbols": {
        "B_MRR": {
          "value": 0.45,
          "normalized": true,
          "source": "stripe.monthly_recurring_revenue",
          "timestamp": "2025-01-15T10:30:00Z"
        },
        "U_DAU_MAU": {
          "value": 0.62,
          "normalized": true,
          "source": "analytics.engagement_ratio",
          "timestamp": "2025-01-15T10:30:00Z"
        },
        "M_TREND": {
          "value": 0.78,
          "normalized": true,
          "source": "google_trends.search_volume",
          "timestamp": "2025-01-15T10:29:45Z"
        }
      },
      "errors": []
    },
    "layer2": {
      "functionsEvaluated": 12,
      "lastEvaluated": "2025-01-15T10:30:00Z",
      "results": {
        "L2_PMF_CHECK": {
          "result": true,
          "confidence": 0.89,
          "inputs": ["U_RETENTION_D7", "B_GROWTH", "U_DAU_MAU"],
          "inputValues": [0.58, 0.23, 0.62],
          "executionTime": 45
        },
        "L2_SCALE_READY": {
          "result": true,
          "confidence": 0.94,
          "inputs": ["B_LTV_CAC", "B_GROWTH", "T_UPTIME"],
          "inputValues": [0.84, 0.23, 0.998],
          "executionTime": 32
        },
        "L2_PIVOT_DECISION": {
          "result": false,
          "confidence": 0.76,
          "inputs": ["B_MRR", "U_RETENTION_D7", "M_TREND"],
          "inputValues": [0.45, 0.58, 0.78],
          "executionTime": 28
        }
      },
      "errors": []
    },
    "layer3": {
      "selectedPKG": "GROWTH_VIRAL_SCALE",
      "selectionConfidence": 0.91,
      "alternatives": [
        {
          "pkgId": "GROWTH_ORGANIC_SCALE",
          "confidence": 0.73,
          "reason": "Lower viral coefficient"
        }
      ],
      "executionQueue": [
        {
          "pkgId": "GROWTH_VIRAL_SCALE",
          "priority": "medium",
          "queuePosition": 3,
          "estimatedStart": "2025-01-15T11:15:00Z"
        }
      ],
      "lastExecution": {
        "pkgId": "GROWTH_USER_ACQUISITION",
        "startedAt": "2025-01-15T08:00:00Z",
        "completedAt": "2025-01-15T08:45:00Z",
        "result": "success",
        "details": {
          "stepsExecuted": 8,
          "stepsSucceeded": 8,
          "stepsSkipped": 0,
          "stepsFailled": 0
        }
      }
    },
    "emergencyTriggers": {
      "active": [],
      "recent": [
        {
          "triggerId": "emrg-789",
          "metric": "T_UPTIME",
          "threshold": 0.90,
          "actualValue": 0.89,
          "triggeredAt": "2025-01-14T22:30:00Z",
          "resolvedAt": "2025-01-14T22:45:00Z",
          "pkgExecuted": "CRISIS_UPTIME_RECOVERY"
        }
      ]
    }
  }
}
```

### GET /api/dag/batch/status
**概要**: バッチ処理状況取得

**Query Parameters:**
- `cycle`: サイクル種別 (2h|24h|48h)
- `status`: ステータス (running|pending|completed|failed)

**Response:**
```json
{
  "success": true,
  "data": {
    "currentBatch": {
      "batchId": "batch-20250115-103000",
      "cycle": "24h",
      "status": "running",
      "startedAt": "2025-01-15T10:30:00Z",
      "progress": {
        "totalSaaS": 87,
        "processedSaaS": 45,
        "percentage": 51.7
      },
      "currentBatches": [
        {
          "batchNumber": 3,
          "saasIds": ["saas-041", "saas-042", "saas-043", "..."],
          "status": "running",
          "startedAt": "2025-01-15T10:35:00Z"
        }
      ],
      "estimatedCompletion": "2025-01-15T11:15:00Z"
    },
    "queuedBatches": [
      {
        "batchId": "batch-20250115-120000",
        "cycle": "2h",
        "saasCount": 12,
        "priority": "critical",
        "scheduledFor": "2025-01-15T12:00:00Z"
      }
    ],
    "recentCompleted": [
      {
        "batchId": "batch-20250115-080000",
        "cycle": "24h",
        "completedAt": "2025-01-15T09:15:00Z",
        "duration": "00:45:00",
        "saasProcessed": 87,
        "pkgsExecuted": 23,
        "successRate": 0.96
      }
    ]
  }
}
```

### POST /api/dag/emergency/trigger
**概要**: 緊急DAG実行トリガー

**Request:**
```json
{
  "saasId": "saas-123",
  "reason": "manual_intervention",
  "metric": "B_MRR",
  "currentValue": 0.02,
  "expectedPKGs": ["CRISIS_MRR_RECOVERY"],
  "skipQueue": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "emergencyExecution": {
      "executionId": "emrg-exec-789",
      "saasId": "saas-123",
      "triggeredAt": "2025-01-15T10:45:00Z",
      "estimatedCompletion": "2025-01-15T11:30:00Z",
      "selectedPKG": "CRISIS_MRR_RECOVERY",
      "priority": "critical",
      "status": "queued"
    }
  }
}
```

## 6. アラート・通知API

### GET /api/alerts
**概要**: アラート一覧取得

**Query Parameters:**
- `severity`: 重要度フィルター (critical|warning|info)
- `saasId`: 特定SaaSのアラート
- `isRead`: 既読フィルター (true|false)
- `limit`: 取得件数

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert-456",
        "saasId": "saas-123",
        "saasName": "猫カフェ予約システム",
        "severity": "warning",
        "title": "DAU減少傾向",
        "message": "過去7日間でDAUが15%減少しています",
        "isRead": false,
        "createdAt": "2025-01-14T15:30:00Z",
        "data": {
          "metric": "dau",
          "currentValue": 120,
          "previousValue": 142,
          "changePercent": -15.5
        }
      }
    ],
    "summary": {
      "total": 23,
      "unread": 12,
      "bySeverity": {
        "critical": 2,
        "warning": 8,
        "info": 13
      }
    }
  }
}
```

### PUT /api/alerts/:id/read
**概要**: アラート既読マーク

**Response:**
```json
{
  "success": true,
  "message": "アラートを既読にしました"
}
```

### POST /api/alerts/batch-read
**概要**: 複数アラート一括既読

**Request:**
```json
{
  "alertIds": ["alert-456", "alert-457", "alert-458"]
}
```

## 6. Gate承認API

### GET /api/gates/pending
**概要**: 承認待ちGate一覧

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingGates": [
      {
        "saasId": "saas-123",
        "saasName": "猫カフェ予約システム",
        "currentPhase": "mvp",
        "nextPhase": "monetization",
        "readyScore": 0.85,
        "requirements": [
          {
            "id": "mvp_retention",
            "title": "7日後継続率 30%以上",
            "status": "met",
            "score": 1.0
          },
          {
            "id": "mvp_nps", 
            "title": "NPS 7以上",
            "status": "met",
            "score": 1.0
          },
          {
            "id": "mvp_feedback",
            "title": "ユーザーフィードバック 50件以上", 
            "status": "pending",
            "score": 0.76
          }
        ]
      }
    ]
  }
}
```

### GET /api/gates/history
**概要**: Gate承認履歴

**Query Parameters:**
- `saasId`: 特定SaaSの履歴
- `limit`: 取得件数

**Response:**
```json
{
  "success": true,
  "data": {
    "gateHistory": [
      {
        "id": "gate-788",
        "saasId": "saas-123",
        "saasName": "猫カフェ予約システム",
        "fromPhase": "lp",
        "toPhase": "mvp",
        "approvedAt": "2024-12-01T10:00:00Z",
        "approvedBy": "admin-user-123",
        "reasoning": "LP CVRが目標の12%を達成、市場需要を確認",
        "duration": 16
      }
    ]
  }
}
```

## 7. AI監視・信頼度API

### GET /api/ai/trust-metrics
**概要**: AI信頼度メトリクス取得

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "trustLevel": 78,
      "recentAccuracy": 84.5,
      "failureCount": 3,
      "lastFailure": "2025-01-12T08:15:00Z"
    },
    "byComponent": {
      "marketResearch": {
        "trustLevel": 82,
        "accuracy": 87.2,
        "failureCount": 1
      },
      "lpGeneration": {
        "trustLevel": 75,
        "accuracy": 81.3,
        "failureCount": 2
      },
      "mvpDevelopment": {
        "trustLevel": 76,
        "accuracy": 85.1,
        "failureCount": 0
      }
    },
    "trends": [
      {
        "date": "2025-01-01",
        "trustLevel": 72
      },
      {
        "date": "2025-01-15",
        "trustLevel": 78
      }
    ]
  }
}
```

### POST /api/ai/feedback
**概要**: AIへのフィードバック送信

**Request:**
```json
{
  "saasId": "saas-123",
  "component": "lpGeneration",
  "action": "generated_landing_page",
  "feedback": "good",
  "details": "生成されたLPのCVRが予想より高く、デザインも優秀",
  "rating": 4
}
```

## 8. リアルタイム更新（WebSocket）

### Connection
```
ws://localhost:3001/ws/dashboard
```

### Authentication
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Message Types

#### KPI更新通知
```json
{
  "type": "kpi_update",
  "data": {
    "saasId": "saas-123",
    "metric": "dau",
    "oldValue": 120,
    "newValue": 125,
    "timestamp": "2025-01-15T15:00:00Z"
  }
}
```

#### アラート通知
```json
{
  "type": "alert",
  "data": {
    "id": "alert-460",
    "saasId": "saas-123",
    "severity": "critical",
    "title": "MRR急減",
    "message": "過去24時間でMRRが30%減少しました"
  }
}
```

#### フェーズ変更通知
```json
{
  "type": "phase_change",
  "data": {
    "saasId": "saas-123",
    "saasName": "猫カフェ予約システム",
    "fromPhase": "mvp",
    "toPhase": "monetization",
    "changedAt": "2025-01-15T14:30:00Z"
  }
}
```

## 9. エラーハンドリング

### エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データに問題があります",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      }
    ]
  }
}
```

### HTTPステータスコード
- `200`: 成功
- `201`: 作成成功
- `400`: バリデーションエラー
- `401`: 認証エラー
- `403`: 認可エラー
- `404`: リソースが見つからない
- `409`: 競合エラー
- `422`: 処理できないエンティティ
- `500`: サーバーエラー

### エラーコード一覧
```typescript
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
  GATE_REQUIREMENTS_NOT_MET = 'GATE_REQUIREMENTS_NOT_MET',
  PHASE_TRANSITION_BLOCKED = 'PHASE_TRANSITION_BLOCKED',
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
```

## 10. レート制限

### 制限設定
- **認証API**: 5回/分
- **一般API**: 100回/分  
- **WebSocket**: 接続数制限のみ

### レート制限ヘッダー
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642234567
```

## 11. セキュリティ

### 認証・認可
- JWT Bearer トークン
- トークン有効期限: 1時間
- リフレッシュトークン: 30日

### CORS設定
```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

### セキュリティヘッダー
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## 12. パフォーマンス最適化

### キャッシュ戦略
- **KPI集計**: Redis 5分キャッシュ
- **SaaS一覧**: Redis 1分キャッシュ  
- **ユーザー情報**: メモリキャッシュ 10分

### データベース最適化
```sql
-- SaaS検索用インデックス
CREATE INDEX idx_saas_phase_status ON saas(phase, status);
CREATE INDEX idx_saas_updated_at ON saas(updated_at DESC);

-- KPI集計用インデックス  
CREATE INDEX idx_kpis_saas_date ON kpis(saas_id, recorded_at DESC);
```

### ページネーション
- デフォルトlimit: 50
- 最大limit: 100
- カーソルベース推奨（大量データ）

## 13. モニタリング・ログ

### APIメトリクス
- レスポンス時間
- エラー率
- スループット（RPS）
- アクティブ接続数（WebSocket）

### ログ形式
```json
{
  "timestamp": "2025-01-15T15:30:00Z",
  "level": "info",
  "method": "GET",
  "path": "/api/saas",
  "statusCode": 200,
  "responseTime": 45,
  "userId": "user-123",
  "requestId": "req-456"
}
```

## 14. 開発・テスト

### API仕様書生成
- OpenAPI 3.0対応
- Swagger UI提供（`/api/docs`）

### テスト戦略
- ユニットテスト（Jest）
- 統合テスト（Supertest）
- E2Eテスト（Playwright）
- ロードテスト（k6）

### 開発環境
```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test
npm run test:integration

# API仕様書確認
open http://localhost:3001/api/docs
```

## 15. デプロイ・インフラ

### 本番環境要件
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- 最小メモリ: 2GB
- 推奨メモリ: 8GB（100+ SaaS対応）

### 環境変数
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://dashboard.unsonos.com
```

### ヘルスチェック
```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected",
  "memoryUsage": "67%"
}
```