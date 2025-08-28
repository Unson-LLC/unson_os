// 4時間自動化スケジューラー（本格運用対応）
import { runAutomation, AutomationConfig, AutomationResult } from './ads-4h-automation'

export interface SchedulerConfig {
  products: ProductConfig[]
  schedule: ScheduleConfig
  notifications: NotificationConfig
}

export interface ProductConfig {
  productId: string
  customerId: number
  loginCustomerId: number
  enabled: boolean
  dryRun: boolean
}

export interface ScheduleConfig {
  intervalHours: number
  runOnHours: number[] // [0, 4, 8, 12, 16, 20] for 4h intervals
  timezone: string
}

export interface NotificationConfig {
  webhookUrl?: string
  slackChannel?: string
  emailRecipients?: string[]
}

export interface ScheduledExecution {
  id: string
  productId: string
  scheduledTime: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: AutomationResult
}

export class AutomationScheduler {
  private config: SchedulerConfig
  private executions: Map<string, ScheduledExecution> = new Map()

  constructor(config: SchedulerConfig) {
    this.config = config
  }

  async scheduleNext4HourRuns(): Promise<ScheduledExecution[]> {
    const now = new Date()
    const nextRunTime = this.getNextScheduledTime(now)
    const scheduled: ScheduledExecution[] = []

    for (const product of this.config.products) {
      if (!product.enabled) continue

      const execution: ScheduledExecution = {
        id: `${product.productId}-${nextRunTime.getTime()}`,
        productId: product.productId,
        scheduledTime: nextRunTime.toISOString(),
        status: 'pending'
      }

      this.executions.set(execution.id, execution)
      scheduled.push(execution)
    }

    return scheduled
  }

  async executeScheduled(executionId: string): Promise<AutomationResult> {
    const execution = this.executions.get(executionId)
    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`)
    }

    const productConfig = this.config.products.find(p => p.productId === execution.productId)
    if (!productConfig) {
      throw new Error(`Product config not found: ${execution.productId}`)
    }

    try {
      execution.status = 'running'
      
      const automationConfig: AutomationConfig = {
        customerId: productConfig.customerId,
        loginCustomerId: productConfig.loginCustomerId,
        productId: productConfig.productId,
        dryRun: productConfig.dryRun
      }

      const result = await runAutomation(automationConfig)
      
      execution.status = 'completed'
      execution.result = result

      await this.sendNotification(execution, result)
      
      return result
    } catch (error: any) {
      execution.status = 'failed'
      
      const errorResult: AutomationResult = {
        productId: execution.productId,
        timestamp: new Date().toISOString(),
        analysis: {},
        actions: [],
        executionResults: [],
        status: 'failed'
      }

      execution.result = errorResult
      await this.sendNotification(execution, errorResult, error)
      
      throw error
    }
  }

  async executeAllPending(): Promise<Map<string, AutomationResult>> {
    const results = new Map<string, AutomationResult>()
    const pendingExecutions = Array.from(this.executions.values())
      .filter(e => e.status === 'pending')

    for (const execution of pendingExecutions) {
      try {
        const result = await this.executeScheduled(execution.id)
        results.set(execution.id, result)
      } catch (error) {
        console.error(`Execution failed: ${execution.id}`, error)
      }
    }

    return results
  }

  getExecutionStatus(executionId: string): ScheduledExecution | undefined {
    return this.executions.get(executionId)
  }

  getAllExecutions(): ScheduledExecution[] {
    return Array.from(this.executions.values())
  }

  private getNextScheduledTime(now: Date): Date {
    const runHours = this.config.schedule.runOnHours.sort()
    const currentHour = now.getHours()
    
    // Find next run hour today
    const nextHourToday = runHours.find(hour => hour > currentHour)
    
    if (nextHourToday !== undefined) {
      const nextRun = new Date(now)
      nextRun.setHours(nextHourToday, 0, 0, 0)
      return nextRun
    }
    
    // Next run is tomorrow at first scheduled hour
    const nextRun = new Date(now)
    nextRun.setDate(now.getDate() + 1)
    nextRun.setHours(runHours[0], 0, 0, 0)
    return nextRun
  }

  private async sendNotification(
    execution: ScheduledExecution, 
    result: AutomationResult, 
    error?: Error
  ): Promise<void> {
    const notification = {
      executionId: execution.id,
      productId: execution.productId,
      status: execution.status,
      timestamp: new Date().toISOString(),
      result: {
        status: result.status,
        actionsCount: result.actions.length,
        successfulActions: result.executionResults.filter(r => r.status === 'success').length
      },
      error: error?.message
    }

    // Webhook通知
    if (this.config.notifications.webhookUrl) {
      try {
        await fetch(this.config.notifications.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        })
      } catch (error) {
        console.error('Webhook notification failed:', error)
      }
    }

    console.log('4時間自動化完了通知:', notification)
  }
}