import { createCookieSessionStorage } from "react-router";
import { envClient } from "~/envClient";
import { envServer } from "~/envServer";

type SessionData = {
  address: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "session",
      domain: envClient.VITE_COOKIE_DOMAIN,
      httpOnly: envClient.VITE_ISPROD ? true : false,
      maxAge: 60 * 60 * 1, // 1 hour
      path: "/",
      sameSite: "lax",
      secrets: [envServer.SESSION_SECRET || "default_secret"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession };
