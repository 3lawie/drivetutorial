// Import necessary modules and types for database connection
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env";
import * as schema from "./schema";
import { createPool ,type Pool} from "mysql2";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
// Define a global object to cache the database client and connection
const globalForDb = globalThis as unknown as {
  client: Pool | Client | undefined; // Add Client type for compatibility
  conn: Pool | undefined; // Add conn property to cache the connection
};

// Initialize the client for database connection
const client = globalForDb.client ?? createClient({ url: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.client = client; // Cache the client in development

// Export the database object using drizzle ORM
export const db = drizzle(client as Client, { schema }); // Ensure client is of type Client

// Fix the typo in the SSL configuration and initialize the connection pool
const conn = 
  globalForDb.conn ?? 
  createPool({
    host: env.SINGLESTORE_HOST, // Database host
    port: parseInt(env.SINGLESTORE_PORT), // Database port
    user: env.SINGLESTORE_USER, // Database user
    password: env.SINGLESTORE_PASS, // Database password
    database: env.SINGLESTORE_DB_NAME, // Database name
    ssl: {},  // Corrected from ssll to ssl, SSL configuration
    maxIdle: 0, // Maximum idle connections
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn; // Cache the connection in development
