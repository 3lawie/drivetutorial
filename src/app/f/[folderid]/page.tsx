import { db } from "~/server/db";
import { files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import DriveContents from "../../drive-contents";
import { eq } from "drizzle-orm";
import { getAllParentsFolders, getFiles, getFolders } from "~/server/db/queries";



export default async function GoogleDriveClone(
    props:{
        params:Promise<{
            folderId:string
        }>}){
            const params =await  props.params;
            //const safeFolderId =Number.isNaN(Number(params.folderId)) ? "Invalid Id" : parseInt(params.folderId)
            // OR
            const parsedFolderId = parseInt(params.folderId);
            if(  isNaN(parsedFolderId) ){
                return <div>{"Invalid Id Input"}</div>
            } 

    const [ files,folders, parents] = await Promise.all
        ([getFiles(parsedFolderId),
        getFolders(parsedFolderId),
        getAllParentsFolders(parsedFolderId)
        ]);
   
    return <DriveContents files={files} folders={folders}  parents={parents}></DriveContents>
}

