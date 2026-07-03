import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";




export default async function GoogleDriveClone(
    props: {
        params: Promise<{
            folderid: string
        }>
    }) {
    const params = await props.params;
    // Parse folderid - trim any whitespace and parse as number
    if (!params.folderid) {
        return <div>{"Missing folder ID"}</div>
    }

    const cleanId = params.folderid.trim();
    const parsedFolderId = Number(cleanId);

    if (!cleanId || !Number.isFinite(parsedFolderId) || parsedFolderId < 0) {
        return <div>{`Invalid Id Input: "${params.folderid}"`}</div>
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

