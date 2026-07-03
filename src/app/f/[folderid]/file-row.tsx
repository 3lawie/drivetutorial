import { type FolderType, type FileType } from "~/lib/mock-data"
import { Folder as FolderIcon, FileIcon, Trash2Icon, FileText, Image, FileSpreadsheet, Film, Music, Archive, File } from "lucide-react"
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolderAction } from "~/server/actions/action";
import { useRouter } from "next/navigation";

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
    return <Image size={18} className={`${iconClass} text-emerald-400`} />;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
    return <Film size={18} className={`${iconClass} text-pink-400`} />;
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <Music size={18} className={`${iconClass} text-violet-400`} />;
  if (["pdf", "doc", "docx", "txt", "md", "rtf"].includes(ext))
    return <FileText size={18} className={`${iconClass} text-blue-400`} />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileSpreadsheet size={18} className={`${iconClass} text-green-400`} />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <Archive size={18} className={`${iconClass} text-amber-400`} />;
  return <File size={18} className={`${iconClass} text-gray-400`} />;
}

export function FileRow(props: { file: FileType, lastFile: boolean, index: number }) {
  const { file } = props;
  const navigate = useRouter();

  return (
    <li
      className={`group px-5 py-3.5 hover:bg-surface-hover/50 transition-colors duration-150 animate-fade-in-up stagger-row ${props.lastFile ? "" : "border-b border-gray-800/40"
        }`}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Name */}
        <div className="col-span-6 flex items-center gap-3 min-w-0">
          {getFileIcon(file.name)}
          <a
            href={file.url}
            target="_blank"
            className="text-sm font-medium text-gray-200 hover:text-blue-400 transition-colors duration-150 truncate"
          >
            {file.name}
          </a>
        </div>

        {/* Type */}
        <div className="col-span-2">
          <span className="text-xs text-gray-500">
            {file.name.includes(".") ? file.name.split(".").pop()!.toUpperCase() : "File"}
          </span>
        </div>

        {/* Size */}
        <div className="col-span-2">
          <span className="text-xs text-gray-500 tabular-nums">
            {formatFileSize(file.size)}
          </span>
        </div>

        {/* Actions — visible on hover */}
        <div className="col-span-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-red-500/10"
            onClick={async () => {
              await deleteFile(file.id);
              navigate.refresh();
            }}
            aria-label="Delete file"
          >
            <Trash2Icon
              className="text-gray-500 group-hover:text-red-400 transition-colors duration-150"
              size={16}
            />
          </Button>
        </div>
      </div>
    </li>
  )
}

export function FolderRow(props: { folder: FolderType, index: number }) {
  const navigate = useRouter();
  return (
    <li
      className="group px-5 py-3.5 border-b border-gray-800/40 hover:bg-surface-hover/50 transition-colors duration-150 animate-fade-in-up stagger-row"
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Name */}
        <div className="col-span-6 flex items-center gap-3 min-w-0">
          <Link
            href={`/f/${props.folder.id}`}
            className="flex items-center gap-3 text-sm font-medium text-gray-200 hover:text-blue-400 transition-colors duration-150 truncate"
          >
            <FolderIcon size={18} className="text-amber-400/80 shrink-0" />
            {props.folder.name}
          </Link>
        </div>

        {/* Type */}
        <div className="col-span-2">
          <span className="text-xs text-gray-500">Folder</span>
        </div>

        {/* Size */}
        <div className="col-span-2">
          <span className="text-xs text-gray-600">—</span>
        </div>

        {/* Actions — visible on hover */}
        <div className="col-span-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-red-500/10"
            onClick={async () => {
              await deleteFolderAction(props.folder.id);
              navigate.refresh();
            }}
            aria-label="Delete folder"
          >
            <Trash2Icon
              className="text-gray-500 group-hover:text-red-400 transition-colors duration-150"
              size={16}
            />
          </Button>
        </div>
      </div>
    </li>
  )
}