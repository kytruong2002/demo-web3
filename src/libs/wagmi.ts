import { createConfig, http } from "wagmi";
import { bscTestnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [bscTestnet, sepolia],
  transports: {
    [bscTestnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [metaMask()],
  ssr: false,
});
