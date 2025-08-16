// DAGアーキテクチャ対応API関数

import { DAGExecutionDetail, BatchProcessingStatus } from '@/types/dag'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// 基本APIクライアント関数
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.data
}

// DAG関連API
export const dagAPI = {
  // 特定SaaSのDAG状況取得
  async getDAGStatus(saasId: string): Promise<DAGExecutionDetail> {
    return apiCall(`/saas/${saasId}/dag/status`)
  },

  // バッチ処理状況取得
  async getBatchStatus(cycle?: '2h' | '24h' | '48h'): Promise<BatchProcessingStatus> {
    const params = cycle ? `?cycle=${cycle}` : ''
    return apiCall(`/dag/batch/status${params}`)
  },

  // 緊急DAG実行
  async triggerEmergencyExecution(saasId: string, reason: string, metric: string, currentValue: number): Promise<void> {
    return apiCall(`/dag/emergency/trigger`, {
      method: 'POST',
      body: JSON.stringify({
        saasId,
        reason: 'manual_intervention',
        metric,
        currentValue,
        skipQueue: true
      })
    })
  }
}

// SaaS管理API（DAG対応版）
export const saasAPI = {
  // SaaS一覧取得（DAG情報含む）
  async getSaaSList(params?: {
    lifecycle?: string
    pkgStatus?: string
    priority?: string
    page?: number
    limit?: number
  }) {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    return apiCall(`/saas?${queryParams}`)
  },

  // 特定SaaS詳細取得（DAG状況含む）
  async getSaaS(saasId: string) {
    return apiCall(`/saas/${saasId}`)
  },

  // SaaS KPI取得
  async getSaaSKPIs(saasId: string, period?: string) {
    const params = period ? `?period=${period}` : ''
    return apiCall(`/saas/${saasId}/kpis${params}`)
  }
}

// アラートAPI
export const alertAPI = {
  // アラート一覧取得
  async getAlerts(params?: {
    severity?: 'critical' | 'warning' | 'info'
    saasId?: string
    isRead?: boolean
    limit?: number
  }) {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    return apiCall(`/alerts?${queryParams}`)
  },

  // アラート既読化
  async markAsRead(alertId: string): Promise<void> {
    return apiCall(`/alerts/${alertId}/read`, { method: 'PUT' })
  },

  // 複数アラート一括既読
  async batchMarkAsRead(alertIds: string[]): Promise<void> {
    return apiCall(`/alerts/batch-read`, {
      method: 'POST',
      body: JSON.stringify({ alertIds })
    })
  }
}

// Gate承認API
export const gateAPI = {
  // 承認待ちGate一覧
  async getPendingGates() {
    return apiCall(`/gates/pending`)
  },

  // Gate承認履歴
  async getGateHistory(saasId?: string, limit?: number) {
    const params = new URLSearchParams()
    if (saasId) params.set('saasId', saasId)
    if (limit) params.set('limit', limit.toString())
    return apiCall(`/gates/history?${params}`)
  }
}

// WebSocket接続（リアルタイム更新）
export class DashboardWebSocket {
  private ws: WebSocket | null = null
  private token: string

  constructor(token: string) {
    this.token = token
  }

  connect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws/dashboard'
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      // 認証
      this.ws?.send(JSON.stringify({
        type: 'auth',
        token: this.token
      }))
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    this.ws.onerror = onError || ((error) => console.error('WebSocket error:', error))
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }
}

export default {
  dagAPI,
  saasAPI,
  alertAPI,
  gateAPI,
  DashboardWebSocket
}