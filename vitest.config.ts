import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web/src"),
      "@esport-sumbar/contracts": path.resolve(__dirname, "./packages/contracts/src"),
      "@esport-sumbar/lib": path.resolve(__dirname, "./packages/lib/src"),
      "@esport-sumbar/config": path.resolve(__dirname, "./packages/config"),
    },
  },
});
