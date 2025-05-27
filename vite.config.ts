import { reactRouter } from "@react-router/dev/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    Icons({ autoInstall: true, compiler: "jsx", jsx: "react" }),
  ],
});
