import ky from 'ky';
import type { FundPayload, Wallet, WalletPayload } from '@/lib/types';

export async function createWalletWithAuth(payload: WalletPayload) {
  try {
    const response = await ky.post('/api/auth/login', {
      json: payload,
    });
    const data = (await response.json()) as { data: Wallet };
    return data;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create wallet');
  }
}

export async function fundWallet(walletLocator: string, payload: FundPayload) {
  try {
    const response = await ky.post(`/api/wallets/${walletLocator}/fund`, {
      json: payload,
    });
    const data = (await response.json()) as { data: Wallet };
    return data;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fund wallet');
  }
}
