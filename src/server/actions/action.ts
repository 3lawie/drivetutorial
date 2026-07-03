"use server"

import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "../db/queries";

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    // Delegate to MUTATIONS which handles the DB and UploadThing logic safely
    return MUTATIONS.deleteFile(fileId, session.userId);
}

export async function deleteFolderAction(id: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Not authenticated");

    return MUTATIONS.deleteFolder(id, user.userId);
}

export async function createFolderAction(name: string, parentId: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Not authenticated");

    await MUTATIONS.createFolder({
        folder: {
            name,
            ownerId: user.userId,
            parent: parentId,
            createdAt: new Date(),
        }
    });

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
}