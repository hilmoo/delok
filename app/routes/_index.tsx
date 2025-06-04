import { ActionIcon, Button, Center, Container, Paper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { signMessage } from "@wagmi/core";
import { ofetch } from "ofetch";
import { data, redirect, useNavigate } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import { randomUUID } from "uncrypto";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useAccount, useConnect } from "wagmi";
import Logo from "~/components/logo";
import { commitSession, getSession } from "~/lib/sessions";
import { storage } from "~/lib/storage";
import type { LoginPayload } from "~/types/auth";
import { wagmiConfig } from "~/wagmi-config";
import TokenBrandedMetamask from "~icons/token-branded/metamask";
import type { Route } from "./+types/_index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("address")) {
    return redirect("/app");
  }

  const requestId = randomUUID();
  const nonce = generateSiweNonce();

  await storage.setItem(requestId, nonce);

  return data(
    {
      requestId: requestId,
      nonce: nonce,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { requestId, nonce } = loaderData;
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const navigate = useNavigate();

  const mutationLogin = useMutation({
    mutationFn: async () => {
      if (!address) {
        throw new Error("No address found. Please connect your wallet.");
      }
      const message = createSiweMessage({
        address: address,
        chainId: 1337,
        domain: "localhost",
        nonce: nonce,
        uri: import.meta.env.VITE_ELEMES_URL,
        version: "1",
        requestId: requestId,
      });
      const signature = await signMessage(wagmiConfig, {
        account: address,
        message: message,
      });

      const payload: LoginPayload = {
        message: message,
        signature: signature,
      };
      await ofetch("/api/login", {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: async () => {
      navigate("/app");
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });

  return (
    <Container size={420} my={40}>
      <Center>
        <ActionIcon
          size={100}
          variant="transparent"
          aria-label="Logo"
          onClick={() => navigate("/")}
        >
          <Logo />
        </ActionIcon>
      </Center>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <ClientOnly fallback={<div>Loading...</div>}>
          {() => (
            <Button
              fullWidth
              leftSection={<TokenBrandedMetamask />}
              variant={"light"}
              onClick={() => {
                if (address) {
                  return mutationLogin.mutate();
                }
                if (!address) {
                  connect({ connector: connectors[0] });
                }
              }}
              loading={mutationLogin.isPending}
            >
              {address ? "SIWE" : "Sign in with Metamask"}
            </Button>
          )}
        </ClientOnly>
      </Paper>
    </Container>
  );
}
