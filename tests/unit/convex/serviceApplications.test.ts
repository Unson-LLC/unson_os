import { describe, it, expect } from '@jest/globals';
import { TenantAwareDatabase, assertTenant } from '../../../convex/lib/tenantUtils';

// Refactor完了: 実際のロジックテスト
describe('Service Applications with Multi-Tenant', () => {
  describe('assertTenant', () => {
    it('should pass valid workspace_id', () => {
      expect(() => assertTenant('ws_test_001')).not.toThrow();
    });

    it('should throw for invalid workspace_id', () => {
      expect(() => assertTenant('')).toThrow('Invalid workspace_id');
      expect(() => assertTenant('   ')).toThrow('Invalid workspace_id');
    });
  });

  describe('TenantAwareDatabase', () => {
    let mockCtx: any;
    let tenantDb: TenantAwareDatabase;
    let mockApplications: any[];

    beforeEach(() => {
      mockApplications = [];
      
      mockCtx = {
        db: {
          insert: jest.fn().mockResolvedValue('generated_id_123'),
          query: jest.fn().mockReturnValue({
            withIndex: jest.fn().mockReturnValue({
              collect: jest.fn().mockResolvedValue(mockApplications),
              first: jest.fn().mockResolvedValue(null),
            }),
          }),
          patch: jest.fn().mockResolvedValue(undefined),
          get: jest.fn().mockResolvedValue({ workspace_id: 'ws_test_001' }),
        },
      };
      
      tenantDb = new TenantAwareDatabase(mockCtx);
    });

    describe('createServiceApplication', () => {
      it('should create service application with workspace_id', async () => {
        const result = await tenantDb.createServiceApplication(
          'ws_test_001',
          'mywa',
          'user@example.com',
          'Test User',
          { role: 'エンジニア', experience: '中級レベル' }
        );

        expect(result).toBe('generated_id_123');
        expect(mockCtx.db.insert).toHaveBeenCalledWith('serviceApplications', expect.objectContaining({
          workspace_id: 'ws_test_001',
          serviceName: 'mywa',
          email: 'user@example.com',
          name: 'Test User',
          status: 'submitted',
        }));
      });

      it('should prevent duplicate applications in same workspace', async () => {
        // 重複ありの状態にモック設定
        mockCtx.db.query().withIndex().first.mockResolvedValueOnce({ _id: 'existing' });

        await expect(
          tenantDb.createServiceApplication(
            'ws_test_001',
            'mywa',
            'user@example.com',
            'Test User',
            {}
          )
        ).rejects.toThrow('既にmywaに申し込み済みです');
      });

      it('should validate workspace_id', async () => {
        await expect(
          tenantDb.createServiceApplication('', 'mywa', 'user@example.com', 'Test User', {})
        ).rejects.toThrow('Invalid workspace_id');
      });
    });

    describe('getApplicationsByService', () => {
      it('should return applications filtered by workspace and service', async () => {
        const mockApps = [
          { workspace_id: 'ws_test_001', serviceName: 'mywa' }
        ];
        mockCtx.db.query().withIndex().collect.mockResolvedValue(mockApps);

        const result = await tenantDb.getApplicationsByService('ws_test_001', 'mywa');

        expect(result).toEqual(mockApps);
        expect(mockCtx.db.query).toHaveBeenCalledWith('serviceApplications');
      });

      it('should filter by status when provided', async () => {
        await tenantDb.getApplicationsByService('ws_test_001', 'mywa', 'approved');

        expect(mockCtx.db.query().withIndex).toHaveBeenCalledWith(
          'by_workspace_service_status',
          expect.any(Function)
        );
      });

      it('should validate workspace_id', async () => {
        await expect(
          tenantDb.getApplicationsByService('', 'mywa')
        ).rejects.toThrow('Invalid workspace_id');
      });
    });

    describe('updateApplicationStatus', () => {
      it('should update status with tenant validation', async () => {
        const result = await tenantDb.updateApplicationStatus('app_123', 'approved', 'Good application');

        expect(mockCtx.db.get).toHaveBeenCalledWith('app_123');
        expect(mockCtx.db.patch).toHaveBeenCalledWith('app_123', expect.objectContaining({
          status: 'approved',
          notes: 'Good application',
        }));
        expect(result).toBe('app_123');
      });

      it('should throw if application not found', async () => {
        mockCtx.db.get.mockResolvedValueOnce(null);

        await expect(
          tenantDb.updateApplicationStatus('nonexistent', 'approved')
        ).rejects.toThrow('申し込みが見つかりません');
      });
    });

    describe('getUserApplications', () => {
      it('should return user applications filtered by workspace', async () => {
        const mockApps = [
          { workspace_id: 'ws_test_001', email: 'user@example.com' }
        ];
        mockCtx.db.query().withIndex().collect.mockResolvedValue(mockApps);

        const result = await tenantDb.getUserApplications('ws_test_001', 'user@example.com');

        expect(result).toEqual(mockApps);
        expect(mockCtx.db.query().withIndex).toHaveBeenCalledWith(
          'by_workspace_email',
          expect.any(Function)
        );
      });

      it('should validate workspace_id', async () => {
        await expect(
          tenantDb.getUserApplications('', 'user@example.com')
        ).rejects.toThrow('Invalid workspace_id');
      });
    });
  });
});