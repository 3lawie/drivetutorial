"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { files_table } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";


// use server have endpoint which is the exported variables 
// this can let user access the file and do whatever he want [deleting, injecting , take a role]

const utApi= new UTApi();

export async function deleteFile(fileId: number){

    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized"}
    }
    const [file] = await db.
    select().
    from(files_table).
    where(and(
      eq(files_table.id,fileId ),
      eq(files_table.ownerId, session.userId), 
    ));
    if (!file) {
        return {error: "File not found"}
    }

    /////!This is not optimal we should have the file key as a property for the file
    //? in case we don't have a fileKey
    
    if(!file.fileKey){
        
        if (file.url.includes("https://grvzhjbjfb.ufs.sh/f/")) {
            const utApiResult = await utApi.deleteFiles([file.url.replace("https://grvzhjbjfb.ufs.sh/f/","")]);
            console.log(utApiResult);
        }else{

            const dbDeleteResult = await db.delete(files_table).where(eq(files_table.id, fileId));

            console.log(dbDeleteResult);


         
            return {success: true, error: "Null",message:"Deleted from DB only"}
        }

   }else{
    const utApiResult = await utApi.deleteFiles(file.fileKey);
    console.log(utApiResult);
   }

   const dbDeleteResult = await db.delete(files_table).where(eq(files_table.id, fileId));

   console.log(dbDeleteResult);

   return {success: true, error: "Null",message:"Deleted from DB and UploadThing"}
}