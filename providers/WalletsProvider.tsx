'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import type { Address } from 'viem';
import type { P256Credential } from 'ox/WebAuthnP256';
import { createCredential } from '../lib/passkeys';
import { useToast } from '@/hooks/use-toast';
import { createWalletWithAuth } from '@/lib/api';

interface WalletsContextType {
  wallets: Address[];
  credential: P256Credential | null;
  isCreating: boolean;
  createWallet: () => Promise<void>;
}

const WalletsContext = createContext<WalletsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WALLETS: 'xm-wallets',
  CREDENTIAL: 'xm-credential',
} as const;

export function WalletsProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Address[]>([]);
  const [credential, setCredential] = useState<P256Credential | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Load saved data from localStorage
  useEffect(() => {
    const savedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);
    const savedCredential = localStorage.getItem(STORAGE_KEYS.CREDENTIAL);

    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
    if (savedCredential) {
      setCredential(JSON.parse(savedCredential));
    }
  }, []);

  const addWallet = useCallback((wallet: Address) => {
    setWallets((prev) => {
      if (prev.includes(wallet)) return prev;
      const newWallets = [...prev, wallet];
      localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(newWallets));
      return newWallets;
    });
  }, []);

  const createWallet = useCallback(async () => {
    setIsCreating(true);
    try {
      const credentialName = 'xm-wallet';
      let userCredential = credential;
      if (!userCredential) {
        userCredential = await createCredential(credentialName);
        setCredential(userCredential);
        // Convert any bigint properties to strings before storing
        const credentialToStore = {
          ...userCredential,
          publicKey: {
            ...userCredential.publicKey,
            x: userCredential.publicKey.x.toString(),
            y: userCredential.publicKey.y.toString(),
          },
        };
        localStorage.setItem(
          STORAGE_KEYS.CREDENTIAL,
          JSON.stringify(credentialToStore)
        );
      }

      const wallet = await createWalletWithAuth({
        type: 'evm-smart-wallet',
        config: {
          adminSigner: {
            id: userCredential.id,
            name: credentialName,
            publicKey: {
              x: userCredential.publicKey.x.toString(),
              y: userCredential.publicKey.y.toString(),
            },
            type: 'evm-passkey',
          },
        },
      });
      console.log({ wallet });
      addWallet(wallet.address);
      toast({
        title: 'Success',
        description: 'Wallet created successfully',
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to create wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }, [credential, addWallet, toast]);

  return (
    <WalletsContext.Provider
      value={{
        wallets,
        credential,
        isCreating,
        createWallet,
      }}>
      {children}
    </WalletsContext.Provider>
  );
}

export function useWallets() {
  const context = useContext(WalletsContext);
  if (context === undefined) {
    throw new Error('useWallets must be used within a WalletsProvider');
  }
  return context;
}
