import * as React from 'react';
import { useCallback, useState } from 'react';
import type { Address } from 'viem';
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
import { useToast } from '@/hooks/use-toast';
import { getTransferTransaction } from '@/lib/token';
import { approveTransaction, createTransaction } from '@/lib/api';
import { signMessage } from '@/lib/passkeys';

interface WalletTransferDialogProps {
  walletLocator: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WalletTransferDialog({
  walletLocator,
  open,
  onOpenChange,
  onSuccess,
}: WalletTransferDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [recipient, setRecipient] = useState<Address | ''>('');
  const [amount, setAmount] = useState('');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { wallets, credential } = useWallets();
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      if (!credential?.id) {
        toast({
          title: 'Error',
          description: 'No credential found',
          variant: 'destructive',
        });
        return;
      }
      e.preventDefault();
      if (!recipient || !amount) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      try {
        const { data, to, value } = await getTransferTransaction(
          recipient,
          amount
        );
        console.log({ data, to, value });
        const txResponse = await createTransaction(walletLocator, {
          params: {
            calls: [
              {
                data,
                to: to as Address,
                value,
              },
            ],
            chain: 'base-sepolia',
            signer: `evm-passkey:${credential.id}`,
          },
        });
        console.log({ txResponse });
        const signature = await signMessage(
          credential.id,
          txResponse.onChain.userOperationHash
        );
        const approval = await approveTransaction(
          walletLocator,
          txResponse.id,
          {
            approvals: [
              {
                metadata: signature.metadata,
                signature: {
                  r: signature.signature.r.toString(),
                  s: signature.signature.s.toString(),
                },
                signer: `evm-passkey:${credential.id}`,
              },
            ],
          }
        );
        console.log({ approval });
        setIsLoading(false);
        onOpenChange(false);
        onSuccess();
        toast({
          title: 'Success',
          description: 'Funds transferred successfully',
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to transfer funds',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      recipient,
      amount,
      onSuccess,
      onOpenChange,
      toast,
      credential?.id,
      walletLocator,
    ]
  );

  const TransferForm = ({ className }: React.ComponentProps<'form'>) => {
    return (
      <form
        onSubmit={onSubmit}
        className={cn('grid items-start gap-4', className)}>
        <div className="grid gap-2">
          <Label htmlFor="recipient">Select Wallet</Label>
          <Select
            value={recipient}
            onValueChange={(value) => setRecipient(value as Address)}>
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
