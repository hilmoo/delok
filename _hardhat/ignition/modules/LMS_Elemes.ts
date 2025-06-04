import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OracleAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; // Account #19 hardhat
// const OracleAddress = "0xaa6002F13b2a90EeCEb8063020D565B03D4ED8Df"; // PROD Oracle Address

const LMS_Elemes_Module = buildModule("LMSElemesModule", (m) => {
  const oracleAddress = m.getParameter("_oracle", OracleAddress);

  const LMS_Elemes = m.contract("LMS_Elemes", [oracleAddress]);

  return { LMS_Elemes };
});

export default LMS_Elemes_Module;
