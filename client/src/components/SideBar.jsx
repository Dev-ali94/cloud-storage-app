
import React, { useState } from "react";
import {HardDrive, Share2Icon, Trash2Icon,CloudUploadIcon, ArrowBigLeftDash, ArrowBigRightDash} from "lucide-react";

const SideBar = ({isMobileOpen, setIsMobileOpen,onCreateFolderClick}) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: "My Drives",
      icon: HardDrive,
    },
    {
      name: "Shared Items",
      icon: Share2Icon,
    },
    {
      name: "Trash",
      icon: Trash2Icon,
    }
  ];

  return (
    <div className={`h-screen bg-zinc-900 text-zinc-100 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-20"}`}>
      {/* Header */}
      <div className={`h-16 flex items-center border-b border-gray-700 ${isOpen ? "justify-between px-4" : "justify-center"}`}>
        
        {isOpen && (
          <div className="flex items-center justify-start gap-2">
         <CloudUploadIcon className="w-7 h-7 text-purple-500"/>
        <h1 className="text-sm font-logo font-base uppercase">Cloudee</h1>
       </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-zinc-800 transition">
          {isOpen ? <ArrowBigLeftDash size ={24} /> : <ArrowBigRightDash size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.name} 
            className={`w-full flex items-center rounded-lg hover:bg-gray-800 transition-all duration-200 ${isOpen ? "gap-3 px-3 py-3" : "justify-center py-3"}`}>
              <Icon size={22} />
              {isOpen && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

     
    </div>
  );
};

export default SideBar;
