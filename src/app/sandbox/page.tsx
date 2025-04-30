import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mock-data";
import { folders, files } from "~/server/db/schema";


export default function sandboxPage() {
    return <div className="flex flex-col gap-4">
        Seed Function
        <form  action={async ()=>{
            "use server"
        await db.insert(folders).values(mockFolders.map((folder,index)=>({
        name:folder.name,
        parent: index !== 0 ? 1 : null,
        id: index + 1,    
        })));
        await db.insert(files).values(mockFiles.map((file,index)=>({
        id: index + 1,
        name:file.name,
        size:5000,
        url: file.url,
        parent: index % 3 + 1,
        })));
        }}>
            <button type="submit"> Seed </button>
        </form>
    </div>
}