'use client';

import { Button } from '@/components/ui/button';
import { useWallets } from '@/providers/WalletsProvider';

export default function WalletCreator() {
  const { createWallet, isCreating } = useWallets();

  return (
    <div className="mb-6">
      <Button onClick={createWallet} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create New Wallet'}
      </Button>
    </div>
  );
}
