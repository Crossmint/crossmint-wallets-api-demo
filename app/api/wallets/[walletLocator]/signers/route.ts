import { NextResponse } from 'next/server';
import { registerDelegatedSigner } from '@/lib/server';
import type { DelegatedSignerPayload } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ walletLocator: string }> }
) {
  try {
    const walletLocator = (await params).walletLocator;
    const delegatedSignerPayload: DelegatedSignerPayload = await request.json();

    const delegatedSignerTransaction = await registerDelegatedSigner(
      walletLocator,
      delegatedSignerPayload
    );

    return NextResponse.json({
      success: true,
      data: delegatedSignerTransaction,
    });
  } catch (error) {
    console.error('Registering delegated signer failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Registering delegated signer failed',
      },
      { status: 500 }
    );
  }
}
