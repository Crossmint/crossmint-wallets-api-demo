import ky from 'ky';
import type {
  DelegatedSigner,
  DelegatedSignerPayload,
  FundPayload,
  Transaction,
  TxApprovalRequest,
  TxRequest,
  TxResponse,
  Wallet,
  WalletPayload,
} from '@/lib/types';

const BASE_URL = process.env.API_BASE_URL;
const WALLETS_API_KEY = process.env.WALLETS_API_KEY;

if (!BASE_URL) {
  throw new Error('API_BASE_URL is not set');
}

if (!WALLETS_API_KEY) {
  throw new Error('API_KEY is not set');
}

const apiClient = ky.create({
  prefixUrl: BASE_URL,
  headers: { 'X-API-KEY': WALLETS_API_KEY },
});

export const createWallet = (payload: WalletPayload) =>
  apiClient.post<Wallet>('2022-06-09/wallets', { json: payload }).json();

export const getWallet = (walletLocator: string) =>
  apiClient.get<Wallet>(`2022-06-09/wallets/${walletLocator}`).json();

export const fundWallet = (walletLocator: string, payload: FundPayload) =>
  apiClient
    .post<TxResponse>(`v1-alpha2/wallets/${walletLocator}/balances`, {
      json: payload,
    })
    .json();

export const getTransactions = (walletLocator: string) =>
  apiClient
    .get<Transaction[]>(`2022-06-09/wallets/${walletLocator}/transactions`)
    .json();

export const createTransaction = (walletLocator: string, payload: TxRequest) =>
  apiClient
    .post<Transaction>(`2022-06-09/wallets/${walletLocator}/transactions`, {
      json: payload,
    })
    .json();

export const approveTransaction = (
  walletLocator: string,
  txId: string,
  payload: TxApprovalRequest
) =>
  apiClient
    .post<Transaction>(
      `2022-06-09/wallets/${walletLocator}/transactions/${txId}/approvals`,
      {
        json: payload,
      }
    )
    .json();

export const registerDelegatedSigner = (
  walletLocator: string,
  payload: DelegatedSignerPayload
) =>
  apiClient
    .post<DelegatedSigner>(`2022-06-09/wallets/${walletLocator}/signers`, {
      json: payload,
    })
    .json();
