"use client";

import { useState } from "react";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import StandardERC20ABI from "@/abi/StandardERC20ABI.json";
import { parseEther } from "viem";
import { estimateGas } from "@wagmi/core";
import { config } from "@/libs/wagmi";

const SendERC20 = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setStatus(`Transaction sent!`);
      },
      onError: (error) => {
        console.error(error);
        setStatus("Error sending transaction.");
      },
    },
  });
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  const handleSend = async () => {
    try {
      if (!recipient || !amount) {
        setStatus("Please provide recipient and amount.");
        return;
      }

      const gasEstimate = await estimateGas(config, {
        account: address as `0x${string}`,
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });

      if (balanceData?.value && balanceData?.value < gasEstimate) {
        setStatus("Insufficient token balance.");
        return;
      }

      await writeContractAsync({
        address: address as `0x${string}`,
        abi: StandardERC20ABI,
        functionName: "transfer",
        args: [recipient as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error(error);
      setStatus("Error sending transaction.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Send ERC-20 Tokens</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Amount"
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

export default SendERC20;
