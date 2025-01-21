import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBalanceOf } from '@/lib/token';
import { useActiveWallet, useWallets } from '@/providers/WalletsProvider';
import { fundWallet } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function WalletsTable() {
  const { wallets } = useWallets();
  const { activeWallet, setActiveWallet } = useActiveWallet();
  const { toast } = useToast();
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<
    undefined | 'funding' | 'transferring'
  >(undefined);

  const fetchBalances = useCallback(async () => {
    const newBalances: Record<string, string> = {};
    for (const wallet of wallets) {
      try {
        const balance = await getBalanceOf(wallet as Address);
        newBalances[wallet] = balance;
      } catch (error) {
        console.error(`Error fetching balance for ${wallet}:`, error);
        newBalances[wallet] = 'Error';
        toast({
          title: 'Error',
          description: 'Failed to fetch balance. Please try again.',
          variant: 'destructive',
        });
      }
    }
    setBalances(newBalances);
  }, [wallets, toast]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const handleFundWallet = useCallback(
    async (wallet: Address) => {
      setLoading('funding');
      try {
        await fundWallet(wallet, {
          amount: 10,
          chain: 'base-sepolia',
          currency: 'usdxm',
        });
        await fetchBalances();
        toast({
          title: 'Success',
          description: 'Wallet funded successfully',
        });
      } catch (error) {
        console.error('Error funding wallet:', error);
        toast({
          title: 'Error',
          description: 'Failed to fund wallet. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(undefined);
      }
    },
    [fetchBalances, toast]
  );

  const handleSetActiveWallet = useCallback(
    (wallet: Address) => {
      setActiveWallet(wallet);
      toast({
        title: 'Success',
        description: 'Active wallet updated',
      });
    },
    [setActiveWallet, toast]
  );

  if (wallets.length === 0) {
    return <div>No wallets created yet</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Your Wallets</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet}>
              <TableCell className="font-mono">{wallet}</TableCell>
              <TableCell>
                {wallet === activeWallet ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetActiveWallet(wallet as Address)}>
                    Set Active
                  </Button>
                )}
              </TableCell>
              <TableCell>{balances[wallet] ?? 'Loading...'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={loading === 'funding'}
                    onClick={() => handleFundWallet(wallet as Address)}>
                    {loading === 'funding' ? 'Funding...' : 'Fund'}
                  </Button>
                  <Button size="sm" variant="secondary">
                    Transfer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
