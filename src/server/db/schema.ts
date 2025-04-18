// schema.ts
// schema.ts
import { int, text, index, singlestoreTableCreator, bigint } from "drizzle-orm/singlestore-core"; // Change import path

//export const users = singlestoreTable("users_table", {  // Use singlestoreTable
//  id: int("id").primaryKey().autoincrement(),
//  name: text("name"),
//  age: int("age"),
//});
export const createTable = singlestoreTableCreator((name) => `drivetutorial_${name}`) 

export const files= createTable(
  "files_table",
  {
    id: bigint("id",{mode:"number",unsigned:true}).primaryKey().autoincrement() ,
    name: text("name").notNull() ,
    size: int("size").notNull() ,
    url: text("url").notNull() ,
    parent: bigint("parent",{mode:"number",unsigned:true}).notNull(),
  },
  (t) => { // Specify the return type
    return [index("parent_index").on(t.parent)];//index the files that have 
    // the same id as parent for easier providing
  }
  )
export const folders = createTable(
  "folders_table",
  {
    id: bigint("id",{mode:"number",unsigned:true}).primaryKey().autoincrement() ,
    name: text("name").notNull() ,
    parent: bigint("parent",{mode:"number",unsigned:true}),
  },
(t) => {
  return [index("parent_index").on(t.parent)];
}
)
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
