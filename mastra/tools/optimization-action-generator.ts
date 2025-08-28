// 最適化アクション生成ツール（ビジネスロジック分離）
import { ISSUE_MESSAGES } from '../config/constants'
import { PerformanceAnalysis, OptimizationAction } from '../types'

export interface ActionTemplate {
  type: string
  descriptionTemplate: (changeValue: number) => string
}

export class OptimizationActionGenerator {
  private static readonly ACTION_TEMPLATES: Record<string, ActionTemplate> = {
    [ISSUE_MESSAGES.CTR_DROP]: {
      type: 'keyword_pause',
      descriptionTemplate: (change) => `AI推奨: CTR ${change}% 低下のため低パフォーマンスキーワード停止`
    },
    [ISSUE_MESSAGES.CPC_SPIKE]: {
      type: 'bid_adjustment',
      descriptionTemplate: (change) => `AI推奨: CPC ${change}% 上昇のため入札調整`
    },
    [ISSUE_MESSAGES.CVR_DROP]: {
      type: 'ad_test',
      descriptionTemplate: (change) => `AI推奨: CVR ${change}% 悪化のため広告テスト開始`
    }
  }

  static generateActionForIssue(issue: string, analysis: PerformanceAnalysis): OptimizationAction | null {
    const template = this.ACTION_TEMPLATES[issue]
    if (!template) return null

    const changeValue = this.getRelevantChangeValue(issue, analysis)
    
    return {
      type: template.type,
      description: template.descriptionTemplate(changeValue)
    }
  }

  private static getRelevantChangeValue(issue: string, analysis: PerformanceAnalysis): number {
    switch (issue) {
      case ISSUE_MESSAGES.CTR_DROP:
        return analysis.ctr.change
      case ISSUE_MESSAGES.CPC_SPIKE:
        return analysis.cpc.change
      case ISSUE_MESSAGES.CVR_DROP:
        return analysis.cvr.change
      default:
        return 0
    }
  }

  static generateOptimizationActions(analysis: PerformanceAnalysis): OptimizationAction[] {
    return analysis.issues
      .map(issue => this.generateActionForIssue(issue, analysis))
      .filter((action): action is OptimizationAction => action !== null)
  }
}