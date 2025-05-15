"use client";

import { shortenAddress } from "@/helpers/functions";
import React, { useState } from "react";
import { formatEther, isAddress, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useSendTransaction,
} from "wagmi";

const SendBNB = () => {
  const { address } = useAccount();
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
  const publicClient = usePublicClient();
  const [recipient, setRecipient] = useState(
    "0x7CA3Bef3b65aF34Afb4C8e64551Fd55215D6EDBa"
  );
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const { data: balanceData } = useBalance({ address });

  const checkGas = async () => {
    if (!recipient || !amount) {
      setStatus("Please provide recipient and amount.");
      return false;
    }

    try {
      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      const gasLimit = (await publicClient?.estimateGas({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      })) as bigint;
      const gasFee = gasPrice * gasLimit;

      if (
        parseEther(amount) + gasFee >
        (balanceData ? balanceData.value : BigInt(0))
      ) {
        setStatus("Insufficient BNB balance.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error estimating gas:", error);
      setStatus("Error estimating gas.");
      return false;
    }
  };

  async function handleSend() {
    const hasSufficientBalance = await checkGas();

    if (!hasSufficientBalance) return;

    await sendTransactionAsync({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    });
  }

  const handleChangeRecipient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    if (!isAddress(value)) {
      setStatus("Invalid recipient address.");
    } else setStatus("");
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const balance = balanceData ? balanceData.value : BigInt(0);
    if (isNaN(Number(value)) || Number(value) <= 0) {
      setStatus("Invalid amount.");
    } else if (Number(value) > +formatEther(balance)) {
      setStatus("Insufficient BNB balance.");
    } else setStatus("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Send BNB</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={handleChangeRecipient}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Amount (BNB)"
        value={amount}
        onChange={handleChangeAmount}
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
