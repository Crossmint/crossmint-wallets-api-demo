import type { SignMetadata } from 'ox/WebAuthnP256';
import type { Address, Hash, Hex } from 'viem';

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
  token: string;
  chain: string;
}

export interface TxResponse {
  txId: Hash;
}

export interface TxRequest {
  params: {
    calls: {
      data: Hex;
      to: Address;
      value: string;
    }[];
    chain: string;
    signer: string;
  };
}

export interface TxApproval {
  metadata: SignMetadata;
  signature: {
    r: string;
    s: string;
  };
  signer: string;
}
export interface TxApprovalRequest {
  approvals: TxApproval[];
}

export interface Transaction {
  id: string;
  status: 'awaiting-approval' | 'pending' | 'success' | 'failed';
  approvals: {
    pending: {
      signer: string;
      message: Hex;
    }[];
    submitted: {
      signer: string;
      message: Hex;
    }[];
  };
  onChain: {
    txId?: Hash;
    explorerLink?: string;
    userOperationHash: Hex;
  };
}

export interface DelegatedSignerPayload {
  signer: {
    type: 'evm-passkey';
    id: string;
    name: string;
    publicKey: {
      x: string;
      y: string;
    };
  };
  chain: string;
}

export interface DelegatedSigner {
  id: string;
  name: string;
  publicKey: {
    x: string;
    y: string;
  };
  chain: string;
}
