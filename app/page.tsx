'use client';

import WalletCreator from '@/components/WalletCreator';
import WalletsTable from '@/components/WalletsTable';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Wallets API Demo</h1>
      <WalletCreator />
      <WalletsTable />
    </main>
  );
}
