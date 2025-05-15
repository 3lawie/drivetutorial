"use server"
import { db } from "~/server/db";
import { files_table as filesSchema, folders_table as foldersSchema } from "~/server/db/schema";
import DriveContents from "./drive-contents";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";



export default async function App(){
    const files = await db.select().from(filesSchema)
    const folders = await db.select().from(foldersSchema)

    return <>
    <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <Link
            href="/f/2251799813685249"
            >
              root file
            </Link>
          </>
}
