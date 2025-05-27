import { createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
