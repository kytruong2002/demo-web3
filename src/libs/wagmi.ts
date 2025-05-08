import { createConfig, http } from "wagmi";
import { bscTestnet, polygon, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [bscTestnet, sepolia, polygon],
  transports: {
    [bscTestnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [metaMask()],
  ssr: false,
});
