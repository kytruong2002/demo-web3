"use client";
import React, { useEffect, useState } from "react";
import { formatEther, formatUnits, erc20Abi } from "viem";
import { bscTestnet, polygon, sepolia } from "viem/chains";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import StandardERC20ABI from "@/abi/StandardERC20ABI.json";

const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

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
    address: tokenAddress,
    abi: StandardERC20ABI,
    functionName: "decimals",
    chainId: bscTestnet.id,
  });

  const { data: nameERC20 } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "name",
  });

  const { data: symbolERC20 } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: rawBalance } = useReadContract({
    address: tokenAddress,
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
        const sepoliaBalance = await publicClientSepolia?.getBalance({
          address,
        });
        const polygonBalance = await publicClientPolygon?.getBalance({
          address,
        });
        const bscTestnetBalance = await publicClientBSCTestnet?.getBalance({
          address,
        });

        setBalances({
          sepolia: formatEther(sepoliaBalance as bigint),
          polygon: formatEther(polygonBalance as bigint),
          bscTestnet: formatEther(bscTestnetBalance as bigint),
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
          <p>{sepolia.nativeCurrency.name}:</p>
          <p>
            {balances?.sepolia} {sepolia.nativeCurrency.symbol}
          </p>

          <p>{bscTestnet.nativeCurrency.name}:</p>
          <p>
            {balances?.bscTestnet} {bscTestnet.nativeCurrency.symbol}
          </p>

          <p>{polygon.nativeCurrency.name}:</p>
          <p>
            {balances?.polygon} {polygon.nativeCurrency.symbol}
          </p>
        </div>
      )}
      <h3 className="pb-4 uppercase font-bold mt-8">
        Token Balances (ERC-20 Token)
      </h3>
      {isConnected && nameERC20 && (
        <div className="grid grid-cols-2 gap-4">
          <p>{nameERC20}: </p>
          <p>
            {balanceToken} {symbolERC20}
          </p>
        </div>
      )}
      {!isConnected && !address && <p>Please connect your wallet.</p>}
    </div>
  );
};

export default Balance;
