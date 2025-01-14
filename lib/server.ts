import ky from 'ky';
import { WalletPayload } from '@/lib/types';

const BASE_URL = process.env.API_BASE_URL;
const WALLETS_API_KEY = process.env.WALLETS_API_KEY;

if (!BASE_URL) {
  throw new Error('API_BASE_URL is not set');
}

if (!WALLETS_API_KEY) {
  throw new Error('API_KEY is not set');
}

export const createWallet = (payload: WalletPayload) =>
  ky
    .post(`${BASE_URL}wallets`, {
      headers: { 'X-API-KEY': WALLETS_API_KEY },
      json: payload,
    })
    .json();

export const getWallet = (walletLocator: string) =>
  ky
    .get(`${BASE_URL}wallets/${walletLocator}`, {
      headers: { 'X-API-KEY': WALLETS_API_KEY },
    })
    .json();
