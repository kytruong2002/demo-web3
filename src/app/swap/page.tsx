// SwapComponent.tsx
"use client";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import PancakeRouterABI from "@/abi/PancakeRouterABI.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { config } from "@/libs/wagmi";

const routerAddress = process.env.NEXT_PUBLIC_SWAP_ROUTER as `0x${string}`; // PancakeSwap V2 Router (BNB Testnet)
const tokenAddress = process.env.NEXT_PUBLIC_ERC20_ADDRESS as `0x${string}`; // Token bạn muốn nhận
const WBNBAddress = process.env.NEXT_PUBLIC_WBNB_ADDRESS as `0x${string}`; // WBNB Testnet
const USDTAddress = process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}`; // USDT Testnet

const Swap = () => {
  const publicCloient = usePublicClient();
  const [ampountIn, setAmountIn] = useState("0.001");
  const { address } = useAccount();

  const handleSwap = async () => {
    const commands = new Uint8Array([1]);
    const amountOutMin = 0;
    const path = [WBNBAddress, USDTAddress];
    const to = address!;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold text-lg mb-2">Swap BNB → ERC20</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Swap BNB
      </button>
    </div>
  );
};

export default Swap;
