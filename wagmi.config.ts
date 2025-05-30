import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "app/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "./hardhat",
      deployments: {
        "LMS_Elemes": {
          31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        },
      },
    }),
  ],
});
