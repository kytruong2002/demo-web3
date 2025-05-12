"use client";

import { shortenAddress } from "@/helpers/functions";
import React, { useState } from "react";
import { formatEther, parseEther } from "viem";
import { bscTestnet } from "viem/chains";
import {
  useBalance,
  useChainId,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";

const SendBNB = () => {
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction({
    mutation: {
      onSuccess: (tx) => {
        setStatus(`Transaction sent! Tx Hash: ${shortenAddress(tx)}`);
      },
      onError: (error) => {
        console.error(error);
        setStatus("Error sending transaction.");
      },
    },
  });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const { data: balanceData } = useBalance();

  const handleSend = async () => {
    if (chainId !== bscTestnet.id) {
      try {
        await switchChainAsync({ chainId: bscTestnet.id });
      } catch {
        throw new Error("Failed to switch network");
      }
    }

    if (chainId !== bscTestnet.id) {
      throw new Error("Wrong network");
    }
    try {
      if (!recipient || !amount) {
        setStatus("Please provide recipient and amount.");
        return;
      }

      const balance = parseFloat(formatEther(balanceData?.value || BigInt(0)));
      const amountToSend = parseFloat(amount);
      if (amountToSend > balance) {
        setStatus("Insufficient BNB balance.");
        return;
      }

      await sendTransactionAsync({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error(error);
      setStatus("Error sending transaction.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Send BNB</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Amount (BNB)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <button
        onClick={handleSend}
        className="text-lg py-3 mt-2 cursor-pointer text-white hover:opacity-85 duration-300 w-full bg-black"
      >
        Send
      </button>
      <p>{status}</p>
    </div>
  );
};

export default SendBNB;
