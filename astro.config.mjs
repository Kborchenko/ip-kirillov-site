import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwind from "@tailwindcss/vite";

const demo = process.env.AGENCY_LOCAL_DEMO === "1";
const settings = demo ? "./demo/settings.json" : "./src/config/agency.json";

export default defineConfig({
  integrations: [react()],
  output: "static",
  outDir: demo ? "./demo/site" : "./dist",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  vite: { plugins: [tailwind()], resolve: { alias: { "@agency-settings": fileURLToPath(new URL(settings, import.meta.url)) } } },
});
