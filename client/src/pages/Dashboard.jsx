
import React, { useRef, useState } from "react";
import { Dropdown, DropdownItem } from "../components/ui/Dropdown";
import {HardDriveUploadIcon,PlusIcon,FolderPlusIcon} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProgressBar } from "../components/ui/ProgressBar";


const Dashboard = () => {
  const fileRef = useRef();
  const { user, currentFolderId,folder,file } = useApp()
  const isUploading = false;
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const formatBytes = (bytes) => { 
  if (!bytes || bytes <= 0) return "0 B";
  console.log(folder);
  // console.log(file)
  

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
};
   const storage_used =Math.floor(Number(user?.storage_used ?? 0)) 
  const storage_limit = Number(user?.storage_limit ?? 0)
  const used_percentage = Math.min(100, Math.round((storage_used / storage_limit) * 100))

  return (
    <div className="flex flex-col gap-4 m-4">

      <div className="p-4 bg-zinc-900 w-full rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Dashboard
            </h2>
            <p className="text-sm text-zinc-400">
              Manage your files and folders
            </p>
          </div>

          {/* New Item Button */}
          <div>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
            />

            <Dropdown
              trigger={
                <button
                  type="button"
                  disabled={isUploading}
                  className="flex items-center justify-center gap-2 px-4 py-2
                  bg-purple-600 hover:bg-purple-700 text-zinc-100
                  font-semibold text-sm rounded-lg transition-all
                  disabled:opacity-50 cursor-pointer"
                >
                  <PlusIcon className="size-5" />
                  <span>New Item</span>
                </button>
              }
              align="right"
              className="w-40"
            >
              <DropdownItem
                icon={HardDriveUploadIcon}
                onClick={() => fileRef.current?.click()}
              >
                Upload File
              </DropdownItem>

              <DropdownItem
                icon={FolderPlusIcon}
                onClick={() => setIsCreateFolderOpen(true)}
              >
                New Folder
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
        {/* Box 1 */} 
        <div className="bg-zinc-900 rounded-2xl p-5 min-h-[180px]"> 
          <h3 className="text-white font-semibold text-lg"> 
            Total Files 
          </h3> 
 
          <p className="text-zinc-400 text-sm mt-2"> 
            Your uploaded files 
          </p> 
 
          <div className="text-3xl font-bold text-purple-500 mt-6"> 
           {file.length} 
          </div> 
        </div> 
 
        {/* Box 2 */} 
        <div className="bg-zinc-900 rounded-2xl p-5 min-h-[180px]"> 
          <h3 className="text-white font-semibold text-lg"> 
            Folders 
          </h3> 
 
          <p className="text-zinc-400 text-sm mt-2"> 
            Your folders 
          </p> 
 
          <div className="text-3xl font-bold text-purple-500 mt-6"> 
            {folder.length} 
          </div> 
        </div> 
 
        {/* Box 3 - Storage */}
<div className="bg-zinc-900 rounded-2xl p-5 min-h-[180px] flex flex-col">
  <h3 className="text-white font-semibold text-lg">
    Storage
  </h3>

  <div className="flex items-center justify-between mt-3">
    <p className="text-zinc-400 text-sm">
      Storage used
    </p>

    <p className="text-purple-400 text-sm font-medium">
      {used_percentage}%
    </p>
  </div>

  {/* Progress Bar */}
  <div className="mt-3">
    <ProgressBar progress={used_percentage} color={used_percentage > 90 ?"bg-red-500" : used_percentage >75 ? "bg-ember-500" : "bg-purple-500"} />
  </div>

  {/* Storage Value */}
  <div className="mt-5 flex items-end justify-between">
    <div>
      <p className="text-3xl font-bold text-purple-500">
       {formatBytes(storage_used)}
      </p>
      <p className="text-xs text-zinc-500 mt-1">
      {formatBytes(storage_limit)}
      </p>
    </div>

    <span className="text-xs text-zinc-500">
      {used_percentage}% used
    </span>
  </div>
</div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-5 min-h-[250px]">
        <h2 className="text-xl font-semibold text-white">
          Recent Share Files
        </h2>

        <p className="text-zinc-400 text-sm mt-2">
          Your recently uploaded files will appear here.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;
