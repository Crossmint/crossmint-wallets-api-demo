'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';
import type { Address } from 'viem';

interface WalletsContextType {
  wallets: Address[];
  activeWallet: Address | null;
  addWallet: (wallet: Address) => void;
  setActiveWallet: (wallet: Address) => void;
}

const WalletsContext = createContext<WalletsContextType | undefined>(undefined);

export function WalletsProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Address[]>([]);
  const [activeWallet, setActiveWallet] = useState<Address | null>(null);

  const addWallet = (wallet: Address) => {
    setWallets((prev) => {
      if (prev.includes(wallet)) return prev;
      return [...prev, wallet];
    });
    // Set as active wallet if it's the first one
    if (wallets.length === 0) {
      setActiveWallet(wallet);
    }
  };

  return (
    <WalletsContext.Provider
      value={{
        wallets,
        activeWallet,
        addWallet,
        setActiveWallet,
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

export function useActiveWallet() {
  const context = useContext(WalletsContext);
  if (context === undefined) {
    throw new Error('useActiveWallet must be used within a WalletsProvider');
  }
  return {
    activeWallet: context.activeWallet,
    setActiveWallet: context.setActiveWallet,
  };
}
