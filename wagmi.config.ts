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
            11155111: "0x497aF9cf993976cabfb65159cAe332f8eaf88a2E",
          },
          DelokCertificate: {
            1337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            11155111: "0xDe7e2111F0F93168A44d8003A4ED0E913b644dA5",
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
            11155111: "0x497aF9cf993976cabfb65159cAe332f8eaf88a2E",
          },
          DelokCertificate: {
            1337: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            11155111: "0xDe7e2111F0F93168A44d8003A4ED0E913b644dA5",
          },
        },
      }),
    ],
  },
]);
