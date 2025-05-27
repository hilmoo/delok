import { ActionIcon, AppShell, Button, Container, Group } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { data, Outlet, redirect, useNavigate } from "react-router";
import { useDisconnect } from "wagmi";
import { SchemaColor } from "~/components/SchemaColor/SchemaColor";
import { getSession } from "~/lib/sessions";
import type { Lms } from "~/types/lms";
import type { Route } from "./+types/app";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));


  if (!session.has("address")) {
    return redirect("/");
  }

}

export default function Index({ loaderData }: Route.ComponentProps) {
 
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  const mutationLogout = useMutation({
    mutationFn: async () => {
      await ofetch("/api/logout", {
        method: "POST",
      });
    },
    onSuccess: async () => {
      await navigate("/");
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
    },
  });

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container h={"100%"}>
          <Group h="100%" px="md" justify={"space-between"} align={"center"}>
            <ActionIcon
              size={50}
              variant="transparent"
              aria-label="Logo"
              onClick={() => navigate("/app")}
            ></ActionIcon>
            <Group>
              <Button
                bg={"red"}
                onClick={async () => {
                  disconnect();
                  await mutationLogout.mutateAsync();
                }}
                loading={mutationLogout.isPending}
              >
                Sign Out
              </Button>
              <SchemaColor />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
