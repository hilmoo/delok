import { fromHex } from "viem";
import { lmsElemesAbi, lmsElemesAddress } from "./abi";
import { client } from "./client";
import { chainId } from "./client";

export async function handleRegistrationRequest(
  userAddress: `0x${string}`,
  userLmsidHex: `0x${string}`,
) {
  const userLmsid = fromHex(userLmsidHex, "string");
  const response = await fetch(
    `${process.env.ELEMES_URL_DOCKER}/api/oracle/data/${userLmsid}/${userAddress}`,
    {
      headers: {
        "X-Is-oracle": process.env.ORACLE_HEADER || "1",
      },
    },
  );

  if (!response.ok) {
    console.error(
      `Failed to verify LMS ID for user ${userAddress}: ${response.statusText}`,
    );
    return;
  }

  const { authorized } = await response.json();

  if (!authorized) {
    console.error(
      `User ${userAddress} is not authorized for LMS ID ${userLmsid}`,
    );
    return;
  }

  client.writeContract({
    address: lmsElemesAddress[chainId],
    abi: lmsElemesAbi,
    functionName: "assignLMSid",
    args: [userAddress, userLmsidHex],
  });
}
