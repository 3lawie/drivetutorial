import { db } from "~/server/db";
import { files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import DriveContents from "src/app/drive-contents";
import { eq } from "drizzle-orm";
import { type File, type FolderType } from "~/lib/mock-data";

export async function getAllParents(folderId: number){
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
}

    export async function getFolders(folderId: number): Promise<FolderType[]> {
        return db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.parent, folderId));
    }
  export async function getFiles (folderId :number ) :Promise<File[]> { 
    return  db.
    select().
    from(filesSchema).
    where(eq(filesSchema.parent, folderId))
  }
    

