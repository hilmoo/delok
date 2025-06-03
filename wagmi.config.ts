import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig([
  {
    out: "app/abi.ts",
    contracts: [],
    plugins: [
      hardhat({
        project: "./_hardhat",
        deployments: {
          LMS_Elemes: {
            1337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          },
          DelokCertificate: {
            1337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          },
        },
      }),
    ],
  },
  {
    out: "_oracle/abi.ts",
    contracts: [],
    plugins: [
      hardhat({
        project: "./_hardhat",
        deployments: {
          LMS_Elemes: {
            1337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          },
          DelokCertificate: {
            1337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
          },
        },
      }),
    ],
  },
]);
