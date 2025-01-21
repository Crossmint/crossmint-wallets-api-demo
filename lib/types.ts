import type { Address } from 'viem';

export interface PasskeyPublicKey {
  x: string;
  y: string;
}

export interface PasskeyAdminSigner {
  id: string;
  name: string;
  publicKey: PasskeyPublicKey;
  type: 'evm-passkey';
}

export interface KeypairAdminSigner {
  type: 'evm-keypair';
  address: string;
  locator: string;
}

export type AdminSigner = PasskeyAdminSigner | KeypairAdminSigner;

export interface WalletConfig {
  adminSigner: AdminSigner;
}

export interface WalletPayload {
  type: 'evm-smart-wallet';
  config: WalletConfig;
}

export interface Wallet {
  type: 'evm-smart-wallet';
  linkedUser?: string;
  address: Address;
  config: WalletConfig;
}

export interface FundPayload {
  amount: number;
  currency: string;
  chain: string;
}
