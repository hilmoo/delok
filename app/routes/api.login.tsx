import { getPublicClient } from "@wagmi/core";
import { data, redirect } from "react-router";
import { parseSiweMessage } from "viem/siwe";
import { wagmiConfig } from "~/wagmi-config";
import { commitSession, getSession } from "~/lib/sessions";
import { storage } from "~/lib/storage";
import type { LoginPayload } from "~/types/auth";
import type { Route } from "./+types/api.login";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const client = getPublicClient(wagmiConfig);
  const payload: LoginPayload = await request.json();

  if (!payload.message || !payload.signature) {
    return data({ success: false, message: "Invalid payload" });
  }

  const parsedMessage = parseSiweMessage(payload.message);
  if (!parsedMessage.requestId) {
    return data({ success: false, message: "Invalid message format" });
  }
  const storageNonce = await storage.getItem(parsedMessage.requestId);
  if (!storageNonce) {
    return data({ success: false, message: "Invalid request ID" });
  }
  if (storageNonce !== parsedMessage.nonce) {
    return data({ success: false, message: "Invalid nonce" });
  }
  await storage.removeItem(parsedMessage.requestId);

  const valid = await client.verifySiweMessage({
    message: payload.message,
    signature: payload.signature,
  });

  if (!valid) {
    return data({ success: false, message: "Invalid signature" });
  }

  if (parsedMessage.chainId !== 1337) {
    return data({ success: false, message: "Invalid chain ID" });
  }

  if (!parsedMessage.address) {
    return data({ success: false, message: "Invalid address" });
  }

  session.set("address", parsedMessage.address);

  return redirect("/app", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
