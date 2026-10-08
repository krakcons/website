import { createDialect as createPostgresDialect } from "emdash/db/postgres";

// Astro serializes adapter config into the build. Resolve the connection URL
// here instead so database credentials never become part of the image.
export const createDialect = (
  config: Parameters<typeof createPostgresDialect>[0],
) => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for the PostgreSQL deployment.");
  }
  return createPostgresDialect({ ...config, connectionString });
};
