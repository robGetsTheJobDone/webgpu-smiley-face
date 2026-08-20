import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "es2022" },
  test: {
    coverage: { reporter: ["text", "json-summary"] }
  }
});
