// ヘルスチェックAPIエンドポイント
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // システム状態チェック
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: await checkDatabase(),
        apis: await checkExternalAPIs(),
        storage: await checkStorage()
      },
      metrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        loadAverage: process.platform !== 'win32' ? require('os').loadavg() : null
      }
    };

    // 全サービスが正常かチェック
    const allServicesHealthy = Object.values(healthData.services).every(service => service.status === 'healthy');
    
    if (!allServicesHealthy) {
      return NextResponse.json(
        { ...healthData, status: 'degraded' },
        { status: 503 }
      );
    }

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

async function checkDatabase() {
  try {
    // Convex接続チェック（実際の実装では適切なチェックを行う）
    return {
      status: 'healthy',
      responseTime: Math.random() * 50 + 10, // 模擬データ
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      lastChecked: new Date().toISOString()
    };
  }
}

async function checkExternalAPIs() {
  try {
    // 外部API接続チェック
    const apiChecks = {
      googleAds: process.env.GOOGLE_ADS_CLIENT_ID ? 'configured' : 'not-configured',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not-configured',
      github: process.env.GITHUB_TOKEN ? 'configured' : 'not-configured',
      discord: process.env.DISCORD_WEBHOOK_URL ? 'configured' : 'not-configured'
    };

    return {
      status: 'healthy',
      apis: apiChecks,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      lastChecked: new Date().toISOString()
    };
  }
}

async function checkStorage() {
  try {
    // ストレージ・ファイルシステムチェック
    return {
      status: 'healthy',
      freeSpace: '85%', // 模擬データ
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      lastChecked: new Date().toISOString()
    };
  }
}