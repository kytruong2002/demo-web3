"use client";

import { useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import StandardERC20ABI from "@/abi/StandardERC20ABI.json";
import { encodeFunctionData, formatEther, isAddress, parseEther } from "viem";

const tokenAddress = process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`;

const SendERC20 = () => {
  const [recipient, setRecipient] = useState(
    "0x7CA3Bef3b65aF34Afb4C8e64551Fd55215D6EDBa"
  );
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
  const { data: balanceToken } = useBalance({ address, token: tokenAddress });
  const [gasPrice, setGasPrice] = useState(0);
  const publicClient = usePublicClient();

  const getFuncABI = (recipient: `0x${string}`, amount: bigint) => {
    const abiFnc = {
      abi: StandardERC20ABI,
      functionName: "transfer",
      args: [recipient, amount],
    };

    return {
      params: abiFnc,
      data: encodeFunctionData(abiFnc),
    };
  };

  const getEstimateGas = async () => {
    try {
      const gasEstimate = (await publicClient?.estimateGas({
        account: address as `0x${string}`,
        to: tokenAddress,
        data: getFuncABI(recipient as `0x${string}`, parseEther(amount)).data,
      })) as bigint;

      const gasPrice = (await publicClient?.getGasPrice()) as bigint;
      setGasPrice(+formatEther(gasEstimate * gasPrice));
    } catch (error) {
      console.error(error);
      setGasPrice(0);
    }
  };

  const handleSend = async () => {
    try {
      if (!recipient || !amount) {
        setStatus("Please provide recipient and amount.");
        return;
      }

      const balance = balanceData ? balanceData.value : BigInt(0);
      if (gasPrice > +formatEther(balance)) {
        setStatus("Insufficient balance for gas.");
        return;
      }

      await writeContractAsync({
        address: tokenAddress,
        ...getFuncABI(recipient as `0x${string}`, parseEther(amount)).params,
      });
    } catch (error) {
      console.error(error);
      setStatus("Error sending transaction.");
    }
  };

  const handleChangeRecipient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    if (!isAddress(value)) {
      setStatus("Invalid recipient address.");
    } else setStatus("");
  };

  const handleChangeAmount = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const erc20Token = balanceToken ? balanceToken.value : BigInt(0);
    if (isNaN(Number(value)) || Number(value) <= 0) {
      setStatus("Invalid amount.");
    } else if (Number(value) > +formatEther(erc20Token)) {
      setStatus(
        `Insufficient ${balanceToken && balanceToken.symbol} (ERC-20 token).`
      );
    } else setStatus("");

    if (recipient && !isNaN(Number(value)) && Number(value) > 0) {
      await getEstimateGas();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Send ERC-20 Tokens</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={handleChangeRecipient}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={handleChangeAmount}
        className="py-2 px-4 border border-gray-300 rounded mb-2 w-full"
      />
      <p className="flex justify-between items-center">
        <span>Gas price: </span>{" "}
        <span>
          {gasPrice} {balanceData?.symbol}
        </span>
      </p>
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
