"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTransferTransaction } from "@/lib/token";
import { useState } from "react";
import type { Address } from "viem";

export default function TokenSender() {
  const [recipientAddress, setRecipientAddress] = useState<
    Address | undefined
  >();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const sendTokens = async () => {
    setStatus("sending");
    if (!recipientAddress) {
      return;
    }
    try {
      const transaction = await getTransferTransaction(
        recipientAddress,
        amount
      );
      console.log({ transaction });
      setStatus("success");
    } catch (error) {
      console.error("Error sending tokens:", error);
      setStatus("error");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Send Tokens</h2>
      <div className="flex flex-col space-y-2">
        <Input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value as Address)}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={sendTokens} disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send"}
        </Button>
        {status === "success" && (
          <p className="text-green-500">Tokens sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-500">Error sending tokens</p>
        )}
      </div>
    </div>
  );
}
