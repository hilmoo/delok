import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OwnerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #0 hardhat
const OracleAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Account #19 hardhat

const LMS_Elemes_Module = buildModule("LMSElemesModule", (m) => {
  const oracleAddress = m.getParameter("_oracle", OracleAddress);

  const LMS_Elemes = m.contract("LMS_Elemes", [oracleAddress]);

  return { LMS_Elemes };
});

export default LMS_Elemes_Module;
