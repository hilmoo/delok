import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

const privateKey = process.env.ORACLE_PRIVATE_KEY as `0x${string}`; 
const account = privateKeyToAccount(privateKey);

export const client = createWalletClient({
  account,
  chain: localhost,
  transport: http(process.env.NODE_RPC_URL),
}).extend(publicActions);

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http(process.env.NODE_RPC_URL),
});

const isProduction = process.env.NODE_ENV == "production";
export const chainId = isProduction ? 11155111 : 1337;