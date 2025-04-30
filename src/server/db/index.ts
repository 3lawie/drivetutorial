import {drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2";
import { env } from "env";
import * as schema from "./schema";
import { console } from "inspector";

/**
 * Cache the connection in development .This avoids creating a new
connection on every HMR
 * update
 */
const globalFordb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
globalFordb.conn ?? 
createPool({
  host: env.SINGLESTORE_HOST,
  port: parseInt(env.SINGLESTORE_PORT),
  user: env.SINGLESTORE_USER,
  password: env.SINGLESTORE_PASS,
  database: env.SINGLESTORE_DB_NAME,
  ssl:{},
  maxIdle:0,
});
if(env.NODE_ENV !=="production") globalFordb.conn = conn;

conn.addListener("error", (err)=>{
  console.error("Database connection error:", err);
})