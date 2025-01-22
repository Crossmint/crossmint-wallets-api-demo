import { NextResponse } from 'next/server';
import { createWallet } from '@/lib/server';
import type { WalletPayload } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const payload: WalletPayload = await request.json();
    const wallet = await createWallet(payload);

    return NextResponse.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    console.error('Wallet creation failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Wallet creation failed',
      },
      { status: 500 }
    );
  }
}
