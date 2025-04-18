// Import necessary modules and types for database connection
import { drizzle } from "drizzle-orm/mysql2"; // Drizzle ORM for MySQL operations
import { createPool, type Pool } from "mysql2"; // MySQL connection pool management
import { env } from "env"; // Environment variables for database configuration
import * as schema from "./schema"; // Database schema definitions

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
// Define a global object to cache the database client and connection
// This helps prevent multiple connections during development hot reloads
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined; // Type definition for the connection pool
};

// Initialize the client for database connection
// Creates a new connection pool if one doesn't exist, otherwise uses the cached one
const conn = 
  globalForDb.conn ?? 
  createPool({
    host: env.SINGLESTORE_HOST, // Database host address
    port: parseInt(env.SINGLESTORE_PORT), // Database port number
    user: env.SINGLESTORE_USER, // Database username
    password: env.SINGLESTORE_PASS, // Database password
    database: env.SINGLESTORE_DB_NAME, // Database name
    ssl: {},  // SSL configuration for secure connections
    maxIdle: 0, // Maximum number of idle connections to keep (0 means no idle connections)
  });

// Cache the connection in development mode to improve performance
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Export the database object using drizzle ORM
// mode: "default" is required for MySQL connections
export const db = drizzle(conn, { schema, mode: "default" });
