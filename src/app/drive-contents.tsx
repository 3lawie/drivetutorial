"use client"

import { type File, type FolderType } from "../lib/mock-data"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { FileRow, FolderRow } from "./file-row"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"


export default function DriveContents(
  props :
   {
    files: File[],//$inferSelects[]
    folders: FolderType[],
    parents: FolderType[],
  }) {
  const emptyFolder = [...props.files, ...props.folders].length === 0;

  const navigate = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 rounded-[20px]">
          <div className="flex items-center">
            <Link
              href={`/f/1`}
              className="text-gray-300 hover:text-white mr-2 rounded-[7px] left-1.5 bg-slate-500 p-2.5 rounded-[7px] relative "

            >
              My Drive
            </Link>
            { props.parents.map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Link
                  href={`/f/${folder.id}`}
                  className="text-gray-300 hover:text-white rounded-md"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>
          <div>
          <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {emptyFolder ? (
          <div className="h-full flex justify-center items-center text-5xl relative top-32 font-mono tracking-tight">empty folder</div>
        ) : (
          <div className="bg-gray-800 rounded-[8px] shadow-xl">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                <div className="col-span-6">Name</div>
                <div className="col-span-3">Type</div>
                <div className="col-span-3">Size</div>
              </div>
            </div>
            <ul>
              {props.folders.map((folder) => (
                <FolderRow key={folder.id} folder={folder} />
              ))}
              {props.files.map((file, index) => {
                const lastFile = props.files.length - 1 === index;
                return <FileRow key={file.id} file={file} lastFile={lastFile} />;
              })}
            </ul>
            
          </div>
        )}
        <UploadButton endpoint="imageUploader" className="p-4" 
        onClientUploadComplete={ ()=>navigate.refresh() }
        />
      </div>
    </div>
  )
}

