"use client";

import React, { useEffect } from "react";
import { bscTestnet } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";

const WrapperContent = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== bscTestnet.id) {
      switchChain({ chainId: bscTestnet.id });
    }
  }, [isConnected, chainId, switchChain]);
  return <>{children}</>;
};

export default WrapperContent;
