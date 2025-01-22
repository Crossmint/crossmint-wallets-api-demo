import * as React from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { getTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/types';

interface WalletTransactionsDialogProps {
  walletLocator: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletTransactionsDialog({
  walletLocator,
  open,
  onOpenChange,
}: WalletTransactionsDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await getTransactions(walletLocator);
      setTransactions(response.transactions || []);
    };
    fetchTransactions();
  }, [walletLocator]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Wallet Transactions</DialogTitle>
            <DialogDescription>
              View all transactions for wallet {walletLocator}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ID: {tx.id}</span>
                      <span
                        className={`text-sm capitalize ${
                          tx.status === 'success'
                            ? 'text-green-600'
                            : tx.status === 'failed'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                        }`}>
                        {tx.status}
                      </span>
                    </div>
                    {tx.onChain.txId && (
                      <div className="text-sm text-muted-foreground">
                        Tx Hash: {tx.onChain.txId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Wallet Transactions</DrawerTitle>
          <DrawerDescription>
            View all transactions for wallet {walletLocator}
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ID: {tx.id}</span>
                    <span
                      className={`text-sm capitalize ${
                        tx.status === 'success'
                          ? 'text-green-600'
                          : tx.status === 'failed'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}>
                      {tx.status}
                    </span>
                  </div>
                  {tx.onChain.txId && (
                    <div className="text-sm text-muted-foreground">
                      Tx Hash: {tx.onChain.txId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
