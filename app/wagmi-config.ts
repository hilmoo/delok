import { createPublicClient } from "viem";
import { createConfig, http } from "wagmi";
import { localhost, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { envClient } from "./envClient";

const isProduction = envClient.VITE_ISPROD == "true";

const wagmiConfigLocal = createConfig({
  chains: [localhost],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http(envClient.VITE_NODE_RPC_URL),
  },
});

const wagmiConfigSepolia = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(envClient.VITE_NODE_RPC_URL),
  },
});

const publicClientLocal = createPublicClient({
  chain: localhost,
  transport: http(envClient.VITE_NODE_RPC_URL),
  pollingInterval: 1_000, // 1 milisecond
});

const publicClientSepolia = createPublicClient({
  chain: sepolia,
  transport: http(envClient.VITE_NODE_RPC_URL),
  pollingInterval: 300_000, // 5 minutes
});

export const chainId = isProduction ? 11155111 : 1337;
export const wagmiConfig = isProduction ? wagmiConfigSepolia : wagmiConfigLocal;
export const publicClient = isProduction
  ? publicClientSepolia
  : publicClientLocal;
