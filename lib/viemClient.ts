import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

if (!RPC_URL) {
  throw new Error('NEXT_PUBLIC_RPC_URL is not set');
}

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL, {
    batch: true,
  }),
});
