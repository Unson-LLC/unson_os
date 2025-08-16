export interface DAGStatus {
  lastExecuted: string
  nextScheduled: string
  currentCycle: '2h' | '24h' | '48h'
  status: 'running' | 'pending' | 'completed' | 'failed'
}

export interface Layer1Symbol {
  value: number
  normalized: boolean
  source: string
  timestamp: string
}

export interface Layer2Function {
  result: boolean
  confidence: number
  inputs: string[]
  inputValues: number[]
  executionTime: number
}

export interface Layer3Selection {
  selectedPKG: string
  selectionConfidence: number
  alternatives: Array<{
    pkgId: string
    confidence: number
    reason: string
  }>
}

export interface EmergencyTrigger {
  triggerId: string
  metric: string
  threshold: number
  actualValue: number
  triggeredAt: string
  resolvedAt?: string
  pkgExecuted: string
}

export interface DAGExecutionDetail {
  saasId: string
  saasName: string
  dagStatus: DAGStatus
  layer1: {
    symbolCount: number
    lastUpdated: string
    symbols: Record<string, Layer1Symbol>
    errors: string[]
  }
  layer2: {
    functionsEvaluated: number
    lastEvaluated: string
    results: Record<string, Layer2Function>
    errors: string[]
  }
  layer3: Layer3Selection
  emergencyTriggers: {
    active: EmergencyTrigger[]
    recent: EmergencyTrigger[]
  }
}

export interface BatchProcessingStatus {
  batchId: string
  cycle: '2h' | '24h' | '48h'
  status: 'running' | 'pending' | 'completed' | 'failed'
  startedAt: string
  progress: {
    totalSaaS: number
    processedSaaS: number
    percentage: number
  }
  estimatedCompletion: string
}