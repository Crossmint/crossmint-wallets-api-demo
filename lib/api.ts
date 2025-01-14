import ky from 'ky';
import type { Wallet, WalletPayload } from '@/lib/types';

export async function createWalletWithAuth(payload: WalletPayload) {
  const response = await ky.post('/api/auth/login', {
    json: payload,
  });

  try {
    const data = (await response.json()) as { data: Wallet };
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create wallet');
  }
}
