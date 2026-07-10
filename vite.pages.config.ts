import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// GitHub Pages needs base path = repo name
// If custom domain, keep base = "/"
const isGithubPages = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "miku-chan";

export default defineConfig({
  base: isGithubPages ? `/${repoName}/` : "/",
  plugins: [tsConfigPaths(), react(), tailwindcss()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
});
