
import React from "react";
import {
  HardDrive,
  Share2Icon,
  Trash2Icon,
  CloudUploadIcon,
  X,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatBytes } from "../assets/assets";
import { ProgressBar } from "./ui/ProgressBar";

const SideBar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user } = useApp();
  const location = useLocation();

  const storageUsed = Math.max(
    0,
    Number(user?.storage_used ?? 0)
  );

  const storageLimit = Math.max(
    0,
    Number(user?.storage_limit ?? 0)
  );

  const usedPercentage =
    storageLimit > 0
      ? Math.min(100, Math.round((storageUsed / storageLimit) * 100))
      : 0;

  const menuItems = [
    { name: "My Drives", icon: HardDrive, path: "/drive" },
    { name: "Shared Files", icon: Share2Icon, path: "/shared" },
    { name: "Trash", icon: Trash2Icon, path: "/trash" },
  ];

  const closeMobileSidebar = () => {
    setIsMobileOpen?.(false);
  };

  const getProgressColor = () => {
    if (usedPercentage >= 90) return "bg-red-500";
    if (usedPercentage >= 75) return "bg-orange-500";
    return "bg-purple-500";
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={closeMobileSidebar}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${
            isMobileOpen
              ? "visible opacity-100"
              : "invisible opacity-0 pointer-events-none"
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50
          flex h-dvh w-72 max-w-[85vw] flex-col
          border-r border-[var(--border-primary)]
          bg-[#0A0A0A] text-white
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:w-64 md:max-w-none
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-primary)] px-5">
          <Link
            to="/drive"
            onClick={closeMobileSidebar}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
              <CloudUploadIcon className="h-5 w-5 text-purple-400" />
            </div>

            <h1 className="font-logo text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Cloudee
            </h1>
          </Link>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Workspace
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                to={item.path}
                key={item.name}
                onClick={closeMobileSidebar}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-purple-500/15 text-white"
                      : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
              >
                {isActive && (
                  <span className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-full bg-purple-400" />
                )}

                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-zinc-500 group-hover:text-zinc-200"
                  }`}
                />

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Compact storage section pinned to bottom */}
        <div className="shrink-0 border-t border-[var(--border-primary)]">
          <div className=" bg-white/[0.025] p-3.5">
            {/* Storage heading */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <HardDrive size={16} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-100">
                    Storage
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    Your space
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold ${
                  usedPercentage >= 90
                    ? "text-red-400"
                    : usedPercentage >= 75
                    ? "text-orange-400"
                    : "text-purple-400"
                }`}
              >
                {usedPercentage}%
              </span>
            </div>

            {/* Slim progress bar */}
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${usedPercentage}%` }}
              />
            </div>

            {/* Storage numbers */}
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="truncate text-xs font-medium text-zinc-200">
                {formatBytes(storageUsed)} used
              </span>

              <span className="shrink-0 text-[10px] text-zinc-500">
                of {formatBytes(storageLimit)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
