import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/types": resolve(__dirname, "./src/types"),
      vue: "vue/dist/vue.esm.js",
    },
  },
  define: {
    // Mock Kirby panel global
    "window.panel": "globalThis.mockPanel",
  },
});
