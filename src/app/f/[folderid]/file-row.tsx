"use client"

import { type FolderType, type FileType } from "~/lib/mock-data"
import { Folder as FolderIcon, Trash2Icon, FileText, Image as ImageIcon, FileSpreadsheet, Film, Music, Archive, File } from "lucide-react"
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolderAction } from "~/server/actions/action";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";

/** Format bytes into a human-readable string */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[i]}`;
}

/** Pick an icon based on file extension */
function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const iconClass = "shrink-0";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext))
    return <ImageIcon size={20} className={`${iconClass} text-emerald-400`} />;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
    return <Film size={20} className={`${iconClass} text-pink-400`} />;
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <Music size={20} className={`${iconClass} text-violet-400`} />;
  if (["pdf", "doc", "docx", "txt", "md", "rtf"].includes(ext))
    return <FileText size={20} className={`${iconClass} text-blue-400`} />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileSpreadsheet size={20} className={`${iconClass} text-green-400`} />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <Archive size={20} className={`${iconClass} text-amber-400`} />;
  return <File size={20} className={`${iconClass} text-gray-400`} />;
}

export function FileRow(props: { file: FileType, lastFile: boolean, index: number, DeleteFile: (fileId: number) => void }) {
  const { file } = props;

  return (
    <li
      className={`group flex items-center gap-4 px-4 py-3 transition-all duration-200 hover:bg-surface-hover/50 sm:grid sm:grid-cols-12 sm:px-5 sm:py-3.5 stagger-row animate-fade-in-up ${props.lastFile ? "" : "border-b border-gray-800/40"}`}
    >
      {/* Name — always visible */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:col-span-6">
        {getFileIcon(file.name)}
        <a
          href={file.url}
          target="_blank"
          className="truncate text-sm font-medium text-gray-200 transition-colors duration-150 hover:text-blue-400"
        >
          {file.name}
        </a>
      </div>

      {/* Type — hidden on mobile */}
      <div className="hidden sm:col-span-2 sm:block">
        <span className="text-xs text-gray-500">
          {file.name.includes(".") ? file.name.split(".").pop()!.toUpperCase() : "File"}
        </span>
      </div>

      {/* Size — hidden on mobile */}
      <div className="hidden sm:col-span-2 sm:block">
        <span className="text-xs text-gray-500 tabular-nums">
          {formatFileSize(file.size)}
        </span>
      </div>

      {/* Actions — always visible on mobile, hover on desktop */}
      <div className="flex shrink-0 justify-end sm:col-span-2 sm:opacity-0 sm:transition-all sm:duration-150 sm:group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-red-500/10"
          onClick={() => props.DeleteFile(file.id)}
          aria-label="Delete file"
        >
          <Trash2Icon
            className="text-gray-500 transition-colors duration-150 group-hover:text-red-400"
            size={16}
          />
        </Button>
      </div>
    </li>
  )
}

export function FolderRow(props: { folder: FolderType, index: number, DeleteFolder: (folderId: number) => void }) {
  const navigate = useRouter();





  return (
    <li
      className={`group flex items-center gap-4 border-b border-gray-800/40 px-4 py-3 transition-all duration-200 hover:bg-surface-hover/50 sm:grid sm:grid-cols-12 sm:px-5 sm:py-3.5 stagger-row animate-fade-in-up`}
    >
      {/* Name */}
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:col-span-6">
        <Link
          href={`/f/${props.folder.id}`}
          className="flex min-w-0 items-center gap-3 text-sm font-medium text-gray-200 transition-colors duration-150 hover:text-blue-400"
        >
          <FolderIcon size={20} className="shrink-0 text-amber-400/80" />
          <span className="truncate">{props.folder.name}</span>
        </Link>
      </div>

      {/* Type */}
      <div className="hidden sm:col-span-2 sm:block">
        <span className="text-xs text-gray-500">Folder</span>
      </div>

      {/* Size */}
      <div className="hidden sm:col-span-2 sm:block">
        <span className="text-xs text-gray-600">—</span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 justify-end sm:col-span-2 sm:opacity-0 sm:transition-all sm:duration-150 sm:group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-red-500/10"
          onClick={() => props.DeleteFolder(props.folder.id)}
          aria-label="Delete folder"
        >
          <Trash2Icon
            className="text-gray-500 transition-colors duration-150 group-hover:text-red-400"
            size={16}
          />
        </Button>
      </div>
    </li>
  )
}