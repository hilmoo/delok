import { Button, Container, Fieldset, Paper, TextInput } from "@mantine/core";
import { redirect } from "react-router";
import { getSession } from "~/lib/sessions";
import type { Route } from "./+types/app._index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("address")) {
    return redirect("/");
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Fieldset legend="Register">
          <TextInput label="Your account Id" />
          <Button mt="md" fullWidth>
            submit
          </Button>
        </Fieldset>
        <Fieldset legend="Minting Certificate">
          <Button mt="md" fullWidth>
            Course 1
          </Button>
        </Fieldset>
      </Paper>
    </Container>
  );
}
