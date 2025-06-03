import { createConfig, http } from "wagmi";
import { localhost } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [localhost],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http("http://localhost:8545"),
  },
});