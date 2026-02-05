/*
!import "server-only"*/ //security but can import in the dev mode
// schema.ts
import { text, index, singlestoreTableCreator, bigint, timestamp } from "drizzle-orm/singlestore-core";

// `createTable` ensures all tables are prefixed with `drive-tutorial_` for organization
export const createTable = singlestoreTableCreator((name) => `drive_tutorial_${name}`);

// Define the 'files' table schema
// This table stores metadata about files, including their name, size, URL, and parent folder.
export const files_table = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(), // File name (required)
    size: bigint("size", { mode: "number", unsigned: true }).notNull(), // File size in bytes (required)
    url: text("url").notNull(), // File URL (required)
    fileKey: text("fileKey"),
    parent: bigint("parent", { mode: "number", unsigned: true }).notNull(), // Parent folder ID (required)
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [index("parent_index").on(t.parent),
    index("owner_id_index").on(t.ownerId),
    ]; // Index for faster lookups by parent
  }
);

export type DB_FileType = typeof files_table.$inferSelect;

// Define the 'folders' table schema
// This table stores metadata about folders, including their name and optional parent folder.
export const folders_table = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(), // Folder name (required)
    parent: bigint("parent", { mode: "number", unsigned: true }), // Optional parent folder ID
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [index("parent_index").on(t.parent),
    index("owner_id_index").on(t.ownerId)
    ]; // Index for faster lookups by parent
  }
);

export type DB_FolderType = typeof folders_table.$inferSelect;

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