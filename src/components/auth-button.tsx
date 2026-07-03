import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButton() {
  return (
    <div className="flex items-center justify-center">
      <SignedOut>
        <SignInButton>
          <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}