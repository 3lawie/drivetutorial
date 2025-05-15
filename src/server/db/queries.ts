import "server-only";
import { db } from "~/server/db";
import { type DB_FileType, files_table as filesSchema, folders_table as foldersSchema } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { type File, type FolderType } from "~/lib/mock-data";
import { auth } from "@clerk/nextjs/server";

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
        .where(eq(foldersSchema.parent, folderId));
        },
    getFiles: async function  (folderId :number ) :Promise<File[]> { 
        return  db.
        select().
        from(filesSchema).
        where(eq(filesSchema.parent, folderId))
    }
}

export const MUTATIONS ={
    createFile: async function (input:{
        file: Omit<DB_FileType, "id" >,
        userId: string;
        }){
        return db.insert(filesSchema).values({
            ...input.file,
        parent:input.file.parent,});
        }
}
