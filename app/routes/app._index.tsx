import { Container, Paper } from "@mantine/core";
import { data, redirect, useNavigate } from "react-router";
import { LmsCards } from "~/components/Cards/LmsCards";
import { getSession } from "~/lib/sessions";
import type { Lms } from "~/types/lms";
import type { Route } from "./+types/app._index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("address")) {
    return redirect("/");
  }

  const dummyData: Lms[] = [
    {
      id: 1,
      name: "ELEMES",
      url: import.meta.env.VITE_ELEMES_URL,
    },
  ];
  return data({
    lms: dummyData,
  });
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { lms } = loaderData;

  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <LmsCards data={lms} />
      </Paper>
    </Container>
  );
}
