import { redirect } from "react-router";
import { destroySession, getSession } from "~/lib/sessions";
import type { Route } from "./+types/api.logout";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
