"use client";

import { shortenAddress } from "@/helpers/functions";
import Link from "next/link";
import { FaRegCopy } from "react-icons/fa";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { isConnected, address } = useAccount();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(address as `0x${string}`)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <ul className="flex gap-4">
        <li>
          <Link href="/">🔌 Connect</Link>
        </li>
        <li>
          <Link href="/balance">💰 Balance</Link>
        </li>
        <li>
          <Link href="/send-bnb">📤 Send BNB</Link>
        </li>
        <li>
          <Link href="/erc20">💎 ERC-20</Link>
        </li>
        <li>
          <Link href="/swap">🔁 Swap</Link>
        </li>
        <li>
          <Link href="/nft">🎨 NFT</Link>
        </li>
      </ul>
      {isConnected && (
        <div className="flex group relative items-center justify-end gap-2">
          <span>{shortenAddress(address as `0x${string}`)}</span>
          <span
            className="cursor-pointer hover:opacity-85"
            onClick={copyToClipboard}
          >
            <FaRegCopy />
          </span>
          <span className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded py-1 px-2 right-full mr-2 top-1/2 transform -translate-y-1/2">
            {address}
          </span>
        </div>
      )}
    </nav>
  );
}
