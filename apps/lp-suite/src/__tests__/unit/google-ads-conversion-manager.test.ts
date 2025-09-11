// TDD RED: GoogleAdsConversionManager テスト (Vitest対応)
import { describe, it, expect, beforeEach } from 'vitest';
import { GoogleAdsConversionManager, ConversionLabel } from '../../../../../mastra/tools/google-ads-conversion-manager';

describe('GoogleAdsConversionManager', () => {
  let manager: GoogleAdsConversionManager;

  beforeEach(() => {
    manager = new GoogleAdsConversionManager();
  });

  describe('getActiveConversionLabels', () => {
    it('should fetch active conversion labels from Google Ads API', async () => {
      const labels = await manager.getActiveConversionLabels();
      
      expect(Array.isArray(labels)).toBe(true);
      expect(labels.length).toBeGreaterThan(0);
      
      // MyWaで使用している実際のラベルが含まれているかテスト
      const mywaLabel = labels.find(label => label.label === 'zINmCPbAtIMbENy46vdA');
      expect(mywaLabel).toBeDefined();
      expect(mywaLabel?.name).toBe('ベータテスター登録完了');
    });

    it('should return ConversionLabel format', async () => {
      const labels = await manager.getActiveConversionLabels();
      
      labels.forEach(label => {
        expect(label).toHaveProperty('id');
        expect(label).toHaveProperty('name');
        expect(label).toHaveProperty('label');
        expect(typeof label.id).toBe('string');
        expect(typeof label.name).toBe('string');
        expect(typeof label.label).toBe('string');
      });
    });
  });

  describe('validateConversionLabel', () => {
    it('should validate correct conversion label format', async () => {
      const validLabel = 'zINmCPbAtIMbENy46vdA';
      const isValid = await manager.validateConversionLabel(validLabel);
      expect(isValid).toBe(true);
    });

    it('should reject invalid conversion label format', async () => {
      const invalidLabels = [
        'invalid_label',
        'mywa_form_submission', // 古いプレースホルダー
        '',
        null,
        undefined
      ];

      for (const invalidLabel of invalidLabels) {
        const isValid = await manager.validateConversionLabel(invalidLabel as string);
        expect(isValid).toBe(false);
      }
    });

    it('should validate against actual Google Ads conversion actions', async () => {
      // 実際に存在するラベルかAPIで確認
      const validLabel = 'zINmCPbAtIMbENy46vdA';
      const isValid = await manager.validateConversionLabel(validLabel);
      expect(isValid).toBe(true);

      const invalidLabel = 'nonExistentLabel123';
      const isInvalid = await manager.validateConversionLabel(invalidLabel);
      expect(isInvalid).toBe(false);
    });
  });

  describe('getSharedConversionLabel', () => {
    it('should return the shared beta tester registration label', async () => {
      const sharedLabel = await manager.getSharedConversionLabel();
      
      expect(sharedLabel).toBe('zINmCPbAtIMbENy46vdA');
    });

    it('should be consistent across multiple calls', async () => {
      const label1 = await manager.getSharedConversionLabel();
      const label2 = await manager.getSharedConversionLabel();
      
      expect(label1).toBe(label2);
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API エラー状況をシミュレート
      const managerWithError = new GoogleAdsConversionManager(null); // 無効なクライアント
      
      await expect(managerWithError.getActiveConversionLabels()).rejects.toThrow();
    });
  });
});