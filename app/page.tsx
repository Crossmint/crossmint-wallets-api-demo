'use client';

import { useState } from 'react';
import type { Address } from 'viem';
import TokenBalance from '@/components/TokenBalance';
import TokenSender from '@/components/TokenSender';
import WalletCreator from '@/components/WalletCreator';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wallets API Demo</h1>
      <WalletCreator onWalletCreated={setWalletAddress} />
      {walletAddress && (
        <>
          <TokenBalance walletAddress={walletAddress} />
          <TokenSender />
        </>
      )}
    </main>
  );
}
