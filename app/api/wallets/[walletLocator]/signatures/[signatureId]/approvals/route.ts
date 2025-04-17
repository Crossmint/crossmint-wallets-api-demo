import { NextResponse } from 'next/server';
import { approveSignature } from '@/lib/server';
import type { TxApprovalRequest } from '@/lib/types';

export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ walletLocator: string; signatureId: string }> }
) {
  try {
    const { walletLocator, signatureId } = await params;
    const approvalRequest: TxApprovalRequest = await request.json();

    const approvalResponse = await approveSignature(
      walletLocator,
      signatureId,
      approvalRequest
    );

    return NextResponse.json({
      success: true,
      data: approvalResponse,
    });
  } catch (error) {
    console.error('Approving signature failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Approving signature failed',
      },
      { status: 500 }
    );
  }
}
