import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";
export default defineConfig({
  root: "app",
  base: "/momentum/",
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: { outDir: "../dist", emptyOutDir: true },
  test: { include: ["src/**/*.test.ts"], maxWorkers: 2, environment: "node" },
});
