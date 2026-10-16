import React, { useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { ChevronRight, HardDrive, Folder, PlusIcon, FolderPlusIcon, HardDriveIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import CreateFolder from '../folder/CreateFolder'
import { useDrive } from "../../hooks/useDrive";

const BreadCrumb = () => {
  const { breadcrumb } = useApp();
  const currentFolderId = breadcrumb[breadcrumb.length - 1]?.id ?? null;
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const { isUploading, uploadFiles } = useDrive()
  const fileRef = useRef();
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files, currentFolderId)
      e.target.value = ""
    }
  }
  return (
    <div className="w-full flex items-center justify-between mb-3">
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto p-1 no-scrollbar">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          const isRoot = index === 0;
          const path = item.id ? `/drive/${item.id}` : "/";

          return (
            <React.Fragment key={item.id || "root"}>
              {index > 0 && (
                <ChevronRight
                  className="mx-1 size-4 shrink-0 text-zinc-100"
                  strokeWidth={2.5}
                />
              )}

              <Link
                to={path}
                aria-current={isLast ? "page" : undefined}
                title={item.name}
                className={`
                    group flex shrink-0 items-center gap-2 rounded-xl
                    px-3 py-2.5 text-sm font-medium
                    transition-all duration-200 ease-out
                    ${isLast
                    ? "border border-zinc-800 bg-zinc-900 text-zinc-200"
                    : "border border-transparent text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
                  }
                  `}
              >
                {isRoot ? (
                  <HardDrive
                    className={`size-[23px] shrink-0 transition-colors ${isLast
                        ? "text-purple-600"
                        : "text-zinc-200 group-hover:text-purple-700"
                      }`}
                  />
                ) : (
                  <Folder
                    className={`size-[17px] shrink-0 transition-colors ${isLast
                        ? "fill-purple-600/30 text-purple-600"
                        : "text-zinc-200 group-hover:text-purple-700"
                      }`}
                  />
                )}

                <span
                  className={`max-w-40 truncate uppercase ${isLast ? "font-semibold" : ""
                    }`}
                >
                  {isRoot ? "My Drive" : item.name}
                </span>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
      {/* New Item Button */}
      <div>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
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
            icon={HardDriveIcon}
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
      <CreateFolder isOpen={isCreateFolderOpen} onClose={() => setIsCreateFolderOpen(false)} />
    </div>
  );
};

export default BreadCrumb;