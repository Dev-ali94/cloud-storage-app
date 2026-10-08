import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar";
import Header from "../Header";

const DashboardLayout = () => {
    const [isMobileOpen,setIsMobileOpen] = useState(false)
    
   
  return (
    <div className="min-h-screen flex flex-col text-zinc-100">
      {/* Sidebar */}
      <SideBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      {/* Right side */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header onMobileMenuToggle={()=>setIsMobileOpen(!isMobileOpen)}/>
        {/* Page */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;