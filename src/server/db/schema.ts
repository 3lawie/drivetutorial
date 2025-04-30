// schema.ts
import { int, text, index, singlestoreTableCreator, bigint } from "drizzle-orm/singlestore-core";

// `createTable` ensures all tables are prefixed with `drive-tutorial_` for organization
export const createTable = singlestoreTableCreator((name) => `drive-tutorial_${name}`);

// Define the 'files' table schema
// This table stores metadata about files, including their name, size, URL, and parent folder.
export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: text("name").notNull(), // File name (required)
    size: bigint("size",{mode:"number", unsigned: true}).notNull(), // File size in bytes (required)
    url: text("url").notNull(), // File URL (required)
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(), // Parent folder ID (required)
  },
  (t) => {
    return [index("parent_index").on(t.parent)]; // Index for faster lookups by parent
  }
);

// Define the 'folders' table schema
// This table stores metadata about folders, including their name and optional parent folder.
export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: text("name").notNull(), // Folder name (required)
    parent: bigint("parent", { mode: "number", unsigned: true }), // Optional parent folder ID
  },
  (t) => {
    return [index("parent_index").on(t.parent)]; // Index for faster lookups by parent
  }
);
//!deleted since we use singleStore
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
//
//import { sql } from "drizzle-orm";
//import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
//
///*
// * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
// * database instance for multiple projects.
// *
// * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
// */
//export const createTable = sqliteTableCreator((name) => `drivetutorial_${name}`);
//
//export const posts = createTable(
//  "post",
//  {
//    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//    name: text("name", { length: 256 }),
//    createdAt: int("created_at", { mode: "timestamp" })
//      .default(sql`(unixepoch())`)
//      .notNull(),
//    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
//      () => new Date()
//    ),
//  },
//  (example) => ({
//    nameIndex: index("name_idx").on(example.name),
//  })
//);