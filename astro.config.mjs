import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local, s3 } from "emdash/astro";
import { sqlite, postgres } from "emdash/db";

// Adapters are selected at build time; credentials are resolved at runtime.
const usePostgres = process.env.EMDASH_DATABASE === "postgres";
const useS3 = process.env.EMDASH_STORAGE === "s3";
const database = usePostgres
  ? {
      ...postgres({ pool: { max: 5, connectionTimeoutMillis: 5000 } }),
      entrypoint: new URL("./src/db/postgres.ts", import.meta.url).pathname,
    }
  : sqlite({ url: "file:./data.db" });

export default defineConfig({
  output: "server",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
  },
  adapter: node({
    mode: "standalone",
  }),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [
    react(),
    emdash({
      database,
      storage: useS3
        ? s3()
        : local({
            directory: "./uploads",
            baseUrl: "/_emdash/api/media/file",
          }),
    }),
  ],
  devToolbar: { enabled: false },
});
