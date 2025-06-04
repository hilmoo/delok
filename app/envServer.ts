import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envServer = createEnv({
  server: {
    ELEMES_URL_DOCKER: z.string().min(1),
    NODE_RPC_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
