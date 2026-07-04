import DriveContents from "./drive-contents";
import { QUERIES } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function GoogleDriveClone(
    props: {
        params: Promise<{
            folderid: string
        }>
    }) {
    const params = await props.params;
    const session = await auth();

    if (!session.userId) {
        return redirect("/sign-in");
    }

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
            QUERIES.getFiles(parsedFolderId, session.userId),
            QUERIES.getFolders(parsedFolderId, session.userId),
            QUERIES.getAllParentsForFolders(parsedFolderId, session.userId)
        ]);

    return <DriveContents
        files={files}
        folders={folders}
        parents={parents}
        currentFolderId={parsedFolderId}
    ></DriveContents>
}
