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
      "@admin": path.resolve(__dirname, "./apps/admin/src"),
      "@esport-sumbar/contracts": path.resolve(__dirname, "./packages/contracts/src"),
      "@esport-sumbar/domain": path.resolve(__dirname, "./packages/domain/src"),
      "@esport-sumbar/design-tokens": path.resolve(__dirname, "./packages/design-tokens/src"),
      "@esport-sumbar/ui": path.resolve(__dirname, "./packages/ui/src"),
      "@esport-sumbar/lib": path.resolve(__dirname, "./packages/lib/src"),
      "@esport-sumbar/config": path.resolve(__dirname, "./packages/config"),
    },
  },
});
