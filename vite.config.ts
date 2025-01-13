import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ghPages } from "vite-plugin-gh-pages";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ghPages()],
  base: "/pomo-session-planner-poc/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
