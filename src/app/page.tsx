 // Indicates that this component is a client component in Next.js

import { useState } from "react"; // Importing useState hook from React
import { type File, mockFiles } from "../lib/mock-data"; // Importing types and mock data
import { Folder, FileIcon, Upload, ChevronRight } from "lucide-react"; // Importing icons from lucide-react
import Link from "next/link"; // Importing Link component for navigation
import { Button } from "~/components/ui/button"; // Importing a custom Button component

// Main component definition
export default function GoogleDriveClone() {
  // State to keep track of the currently selected folder
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Function to get files in the current folder
  const getCurrentFiles = () => {
    return mockFiles.filter((file) => file.parent === currentFolder);
  };

  // Function to handle folder click events
  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId); // Update the current folder state
  };

  // Function to generate breadcrumbs for navigation
  const getBreadcrumbs = () => {
    const breadcrumbs: File[] = []; // Array to hold breadcrumb items
    let currentId = currentFolder; // Start with the current folder

    // Loop to build the breadcrumb trail
    while (currentId !== null) {
      const folder = mockFiles.find((file) => file.id === currentId); // Find the folder by ID
      if (folder) {
        breadcrumbs.unshift(folder); // Add folder to the beginning of the array
        currentId = folder.parent; // Move to the parent folder
      } else {
        break; // Exit if no folder is found
      }
    }

    return breadcrumbs; // Return the breadcrumb array
  };

  // Function to handle file upload (currently just an alert)
  const handleUpload = () => {
    alert("Upload functionality would be implemented here");
  };

  // Render the component
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Main container with background and padding */}
      <div className="max-w-6xl mx-auto">
        {/* Header section with navigation and upload button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {/* Button to go back to "My Drive" */}
            <Button
              onClick={() => setCurrentFolder(null)}
              variant="ghost"
              className="text-gray-300 hover:text-white mr-2"
            >
              My Drive
            </Button>
            {/* Render breadcrumbs for navigation */}
            {getBreadcrumbs().map((folder) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="mx-2 text-gray-500" size={16} />
                <Button
                  onClick={() => handleFolderClick(folder.id)}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  {folder.name}
                </Button>
              </div>
            ))}
          </div>
          {/* Upload button */}
          <Button
            onClick={handleUpload}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Upload className="mr-2" size={20} />
            Upload
          </Button>
        </div>
        {/* File and folder list section */}
        <div className="bg-gray-800 rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-3">Size</div>
            </div>
          </div>
          <ul>
            {/* Render the list of files and folders */}
            {getCurrentFiles().map((file) => (
              <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center">
                    {/* Conditional rendering based on file type */}
                    {file.type === "folder" ? (
                      <button
                        onClick={() => handleFolderClick(file.id)}
                        className="flex items-center text-gray-100 hover:text-blue-400"
                      >
                        <Folder className="mr-3" size={20} />
                        {file.name}
                      </button>
                    ) : (
                      <Link href={file.url ?? "#"} className="flex items-center text-gray-100 hover:text-blue-400">
                        <FileIcon className="mr-3" size={20} />
                        {file.name}
                      </Link>
                    )}
                  </div>
                  <div className="col-span-3 text-gray-400">{file.type === "folder" ? "Folder" : "File"}</div>
                  <div className="col-span-3 text-gray-400">{file.type === "folder" ? "--" : "2 MB"}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}