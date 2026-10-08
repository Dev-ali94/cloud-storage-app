import React, { useState } from "react"; 
import { HardDrive, Share2Icon, Trash2Icon, CloudUploadIcon, ArrowBigLeftDash, ArrowBigRightDash, LayoutDashboard, LogOut } from "lucide-react"; 
import { useApp } from "../context/AppContext"; 
import { Link, useLocation } from "react-router-dom" 
 
const SideBar = ({ isMobileOpen, setIsMobileOpen }) => { 
  const { user, currentFolderId } = useApp() 
  const location = useLocation() 
  const menuItems = [ 
    { 
      name: "Dashboard", 
      icon: LayoutDashboard, 
      path: "/" 
    }, 
    { 
      name: "My Drives", 
      icon: HardDrive, 
      path: "/drive" 
    }, 
    { 
      name: "Shared File", 
      icon: Share2Icon, 
      path: "/shared" 
    }, 
    { 
      name: "Trash", 
      icon: Trash2Icon, 
      path: "/trash" 
    } 
  ]; 
 
  return ( 
    <div className="fixed top-0 left-0 border-r border-zinc-700  bottom-0 h-screen bg-zinc-900 text-zinc-100 flex flex-col transition-all duration-300 ease-in-out w-64"> 
      {/* Header */} 
      <div className="h-16  p-3 flex items-center justifiy-start border-b border-gray-700 "> 
          <div className="flex items-center justify-start gap-2"> 
            <CloudUploadIcon className="w-7 h-7 text-purple-500" /> 
            <h1 className="text-sm font-logo font-base uppercase">Cloudee</h1> 
          </div> 
      </div> 
 
      {/* Navigation */} 
      <nav className="flex-1 space-y-1.5 px-2 py-4"> 
        {menuItems.map((item) => { 
          const Icon = item.icon; 
 
          // Correct active route logic 
          const isActive = item.path === "/" ? location.pathname === "/" : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`); 
 
          return ( 
            <Link 
              to={item.path} 
              key={item.name} 
              className={`group px-3.5 py-2.5 rounded-xl relative flex items-center rounded-xltext-sm font-medium transition-all duration-200 ease-in-out 
         
 
          ${isActive 
                  ? "bg-purple-600/15 text-purple-400 shadow-sm" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white" 
                } 
        `} 
            > 
              {/* Active indicator */} 
              {isActive && ( 
                <span 
                  className=" 
              absolute left-0 top-1/2 
              h-7 w-1 
              -translate-y-1/2 
              rounded-r-full 
              bg-purple-500 
            " 
                /> 
              )} 
 
              {/* Icon */} 
              <Icon 
                className={` 
            size-5 shrink-0 
            transition-colors duration-200 
            ${isActive 
                    ? "text-purple-400" 
                    : "text-zinc-400 group-hover:text-white" 
                  } 
          `} 
              /> 
 
              
                <span className="truncate"> 
                  {item.name} 
                </span> 
            </Link> 
          ); 
        })} 
      </nav> 
 
      <div className="border-t border-zinc-800 p-4"> 
        <div className="flex items-center gap-3"> 
          {/* Avatar */} 
          <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold"> 
            {user?.name?.charAt(0).toUpperCase()} 
          </div> 
 
          {/* User Info */} 
          <div className="min-w-0 flex-1"> 
            <h2 className="text-sm font-semibold text-zinc-100 truncate"> 
              {user?.name} 
            </h2> 
 
            <p className="text-xs text-zinc-400 truncate"> 
              {user?.email} 
            </p> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default SideBar;  