import { NextResponse } from 'next/server';
import { createTransaction, getTransactions } from '@/lib/server';
import type { TxRequest } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ walletLocator: string }> }
) {
  try {
    const walletLocator = (await params).walletLocator;
    const txRequest: TxRequest = await request.json();

    const txIntent = await createTransaction(walletLocator, txRequest);

    return NextResponse.json({
      success: true,
      data: txIntent,
    });
  } catch (error) {
    console.error('Creating transaction failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Creating transaction failed',
      },
      { status: 500 }
    );
  }
}

export async function GET({
  params,
}: {
  params: Promise<{ walletLocator: string }>;
}) {
  try {
    const walletLocator = (await params).walletLocator;
    const transactions = await getTransactions(walletLocator);

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Getting transactions failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Getting transactions failed',
      },
      { status: 500 }
    );
  }
}
