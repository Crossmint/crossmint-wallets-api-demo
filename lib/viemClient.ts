import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://api.developer.coinbase.com/rpc/v1/base-sepolia/EeDFtOLXW0dUVCVpTFihKcfVeLccha2C', {
        batch: true
    }),
});