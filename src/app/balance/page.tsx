"use client";
import React, { useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";
import { bscTestnet, polygon, sepolia } from "viem/chains";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import StandardERC20ABI from "@/abi/StandardERC20ABI.json";

const Balance = () => {
  const { address, isConnected } = useAccount();
  const publicClientSepolia = usePublicClient({ chainId: sepolia.id });
  const publicClientPolygon = usePublicClient({ chainId: polygon.id });
  const publicClientBSCTestnet = usePublicClient({ chainId: bscTestnet.id });
  const [balances, setBalances] = useState<{
    sepolia: string;
    polygon: string;
    bscTestnet: string;
  } | null>(null);

  const { data: decimals } = useReadContract({
    address: address,
    abi: StandardERC20ABI,
    functionName: "decimals",
    chainId: bscTestnet.id,
  });

  const { data: rawBalance } = useReadContract({
    address: address,
    abi: StandardERC20ABI,
    functionName: "balanceOf",
    args: [address!],
    chainId: bscTestnet.id,
  });

  const balanceToken =
    rawBalance && decimals
      ? formatUnits(rawBalance as bigint, decimals as number)
      : "0";

  useEffect(() => {
    if (address && isConnected) {
      const getBalances = async () => {
        const sepolia = await publicClientSepolia?.getBalance({ address });
        const polygon = await publicClientPolygon?.getBalance({ address });
        const bscTestnet = await publicClientBSCTestnet?.getBalance({
          address,
        });

        setBalances({
          sepolia: formatEther(sepolia as bigint),
          polygon: formatEther(polygon as bigint),
          bscTestnet: formatEther(bscTestnet as bigint),
        });
      };
      getBalances();
    }
  }, [
    address,
    isConnected,
    publicClientBSCTestnet,
    publicClientPolygon,
    publicClientSepolia,
  ]);

  return (
    <div>
      <h3 className="pb-4 uppercase font-bold">
        Token Balances (Native Token)
      </h3>
      {isConnected && balances && (
        <div className="grid grid-cols-2 gap-4">
          <p>Ethereum Balance:</p>
          <p>{balances?.sepolia} SepoliaETH</p>

          <p>Binance Smart Chain (tBNB) Balance:</p>
          <p>{balances?.bscTestnet} tBNB</p>

          <p>Polygon Balance:</p>
          <p>{balances?.polygon} MATIC</p>
        </div>
      )}
      <h3 className="pb-4 uppercase font-bold mt-8">
        Token Balances (ERC-20 Token)
      </h3>
      {isConnected && balanceToken && (
        <div className="grid grid-cols-2 gap-4">
          <p>Your Balance: </p>
          <p>{balanceToken} USDT</p>
        </div>
      )}
      {!isConnected && !address && <p>Please connect your wallet.</p>}
    </div>
  );
};

export default Balance;
