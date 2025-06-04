import { createPublicClient } from "viem";
import { createConfig, http } from "wagmi";
import { localhost } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [localhost],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http(
      import.meta.env.VITE_NODE_RPC_URL || process.env.NODE_RPC_URL,
    ),
  },
});

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http(import.meta.env.VITE_NODE_RPC_URL),
  pollingInterval: 60_000, // 1 minutes
});

const isProduction = import.meta.env.VITE_ISPROD == "true";
export const chainId = isProduction ? 11155111 : 1337;