"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, LogOut, ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function BusinessHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts.length > 1 ? pathParts[1].toUpperCase() : "BUSINESS OS";

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between z-20 select-none">
      {/* Search & Module Name */}
      <div className="flex items-center gap-6">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
          BUSINESS OS / <span className="text-blue-600 dark:text-blue-400 font-extrabold">{currentPage}</span>
        </div>

        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deals, staff, ledger..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          <span>Admin CMS</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </Link>

        <ThemeToggle />

        {/* User Profile */}
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-3">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              OS
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Executive Suite</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs text-slate-900 dark:text-slate-100">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-slate-900 dark:text-slate-100 font-sans">Business Executive</div>
                <div className="text-[10px] text-slate-400">exec@nuvexora.com</div>
              </div>
              <Link href="/" className="flex items-center gap-2 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
