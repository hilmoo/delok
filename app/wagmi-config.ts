import { createPublicClient } from "viem";
import { createConfig, http } from "wagmi";
import { localhost } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [localhost],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http("http://host.docker.internal:8545"),
  },
});

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http("http://host.docker.internal:8545"),
});
