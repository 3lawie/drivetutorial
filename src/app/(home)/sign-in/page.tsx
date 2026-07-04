import { Cloud } from "lucide-react"
import { SignInButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 p-6">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-amber-900/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-red-950/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-950/10 blur-3xl" />

      {/* Logo */}
      <div className="absolute top-8 z-10 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-amber-200/80" />
        <span className="text-lg font-bold text-zinc-200">T3 Drive FST</span>
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-sm md:p-10">
        <h1 className="mb-2 text-2xl font-bold text-zinc-100 md:text-3xl">Welcome back</h1>
        <p className="mb-8 text-center text-sm text-zinc-400">Sign in to access your secure cloud storage</p>

        <div className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 text-center transition-colors hover:bg-zinc-800">
          <SignInButton forceRedirectUrl={"/drive"} />
        </div>

        <div className="mt-8 w-full">
          <div className="h-1.5 w-full rounded-full bg-zinc-800">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-amber-700/50 via-red-800/50 to-violet-800/50 blur-[2px]" />
          </div>
          <p className="mt-2 text-center text-xs text-zinc-500">Encrypted end-to-end</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center px-4">
        <div className="text-xs text-zinc-500">© 2025 T3 Drive FST. All rights reserved.</div>
      </div>
    </div>
  )
}