import { WebAuthnP256 } from 'ox';
import type { Hex } from 'viem';

export const createCredential = (name: string) =>
  WebAuthnP256.createCredential({ name });

export const signMessage = (credentialId: string, message: Hex) =>
  WebAuthnP256.sign({
    challenge: message,
    credentialId,
  });
