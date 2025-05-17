"use server"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";



export default async function App(){
    return <div className=" w-full h-full flex flex-col 
    justify-between items-center  top-1/2 mt-56 gap-96 text-4xl">
    <div>
    <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
            <div>
            <Link
            href="/f/2251799813685249"
            >
              root file
            </Link>
            </div>
          </div>
}
