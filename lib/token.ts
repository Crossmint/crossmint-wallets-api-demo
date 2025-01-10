import { publicClient } from "@/lib/viemClient";
import { type Address, encodeFunctionData, formatUnits, parseAbi, parseUnits } from "viem";

export const TOKEN_ADDRESS = "0x14196F08a4Fa0B66B7331bC40dd6bCd8A1dEeA9F";
export const TOKEN_ABI = parseAbi([
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint256 amount) returns (bool)",
]);

export const getBalanceOf = async (walletAddress: Address) => {
    const [rawBalance, decimals] = await Promise.all([
        publicClient.readContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: "balanceOf",
            args: [walletAddress],
        }),
        publicClient.readContract({
            address: TOKEN_ADDRESS,
            abi: TOKEN_ABI,
            functionName: "decimals",
        }),
    ]);
    return formatUnits(rawBalance, decimals);
};

export const getTransferTransaction = async (recipientAddress: Address, amount: string) => {
    const decimals = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: "decimals",
    });

    const data = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount, decimals)],
    });

    return {
        to: TOKEN_ADDRESS, // The token contract address
        data: data, // The encoded function call
        value: '0', // No ETH is being sent
    };
};