import { NextResponse } from 'next/server';
import { approveTransaction } from '@/lib/server';
import type { TxApprovalRequest } from '@/lib/types';

export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ walletLocator: string; transactionId: string }> }
) {
  try {
    const { walletLocator, transactionId } = await params;
    const approvalRequest: TxApprovalRequest = await request.json();

    const approvalResponse = await approveTransaction(
      walletLocator,
      transactionId,
      approvalRequest
    );

    return NextResponse.json({
      success: true,
      data: approvalResponse,
    });
  } catch (error) {
    console.error('Approving transaction failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Approving transaction failed',
      },
      { status: 500 }
    );
  }
}
