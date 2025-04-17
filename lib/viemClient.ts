import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL, {
    batch: true,
  }),
});
