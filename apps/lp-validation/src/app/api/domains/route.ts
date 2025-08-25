import { NextRequest, NextResponse } from 'next/server';
import { DomainAutomationService } from '../../../../../services/domain-automation/src/services/domain-automation-service';

const domainService = new DomainAutomationService();

/**
 * GET /api/domains - ドメイン一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    // 仮のデータを返す（実際はConvexから取得）
    const domains = [
      {
        id: 'dom_001',
        productId: 'ai-coach-001',
        subdomain: 'ai-coach',
        fqdn: 'ai-coach.unson.jp',
        status: 'active',
        vercelProjectId: 'prj_xxx',
        vercelUrl: 'ai-coach-unson.vercel.app',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'dom_002',
        productId: 'ai-writer-001',
        subdomain: 'ai-writer',
        fqdn: 'ai-writer.unson.jp',
        status: 'active',
        vercelProjectId: 'prj_yyy',
        vercelUrl: 'ai-writer-unson.vercel.app',
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ domains });
  } catch (error) {
    console.error('Failed to fetch domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/domains - ドメイン作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { productId, subdomain, projectName, environmentVariables } = body;

    if (!productId || !subdomain) {
      return NextResponse.json(
        { error: 'productId and subdomain are required' },
        { status: 400 }
      );
    }

    const result = await domainService.setupProductDomain({
      productId,
      subdomain,
      projectName,
      environmentVariables,
    });

    if (result.status === 'failed') {
      return NextResponse.json(
        { error: 'Domain setup failed', details: result.errors },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create domain:', error);
    return NextResponse.json(
      { error: 'Failed to create domain' },
      { status: 500 }
    );
  }
}