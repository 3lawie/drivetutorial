import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";




export default async function GoogleDriveClone(
    props: {
        params: Promise<{
            folderId: string
        }>
    }) {
    const params = await props.params;
    //const safeFolderId =Number.isNaN(Number(params.folderId)) ? "Invalid Id" : parseInt(params.folderId)
    // OR
    const parsedFolderId = parseInt(params.folderId);
    if (isNaN(parsedFolderId)) {
        return <div>{"Invalid Id Input"}</div>
    }

    const [files, folders, parents] = await Promise.all
        ([
            QUERIES.getFiles(parsedFolderId),
            QUERIES.getFolders(parsedFolderId),
            QUERIES.getAllParentsForFolders(parsedFolderId)
        ]);
    const isFile = "url" in parents[parents.length - 1]! && "size" in parents[parents.length - 1]!;



    return <DriveContents
        files={files}
        folders={folders}
        parents={parents}
        isFile={isFile}
        currentFolderId={parsedFolderId}
    ></DriveContents>
}

