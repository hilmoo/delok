import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost, sepolia } from "viem/chains";

const isProduction = process.env.NODE_ENV == "production";
const privateKey = process.env.ORACLE_PRIVATE_KEY as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const clientLocal = createWalletClient({
  account,
  chain: localhost,
  transport: http(process.env.NODE_RPC_URL),
}).extend(publicActions);

const clientSepolia = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.NODE_RPC_URL),
}).extend(publicActions);

const publicClientLocal = createPublicClient({
  chain: localhost,
  transport: http(process.env.NODE_RPC_URL),
  pollingInterval: 1_000, // 1 minutes
});
const publicClientSepolia = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NODE_RPC_URL),
  pollingInterval: 60_000, // 1 minutes
});

export const client = isProduction ? clientSepolia : clientLocal;
export const publicClient = isProduction
  ? publicClientSepolia
  : publicClientLocal;
export const chainId = isProduction ? 11155111 : 1337;
