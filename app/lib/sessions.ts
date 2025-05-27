import { createCookieSessionStorage } from "react-router";

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
      domain: "localhost",
      // httpOnly: true,
      maxAge: 60 * 60 * 1, // 1 hour
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET || "default_secret"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession };
