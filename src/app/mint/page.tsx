"use client";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { uploadToIPFS } from "@/libs/ipfs";

const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function MintNFT() {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const { writeContract, isPending, isSuccess } = useWriteContract();

  const handleMint = async () => {
    if (!file) return alert("Chọn file ảnh trước");

    const tokenURI = await uploadToIPFS(file, name, desc); // ipfs://xxx

    writeContract({
      abi: abi,
      address: address as `0x${string}`,
      functionName: "mint",
      args: [tokenURI],
    });
  };

  return (
    <div className="p-4 space-y-2">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <input
        placeholder="Tên NFT"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Mô tả"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button onClick={handleMint} disabled={isPending}>
        {isPending ? "Đang đúc..." : "Đúc NFT"}
      </button>
      {isSuccess && <p className="text-green-600">✅ Đúc thành công!</p>}
    </div>
  );
}
