import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envClient = createEnv({
  clientPrefix: "VITE_",

  client: {
    VITE_ISPROD: z.string().min(1),
    VITE_ELEMES_URL: z.string().min(1),
    VITE_NODE_RPC_URL: z.string().min(1),
    VITE_COOKIE_DOMAIN: z.string().min(1),
    VITE_BASE_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
});
