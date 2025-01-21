'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';
import type { Address } from 'viem';

interface WalletsContextType {
  wallets: Address[];
  addWallet: (wallet: Address) => void;
}

const WalletsContext = createContext<WalletsContextType | undefined>(undefined);

export function WalletsProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Address[]>([]);

  const addWallet = (wallet: Address) => {
    setWallets((prev) => {
      if (prev.includes(wallet)) return prev;
      return [...prev, wallet];
    });
  };

  return (
    <WalletsContext.Provider
      value={{
        wallets,
        addWallet,
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
  return {
    wallets: context.wallets,
    addWallet: context.addWallet,
  };
}
