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
  transport: http(import.meta.env.VITE_NODE_RPC_URL_CLIENT),
});
