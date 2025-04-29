// Import necessary modules and types for database connection
import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2";
import { env } from "env";
import * as schema from "./schema";
import path from "path";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined; // Type definition for the connection pool
};

// Initialize the client for database connection
const conn =
  globalForDb.conn ??
  createPool({
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
    maxIdle: 0, // Maximum number of idle connections to keep (0 means no idle connections)
  });

// Cache the connection in development mode to improve performance
if (process.env.NODE_ENV === "development") globalForDb.conn = conn;

// Export the database object using drizzle ORM
export const db = drizzle(conn, { schema, mode: "default" });