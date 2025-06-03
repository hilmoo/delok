import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

const account = privateKeyToAccount(
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
);

export const client = createWalletClient({
  account,
  chain: localhost,
  transport: http("http://host.docker.internal:8545"),
}).extend(publicActions);

export const publicClient = createPublicClient({
  chain: localhost,
  transport: http("http://host.docker.internal:8545"),
});
