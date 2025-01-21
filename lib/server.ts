import ky from 'ky';
import type {
  FundPayload,
  TxResponse,
  Wallet,
  WalletPayload,
} from '@/lib/types';

const BASE_URL = process.env.API_BASE_URL;
const API_ALPHA_V2_BASE_URL = process.env.API_ALPHA_V2_BASE_URL;
const WALLETS_API_KEY = process.env.WALLETS_API_KEY;

if (!BASE_URL) {
  throw new Error('API_BASE_URL is not set');
}

if (!WALLETS_API_KEY) {
  throw new Error('API_KEY is not set');
}

if (!API_ALPHA_V2_BASE_URL) {
  throw new Error('API_ALPHA_V2_BASE_URL is not set');
}

export const createWallet = (payload: WalletPayload) =>
  ky
    .post<Wallet>(`${BASE_URL}wallets`, {
      headers: { 'X-API-KEY': WALLETS_API_KEY },
      json: payload,
    })
    .json();

export const getWallet = (walletLocator: string) =>
  ky
    .get<Wallet>(`${BASE_URL}wallets/${walletLocator}`, {
      headers: { 'X-API-KEY': WALLETS_API_KEY },
    })
    .json();

export const fundWallet = (walletLocator: string, payload: FundPayload) =>
  ky
    .post<TxResponse>(
      `${API_ALPHA_V2_BASE_URL}wallets/${walletLocator}/balances`,
      {
        headers: { 'X-API-KEY': WALLETS_API_KEY },
        json: payload,
      }
    )
    .json();
