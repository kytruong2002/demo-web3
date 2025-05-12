"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

const ERC721_ABI = [
  {
    name: "mintNFT",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }],
    outputs: [],
  },
];

const NFT = () => {
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState("");
  const [to, setTo] = useState("");
  const { address } = useAccount();

  const mintNFT = async (to: string) => {
    try {
      await writeContractAsync({
        address: address as `0x${string}`,
        abi: ERC721_ABI,
        functionName: "mintNFT",
        args: [to],
      });
      setStatus("Transaction sent, waiting for confirmation...");
    } catch {
      setStatus("Error minting NFT");
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Mint NFT</h1>
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full py-2 px-4"
      />
      <button
        onClick={() => mintNFT(to)}
        className="text-lg py-3 mt-2 cursor-pointer text-white hover:opacity-85 duration-300 w-full bg-black"
      >
        Mint NFT
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default NFT;
