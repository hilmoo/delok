import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@openzeppelin/hardhat-upgrades";
import { vars, type HardhatUserConfig } from "hardhat/config";

const NODE_RPC_URL = vars.get("NODE_RPC_URL");

const config: HardhatUserConfig = {
  solidity: "0.8.22",
  networks: {
    hardhathost: {
      chainId: 1337,
      url: NODE_RPC_URL,
    },
  },
};

export default config;
