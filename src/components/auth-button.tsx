import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButton() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}