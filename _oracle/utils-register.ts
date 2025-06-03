import { fromHex } from "viem";
import { lmsElemesAbi, lmsElemesAddress } from "./abi";
import { client } from "./client";

export async function handleRegistrationRequest(
  userAddress: `0x${string}`,
  userLmsidHex: `0x${string}`,
) {
  const userLmsid = fromHex(userLmsidHex, "string");
  const response = await fetch(
    `http://host.docker.internal:4000/api/oracle/data/${userLmsid}/${userAddress}`,
    {
      headers: {
        "X-Is-oracle": "1",
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
    address: lmsElemesAddress[1337],
    abi: lmsElemesAbi,
    functionName: "assignLMSid",
    args: [userAddress, userLmsidHex],
  });
}
