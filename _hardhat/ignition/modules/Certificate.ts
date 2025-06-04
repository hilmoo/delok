import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OwnerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #0 hardhat
const OracleAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Account #19 hardhat
const LMS_ElemesAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const OwnerAddress = "0x3A8B1f5f0e7B6F7712B3fd6E0628bF9BBfb9E781"; // PROD Owner Address
// const OracleAddress = "0xaa6002F13b2a90EeCEb8063020D565B03D4ED8Df"; // PROD Oracle Address
// const LMS_ElemesAddress = "0x497aF9cf993976cabfb65159cAe332f8eaf88a2E"; // PROD LMS_Elemes Address

const ProxyModule = buildModule("ProxyModule", (builder) => {
  // Deploy the implementation contract
  const implementation = builder.contract("DelokCertificate");

  // Encode the initialize function call for the contract.
  const initialize = builder.encodeFunctionCall(implementation, "initialize", [
    OwnerAddress,
    OracleAddress,
  ]);

  // Deploy the ERC1967 Proxy, pointing to the implementation
  const proxy = builder.contract("ERC1967Proxy", [implementation, initialize]);

  return { proxy };
});

export const MyContractModule = buildModule("MyContractModule", (builder) => {
  // Get the proxy from the previous module.
  const { proxy } = builder.useModule(ProxyModule);

  // Create a contract instance using the deployed proxy's address.
  const instance = builder.contractAt("DelokCertificate", proxy);

  builder.call(instance, "setContractLMS_Elemes", [
    builder.getParameter("_contractElemes", LMS_ElemesAddress),
  ]);

  return { instance, proxy };
});

export default MyContractModule;
