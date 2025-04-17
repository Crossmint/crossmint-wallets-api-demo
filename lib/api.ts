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

export async function getTransactions(walletLocator: string) {
  try {
    const { data: txResponse } = await ky
      .get<{
        data: { transactions: Transaction[] };
      }>(`/api/wallets/${walletLocator}/transactions`)
      .json();
    return txResponse;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get transactions');
  }
}

export async function createTransaction(
  walletLocator: string,
  payload: TxRequest
) {
  try {
    const { data: txResponse } = await ky
      .post<{ data: Transaction }>(
        `/api/wallets/${walletLocator}/transactions`,
        {
          json: payload,
        }
      )
      .json();
    return txResponse;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create transaction');
  }
}

export async function approveTransaction(
  walletLocator: string,
  txId: string,
  payload: TxApprovalRequest
) {
  try {
    const { data: approvalResponse } = await ky
      .post<{ data: Transaction }>(
        `/api/wallets/${walletLocator}/transactions/${txId}/approvals`,
        {
          json: payload,
        }
      )
      .json();
    return approvalResponse;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to approve transaction');
  }
}

export async function registerDelegatedSigner(
  walletLocator: string,
  payload: DelegatedSignerPayload
) {
  try {
    const { data: delegatedSigner } = await ky
      .post<{ data: DelegatedSigner }>(
        `/api/wallets/${walletLocator}/signers`,
        {
          json: payload,
        }
      )
      .json();
    return delegatedSigner;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    throw new Error(error.message || 'Failed to register delegated signer');
  }
}
