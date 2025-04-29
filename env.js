import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Server-side Environment Configuration
  server: {
    // Database connection URL - Must be a valid URL format
    DATABASE_URL: z.string().url(),

    // Application environment setting
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // SingleStore Database Credentials
    SINGLESTORE_USER: z.string(),     // Database username
    SINGLESTORE_PASS: z.string(),     // Database password
    SINGLESTORE_HOST: z.string(),     // Database host (must be valid URL)
    SINGLESTORE_PORT: z.string(),     // Database port number (as string)
    SINGLESTORE_DB_NAME: z.string(),  // Database name

    // Add SSL CA bundle path (optional if SSL is not enforced)
    SINGLESTORE_SSL_CA: z.string().optional(), // Path to CA bundle (optional)
  },

  // Client-side Environment Configuration
  client: {
    // Client-side variables must be prefixed with NEXT_PUBLIC_
    // Example (currently commented out):
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  // Runtime Environment Mapping
  runtimeEnv: {
    // Maps each environment variable to its process.env equivalent
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SINGLESTORE_USER: process.env.SINGLESTORE_USER,
    SINGLESTORE_PASS: process.env.SINGLESTORE_PASS,
    SINGLESTORE_HOST: process.env.SINGLESTORE_HOST,
    SINGLESTORE_PORT: process.env.SINGLESTORE_PORT,
    SINGLESTORE_DB_NAME: process.env.SINGLESTORE_DB_NAME,
    SINGLESTORE_SSL_CA: process.env.SINGLESTORE_SSL_CA, // Map SSL CA bundle
  },

  // Configuration Options
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,  // Skip validation if SKIP_ENV_VALIDATION is set
  emptyStringAsUndefined: true,  // Treat empty strings as undefined for stricter validation
});