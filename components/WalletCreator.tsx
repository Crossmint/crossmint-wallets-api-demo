'use client';

import { useCallback, useState } from 'react';
import { useWallets } from '@/providers/WalletsProvider';
import { createWalletWithAuth } from '@/lib/api';
import { createCredential } from '@/lib/passkeys';
import { Button } from '@/components/ui/button';

export default function WalletCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const { addWallet } = useWallets();

  const handleCreateWallet = useCallback(async () => {
    setIsCreating(true);
    try {
      const credentialName = 'xm-wallet';
      const credential = await createCredential(credentialName);

      const wallet = await createWalletWithAuth({
        type: 'evm-smart-wallet',
        config: {
          adminSigner: {
            id: credential.id,
            name: credentialName,
            publicKey: {
              x: credential.publicKey.x.toString(),
              y: credential.publicKey.y.toString(),
            },
            type: 'evm-passkey',
          },
        },
      });
      addWallet(wallet.address);
      console.log({ wallet });
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setIsCreating(false);
    }
  }, [addWallet]);

  return (
    <div className="mb-6">
      <Button onClick={handleCreateWallet} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create New Wallet'}
      </Button>
    </div>
  );
}
