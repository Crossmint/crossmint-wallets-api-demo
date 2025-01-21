'use client';

import { useCallback, useState } from 'react';
import { useWallets } from '@/providers/WalletsProvider';
import { createWalletWithAuth } from '@/lib/api';
import { createCredential } from '@/lib/passkeys';

export default function WalletCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const { addWallet } = useWallets();

  const handleCreateWallet = useCallback(async () => {
    setIsCreating(true);
    try {
      const credentialName = 'xm-wallet';
      const credential = await createCredential(credentialName);

      const { data: wallet } = await createWalletWithAuth({
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
      <button
        type="button"
        onClick={handleCreateWallet}
        disabled={isCreating}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        {isCreating ? 'Creating...' : 'Create New Wallet'}
      </button>
    </div>
  );
}
