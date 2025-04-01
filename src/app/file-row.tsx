import { type FolderType, mockFolders, type File} from "~/lib/mock-data"
import { Folder as FolderIcon, FileIcon, Upload, ChevronRight, Link, Folder } from "lucide-react"
 export function FileRow(props : {file : File}) {
    const {file}= props;

    return (
        <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition duration-200">
            <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center">
                    <a 
                        href={file.url} 
                        target="_blank" 
                        className="flex items-center text-gray-100 hover:text-blue-400 transition duration-200"
                    >
                        <FileIcon className="mr-3" size={20} />
                       {file.name}
                       </a>
                </div>
                <div className="col-span-3 text-gray-400">File</div>
                <div className="col-span-3 text-gray-400">2 MB</div>
            </div>
        </li>
    )
}
export function FolderRow({ folder, handleFolderClick }: { folder: FolderType /*FolderType*/; handleFolderClick: () => void }) {
    return (
        <li key={folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
              <button
                onClick={() => handleFolderClick() }
                className="flex items-center text-gray-100 hover:text-blue-400"
              >
                <FolderIcon className="mr-3" size={20} />
                {folder.name}
              </button>
            </div>
          <div className="col-span-3 text-gray-400">Folder</div>
        </div>
      </li>
    )
}