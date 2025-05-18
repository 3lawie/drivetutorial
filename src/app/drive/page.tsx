import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
    const session =await auth();

    if(!session.userId){
        return redirect("/sign-in");
    }
    const rootFolder= await QUERIES.getRootFolderForUser(session.userId);
    console.log(rootFolder)

    if(!rootFolder){
        return redirect("/create-root-folder");
    }

    return redirect(`/f/${rootFolder.id}`);

}