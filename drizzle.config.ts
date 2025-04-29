import { defineConfig } from "drizzle-kit";
import { env } from "env";
import path from "path";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["drive-tutorial_*"],
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: env.SINGLESTORE_SSL_CA
      ? {
          ca: path.resolve(process.cwd(), env.SINGLESTORE_SSL_CA), // Resolve CA bundle path
          rejectUnauthorized: true, // Enforce valid certificate
        }
      : undefined, // SSL is optional (e.g., for local testing)
  },
});