import { useCallback, useState, memo } from 'react';
import type { P256Credential } from 'ox/WebAuthnP256';
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createCredential, signMessage } from '@/lib/passkeys';
import { approveSignature, registerDelegatedSigner } from '@/lib/api';
import { useWallets } from '@/providers/WalletsProvider';

interface RegisterFormProps extends React.ComponentProps<'form'> {
  signerName: string;
  onSignerNameChange: (value: string) => void;
  isLoading: boolean;
  credential: P256Credential | null;
  onCreatePasskey: () => void;
  onRegister: () => void;
}

const RegisterForm = memo(function RegisterForm({
  className,
  signerName,
  onSignerNameChange,
  isLoading,
  credential,
  onCreatePasskey,
  onRegister,
}: RegisterFormProps) {
  return (
    <form className={cn('grid items-start gap-4', className)}>
      <div className="grid gap-2">
        <Label htmlFor="signerName">Signer Name</Label>
        <Input
          id="signerName"
          value={signerName}
          onChange={(e) => onSignerNameChange(e.target.value)}
          placeholder="Enter signer name"
          disabled={isLoading || !!credential}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={onCreatePasskey}
          disabled={isLoading || !!credential}>
          {isLoading ? 'Creating...' : 'Create Passkey'}
        </Button>
        {credential && (
          <Button type="button" onClick={onRegister} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Signer'}
          </Button>
        )}
      </div>
    </form>
  );
});

interface WalletRegisterSignerDialogProps {
  walletLocator: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WalletRegisterSignerDialog({
  walletLocator,
  open,
  onOpenChange,
  onSuccess,
}: WalletRegisterSignerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [delegatedCredential, setDelegatedCredential] =
    useState<P256Credential | null>(null);
  const [signerName, setSignerName] = useState('');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();
  const { credential } = useWallets();

  const handleSignerNameChange = useCallback((value: string) => {
    setSignerName(value);
  }, []);

  const handleCreatePasskey = useCallback(async () => {
    if (!signerName) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the passkey',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const newCredential = await createCredential(signerName);
      setDelegatedCredential(newCredential);
      toast({
        title: 'Success',
        description: 'Passkey created successfully',
      });
    } catch (error) {
      console.error('Error creating passkey:', error);
      toast({
        title: 'Error',
        description: 'Failed to create passkey. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [signerName, toast]);

  const handleRegister = useCallback(async () => {
    if (!delegatedCredential) {
      toast({
        title: 'Error',
        description: 'Please create a passkey first',
        variant: 'destructive',
      });
      return;
    }

    if (!credential) {
      toast({
        title: 'Error',
        description: 'Please login to your account first',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const delegatedSignerTransaction = await registerDelegatedSigner(
        walletLocator,
        {
          signer: {
            type: 'evm-passkey',
            id: delegatedCredential.id,
            name: signerName,
            publicKey: {
              x: delegatedCredential.publicKey.x.toString(),
              y: delegatedCredential.publicKey.y.toString(),
            },
          },
          chain: 'base-sepolia',
        }
      );

      console.log({ delegatedSignerTransaction });

      const signature = await signMessage(
        credential.id,
        delegatedSignerTransaction.chains['base-sepolia'].approvals.pending[0]
          .message
      );

      console.log({ signature });

      const approval = await approveSignature(
        walletLocator,
        delegatedSignerTransaction.chains['base-sepolia'].id,
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

      onOpenChange(false);
      onSuccess();
      toast({
        title: 'Success',
        description: 'Delegated signer registered successfully',
      });
    } catch (error) {
      console.error('Error registering delegated signer:', error);
      toast({
        title: 'Error',
        description: 'Failed to register delegated signer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    delegatedCredential,
    signerName,
    walletLocator,
    credential,
    onOpenChange,
    onSuccess,
    toast,
  ]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register Delegated Signer</DialogTitle>
            <DialogDescription>
              Create a new passkey and register it as a delegated signer for
              this wallet.
            </DialogDescription>
          </DialogHeader>
          <RegisterForm
            signerName={signerName}
            onSignerNameChange={handleSignerNameChange}
            isLoading={isLoading}
            credential={delegatedCredential}
            onCreatePasskey={handleCreatePasskey}
            onRegister={handleRegister}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Register Delegated Signer</DrawerTitle>
          <DrawerDescription>
            Create a new passkey and register it as a delegated signer for this
            wallet.
          </DrawerDescription>
        </DrawerHeader>
        <RegisterForm
          className="px-4"
          signerName={signerName}
          onSignerNameChange={handleSignerNameChange}
          isLoading={isLoading}
          credential={delegatedCredential}
          onCreatePasskey={handleCreatePasskey}
          onRegister={handleRegister}
        />
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
