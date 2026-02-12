import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    alias: {
      "#src": path.resolve(__dirname, "./src"),
      "#test": path.resolve(__dirname, "./test"),
    },
    include: ["test/**/*.test.ts"],
  },
});
