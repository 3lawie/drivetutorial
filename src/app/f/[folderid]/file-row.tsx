import { type FolderType, type FileType} from "~/lib/mock-data"
import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react"
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolderAction } from "~/server/actions/action";

import { useRouter } from "next/navigation";
import { MUTATIONS } from "~/server/db/queries";
 export function FileRow(props : {file : FileType , lastFile: boolean}) {
    const {file}= props;
    const navigate =useRouter();
    return (
        <li key={file.id} className={`px-6 py-4 border-gray-700 hover:bg-gray-750 transition duration-200 ${props.lastFile ? '' : 'border-b'}`} >
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
                <div className="col-span-3 text-gray-400">2 MB</div>
                <div className="col-span-3 text-gray-400 hover:text-black">
                  <Button variant="ghost" size="icon" className="hover:bg-zinc-300 rounded-[8px]" 
                  onClick={() => deleteFile(file.id) } 
                  aria-label="Delete file">
                    <Trash2Icon className="text-red-500 hover:text-red-700" size={20} onClick={() => setTimeout(() => navigate.refresh(), 1200)}></Trash2Icon>
                  </Button>
                </div>
                </div>
        </li>
    )
}
export function FolderRow(props : { folder:FolderType/*, handleFolderClick: () => void*/ }) {
    const navigate = useRouter();
    return (
        <li key={props.folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center">
              <Link
             href={`/f/${props.folder.id}`}
             className="flex items-center text-gray-100 hover:text-blue-400"
              >
                <FolderIcon className="mr-3" size={20} />
                {props.folder.name}
              </Link>
            </div>
          <div className="col-span-3 text-gray-400">Folder</div>
          
          <div className="col-span-3 text-gray-400"><Button variant="ghost" size="icon" className="hover:bg-zinc-300 rounded-[8px]" 
                  onClick={async ()=> await deleteFolderAction(props.folder.id) }
                  aria-label="Delete file">
                    <Trash2Icon className="text-red-500 hover:text-red-700" size={20} onClick={() => setTimeout(() => navigate.refresh(), 1200)}></Trash2Icon>
                  </Button>
                </div>
        </div>
      </li>
    )
}