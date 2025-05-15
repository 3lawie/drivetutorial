"use server"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";



export default async function App(){
    
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
