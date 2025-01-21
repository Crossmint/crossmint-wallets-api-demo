import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBalanceOf } from '@/lib/token';
import { useWallets } from '@/providers/WalletsProvider';
import { fundWallet } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { WalletTransactionsDialog } from './WalletTransactionsDialog';
import { WalletTransferDialog } from './WalletTransferDialog';

export default function WalletsTable() {
  const { wallets } = useWallets();
  const { toast } = useToast();
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<
    undefined | 'funding' | 'transferring'
  >(undefined);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<
    'transfer' | 'transactions' | null
  >(null);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(null);
    setSelectedWallet(null);
  }, []);

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
            <TableHead>Balance</TableHead>
            <TableHead>Fund</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet}>
              <TableCell className="font-mono">{wallet}</TableCell>
              <TableCell>{balances[wallet] ?? 'Loading...'}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  disabled={loading === 'funding'}
                  onClick={() => handleFundWallet(wallet as Address)}>
                  {loading === 'funding' ? 'Funding...' : 'Fund'}
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedWallet(wallet);
                        setDialogOpen('transfer');
                      }}>
                      Transfer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedWallet(wallet);
                        setDialogOpen('transactions');
                      }}>
                      View Transactions
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedWallet && dialogOpen === 'transactions' && (
        <WalletTransactionsDialog 
          walletLocator={selectedWallet}
          open={true}
          onOpenChange={(open) => !open && handleCloseDialog()}
        />
      )}

      {selectedWallet && dialogOpen === 'transfer' && (
        <WalletTransferDialog 
          walletLocator={selectedWallet}
          open={true}
          onOpenChange={(open) => !open && handleCloseDialog()}
          onSuccess={() => {
            fetchBalances();
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
}
