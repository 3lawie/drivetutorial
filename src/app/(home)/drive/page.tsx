import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
    const session =await auth();

    if(!session.userId){
        return redirect("/sign-in");
    }
    const rootFolder= await QUERIES.getRootFolderForUser(session.userId);
    console.log(rootFolder)

    if(!rootFolder){
      return (
            <div className="z-20 flex justify-center items-center mt-8">
                <button 
                    className="bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-900 px-8 py-6 text-lg text-zinc-100 hover:from-zinc-700 hover:to-zinc-800 rounded-full"
                    onClick={async () => {
                        "use server"
                        if (!session.userId) {
                            return redirect("/sign-in")
                        }
                        const rootFolderId = await MUTATIONS.onBoardUser(session.userId);
                        return redirect(`/f/${rootFolderId}`)
                    }}
                >
                    Create Root Folder
                </button>
            </div>
        );
    }

    return redirect(`/f/${rootFolder.id}`);

}