import { NextRequest, NextResponse } from 'next/server';
import { DomainAutomationService } from '../../../../../../services/domain-automation/src/services/domain-automation-service';

const domainService = new DomainAutomationService();

/**
 * GET /api/domains/[id]/health - ドメインヘルスチェック
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const health = await domainService.checkDomainHealth(productId);
    
    return NextResponse.json({
      productId,
      ...health,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/domains/[id] - ドメイン削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    await domainService.removeProductDomain(productId);
    
    return NextResponse.json({
      message: 'Domain removed successfully',
      productId,
    });
  } catch (error) {
    console.error('Failed to delete domain:', error);
    return NextResponse.json(
      { error: 'Failed to delete domain' },
      { status: 500 }
    );
  }
}