import { createPublicClient } from "viem";
import { createConfig, http } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

const isProduction = import.meta.env.VITE_ISPROD == "true";

const wagmiConfigLocal = createConfig({
  chains: [localhost],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http(
      import.meta.env.VITE_NODE_RPC_URL || process.env.NODE_RPC_URL,
    ),
  },
});

const wagmiConfigSepolia = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(
      import.meta.env.VITE_NODE_RPC_URL || process.env.NODE_RPC_URL,
    ),
  },
});

const publicClientLocal = createPublicClient({
  chain: localhost,
  transport: http(import.meta.env.VITE_NODE_RPC_URL),
  pollingInterval: 60_000, // 1 minutes
});

const publicClientSepolia = createPublicClient({
  chain: sepolia,
  transport: http(import.meta.env.VITE_NODE_RPC_URL),
  pollingInterval: 60_000, // 1 minutes
});

export const chainId = isProduction ? 11155111 : 1337;
export const wagmiConfig = isProduction ? wagmiConfigSepolia : wagmiConfigLocal;
export const publicClient = isProduction
  ? publicClientSepolia
  : publicClientLocal;
