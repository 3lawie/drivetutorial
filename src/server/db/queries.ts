import "server-only";
import { db } from "~/server/db";
import { type DB_FileType, type DB_FolderType, files_table as filesSchema, folders_table, folders_table as foldersSchema } from "~/server/db/schema";
import { asc, eq, desc, and, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { env } from "~/env";

const utApi = new UTApi({ token: env.UPLOADTHING_SECRET });

export const QUERIES = {
    getAllParentsForFolders: async function (folderId: number) {
        const parents = [];
        let currentId: number | null = folderId;
        while (currentId !== null) {
            const folder = await db.selectDistinct().from(foldersSchema).where(eq(foldersSchema.id, currentId));
            if (!folder[0]) {
                throw new Error("Folder not found")
            }
            parents.unshift(folder[0]);
            currentId = folder[0]?.parent;
        }
        return parents;
    },
    getFolders: async function (folderId: number): Promise<DB_FolderType[]> {
        return db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.parent, folderId)).orderBy(asc(folders_table.id))
    },
    getUserFolders: async function (userId: string): Promise<DB_FolderType[]> {
        const userFolders = db
            .select()
            .from(foldersSchema)
            .where(eq(foldersSchema.ownerId, userId));

        return userFolders;
    },
    getFiles: async function (folderId: number): Promise<DB_FileType[]> {
        return db
            .select()
            .from(filesSchema)
            .where(eq(filesSchema.parent, folderId))
            .orderBy(desc(filesSchema.id))
    },
    getFolderById: async function (folderId: number) {
        const folder = await db
            .select()
            .from(folders_table)
            .where(eq(folders_table.id, folderId))
        return folder[0];
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

        if (!file.fileKey) {
            if (file.url.includes("https://grvzhjbjfb.ufs.sh/f/")) {
                const utApiResult = await utApi.deleteFiles([file.url.replace("https://grvzhjbjfb.ufs.sh/f/", "")]);
                console.log(utApiResult);
            } else {
                const dbDeleteResult = await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
                console.log(dbDeleteResult);

                const c = await cookies();
                c.set("force-refresh", JSON.stringify(Math.random))

                return { success: true, error: "Null", message: "Deleted from DB only" }
            }
        } else {
            const utApiResult = await utApi.deleteFiles(file.fileKey);
            console.log(utApiResult);
        }

        const dbDeleteResult = await db.delete(filesSchema).where(eq(filesSchema.id, fileId));
        console.log(dbDeleteResult);

        const c = await cookies();
        c.set("force-refresh", JSON.stringify(Math.random))

        return { success: true, error: "Null", message: "Deleted from DB and UploadThing" }
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

        const c = await cookies();
        c.set("force-refresh", JSON.stringify(Math.random()))

        return deleteCall
    },
}