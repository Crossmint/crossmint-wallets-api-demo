"use client";

import { useState } from "react";
import { type Address, generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { Button } from "@/components/ui/button";

interface WalletCreatorProps {
  onWalletCreated: (address: Address) => void;
}

export default function WalletCreator({ onWalletCreated }: WalletCreatorProps) {
  const [status, setStatus] = useState<
    "not_created" | "loading" | "error" | "created"
  >("not_created");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const createWallet = async () => {
    setStatus("loading");
    try {
      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);

      setWalletAddress(account.address);
      setStatus("created");
      onWalletCreated(account.address);
    } catch (error) {
      console.error("Error creating wallet:", error);
      setStatus("error");
    }
  };

  return (
    <div className="mb-6">
      <Button
        onClick={createWallet}
        disabled={status === "loading" || status === "created"}
      >
        Create Wallet
      </Button>
      <div className="mt-2">
        {status === "loading" && <p>Creating wallet...</p>}
        {status === "error" && (
          <p className="text-red-500">Error creating wallet</p>
        )}
        {status === "created" && (
          <p>
            Wallet created! Address:{" "}
            <span className="font-mono">{walletAddress}</span>
          </p>
        )}
      </div>
    </div>
  );
}
