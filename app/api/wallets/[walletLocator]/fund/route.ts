import { NextResponse } from 'next/server';
import { fundWallet } from '@/lib/server';
import type { FundPayload } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ walletLocator: string }> }
) {
  try {
    const walletLocator = (await params).walletLocator;
    const payload: FundPayload = await request.json();
    const fundResponse = await fundWallet(walletLocator, payload);

    return NextResponse.json({
      success: true,
      data: fundResponse,
    });
  } catch (error) {
    console.error('Funding wallet failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Funding wallet failed',
      },
      { status: 500 }
    );
  }
}
