import Link from "next/link"
import { ArrowRight, Cloud } from "lucide-react"

import { Button } from "~/components/ui/button"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function Home() {
  return (
  <>    {/* Logo in top left */}
      <div className="absolute left-8 top-6 z-10 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-amber-200/80" />
        <span className="text-lg font-bold text-zinc-200">T3 Drive FST</span>
      </div>

      {/* Login/Signup in top right */}
      <div className="absolute right-8 top-6 z-10 flex items-center gap-4">
     <SignInButton forceRedirectUrl={"/drive"}/>
           </div>

      {/* Main content - centered horizontally */}
      <div className="relative z-10 flex w-full max-w-7xl flex-row items-center justify-between px-8">
        {/* Left side - Main message */}
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-amber-200/90 via-zinc-200 to-violet-200/90 bg-clip-text text-transparent">
              Cloud storage
            </span>{" "}
            reimagined for speed
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            T3 Drive FST delivers lightning-fast cloud storage with uncompromising security. Store, share, and
            collaborate in one seamless experience.
          </p>
          <div className="mt-8">
          <form action={async () => {
            "use server"
            const session = await auth();
            if(!session.userId){
              return redirect("/sign-in");
            }

            return redirect("/drive");
           }}>

<Button type="submit" className="bg-gradient-to-r from-zinc-800 via-zinc-800 to-zinc-900 px-8 py-6 text-lg text-zinc-100 hover:from-zinc-700 hover:to-zinc-800">
              Get Started <ArrowRight className="ml-2 h-5 w-5 text-amber-200/80" />
            </Button>
           </form>

           </div>
        </div>

        {/* Right side - Visual element with color accents */}
        <div className="relative hidden md:block">
          <div className="relative h-[350px] w-[350px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 opacity-80" />

            {/* Subtle color accents */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-900/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-violet-900/10 blur-3xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Cloud className="h-24 w-24 text-zinc-700" />
                <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500/40 to-red-500/40 blur-sm" />
                <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-gradient-to-r from-violet-500/40 to-violet-400/40 blur-sm" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 to-transparent p-6 pt-12">
              <div className="h-2 w-full rounded-full bg-zinc-800">
                <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-amber-700/50 via-red-800/50 to-violet-800/50" />
              </div>
              <p className="mt-2 text-xs text-zinc-500">75% of 1TB used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
        <div className="text-xs text-zinc-500">© 2025 T3 Drive FST. All rights reserved.</div>
      </div>
    </>
  )
}
