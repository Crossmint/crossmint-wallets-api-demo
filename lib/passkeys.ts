import { WebAuthnP256 } from 'ox';

export const createCredential = (name: string) =>
  WebAuthnP256.createCredential({ name });
