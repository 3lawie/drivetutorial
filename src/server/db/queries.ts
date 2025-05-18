import "server-only";
import { db } from "~/server/db";
import { type DB_FileType, DB_FolderType, files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import { asc, eq , desc, and, isNull } from "drizzle-orm";
import { type File, type FolderType } from "~/lib/mock-data";

export const QUERIES ={
    getAllParentsForFolders: async function (folderId: number){
        const parents = [];
        let currentId : number | null = folderId;
        while (currentId !== null) {
        const folder = await  db.selectDistinct().from(foldersSchema).where(eq(foldersSchema.id,currentId));
        if(!folder[0]){
            throw new Error("Folder not found")
        }
        parents.unshift(folder[0]);
        currentId = folder[0]?.parent;
        }
        return parents;
        },
    getFolders: async function (folderId: number): Promise<FolderType[]> {
        return db
        .select()
        .from(foldersSchema)
        .where(eq(foldersSchema.parent, folderId)).orderBy(asc(folders_table.id))
        },
    getFiles: async function  (folderId :number ) :Promise<File[]> { 
        return  db.
        select().
        from(filesSchema).
        where(eq(filesSchema.parent, folderId)).orderBy(desc(filesSchema.id))
    },
    getFolderById: async function (folderId: number ) {
      const folder = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.id, folderId))
      return folder[0];  
    },
    getRootFolderForUser: async function (userId: string) {
        const folder = await db.
        select().
        from(foldersSchema).
        where(and(
            eq(foldersSchema.ownerId, userId),
            isNull(foldersSchema.parent)))
        return folder[0];
    }
}

export const MUTATIONS ={
    createFile: async function (input:{
        file: Omit<DB_FileType, "id" >,
        userId: string;
        }){
        return db.insert(filesSchema).values({
            ...input.file
        });
        },
        onBoardUser:async function(userId:string){
            const rootFolder = await db.insert(foldersSchema).values({
                name:"Root",
                parent:null,
                ownerId:userId,
            }).$returningId();

            const rootFolderId= rootFolder[0]!.id;

            await db.insert(foldersSchema).values(
                [
                {
                    name:"Trash",
                    parent:rootFolderId,
                    ownerId:userId,
                },
                {
                    name:"Shared",
                    parent:rootFolderId,
                    ownerId:userId,
                },
                {
                    name:"Documents",
                    parent:rootFolderId,
                    ownerId:userId
                }

            ])

            return rootFolderId;
         }
}
