import ky from 'ky';
import type {
  FundPayload,
  TxResponse,
  Wallet,
  WalletPayload,
} from '@/lib/types';
import { publicClient } from '@/lib/viemClient';

export async function createWalletWithAuth(payload: WalletPayload) {
  try {
    const { data: wallet } = await ky
      .post<{ data: Wallet }>('/api/auth/login', {
        json: payload,
      })
      .json();
    return wallet;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create wallet');
  }
}

export async function fundWallet(walletLocator: string, payload: FundPayload) {
  try {
    const { data: txResponse } = await ky
      .post<{ data: TxResponse }>(`/api/wallets/${walletLocator}/fund`, {
        json: payload,
      })
      .json();
    // wait for tx to be mined
    await publicClient.waitForTransactionReceipt({ hash: txResponse.txId });
    return txResponse;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fund wallet');
  }
}
