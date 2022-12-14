import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    deps: {
      inline: ["vitest-mock-process"],
    },
    setupFiles: ["./vitest.setup.ts"],
  },
  build: {
    sourcemap: true,
  },
});
