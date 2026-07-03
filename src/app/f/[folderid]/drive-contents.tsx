"use client"

import { type FileType, type FolderType } from "../../../lib/mock-data"
import { ChevronRight, FolderPlus, FolderOpen, Upload } from "lucide-react"
import Link from "next/link"
import { FileRow, FolderRow } from "./file-row"
import { AuthButton } from "~/components/auth-button"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createFolderAction } from "~/server/actions/action"


export default function DriveContents(
  props:
    {
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
    <div className="min-h-screen bg-surface-0 text-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header: Breadcrumbs + Actions ── */}
        <div className="flex justify-between items-center mb-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm" aria-label="Breadcrumb">
            <Link
              href={`/f/2251799813685249`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-700/50 bg-surface-2 hover:bg-surface-3 transition-all duration-200 font-medium"
            >
              My Drive
            </Link>
            {props.parents.map((folder, i) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-1.5 text-gray-600" size={14} />
                {i === props.parents.length - 1 ? (
                  <span className="text-gray-100 font-medium px-2 py-1">
                    {folder.name}
                  </span>
                ) : (
                  <Link
                    href={`/f/${folder.id}`}
                    className="text-gray-400 hover:text-white px-2 py-1 rounded-md hover:bg-surface-2 transition-all duration-200"
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
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-300 bg-surface-2 border border-gray-700/50 rounded-lg hover:bg-surface-3 hover:text-white hover:border-gray-600 transition-all duration-200"
            >
              <FolderPlus size={16} />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <AuthButton />
          </div>
        </div>

        {/* ── Create Folder Inline Form ── */}
        {showCreateFolder && (
          <div className="mb-5 flex items-center gap-3 bg-surface-1 border border-gray-700/60 rounded-xl px-5 py-3.5 animate-fade-in-up shadow-lg shadow-black/10">
            <FolderPlus size={18} className="text-blue-400 shrink-0" />
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
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-100 placeholder-gray-500 focus:ring-0"
            />
            <button
              id="confirm-create-folder-btn"
              onClick={handleCreateFolder}
              disabled={isCreating || !folderName.trim()}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isCreating ? "Creating…" : "Create"}
            </button>
            <button
              id="cancel-create-folder-btn"
              onClick={() => { setShowCreateFolder(false); setFolderName(""); }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
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
              /* ── Empty State ── */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center mb-6">
                  <FolderOpen size={36} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">This folder is empty</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-xs">
                  Upload files or create a folder to get started
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 bg-surface-2 border border-gray-700/50 rounded-lg hover:bg-surface-3 hover:text-white transition-all duration-200"
                  >
                    <FolderPlus size={16} />
                    New Folder
                  </button>
                </div>
              </div>
            ) : (
              /* ── File/Folder Table ── */
              <div className="bg-surface-1 rounded-xl border border-gray-800/60 shadow-xl shadow-black/10 overflow-hidden">
                {/* Table Header */}
                <div className="px-5 py-3 border-b border-gray-800/60">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>
                {/* Rows */}
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
        <div className="mt-6 flex justify-center">
          <UploadButton
            endpoint="driveUploader"
            onClientUploadComplete={() => navigate.refresh()}
            input={{
              folderId: props.currentFolderId,
            }}
          />
        </div>

      </div>
    </div>
  )
}
