"use client";

import { config } from "@/libs/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import Navbar from "./navBar";

const queryClient = new QueryClient();

const WrapperProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <main className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            {children}
          </div>
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WrapperProvider;
