// SwapComponent.tsx
import React, { useState } from "react";
import { parseUnits } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import erc20Abi from "@/abis/erc20.json";
import routerAbi from "./abis/uniswapRouter.json";

const Swap = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [txHash, setTxHash] = useState<string | null>(null);

  // 🪙 Token địa chỉ (Ethereum mainnet)
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // tokenIn
  const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // tokenOut
  const router = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Uniswap V2 Router (ví dụ)

  // 🧮 Số lượng swap
  const amountIn = parseUnits("100", 6); // 100 USDT (6 decimals)
  const amountOutMin = BigInt(0); // không slippage (test thôi)

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 phút

  const swapTokens = async () => {
    try {
      // 1. ✅ Approve router được dùng USDT
      const approveTx = await writeContractAsync({
        address: usdt,
        abi: erc20Abi,
        functionName: "approve",
        args: [router, amountIn],
      });

      console.log("Approved tx:", approveTx);

      // 2. ⏳ Đợi approve xong (tùy bạn có thể skip)
      await publicClient.waitForTransactionReceipt({ hash: approveTx });

      // 3. 🚀 Gọi swap
      const swapTx = await writeContractAsync({
        address: router,
        abi: routerAbi,
        functionName: "swapExactTokensForTokens",
        args: [amountIn, amountOutMin, [usdt, dai], address!, deadline],
      });

      setTxHash(swapTx);
      console.log("Swap tx:", swapTx);
    } catch (err) {
      console.error("Swap error:", err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold text-lg mb-2">Swap USDT → DAI</h2>
      <button
        onClick={swapTokens}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Swap 100 USDT
      </button>
      {txHash && (
        <p className="mt-2 text-sm text-green-600">
          Giao dịch đã gửi: {txHash.slice(0, 10)}...
        </p>
      )}
    </div>
  );
};

export default Swap;
