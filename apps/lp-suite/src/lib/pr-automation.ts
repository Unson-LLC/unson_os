// PR自動作成機能実装
import type { 
  OptimizationResult, 
  PhaseTransitionResult, 
  PRAutomationConfig,
  PRCreationResult,
  PRContent
} from '@/types/lp-validation';
import { PR_AUTOMATION_CONSTANTS, PR_TYPE } from './constants/pr-automation-constants';
import { PRAutomationUtils } from './utils/pr-automation-utils';

export class PRAutomation {
  private config: PRAutomationConfig;
  private webhookHandler?: (data: any) => Promise<any>;
  private discordNotification?: (data: any) => Promise<any>;
  
  constructor(config: PRAutomationConfig) {
    this.config = config;
  }

  setWebhookHandler(handler: (data: any) => Promise<any>) {
    this.webhookHandler = handler;
  }

  setDiscordNotification(handler: (data: any) => Promise<any>) {
    this.discordNotification = handler;
  }

  async createOptimizationPR(
    result: OptimizationResult, 
    options?: { maxRetries?: number }
  ): Promise<PRCreationResult> {
    try {
      if (!PRAutomationUtils.isValidOptimizationResult(result)) {
        return {
          success: false,
          error: PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.INVALID_SESSION_ID
        };
      }

      const branchName = PRAutomationUtils.generateBranchName(PR_TYPE.OPTIMIZATION, result.sessionId);
      const prContent = this.generatePRContent(result);

      const maxRetries = options?.maxRetries || PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.MAX_RETRIES;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await this.config.githubApi.createBranch(branchName);
          await this.updateLPConfig(result);
          
          const prResponse = await this.config.githubApi.createPR({
            title: prContent.title,
            body: prContent.body,
            head: branchName,
            base: prContent.base
          });

          const prResult = {
            success: true,
            prUrl: prResponse.html_url,
            prNumber: prResponse.number
          };

          if (this.webhookHandler) {
            await this.webhookHandler(
              PRAutomationUtils.createWebhookPayload(
                PR_TYPE.OPTIMIZATION,
                result.sessionId,
                prResponse.html_url,
                result.metrics
              )
            );
          }

          if (this.discordNotification) {
            await this.discordNotification({
              embeds: [PRAutomationUtils.createDiscordEmbed(
                PR_TYPE.OPTIMIZATION,
                result.sessionId,
                prResponse.html_url,
                result.metrics
              )]
            });
          }

          return prResult;
        } catch (error) {
          lastError = error as Error;
          if (attempt === maxRetries) break;
          
          await new Promise(resolve => 
            setTimeout(resolve, PRAutomationUtils.calculateRetryDelay(attempt))
          );
        }
      }

      const errorMessage = lastError ? PRAutomationUtils.parseGitHubError(lastError) : 'PR作成に失敗しました';
      return {
        success: false,
        error: errorMessage
      };

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  async createPhaseTransitionPR(result: PhaseTransitionResult): Promise<PRCreationResult> {
    try {
      if (!PRAutomationUtils.isValidPhaseTransition(result)) {
        return {
          success: false,
          error: PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.PHASE_TRANSITION_CONDITIONS_NOT_MET
        };
      }

      const branchName = PRAutomationUtils.generateBranchName(PR_TYPE.PHASE_TRANSITION, result.sessionId);
      const prContent = this.generatePhaseTransitionContent(result);

      await this.config.githubApi.createBranch(branchName);
      await this.updatePhaseConfig(result);
      
      const prResponse = await this.config.githubApi.createPR({
        title: prContent.title,
        body: prContent.body,
        head: branchName,
        base: prContent.base
      });

      return {
        success: true,
        prUrl: prResponse.html_url,
        prNumber: prResponse.number
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  generatePRContent(result: OptimizationResult): PRContent {
    const additionalInfo = `CVR: ${result.metrics.cvr}%`;
    const title = PRAutomationUtils.createPRTitle(PR_TYPE.OPTIMIZATION, result.sessionId, additionalInfo);
    
    const metricsDisplay = PRAutomationUtils.formatMetricsDisplay(
      result.metrics.cvr,
      result.metrics.cpa,
      result.metrics.sessions,
      result.metrics.conversions
    );

    const performanceSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.SECTIONS.PERFORMANCE,
      PRAutomationUtils.createMarkdownList([
        ...metricsDisplay,
        `統計的有意性: ${result.metrics.confidence}%`
      ])
    );

    const contentSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.SECTIONS.CONTENT,
      `**ヘッドライン**: ${result.optimizedLP.headline}\n**説明文**: ${result.optimizedLP.description}\n**CTA**: ${result.optimizedLP.ctaText}\n**キーワード**: ${result.optimizedLP.keywords.join(', ')}\n**入札調整**: ${result.optimizedLP.bidAdjustment}x`
    );

    const improvementsSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.SECTIONS.IMPROVEMENTS,
      PRAutomationUtils.createMarkdownList(result.improvements)
    );

    const historySection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.SECTIONS.HISTORY,
      PRAutomationUtils.createMarkdownList([
        `実行時刻: ${PRAutomationUtils.formatDateForJapanese(result.timestamp)}`,
        `セッションID: ${result.sessionId}`
      ])
    );

    const body = `${PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.OPTIMIZATION.SECTIONS.SUMMARY,
      ''
    )}${performanceSection}${contentSection}${improvementsSection}${historySection}---\n${PRAutomationUtils.createPRFooter(PR_TYPE.OPTIMIZATION)}`;

    return {
      title,
      body,
      base: PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH,
      head: PRAutomationUtils.generateBranchName(PR_TYPE.OPTIMIZATION, result.sessionId)
    };
  }

  generatePhaseTransitionContent(result: PhaseTransitionResult): PRContent {
    const additionalInfo = `Phase${result.currentPhase}→Phase${result.nextPhase}`;
    const title = PRAutomationUtils.createPRTitle(PR_TYPE.PHASE_TRANSITION, result.sessionId, additionalInfo);
    
    const transitionSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.TRANSITION,
      PRAutomationUtils.createMarkdownList([
        `現在フェーズ: Phase${result.currentPhase}`,
        `次フェーズ: Phase${result.nextPhase}`,
        `信頼度: ${result.transitionDecision.confidence}%`
      ])
    );

    const reasonsSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.REASONS,
      PRAutomationUtils.createMarkdownList(result.transitionDecision.reasons)
    );

    const performanceSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.PERFORMANCE,
      PRAutomationUtils.createMarkdownList([
        `CVR: ${result.metrics.currentCVR}%`,
        `CPA: ${PRAutomationUtils.formatCurrency(result.metrics.currentCPA)}`,
        `セッション数: ${result.metrics.sessions.toLocaleString()}`,
        `コンバージョン数: ${result.metrics.conversions.toLocaleString()}`,
        `統計的有意性: ${result.metrics.significance}%`
      ])
    );

    const configSection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.CONFIG,
      PRAutomationUtils.createMarkdownList([
        `期間: ${result.phaseConfig.duration}`,
        `予算: ${PRAutomationUtils.formatCurrency(result.phaseConfig.budget)}`,
        `CVR目標: ${result.phaseConfig.targetCVR}%`,
        `CPA目標: ${PRAutomationUtils.formatCurrency(result.phaseConfig.targetCPA)}`
      ])
    );

    const historySection = PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.HISTORY,
      PRAutomationUtils.createMarkdownList([
        `実行時刻: ${PRAutomationUtils.formatDateForJapanese(result.timestamp)}`,
        `セッションID: ${result.sessionId}`
      ])
    );

    const body = `${PRAutomationUtils.createMarkdownSection(
      PR_AUTOMATION_CONSTANTS.PR_TEMPLATES.PHASE_TRANSITION.SECTIONS.SUMMARY,
      ''
    )}${transitionSection}${reasonsSection}${performanceSection}${configSection}${historySection}---\n${PRAutomationUtils.createPRFooter(PR_TYPE.PHASE_TRANSITION)}`;

    return {
      title,
      body,
      base: PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.BASE_BRANCH,
      head: PRAutomationUtils.generateBranchName(PR_TYPE.PHASE_TRANSITION, result.sessionId)
    };
  }

  async updateLPConfig(result: OptimizationResult): Promise<void> {
    const configPath = PRAutomationUtils.generateConfigPath(PR_TYPE.OPTIMIZATION, result.sessionId);
    
    const existingConfig = await this.config.githubApi.getFile(configPath);
    const currentConfig = JSON.parse(
      PRAutomationUtils.decodeFileContent(existingConfig.content)
    );

    const newConfigData = {
      headline: result.optimizedLP.headline,
      description: result.optimizedLP.description,
      ctaText: result.optimizedLP.ctaText,
      keywords: result.optimizedLP.keywords,
      bidAdjustment: result.optimizedLP.bidAdjustment,
      metrics: result.metrics,
      improvements: result.improvements
    };

    const updatedConfig = PRAutomationUtils.mergeConfigWithHistory(
      currentConfig,
      newConfigData,
      'optimizationHistory',
      result.timestamp
    );

    const commitMessage = PRAutomationUtils.createCommitMessage(
      PR_TYPE.OPTIMIZATION,
      result.sessionId,
      `CVR ${result.metrics.cvr}%`
    );

    await this.config.githubApi.updateFile({
      path: configPath,
      message: commitMessage,
      content: PRAutomationUtils.encodeFileContent(JSON.stringify(updatedConfig, null, 2)),
      sha: existingConfig.sha
    });
  }

  async updatePhaseConfig(result: PhaseTransitionResult): Promise<void> {
    const configPath = PRAutomationUtils.generateConfigPath(PR_TYPE.PHASE_TRANSITION, result.sessionId);
    
    const existingConfig = await this.config.githubApi.getFile(configPath);
    const currentConfig = JSON.parse(
      PRAutomationUtils.decodeFileContent(existingConfig.content)
    );

    const newConfigData = {
      currentPhase: result.nextPhase,
      phaseConfig: result.phaseConfig,
      lastTransition: result.timestamp.toISOString(),
      fromPhase: result.currentPhase,
      toPhase: result.nextPhase,
      confidence: result.transitionDecision.confidence,
      reasons: result.transitionDecision.reasons,
      metrics: result.metrics
    };

    const updatedConfig = PRAutomationUtils.mergeConfigWithHistory(
      currentConfig,
      newConfigData,
      'transitionHistory',
      result.timestamp
    );

    const commitMessage = PRAutomationUtils.createCommitMessage(
      PR_TYPE.PHASE_TRANSITION,
      result.sessionId,
      `Phase${result.currentPhase}→Phase${result.nextPhase}`
    );

    await this.config.githubApi.updateFile({
      path: configPath,
      message: commitMessage,
      content: PRAutomationUtils.encodeFileContent(JSON.stringify(updatedConfig, null, 2)),
      sha: existingConfig.sha
    });
  }

}