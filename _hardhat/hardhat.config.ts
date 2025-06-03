import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@openzeppelin/hardhat-upgrades";
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.22",
  networks: {
    hardhathost: {
      chainId: 1337,
      url: "http://host.docker.internal:8545",
    },
  },
};

export default config;
