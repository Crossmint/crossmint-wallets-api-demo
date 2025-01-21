import * as React from 'react';
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
            {/* Transactions list will go here */}
            <p className="text-sm text-muted-foreground">No transactions yet</p>
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
          {/* Transactions list will go here */}
          <p className="text-sm text-muted-foreground">No transactions yet</p>
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
