"use server"

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MUTATIONS } from "../db/queries";

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    const result = await MUTATIONS.deleteFile(fileId, session.userId);
    revalidatePath("/f/[folderId]", "page");
    return result;
}

export async function deleteFolderAction(id: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Not authenticated");

    const result = await MUTATIONS.deleteFolder(id, user.userId);
    revalidatePath("/f/[folderId]", "page");
    return result;
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

    revalidatePath("/f/[folderId]", "page");
}