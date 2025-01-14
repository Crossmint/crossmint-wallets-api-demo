'use client';

import React, { useState } from 'react';
import { type Address } from 'viem/accounts';
import { Button } from '@/components/ui/button';
import { createWalletWithAuth } from '@/lib/api';
import { createCredential } from '@/lib/passkeys';

interface WalletCreatorProps {
  onWalletCreated: (address: Address) => void;
}

export default function WalletCreator({ onWalletCreated }: WalletCreatorProps) {
  const [status, setStatus] = useState<
    'not_created' | 'loading' | 'error' | 'created'
  >('not_created');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [credentialName, setCredentialName] = useState('Wallet');

  const createWallet = React.useCallback(async () => {
    setStatus('loading');
    try {
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

      console.log({ wallet });

      setWalletAddress(wallet.address);
      setStatus('created');
      onWalletCreated(wallet.address);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setStatus('error');
    }
  }, [onWalletCreated, credentialName]);

  return (
    <div className="mb-6">
      <div className="mb-4">
        <label
          htmlFor="credentialName"
          className="block text-sm font-medium mb-1">
          Credential Name
        </label>
        <input
          type="text"
          id="credentialName"
          value={credentialName}
          onChange={(e) => setCredentialName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter credential name"
        />
      </div>
      <Button
        onClick={createWallet}
        disabled={status === 'loading' || status === 'created'}>
        Create Wallet
      </Button>
      <div className="mt-2">
        {status === 'loading' && <p>Creating wallet...</p>}
        {status === 'error' && (
          <p className="text-red-500">Error creating wallet</p>
        )}
        {status === 'created' && (
          <p>
            Wallet created! Address:{' '}
            <span className="font-mono">{walletAddress}</span>
          </p>
        )}
      </div>
    </div>
  );
}
