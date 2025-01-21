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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useWallets } from '@/providers/WalletsProvider';

interface WalletTransferDialogProps {
  walletLocator: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletTransferDialog({
  walletLocator,
  open,
  onOpenChange,
}: WalletTransferDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { wallets } = useWallets();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Transfer logic will go here
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    onOpenChange(false);
  };

  const TransferForm = ({ className }: React.ComponentProps<'form'>) => {
    return (
      <form
        onSubmit={onSubmit}
        className={cn('grid items-start gap-4', className)}>
        <div className="grid gap-2">
          <Label htmlFor="wallet">Select Wallet</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a wallet" />
            </SelectTrigger>
            <SelectContent>
              {wallets?.map((address) => (
                <SelectItem key={address} value={address}>
                  {address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.000001"
            min="0"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Transferring...' : 'Transfer'}
        </Button>
      </form>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
            <DialogDescription>
              Transfer funds from this wallet to another wallet.
            </DialogDescription>
          </DialogHeader>
          <TransferForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Transfer Funds</DrawerTitle>
          <DrawerDescription>
            Transfer funds from this wallet to another wallet.
          </DrawerDescription>
        </DrawerHeader>
        <TransferForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
