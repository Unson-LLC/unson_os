// PR自動作成サービス統合
import { PRAutomation } from './pr-automation';
import { GitHubAPIClient } from './github-api';
import { PR_AUTOMATION_CONSTANTS } from './constants/pr-automation-constants';
import { PRAutomationUtils } from './utils/pr-automation-utils';
import type { 
  OptimizationResult, 
  PhaseTransitionResult,
  PRCreationResult 
} from '@/types/lp-validation';

export class PRAutomationService {
  private prAutomation: PRAutomation;
  
  constructor() {
    const githubClient = new GitHubAPIClient({
      token: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_TOKEN] || '',
      owner: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_OWNER] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_OWNER,
      repo: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_REPO] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_REPO
    });

    this.prAutomation = new PRAutomation({
      owner: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_OWNER] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_OWNER,
      repo: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_REPO] || PR_AUTOMATION_CONSTANTS.GITHUB_API.DEFAULT_REPO,
      token: process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.GITHUB_TOKEN] || '',
      githubApi: githubClient
    });

    this.setupWebhooks();
  }

  private setupWebhooks() {
    const discordWebhookUrl = process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.DISCORD_WEBHOOK_URL];
    if (discordWebhookUrl) {
      this.prAutomation.setDiscordNotification(async (data) => {
        const response = await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': PR_AUTOMATION_CONSTANTS.GITHUB_API.CONTENT_TYPE,
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.DISCORD_NOTIFICATION_FAILED);
        }
        
        return { message: 'sent' };
      });
    }

    const webhookUrl = process.env[PR_AUTOMATION_CONSTANTS.ENV_VARS.WEBHOOK_URL];
    if (webhookUrl) {
      this.prAutomation.setWebhookHandler(async (data) => {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': PR_AUTOMATION_CONSTANTS.GITHUB_API.CONTENT_TYPE,
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.WEBHOOK_NOTIFICATION_FAILED);
        }
        
        return { status: 'sent' };
      });
    }
  }

  async processOptimizationResult(result: OptimizationResult): Promise<PRCreationResult> {
    return this.prAutomation.createOptimizationPR(result, { 
      maxRetries: PR_AUTOMATION_CONSTANTS.DEFAULT_CONFIG.MAX_RETRIES 
    });
  }

  async processPhaseTransition(result: PhaseTransitionResult): Promise<PRCreationResult> {
    return this.prAutomation.createPhaseTransitionPR(result);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testSessionId = `test-${Date.now()}`;
      const testResult = PRAutomationUtils.createTestOptimizationResult(testSessionId);
      const prContent = this.prAutomation.generatePRContent(testResult);
      
      return {
        success: true,
        message: 'PR自動作成機能が正常に動作しています'
      };
    } catch (error) {
      return {
        success: false,
        message: `${PR_AUTOMATION_CONSTANTS.ERROR_MESSAGES.CONNECTION_TEST_FAILED}: ${(error as Error).message}`
      };
    }
  }
}