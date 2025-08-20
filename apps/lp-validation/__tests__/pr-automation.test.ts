// PR自動作成機能テスト
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PRAutomation } from '@/lib/pr-automation';
import type { PhaseTransitionResult, OptimizationResult } from '@/types/lp-validation';

describe('PR自動作成機能', () => {
  let prAutomation: PRAutomation;
  let mockGithubApi: any;

  beforeEach(() => {
    mockGithubApi = {
      createPR: vi.fn().mockResolvedValue({ 
        html_url: 'https://github.com/owner/repo/pull/123',
        number: 123
      }),
      getBranch: vi.fn().mockResolvedValue({ 
        name: 'main', 
        commit: { sha: 'abc123' } 
      }),
      createBranch: vi.fn().mockResolvedValue({ 
        ref: 'refs/heads/feature/optimization-20240820'
      }),
      getFile: vi.fn().mockResolvedValue({
        content: 'Y29uc3QgY3VycmVudENvbmZpZyA9IHsgY3ZyOiAxMC4wIH07', // base64 encoded
        sha: 'file123'
      }),
      updateFile: vi.fn().mockResolvedValue({ 
        commit: { sha: 'def456' }
      })
    };
    
    prAutomation = new PRAutomation({
      owner: 'test-owner',
      repo: 'test-repo',
      token: 'test-token',
      githubApi: mockGithubApi
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('LP最適化結果からPR作成', () => {
    it('有効な最適化結果からPRを自動作成できる', async () => {
      const optimizationResult: OptimizationResult = {
        sessionId: 'session-123',
        optimizedLP: {
          headline: '新しいヘッドライン',
          description: '最適化された説明文',
          ctaText: 'アクション強化',
          keywords: ['keyword1', 'keyword2'],
          bidAdjustment: 1.15
        },
        metrics: {
          cvr: 12.5,
          cpa: 285,
          sessions: 1500,
          conversions: 188,
          confidence: 98.5
        },
        improvements: [
          'ヘッドライン改善により+2.5% CVR向上',
          'CTA最適化により+15% クリック率向上'
        ],
        timestamp: new Date('2024-08-20T10:00:00Z')
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult);

      expect(mockGithubApi.createBranch).toHaveBeenCalledWith(
        expect.stringMatching(/^feature\/optimization-\d{8}-session-123$/)
      );
      expect(mockGithubApi.updateFile).toHaveBeenCalled();
      expect(mockGithubApi.createPR).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'LP最適化自動更新: session-123 (CVR: 12.5%)',
          body: expect.stringContaining('## 最適化結果サマリー'),
          base: 'main'
        })
      );
      expect(result.prUrl).toBe('https://github.com/owner/repo/pull/123');
      expect(result.success).toBe(true);
    });

    it('不正な最適化結果の場合エラーを返す', async () => {
      const invalidResult = {
        sessionId: '',
        optimizedLP: null,
        metrics: {},
        improvements: []
      } as any;

      const result = await prAutomation.createOptimizationPR(invalidResult);

      expect(result.success).toBe(false);
      expect(result.error).toContain('セッションIDが無効');
      expect(mockGithubApi.createPR).not.toHaveBeenCalled();
    });

    it('GitHub API エラー時に適切にエラーハンドリングする', async () => {
      mockGithubApi.createPR.mockRejectedValue(new Error('GitHub API Error'));

      const optimizationResult: OptimizationResult = {
        sessionId: 'session-456',
        optimizedLP: {
          headline: 'テストヘッドライン',
          description: 'テスト説明',
          ctaText: 'テストCTA',
          keywords: ['test'],
          bidAdjustment: 1.1
        },
        metrics: {
          cvr: 11.0,
          cpa: 300,
          sessions: 1000,
          conversions: 110,
          confidence: 95.0
        },
        improvements: ['改善1'],
        timestamp: new Date()
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult);

      expect(result.success).toBe(false);
      expect(result.error).toContain('GitHub API Error');
    });
  });

  describe('フェーズ移行時PR作成', () => {
    it('フェーズ移行時に設定変更PRを作成できる', async () => {
      const transitionResult: PhaseTransitionResult = {
        sessionId: 'session-789',
        currentPhase: 1,
        nextPhase: 2,
        transitionDecision: {
          shouldTransition: true,
          confidence: 85.5,
          reasons: [
            'CVR目標を達成（12.3% vs 10%）',
            'CPA目標内（¥287 vs ¥300）',
            '統計的有意性確保（95%以上）'
          ]
        },
        phaseConfig: {
          phase: 2,
          duration: '14日',
          budget: 200000,
          targetCVR: 15.0,
          targetCPA: 250
        },
        metrics: {
          currentCVR: 12.3,
          currentCPA: 287,
          sessions: 2000,
          conversions: 246,
          significance: 97.2
        },
        timestamp: new Date('2024-08-20T15:00:00Z')
      };

      const result = await prAutomation.createPhaseTransitionPR(transitionResult);

      expect(mockGithubApi.createBranch).toHaveBeenCalledWith(
        expect.stringMatching(/^feature\/phase-transition-\d{8}-session-789$/)
      );
      expect(mockGithubApi.createPR).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'フェーズ移行自動実行: session-789 (Phase1→Phase2)',
          body: expect.stringContaining('## フェーズ移行サマリー'),
          base: 'main'
        })
      );
      expect(result.prUrl).toBe('https://github.com/owner/repo/pull/123');
      expect(result.success).toBe(true);
    });

    it('フェーズ移行が不要な場合はPRを作成しない', async () => {
      const transitionResult: PhaseTransitionResult = {
        sessionId: 'session-999',
        currentPhase: 1,
        nextPhase: 1,
        transitionDecision: {
          shouldTransition: false,
          confidence: 45.0,
          reasons: ['CVR目標未達成（8.5% vs 10%）']
        },
        phaseConfig: {
          phase: 1,
          duration: '7日',
          budget: 100000,
          targetCVR: 10.0,
          targetCPA: 300
        },
        metrics: {
          currentCVR: 8.5,
          currentCPA: 320,
          sessions: 800,
          conversions: 68,
          significance: 88.0
        },
        timestamp: new Date()
      };

      const result = await prAutomation.createPhaseTransitionPR(transitionResult);

      expect(result.success).toBe(false);
      expect(result.error).toContain('フェーズ移行条件が満たされていません');
      expect(mockGithubApi.createPR).not.toHaveBeenCalled();
    });
  });

  describe('PR内容生成', () => {
    it('最適化結果から適切なPR説明文を生成できる', async () => {
      const optimizationResult: OptimizationResult = {
        sessionId: 'session-content-test',
        optimizedLP: {
          headline: '革新的なソリューション',
          description: 'あなたのビジネスを変革',
          ctaText: '今すぐ始める',
          keywords: ['革新', '変革', 'ビジネス'],
          bidAdjustment: 1.25
        },
        metrics: {
          cvr: 14.8,
          cpa: 265,
          sessions: 2500,
          conversions: 370,
          confidence: 99.2
        },
        improvements: [
          'ヘッドライン強化により+4.8% CVR向上',
          'キーワード最適化により-12% CPA改善',
          '統計的有意性99.2%達成'
        ],
        timestamp: new Date('2024-08-20T12:30:00Z')
      };

      const prContent = prAutomation.generatePRContent(optimizationResult);

      expect(prContent.title).toContain('LP最適化自動更新: session-content-test');
      expect(prContent.title).toContain('CVR: 14.8%');
      expect(prContent.body).toContain('## 最適化結果サマリー');
      expect(prContent.body).toContain('CVR: 14.8%');
      expect(prContent.body).toContain('CPA: ¥265');
      expect(prContent.body).toContain('統計的有意性: 99.2%');
      expect(prContent.body).toContain('革新的なソリューション');
      expect(prContent.body).toContain('ヘッドライン強化により+4.8% CVR向上');
    });

    it('フェーズ移行結果から適切なPR説明文を生成できる', async () => {
      const transitionResult: PhaseTransitionResult = {
        sessionId: 'session-phase-test',
        currentPhase: 2,
        nextPhase: 3,
        transitionDecision: {
          shouldTransition: true,
          confidence: 92.5,
          reasons: [
            'Phase2目標すべてクリア',
            'ROI改善率+35%達成',
            '市場適合性スコア8.5/10'
          ]
        },
        phaseConfig: {
          phase: 3,
          duration: '21日',
          budget: 500000,
          targetCVR: 18.0,
          targetCPA: 220
        },
        metrics: {
          currentCVR: 16.2,
          currentCPA: 245,
          sessions: 5000,
          conversions: 810,
          significance: 99.8
        },
        timestamp: new Date('2024-08-20T16:45:00Z')
      };

      const prContent = prAutomation.generatePhaseTransitionContent(transitionResult);

      expect(prContent.title).toContain('フェーズ移行自動実行: session-phase-test');
      expect(prContent.title).toContain('Phase2→Phase3');
      expect(prContent.body).toContain('## フェーズ移行サマリー');
      expect(prContent.body).toContain('Phase2→Phase3');
      expect(prContent.body).toContain('信頼度: 92.5%');
      expect(prContent.body).toContain('Phase2目標すべてクリア');
      expect(prContent.body).toContain('予算: ¥500,000');
      expect(prContent.body).toContain('CVR目標: 18.0%');
    });
  });

  describe('設定ファイル更新', () => {
    it('LP設定ファイルを正しく更新できる', async () => {
      const optimizationResult: OptimizationResult = {
        sessionId: 'session-config-test',
        optimizedLP: {
          headline: '新ヘッドライン',
          description: '新説明文',
          ctaText: '新CTA',
          keywords: ['新', 'キーワード'],
          bidAdjustment: 1.3
        },
        metrics: {
          cvr: 13.5,
          cpa: 275,
          sessions: 1800,
          conversions: 243,
          confidence: 96.8
        },
        improvements: ['改善項目1'],
        timestamp: new Date()
      };

      await prAutomation.updateLPConfig(optimizationResult);

      const updateCall = mockGithubApi.updateFile.mock.calls[0];
      const updatedContent = JSON.parse(Buffer.from(updateCall[0].content, 'base64').toString());

      expect(updatedContent.headline).toBe('新ヘッドライン');
      expect(updatedContent.description).toBe('新説明文');
      expect(updatedContent.ctaText).toBe('新CTA');
      expect(updatedContent.keywords).toEqual(['新', 'キーワード']);
      expect(updatedContent.bidAdjustment).toBe(1.3);
      expect(updatedContent.lastUpdated).toBeDefined();
    });

    it('フェーズ設定ファイルを正しく更新できる', async () => {
      const transitionResult: PhaseTransitionResult = {
        sessionId: 'session-phase-config',
        currentPhase: 1,
        nextPhase: 2,
        transitionDecision: {
          shouldTransition: true,
          confidence: 88.0,
          reasons: ['移行条件満了']
        },
        phaseConfig: {
          phase: 2,
          duration: '14日',
          budget: 250000,
          targetCVR: 12.0,
          targetCPA: 280
        },
        metrics: {
          currentCVR: 11.5,
          currentCPA: 295,
          sessions: 1500,
          conversions: 173,
          significance: 95.5
        },
        timestamp: new Date()
      };

      await prAutomation.updatePhaseConfig(transitionResult);

      const updateCall = mockGithubApi.updateFile.mock.calls[0];
      const updatedConfig = JSON.parse(Buffer.from(updateCall[0].content, 'base64').toString());

      expect(updatedConfig.currentPhase).toBe(2);
      expect(updatedConfig.phaseConfig.budget).toBe(250000);
      expect(updatedConfig.phaseConfig.targetCVR).toBe(12.0);
      expect(updatedConfig.phaseConfig.targetCPA).toBe(280);
      expect(updatedConfig.transitionHistory).toBeDefined();
    });
  });

  describe('エラーハンドリング', () => {
    it('認証エラーを適切に処理する', async () => {
      mockGithubApi.createPR.mockRejectedValue(new Error('Bad credentials'));

      const optimizationResult: OptimizationResult = {
        sessionId: 'session-auth-error',
        optimizedLP: {
          headline: 'テスト',
          description: 'テスト',
          ctaText: 'テスト',
          keywords: ['テスト'],
          bidAdjustment: 1.0
        },
        metrics: {
          cvr: 10.0,
          cpa: 300,
          sessions: 1000,
          conversions: 100,
          confidence: 95.0
        },
        improvements: ['テスト改善'],
        timestamp: new Date()
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult);

      expect(result.success).toBe(false);
      expect(result.error).toContain('認証エラー');
    });

    it('ネットワークエラーをリトライ機能付きで処理する', async () => {
      mockGithubApi.createPR
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockResolvedValueOnce({ 
          html_url: 'https://github.com/owner/repo/pull/456',
          number: 456
        });

      const optimizationResult: OptimizationResult = {
        sessionId: 'session-retry-test',
        optimizedLP: {
          headline: 'リトライテスト',
          description: 'リトライテスト',
          ctaText: 'リトライテスト',
          keywords: ['リトライ'],
          bidAdjustment: 1.0
        },
        metrics: {
          cvr: 10.5,
          cpa: 290,
          sessions: 1200,
          conversions: 126,
          confidence: 96.0
        },
        improvements: ['リトライ改善'],
        timestamp: new Date()
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult, { maxRetries: 3 });

      expect(result.success).toBe(true);
      expect(result.prUrl).toBe('https://github.com/owner/repo/pull/456');
      expect(mockGithubApi.createPR).toHaveBeenCalledTimes(3);
    });
  });

  describe('Webhook統合', () => {
    it('PR作成成功時にWebhook通知を送信できる', async () => {
      const mockWebhook = vi.fn().mockResolvedValue({ status: 'sent' });
      prAutomation.setWebhookHandler(mockWebhook);

      const optimizationResult: OptimizationResult = {
        sessionId: 'session-webhook-test',
        optimizedLP: {
          headline: 'Webhook テスト',
          description: 'Webhook テスト説明',
          ctaText: 'Webhook CTA',
          keywords: ['webhook'],
          bidAdjustment: 1.1
        },
        metrics: {
          cvr: 11.8,
          cpa: 278,
          sessions: 1600,
          conversions: 189,
          confidence: 97.5
        },
        improvements: ['Webhook改善テスト'],
        timestamp: new Date()
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult);

      expect(result.success).toBe(true);
      expect(mockWebhook).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pr_created',
          sessionId: 'session-webhook-test',
          prUrl: 'https://github.com/owner/repo/pull/123',
          metrics: expect.objectContaining({
            cvr: 11.8,
            cpa: 278
          })
        })
      );
    });

    it('Discord通知を送信できる', async () => {
      const mockDiscord = vi.fn().mockResolvedValue({ message: 'sent' });
      prAutomation.setDiscordNotification(mockDiscord);

      const optimizationResult: OptimizationResult = {
        sessionId: 'session-discord-test',
        optimizedLP: {
          headline: 'Discord テスト',
          description: 'Discord テスト説明',
          ctaText: 'Discord CTA',
          keywords: ['discord'],
          bidAdjustment: 1.2
        },
        metrics: {
          cvr: 13.2,
          cpa: 268,
          sessions: 1900,
          conversions: 251,
          confidence: 98.7
        },
        improvements: ['Discord改善テスト'],
        timestamp: new Date()
      };

      const result = await prAutomation.createOptimizationPR(optimizationResult);

      expect(result.success).toBe(true);
      expect(mockDiscord).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '🚀 LP最適化 PR作成完了',
          description: expect.stringContaining('session-discord-test'),
          fields: expect.arrayContaining([
            expect.objectContaining({ name: 'CVR', value: '13.2%' }),
            expect.objectContaining({ name: 'CPA', value: '¥268' })
          ])
        })
      );
    });
  });
});