"use client"

import { type FileType, type FolderType } from "../../../lib/mock-data"
import { ChevronRight, FolderPlus, FolderOpen, Upload } from "lucide-react"
import Link from "next/link"
import { FileRow, FolderRow } from "./file-row"
import { AuthButton } from "~/components/auth-button"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"
import { useState, useEffect, useTransition, useOptimistic } from "react" // Added useEffect
import { createFolderAction, deleteFile, deleteFolderAction, renameFileAction, renameFolderAction } from "~/server/actions/action"
import { toast } from "sonner"

export default function DriveContents(
  props: {
    files: FileType[],
    folders: FolderType[],
    parents: FolderType[],
    currentFolderId: number;
  }) {


  const navigate = useRouter()
  const [isPending, startTransition] = useTransition();

  type FolderAction =
    | { type: "add"; name: string; currentFolderId: number }
    | { type: "remove"; id: number }
    | { type: "rename"; id: number; name: string };

  const [optimisticFolders, updateOptimisticFolders] = useOptimistic(
    props.folders,
    (state: FolderType[], action: FolderAction) => {
      switch (action.type) {
        case "add":
          return [
            ...state,
            {
              id: Date.now(),
              name: action.name,
              parent: action.currentFolderId,
              ownerId: state[0]?.ownerId || "",
            } as FolderType
          ];
        case "remove":
          return state.filter((f) => f.id !== action.id);
        case "rename":
          return state.map((f) => f.id === action.id ? { ...f, name: action.name } : f);

        default:
          return state;
      }
    }
  );

  type FileAction =
    { type: "remove"; id: number }
    | { type: "rename"; id: number; name: string };

  const [optimisticFiles, updateOptimisticFiles] = useOptimistic(
    props.files,
    (state: FileType[], action: FileAction) => {
      switch (action.type) {
        case "remove":
          return state.filter((f) => f.id !== action.id);
        case "rename":
          return state.map((f) => f.id === action.id ? { ...f, name: action.name } : f);
        default:
          return state;
      }
    }
  );


  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const uploadAppearance = {
    button: "bg-gradient-to-b from-surface-2 to-surface-1 hover:from-surface-3 hover:to-surface-2 border border-gray-700/50 text-gray-200 rounded-full font-medium text-sm px-8 py-2 shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto focus-within:ring-2 focus-within:ring-blue-500/50 ut-uploading:cursor-not-allowed",
    allowedContent: "text-gray-500 text-xs mt-2",
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      setShowCreateFolder(false);
    };

    if (showCreateFolder) {
      // Preserve Next.js internal router state when pushing our fake modal state!
      window.history.pushState({ ...window.history.state, modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else {
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showCreateFolder]);

  const closeFolderForm = () => {
    setShowCreateFolder(false);
    setFolderName("");
    // If we pushed a fake state, pop it so the history stays clean
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const emptyFolder = [...props.files, ...props.folders].length === 0;

  async function handleOptimsticFolderAdd(folder: string) {
    if (!folder.trim()) return;
    const name = folder.trim();

    // Immediately close the form and clear the input in the UI
    closeFolderForm();

    startTransition(async () => {
      updateOptimisticFolders({ type: "add", name, currentFolderId: props.currentFolderId });

      try {
        await createFolderAction(name, props.currentFolderId);
        navigate.refresh();
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    })
  }


  function handleFolderOptimisticRemove(folderId: number) {
    startTransition(async () => {
      updateOptimisticFolders({ type: "remove", id: folderId });
      await handleDeleteFolder(folderId);
    });
  }

  function handleFileOptimisticRemove(fileId: number) {
    startTransition(async () => {
      updateOptimisticFiles({ type: "remove", id: fileId });
      await handleDeleteFile(fileId);
    });
  }

  function handleFolderOptimisticRename(folderId: number, name: string) {
    startTransition(async () => {
      updateOptimisticFolders({ type: "rename", id: folderId, name });
      await renameFolder(folderId, name);
    });
  }

  function handleFileOptimisticRename(fileId: number, name: string) {
    startTransition(async () => {
      updateOptimisticFiles({ type: "rename", id: fileId, name });
      await renameFile(fileId, name);
    });
  }

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      toast.success(`Deleted file`);
      navigate.refresh();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolderAction(folderId);
      toast.success(`Deleted "${folderId}"`);
      navigate.refresh();
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const renameFile = async (id: number, name: string) => {
    try {
      await renameFileAction(name, id);
      toast.success(`Renamed file`);
      navigate.refresh();
    } catch (error) {
      toast.error("Failed to rename file");
    }
  };

  const renameFolder = async (id: number, name: string) => {
    try {
      await renameFolderAction(name, id);
      toast.success(`Renamed folder`);
      navigate.refresh();
    } catch (error) {
      toast.error("Failed to rename folder");
    }
  };
  return (
    <div className="min-h-screen bg-surface-0 text-gray-100 p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-5xl">

        {/* ── Header: Breadcrumbs + Actions ── */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          {/* Breadcrumbs - Scrollable on mobile */}
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm pb-2" aria-label="Breadcrumb">
            {props.parents.length <= 1 ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-700/50 bg-surface-2 px-3 py-1.5 font-medium text-gray-300">
                My Drive
              </span>
            ) : (
              <Link
                href={`/f/${props.parents[0]?.id}`}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-700/50 bg-surface-2 px-3 py-1.5 font-medium text-gray-300 transition-all duration-200 hover:bg-surface-3 hover:text-white"
              >
                My Drive
              </Link>
            )}
            {props.parents.slice(1).map((folder, i) => (
              <div key={folder.id} className="flex shrink-0 items-center">
                <ChevronRight className="mx-1 text-gray-600" size={14} />
                {i === props.parents.slice(1).length - 1 ? (
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
                if (e.key === "Enter") handleOptimsticFolderAdd(folderName);
                if (e.key === "Escape") { closeFolderForm(); }
              }}
              autoFocus
              className="flex-1 border-none bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none focus:ring-0"
            />
            <button
              id="confirm-create-folder-btn"
              onClick={() => handleOptimsticFolderAdd(folderName)}
              disabled={isCreating || !folderName.trim()}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCreating ? "Creating…" : "Create"}
            </button>
            <button
              id="cancel-create-folder-btn"
              onClick={() => closeFolderForm()}
              className="px-3 py-1.5 text-sm text-gray-500 transition-colors duration-150 hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Content Area ── */}

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
              {optimisticFolders.map((folder, i) => (
                <FolderRow key={folder.id} folder={folder} index={i} DeleteFolder={handleFolderOptimisticRemove} renameFolder={handleFolderOptimisticRename} />
              ))}
              {optimisticFiles.map((file, index) => {
                const lastFile = optimisticFiles.length - 1 === index;
                return <FileRow key={file.id} file={file} lastFile={lastFile}
                  index={optimisticFolders.length + index} DeleteFile={handleFileOptimisticRemove}
                  renameFile={handleFileOptimisticRename} />;
              })}
            </ul>
          </div>
        )}

        {/* ── Upload Area ── */}
        <div className="mt-8 mb-12 flex justify-center pb-8">
          <UploadButton
            endpoint="driveUploader"
            appearance={uploadAppearance}
            onClientUploadComplete={() => {
              toast.success("Upload complete!");
              navigate.refresh();
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
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