"use client"

import { type FileType, type FolderType } from "../../../lib/mock-data"
import { ChevronRight, FolderPlus, FolderOpen } from "lucide-react"
import Link from "next/link"
import { FileRow, FolderRow } from "./file-row"
import { AuthButton } from "~/components/auth-button"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createFolderAction } from "~/server/actions/action"

export default function DriveContents(
  props: {
    files: FileType[],
    folders: FolderType[],
    parents: FolderType[],
    isFile: boolean,
    currentFolderId: number;
  }) {

  const emptyFolder = [...props.files, ...props.folders].length === 0;
  const navigate = useRouter()

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    setIsCreating(true);
    try {
      await createFolderAction(folderName.trim(), props.currentFolderId);
      setFolderName("");
      setShowCreateFolder(false);
      navigate.refresh();
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 text-gray-100 p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-5xl">
        {/* ── Header: Breadcrumbs + Actions ── */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm pb-2" aria-label="Breadcrumb">
            <Link
              href={`/f/2251799813685249`}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-700/50 bg-surface-2 px-3 py-1.5 font-medium text-gray-300 transition-all duration-200 hover:bg-surface-3 hover:text-white"
            >
              My Drive
            </Link>
            {props.parents.map((folder, i) => (
              <div key={folder.id} className="flex shrink-0 items-center">
                <ChevronRight className="mx-1 text-gray-600" size={14} />
                {i === props.parents.length - 1 ? (
                  <span className="px-2 py-1 font-medium text-gray-100">
                    {folder.name}
                  </span>
                ) : (
                  <Link
                    href={`/f/${folder.id}`}
                    className="rounded-md px-2 py-1 text-gray-400 transition-all duration-200 hover:bg-surface-2 hover:text-white"
                  >
                    {folder.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              id="create-folder-btn"
              onClick={() => setShowCreateFolder(!showCreateFolder)}
              className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-surface-2 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-surface-3 hover:text-white"
            >
              <FolderPlus size={16} />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <AuthButton />
          </div>
        </div>

        {/* ── Create Folder Inline Form ── */}
        {showCreateFolder && (
          <div className="mb-5 flex animate-fade-in-up items-center gap-3 rounded-xl border border-gray-700/60 bg-surface-1 px-4 py-3 shadow-lg shadow-black/10 md:px-5 md:py-3.5">
            <FolderPlus size={18} className="shrink-0 text-blue-400" />
            <input
              id="folder-name-input"
              type="text"
              placeholder="Untitled folder"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") { setShowCreateFolder(false); setFolderName(""); }
              }}
              autoFocus
              className="flex-1 border-none bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none focus:ring-0"
            />
            <button
              id="confirm-create-folder-btn"
              onClick={handleCreateFolder}
              disabled={isCreating || !folderName.trim()}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCreating ? "Creating…" : "Create"}
            </button>
            <button
              id="cancel-create-folder-btn"
              onClick={() => { setShowCreateFolder(false); setFolderName(""); }}
              className="px-3 py-1.5 text-sm text-gray-500 transition-colors duration-150 hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Content Area ── */}
        {props.isFile ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <p className="text-lg font-medium">File preview</p>
          </div>
        ) : (
          <>
            {emptyFolder ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-2">
                  <FolderOpen size={36} className="text-gray-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-200">This folder is empty</h3>
                <p className="mb-8 max-w-xs text-sm text-gray-500">
                  Upload files or create a folder to get started
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-surface-2 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-surface-3 hover:text-white"
                  >
                    <FolderPlus size={16} />
                    New Folder
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-800/60 bg-surface-1 shadow-xl shadow-black/10">
                <div className="hidden border-b border-gray-800/60 px-5 py-3 md:block">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>
                <ul>
                  {props.folders.map((folder, i) => (
                    <FolderRow key={folder.id} folder={folder} index={i} />
                  ))}
                  {props.files.map((file, index) => {
                    const lastFile = props.files.length - 1 === index;
                    return <FileRow key={file.id} file={file} lastFile={lastFile} index={props.folders.length + index} />;
                  })}
                </ul>
              </div>
            )}
          </>
        )}

        {/* ── Upload Area ── */}
        <div className="mt-8 flex justify-center pb-8">
          <UploadButton
            endpoint="driveUploader"
            onClientUploadComplete={() => navigate.refresh()}
            onUploadError={(error: Error) => {
              // ADDED: Error handler so uploads don't fail silently
              alert(`ERROR! ${error.message}`);
            }}
            input={{
              folderId: props.currentFolderId,
            }}
          />
        </div>

      </div>
    </div>
  )
}