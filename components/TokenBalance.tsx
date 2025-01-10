"use client";

import { getBalanceOf } from "@/lib/token";
import { useEffect, useState } from "react";
import type { Address } from "viem";

interface TokenBalanceProps {
  walletAddress: Address;
}

export default function TokenBalance({ walletAddress }: TokenBalanceProps) {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await getBalanceOf(walletAddress);
        setBalance(walletBalance);
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Token Balance</h2>
      {balance !== null ? (
        <p>Balance: {balance} tokens</p>
      ) : (
        <p>Error fetching balance</p>
      )}
    </div>
  );
}
