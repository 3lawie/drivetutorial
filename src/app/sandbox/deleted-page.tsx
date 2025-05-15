import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { folders_table, files_table } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";


export default function sandboxPage() {
    return <div className="flex flex-col gap-4">
        Seed Function
        <form  action={async ()=>{
            "use server"
            const user = await auth();

            if (!user.userId) throw new Error("Unauthorized");
                
                const rootFolders = await db.insert(folders_table).values({
                    name:"root",
                    ownerId: user.userId,
                    parent:null,
                })
                .$returningId();

            const insertableFolders = mockFolders.map((folder)=>({
                name: folder.name,
                ownerId:user.userId,
                parent: rootFolders[0]!.id,
            }));

            await db.insert(folders_table).values(insertableFolders);
            
            const insertableFiles = mockFiles.map((file) => ({
                name: file.name,
                ownerId: user.userId,
                parent: file.parent ?? rootFolders[0]!.id,
                size: file.size,
                url: file.url
            }));

            await db.insert(files_table).values(insertableFiles);

        }
     }  
    >  
       <button type="submit"> Seed </button>
     
        </form>
     
    </div>
}