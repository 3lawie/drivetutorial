import { defineConfig } from "drizzle-kit";
import { env } from "env";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["drive-tutorial_*"],
});