import Link from "next/link"
import { ArrowRight, Cloud } from "lucide-react"

import { Button } from "~/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function Home() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient with subtle violet */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Accent gradients with yellow, red, and violet */}
      <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-amber-900/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-red-950/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-950/10 blur-3xl" />
<div>
      {/* Logo in top left */}
      
    {/* Right side - Visual element with color accents */}
        <div className="relative hidden md:block">
          <div className="relative h-[260px] w-[260px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 opacity-80" />

            {/* Subtle color accents */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-900/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-violet-900/10 blur-3xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className=" z-10 flex items-center gap-4">
           <form action={async () => {
            "use server"
            const session = await auth();
            if(!session.userId){
              return redirect("/sign-in");
            }

            return redirect("/drive");
           }}>

            <Button 
            size="lg"
            type="submit"
            className="border border-neutral-700 bg-neutral-800 rounded-[5px] 
            transition-colors hover:bg-neutral-700 text-violet-300">sign-in </Button>
           </form>

           </div>
                <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-gradient-to-r from-violet-500/40 to-violet-400/40 blur-sm" />
              </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 to-transparent p-6 pt-12">
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-2  w-full  rounded-full bg-gradient-to-r from-amber-700/50 via-red-800/50 to-violet-800/50" />
              </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
        <div className="text-xs text-zinc-500">© 2025 T3 Drive FST. All rights reserved.</div>
      </div>
    </div>
  )
}
