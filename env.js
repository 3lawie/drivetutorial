// Import required dependencies
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/*
 * createEnv: A utility function from the T3 stack that creates a type-safe environment configuration
 * z: Zod library for schema validation with TypeScript integration
 */

export const env = createEnv({
  // Server-side Environment Configuration
  server: {
    // Database connection URL - Must be a valid URL format
    DATABASE_URL: z.string().url(),
    
    // Application environment setting
    // Restricts values to only: "development", "test", or "production"
    // Defaults to "development" if not specified
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    
    // SingleStore Database Credentials
    // All these fields are required strings
    SINGLESTORE_USER: z.string(),     // Database username
    SINGLESTORE_PASS: z.string(),     // Database password
    SINGLESTORE_HOST: z.string(), // Database host (must be valid URL)
    SINGLESTORE_PORT: z.string(),     // Database port number
    SINGLESTORE_DB_NAME: z.string(),  // Database name
  },

  // Client-side Environment Configuration
  client: {
    // Client-side variables must be prefixed with NEXT_PUBLIC_
    // Example (currently commented out):
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  // Runtime Environment Mapping
  // Maps schema definitions to actual process.env values
  runtimeEnv: {
    // Maps each environment variable to its process.env equivalent
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SINGLESTORE_USER: process.env.SINGLESTORE_USER,
    SINGLESTORE_PASS: process.env.SINGLESTORE_PASS,
    SINGLESTORE_HOST: process.env.SINGLESTORE_HOST,
    SINGLESTORE_PORT: process.env.SINGLESTORE_PORT,
    SINGLESTORE_DB_NAME: process.env.SINGLESTORE_DB_NAME,
    
    // Example of client-side variable mapping (commented out)
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },

  // Configuration Options
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,  // Skip validation if SKIP_ENV_VALIDATION is set
  emptyStringAsUndefined: true,  // Treat empty strings as undefined for stricter validation
});