import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";

const DashboardLayout = () => {
    const [isMobileOpen,setIsMobileOpen] = useState(false)
    const [isCreateFolderOpen,setIsCreateFolderOpen] = useState(false)
    const onCreateFolderClick = ()=>{

    }
  return (
    <div className="min-h-screen flex flex-col text-zinc-100">
      {/* Sidebar */}
      <SideBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} onCreateFolderClick={onCreateFolderClick} />
      {/* Right side */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Header */}
          <h1 className="text-xl font-semibold">
            Header
          </h1>
        {/* Page */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;