// Convex統合テスト用サポート関数
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// テスト環境初期化
export const initializeTestEnvironment = mutation({
  args: {
    workspace_id: v.string(),
  },
  handler: async (ctx, args) => {
    // テストワークスペース作成
    const testWorkspace = await ctx.db.insert('workspaces', {
      workspace_id: args.workspace_id,
      name: `Test Workspace ${args.workspace_id}`,
      created_at: Date.now(),
      status: 'active',
    });
    
    return { workspace_id: args.workspace_id, created: testWorkspace };
  },
});

// テストデータクリーンアップ
export const cleanupTestEnvironment = mutation({
  args: {
    workspace_id: v.string(),
  },
  handler: async (ctx, args) => {
    // セッション削除
    const sessions = await ctx.db
      .query('lpValidationSessions')
      .filter(q => q.eq(q.field('workspace_id'), args.workspace_id))
      .collect();
      
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
    
    // 実行ログ削除
    const executions = await ctx.db
      .query('automationExecutions')
      .collect();
      
    for (const execution of executions) {
      if (execution.session_id && sessions.find(s => s._id === execution.session_id)) {
        await ctx.db.delete(execution._id);
      }
    }
    
    // アラート削除
    const alerts = await ctx.db
      .query('systemAlerts')
      .collect();
      
    for (const alert of alerts) {
      if (alert.session_id && sessions.find(s => s._id === alert.session_id)) {
        await ctx.db.delete(alert._id);
      }
    }
    
    return { cleaned_up: true };
  },
});

// テストデータリセット
export const resetTestData = mutation({
  args: {
    workspace_id: v.string(),
  },
  handler: async (ctx, args) => {
    await cleanupTestEnvironment(ctx, args);
    await initializeTestEnvironment(ctx, args);
    return { reset: true };
  },
});

// 最近の実行ログ取得（重複チェック用）
export const getRecentExecutions = query({
  args: {
    session_id: v.id('lpValidationSessions'),
    execution_type: v.string(),
    hours: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.hours * 60 * 60 * 1000);
    
    return await ctx.db
      .query('automationExecutions')
      .filter(q => q.eq(q.field('session_id'), args.session_id))
      .filter(q => q.eq(q.field('execution_type'), args.execution_type))
      .filter(q => q.gte(q.field('started_at'), cutoff))
      .collect();
  },
});

// 実行統計取得
export const getExecutionStats = query({
  args: {
    workspace_id: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query('lpValidationSessions')
      .filter(q => q.eq(q.field('workspace_id'), args.workspace_id))
      .collect();
      
    const sessionIds = sessions.map(s => s._id);
    
    const executions = await ctx.db
      .query('automationExecutions')
      .collect();
      
    const filteredExecutions = executions.filter(e => 
      e.session_id && sessionIds.includes(e.session_id)
    );
    
    const stats = {
      total_executions: filteredExecutions.length,
      successful_executions: filteredExecutions.filter(e => e.status === 'completed').length,
      failed_executions: filteredExecutions.filter(e => e.status === 'failed').length,
      running_executions: filteredExecutions.filter(e => e.status === 'running').length,
      average_duration: 0,
      by_type: {} as Record<string, number>,
    };
    
    // タイプ別統計
    filteredExecutions.forEach(execution => {
      if (!stats.by_type[execution.execution_type]) {
        stats.by_type[execution.execution_type] = 0;
      }
      stats.by_type[execution.execution_type]++;
    });
    
    // 平均実行時間
    const completedExecutions = filteredExecutions.filter(e => e.duration_ms);
    if (completedExecutions.length > 0) {
      stats.average_duration = completedExecutions.reduce(
        (sum, e) => sum + (e.duration_ms || 0), 
        0
      ) / completedExecutions.length;
    }
    
    return stats;
  },
});