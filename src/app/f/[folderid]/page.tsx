import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";




export default async function GoogleDriveClone(
    props: {
        params: Promise<{
            folderId: string
        }>
    }) {
    const params = await props.params;
    // Parse folderId - trim any whitespace and parse as nu mber
    const cleanId = params.folderId.trim();
    const parsedFolderId = Number(cleanId);

    if (!cleanId || !Number.isFinite(parsedFolderId) || parsedFolderId < 0) {
        return <div>{`Invalid Id Input: "${params.folderId}"`}</div>
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

