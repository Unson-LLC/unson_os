import { vi } from 'vitest'

// Convex testing setup
process.env.NODE_ENV = 'test'

// Convex関数のモック
vi.mock('./_generated/api', () => ({
  api: {
    lpValidation: {
      createSession: vi.fn(),
      getSession: vi.fn(),
      updateSessionStatus: vi.fn(),
      getActiveSessionsByWorkspace: vi.fn(),
      updateSessionMetrics: vi.fn(),
    },
    automationExecutions: {
      logExecution: vi.fn(),
      getExecution: vi.fn(),
      getExecutionHistory: vi.fn(),
      getExecutionStats: vi.fn(),
    },
    systemAlerts: {
      createAlert: vi.fn(),
      getAlert: vi.fn(),
      resolveAlert: vi.fn(),
      getActiveAlerts: vi.fn(),
    },
  },
}))

// ConvexTestingHelperのモック
vi.mock('convex/testing', () => ({
  ConvexTestingHelper: vi.fn(() => ({
    run: vi.fn(),
    mutation: vi.fn(),
    query: vi.fn(),
    db: {
      query: vi.fn(() => ({
        collect: vi.fn(() => []),
      })),
      delete: vi.fn(),
    },
  })),
}))