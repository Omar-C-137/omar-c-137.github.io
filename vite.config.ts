import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    base: '/', // Root path for the GitHub Pages site at https://omar-c-137.github.io/
  }
});
