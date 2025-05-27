import Link from "next/link"
import { ArrowRight, Cloud } from "lucide-react"

import { Button } from "~/components/ui/button"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SignInButton, SignUpButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient with subtle violet */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Accent gradients with yellow, red, and violet */}
      <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-amber-900/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-red-950/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-950/10 blur-3xl" />

      {/* Logo in top left */}
      <div className="absolute  top-6 z-10 flex items-center justify-center gap-2 ">
        <Cloud className="h-5 w-5 text-amber-200/80 text-5xl" />
        <span className="text-lg font-bold text-zinc-200 ">T3 Drive FST</span>
      </div>


      {/* Main content - centered horizontally */}
      <div className="relative z-10 flex w-full max-w-7xl flex-row items-center justify-center px-8">
        {/* Left side - Main message */}
       

        {/* Right side - Visual element with color accents */}
        <div className="relative hidden md:block">
          <div className="relative h-[180px] w-[350px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 opacity-80" />

            {/* Subtle color accents */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-900/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-40 w-40 rounded-full bg-violet-900/10 blur-3xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
              <SignInButton forceRedirectUrl={"/drive"} />    
            <div className=" absolute -right-6 -top-2 h-5 w-5 blur-[6px] rounded-full bg-gradient-to-r from-amber-500/40 to-red-500/40 blur-sm" />
                <div className="absolute -bottom-2 -left-3 h-4 w-4 blur-[8px] rounded-full bg-gradient-to-r from-violet-500/40 to-violet-400/40 blur-sm" />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 to-transparent p-6 pt-12">
              <div className="h-1.5 w-44 rounded-full bg-zinc-800 blur-[2px] ">
                <div className="relative  h-1.5 w-full rounded-full bg-gradient-to-r from-amber-700/50 via-red-800/50 to-violet-800/50 blur-sm" />
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
