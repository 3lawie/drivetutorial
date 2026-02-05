import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
    const session = await auth();

    if (!session.userId) {
        return redirect("/sign-in");
    }
    const rootFolder = await QUERIES.getRootFolderForUser(session.userId);
    console.log(rootFolder)

    if (!rootFolder) {
        const rootFolder = await MUTATIONS.createRootFolder(session.userId);

        const initialFolders = await MUTATIONS.OnBoardFolders(session.userId, rootFolder!.id);
        return redirect(`/f/${rootFolder!.id}`);
    }
    else {
        const userFolders = await QUERIES.getUserFolders(session.userId);

        if (userFolders.length < 2) {
            await MUTATIONS.OnBoardFolders(session.userId, rootFolder.id)
        }

        return redirect(`/f/${rootFolder.id}`);
    }
}


