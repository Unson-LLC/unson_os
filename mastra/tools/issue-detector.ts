// 広告パフォーマンス問題検出ツール
import { ADS_ANALYSIS_THRESHOLDS, ISSUE_MESSAGES } from '../config/constants'

export interface MetricsData {
  ctr: { change: number }
  cvr: { change: number }
  cpc: { change: number }
}

export class IssueDetector {
  static detectCTRDrop(ctrChange: number): boolean {
    return ctrChange < ADS_ANALYSIS_THRESHOLDS.CTR_DROP_THRESHOLD
  }

  static detectCVRDrop(cvrChange: number): boolean {
    return cvrChange < ADS_ANALYSIS_THRESHOLDS.CVR_DROP_THRESHOLD
  }

  static detectCPCSpike(cpcChange: number): boolean {
    return cpcChange > ADS_ANALYSIS_THRESHOLDS.CPC_SPIKE_THRESHOLD
  }

  static detectAllIssues(metrics: MetricsData): string[] {
    const issues: string[] = []

    if (this.detectCTRDrop(metrics.ctr.change)) {
      issues.push(ISSUE_MESSAGES.CTR_DROP)
    }

    if (this.detectCVRDrop(metrics.cvr.change)) {
      issues.push(ISSUE_MESSAGES.CVR_DROP)
    }

    if (this.detectCPCSpike(metrics.cpc.change)) {
      issues.push(ISSUE_MESSAGES.CPC_SPIKE)
    }

    return issues
  }
}