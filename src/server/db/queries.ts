import "server-only";
import { db } from "~/server/db";
import { type DB_FileType, type DB_FolderType, files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import { asc, eq , desc, and, isNull } from "drizzle-orm";
import { error } from "console";

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
    getFolders: async function (folderId: number): Promise<DB_FolderType[]> {
        return db
        .select()
        .from(foldersSchema)
        .where(eq(foldersSchema.parent, folderId)).orderBy(asc(folders_table.id))
        },
        getUserFolders: async function (userId:string): Promise<DB_FolderType[]> {
            const userFolders= db
                .select()
                .from(foldersSchema)
                .where(eq(foldersSchema.ownerId, userId));
            
                return userFolders;
        },
    getFiles: async function (folderId: number): Promise<DB_FileType[]> { 
        return db
            .select()
            .from(filesSchema)
            .where(eq(filesSchema.parent, folderId))
            .orderBy(desc(filesSchema.id))
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
        createFolder: async function ({ folder }: { folder: Omit<DB_FolderType, "id"> }){
            db.insert(foldersSchema).values({
                name:folder.name,
                ownerId:folder.ownerId,
                parent:folder.parent,
            })
        },
        createRootFolder: async function (userId: string) {
            const rootFolder = await db.insert(foldersSchema).values({
                name: "Root",
                parent: null,
                ownerId: userId,
            }).$returningId();; 
            

            return rootFolder[0];
        },
        OnBoardFolders: async (userId: string, rootFolder: number) => {
            const folders = await db
            .insert(foldersSchema)
            .values([
                {
                name:"Documents",
                parent:rootFolder,
                ownerId:userId
            },
                {
                name:"Trash",
                parent:rootFolder,
                ownerId:userId
            },
                {
                name:"Shared",
                parent:rootFolder,
                ownerId:userId
            },
            ])
            return folders ;
        },
    }

