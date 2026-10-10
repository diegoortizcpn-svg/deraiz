import { defineConfig } from "vitest/config";
import path from "node:path";

// La carpeta tests/ es independiente de la app: las dependencias se resuelven desde tests/node_modules.
export default defineConfig({
  resolve: {
    alias: {
      "@stellar/stellar-sdk": path.resolve(__dirname, "node_modules/@stellar/stellar-sdk"),
      "@": path.resolve(__dirname, "../src"),
    },
  },
  test: { include: ["*.test.ts"] },
});
