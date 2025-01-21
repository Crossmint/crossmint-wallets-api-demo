import { useEffect, useState } from 'react';
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

export default function WalletsTable() {
  const { wallets } = useWallets();
  const { activeWallet, setActiveWallet } = useActiveWallet();
  const [balances, setBalances] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances: Record<string, string> = {};
      for (const wallet of wallets) {
        try {
          const balance = await getBalanceOf(wallet as Address);
          newBalances[wallet] = balance;
        } catch (error) {
          console.error(`Error fetching balance for ${wallet}:`, error);
          newBalances[wallet] = 'Error';
        }
      }
      setBalances(newBalances);
    };

    fetchBalances();
  }, [wallets]);

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
                    onClick={() => setActiveWallet(wallet as Address)}>
                    Set Active
                  </Button>
                )}
              </TableCell>
              <TableCell>{balances[wallet] ?? 'Loading...'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm">Fund</Button>
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
