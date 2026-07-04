import "server-only";
import { db } from "~/server/db";
import { type DB_FileType, type DB_FolderType, files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import { asc, eq, desc, and, isNull } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { env } from "~/env";

const utApi = new UTApi({ token: env.UPLOADTHING_TOKEN });

export const QUERIES = {
    getAllParentsForFolders: async function (folderId: number, userId: string) {
        const parents = [];
        let currentId: number | null = folderId;
        while (currentId !== null) {
            const folder = await db.selectDistinct().from(foldersSchema).where(and(eq(foldersSchema.id, currentId), eq(foldersSchema.ownerId, userId)));
            if (!folder[0]) {
                throw new Error("Folder not found")
            }
            parents.unshift(folder[0]);
            currentId = folder[0]?.parent;
        }
        return parents;
    },
    getFolders: async function (folderId: number, userId: string): Promise<DB_FolderType[]> {
        return db
            .select()
            .from(foldersSchema)
            .where(and(eq(foldersSchema.parent, folderId), eq(foldersSchema.ownerId, userId))).orderBy(asc(folders_table.id))
    },
    getUserFolders: async function (userId: string): Promise<DB_FolderType[]> {
        const userFolders = db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.ownerId, userId));

        return userFolders;
    },
    getFiles: async function (folderId: number, userId: string): Promise<DB_FileType[]> {
        return db
            .select()
            .from(filesSchema)
            .where(and(eq(filesSchema.parent, folderId), eq(filesSchema.ownerId, userId)))
            .orderBy(desc(filesSchema.id))
    },
    getFolderById: async function (folderId: number, userId: string) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(and(eq(folders_table.id, folderId), eq(folders_table.ownerId, userId)))
        return folder[0];
    },
    getFileById: async function (fileId: number, userId: string) {
        const file = await db
            .select()
            .from(filesSchema)
            .where(and(eq(filesSchema.id, fileId), eq(filesSchema.ownerId, userId)))
        return file[0];
    },
    getRootFolderForUser: async function (userId: string) {
        const folder = await db.
            select().
            from(foldersSchema).
            where(and(
                eq(foldersSchema.ownerId, userId),
                isNull(foldersSchema.parent)))
        return folder[0];
    },
    getFolderChildren: async function (id: number, userId: string): Promise<{ finalFiles: DB_FileType[], finalFolders: DB_FolderType[] }> {
        const finalFiles: DB_FileType[] = [];
        const finalFolders: DB_FolderType[] = [];

        const foldersChildrenRequest = db
            .select()
            .from(foldersSchema)
            .where(
                and(
                    eq(foldersSchema.parent, id),
                    eq(foldersSchema.ownerId, userId)
                ));
        const filesChildrenRequest = db
            .select()
            .from(filesSchema)
            .where(
                and(
                    eq(filesSchema.parent, id),
                    eq(filesSchema.ownerId, userId)
                )
            );

        const [files, folders] = await Promise.all([filesChildrenRequest, foldersChildrenRequest]) as [DB_FileType[], DB_FolderType[]];
        finalFiles.push(...files);
        finalFolders.push(...folders);

        const childResults = await Promise.all(folders.map(child => this.getFolderChildren(child.id, userId)));

        for (const { finalFiles: childFiles, finalFolders: childFolders } of childResults) {
            finalFiles.push(...childFiles)
            finalFolders.push(...childFolders)
        }

        return { finalFiles, finalFolders };
    }
}

export const MUTATIONS = {
    createFile: async function (input: {
        file: Omit<DB_FileType, "id">,
        userId: string;
    }) {
        return db.insert(filesSchema).values({
            ...input.file
        });
    },
    createFolder: async function ({ folder }: { folder: Omit<DB_FolderType, "id"> }) {
        return db.insert(foldersSchema).values({
            name: folder.name,
            ownerId: folder.ownerId,
            parent: folder.parent,
        })
    },
    createRootFolder: async function (userId: string) {
        const rootFolder = await db.insert(foldersSchema).values({
            name: "Root",
            parent: null,
            ownerId: userId,
        }).$returningId();

        return rootFolder[0];
    },
    OnBoardFolders: async (userId: string, rootFolder: number) => {
        const folders = await db
            .insert(foldersSchema)
            .values([
                {
                    name: "Documents",
                    parent: rootFolder,
                    ownerId: userId
                },
                {
                    name: "Trash",
                    parent: rootFolder,
                    ownerId: userId
                },
                {
                    name: "Shared",
                    parent: rootFolder,
                    ownerId: userId
                },
            ])
        return folders;
    },
    deleteFile: async function (fileId: number, userId: string) {
        const [file] = await db
            .select()
            .from(filesSchema)
            .where(and(
                eq(filesSchema.id, fileId),
                eq(filesSchema.ownerId, userId),
            ));

        if (!file) {
            return { error: "File not found" }
        }

        // Delete from UploadThing if applicable
        if (!file.fileKey) {
            if (file.url.includes("https://grvzhjbjfb.ufs.sh/f/")) {
                await utApi.deleteFiles([file.url.replace("https://grvzhjbjfb.ufs.sh/f/", "")]);
            } else {
                await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
                return { success: true, error: null, message: "Deleted from DB only" }
            }
        } else {
            await utApi.deleteFiles(file.fileKey);
        }

        await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
        return { success: true, error: null, message: "Deleted from DB and UploadThing" }
    },
    deleteFolder: async (id: number, userId: string) => {
        const { finalFiles: files, finalFolders: folders } = await QUERIES.getFolderChildren(id, userId);

        const deleteCall = await Promise.all([
            ...files.map(async file => {
                if (file.ownerId !== userId) throw new Error("Unauthorized")
                await MUTATIONS.deleteFile(file.id, userId); // <--- FIXED: Call MUTATIONS.deleteFile directly
            }),
            ...folders.map(async folder => {
                if (folder.ownerId !== userId) throw new Error("Unauthorized")
                await db.delete(foldersSchema)
                    .where(and(
                        eq(foldersSchema.id, folder.id),
                        eq(foldersSchema.ownerId, userId)
                    ));
            })
        ])

        // Delete the target folder itself
        await db.delete(foldersSchema)
            .where(and(
                eq(foldersSchema.id, id),
                eq(foldersSchema.ownerId, userId)
            ));
        return deleteCall
    },
    renameFile: async (name: string, id: number, userId: string) => {
        const file = await db.update(filesSchema).set({
            name: name
        }).where(and(
            eq(filesSchema.id, id),
            eq(filesSchema.ownerId, userId)
        ))

        return file;

    },
    renameFolder: async (name: string, id: number, userId: string) => {
        const folder = await db.update(foldersSchema).set({
            name: name
        }).where(and(
            eq(foldersSchema.id, id),
            eq(foldersSchema.ownerId, userId)
        ))

        return folder;
    }
}