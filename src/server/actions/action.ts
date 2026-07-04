"use server"

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { MUTATIONS, QUERIES } from "../db/queries";

export async function deleteFile(fileId: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    await MUTATIONS.deleteFile(fileId, session.userId);
    revalidatePath("/f/[folderId]", "page");
    return { success: true };
}

export async function deleteFolderAction(id: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Not authenticated");

    await MUTATIONS.deleteFolder(id, user.userId);
    revalidatePath("/f/[folderId]", "page");
    return { success: true };
}

export async function createFolderAction(name: string, parentId: number) {
    const user = await auth();
    if (!user.userId) throw new Error("Not authenticated");

    const parent = await QUERIES.getFolderById(parentId, user.userId);
    if (!parent) {
        throw new Error("Unauthorized or parent folder not found");
    }

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

export async function renameFileAction(name: string, id: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    await MUTATIONS.renameFile(name, id, session.userId);
    revalidatePath("/f/[folderId]", "page");
    return { success: true };
}

export async function renameFolderAction(name: string, id: number) {
    const session = await auth();
    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    await MUTATIONS.renameFolder(name, id, session.userId);
    revalidatePath("/f/[folderId]", "page");
    return { success: true };
}