// PR自動作成ユーティリティ関数
import { PR_AUTOMATION_CONSTANTS, PR_TYPE } from '../constants/pr-automation-constants';
import type { OptimizationResult, PhaseTransitionResult } from '@/types/lp-validation';

export class PRAutomationUtils {
  static formatDateForBranch(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }

  static formatDateForJapanese(date: Date): string {
    return date.toLocaleString(
      PR_AUTOMATION_CONSTANTS.DATE_FORMAT.JAPANESE_LOCALE, 
      { timeZone: PR_AUTOMATION_CONSTANTS.DATE_FORMAT.TIMEZONE_TOKYO }
    );
  }

  static generateBranchName(type: string, sessionId: string, date: Date = new Date()): string {
    const prefix = type === PR_TYPE.OPTIMIZATION 
      ? PR_AUTOMATION_CONSTANTS.BRANCH_PREFIXES.OPTIMIZATION
      : PR_AUTOMATION_CONSTANTS.BRANCH_PREFIXES.PHASE_TRANSITION;
    
    const formattedDate = this.formatDateForBranch(date);
    return `${prefix}-${formattedDate}-${sessionId}`;
  }

  static generateConfigPath(type: string, sessionId: string): string {
    const basePath = type === PR_TYPE.OPTIMIZATION
      ? PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.CONFIG_PATHS.LP_SESSIONS
      : PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.CONFIG_PATHS.PHASE_SESSIONS;
    
    return `${basePath}/${sessionId}${PR_AUTOMATION_CONSTANTS.FILE_EXTENSIONS.JSON}`;
  }

  static isValidOptimizationResult(result: OptimizationResult): boolean {
    return !!(result.sessionId && result.optimizedLP);
  }

  static isValidPhaseTransition(result: PhaseTransitionResult): boolean {
    return result.transitionDecision.shouldTransition;
  }

  static formatMetricsDisplay(cvr: number, cpa: number, sessions: number, conversions: number): string[] {
    return [
      `CVR: ${cvr}%`,
      `CPA: ¥${cpa}`,
      `セッション数: ${sessions.toLocaleString()}`,
      `コンバージョン数: ${conversions.toLocaleString()}`
    ];
  }

  static formatCurrency(amount: number): string {
    return `¥${amount.toLocaleString()}`;
  }

  static formatPercentage(value: number): string {
    return `${value}%`;
  }

  static createMarkdownSection(title: string, content: string): string {
    return `## ${title}\n\n${content}\n`;
  }

  static createMarkdownList(items: string[]): string {
    return items.map(item => `- ${item}`).join('\n');
  }

  static createPRTitle(type: string, sessionId: string, additionalInfo: string): string {
    const prefix = type === PR_TYPE.OPTIMIZATION
      ? PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.TITLE_PREFIX
      : PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.TITLE_PREFIX;
    
    return `${prefix}: ${sessionId} (${additionalInfo})`;
  }

  static createPRFooter(type: string): string {
    return type === PR_TYPE.OPTIMIZATION
      ? PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.FOOTER
      : PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.FOOTER;
  }

  static parseGitHubError(error: Error): string {
    const message = error.message;
    
    if (message.includes('Bad credentials')) {
      return PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.AUTH_ERROR;
    }
    
    if (message.includes(PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.GITHUB_API_ERROR)) {
      return message;
    }
    
    return message;
  }

  static calculateRetryDelay(attempt: number): number {
    return PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.RETRY_DELAY_BASE * attempt;
  }

  static createDiscordEmbed(
    type: string, 
    sessionId: string, 
    prUrl: string, 
    metrics: { cvr: number; cpa: number }
  ) {
    const emoji = type === PR_TYPE.OPTIMIZATION 
      ? PR_AUTOMATION_CONSTANTS.NOTIFICATION.DISCORD.EMOJIS.OPTIMIZATION
      : PR_AUTOMATION_CONSTANTS.NOTIFICATION.DISCORD.EMOJIS.PHASE_TRANSITION;

    const title = type === PR_TYPE.OPTIMIZATION 
      ? `${emoji} LP最適化 PR作成完了`
      : `${emoji} フェーズ移行 PR作成完了`;

    return {
      title,
      description: `セッション: ${sessionId}`,
      fields: [
        { name: 'CVR', value: this.formatPercentage(metrics.cvr), inline: true },
        { name: 'CPA', value: this.formatCurrency(metrics.cpa), inline: true },
        { name: 'PR URL', value: prUrl, inline: false }
      ],
      color: PR_AUTOMATION_CONSTANTS.NOTIFICATION.DISCORD.COLORS.SUCCESS,
      timestamp: new Date().toISOString()
    };
  }

  static createWebhookPayload(type: string, sessionId: string, prUrl: string, metrics: any) {
    return {
      type: 'pr_created',
      prType: type,
      sessionId,
      prUrl,
      metrics,
      timestamp: new Date().toISOString()
    };
  }

  static createCommitMessage(type: string, sessionId: string, additionalInfo: string): string {
    if (type === PR_TYPE.OPTIMIZATION) {
      return `自動最適化: ${sessionId} - ${additionalInfo}`;
    } else {
      return `フェーズ移行: ${sessionId} - ${additionalInfo}`;
    }
  }

  static mergeConfigWithHistory(
    currentConfig: any, 
    newData: any, 
    historyKey: string, 
    timestamp: Date
  ): any {
    return {
      ...currentConfig,
      ...newData,
      [historyKey]: [
        ...(currentConfig[historyKey] || []),
        {
          timestamp: timestamp.toISOString(),
          ...newData
        }
      ],
      lastUpdated: timestamp.toISOString()
    };
  }

  static encodeFileContent(content: string): string {
    return Buffer.from(content).toString('base64');
  }

  static decodeFileContent(base64Content: string): string {
    return Buffer.from(base64Content, 'base64').toString();
  }

  static validateEnvironmentVariables(): { isValid: boolean; missingVars: string[] } {
    const requiredVars = [
      PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_TOKEN,
      PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_OWNER,
      PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_REPO
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    return {
      isValid: missingVars.length === 0,
      missingVars
    };
  }

  static createTestOptimizationResult(sessionId: string): OptimizationResult {
    return {
      sessionId,
      optimizedLP: {
        headline: 'テストヘッドライン',
        description: 'テスト説明文',
        ctaText: 'テストCTA',
        keywords: ['テスト'],
        bidAdjustment: 1.0
      },
      metrics: {
        cvr: 10.0,
        cpa: 300,
        sessions: 100,
        conversions: 10,
        confidence: 95.0
      },
      improvements: ['テスト改善項目'],
      timestamp: new Date()
    };
  }
}