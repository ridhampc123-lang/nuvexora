"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  LogOut, 
  ExternalLink, 
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LayoutDashboard, Users, UserPlus, Briefcase, FolderKanban, CheckSquare,
  Milestone, Building2, Landmark, Clock, CalendarDays, Video, Calendar,
  MessageSquare, LifeBuoy, FileSpreadsheet, CreditCard, ScrollText, PenTool,
  FolderOpen, LineChart, PieChart, LayoutTemplate, PenBox, FolderHeart,
  Image as ImageIcon, Key, History, Settings
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const mobileNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: UserPlus },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
  { label: "Employees", href: "/admin/employees", icon: Briefcase },
  { label: "Attendance", href: "/admin/attendance", icon: Clock },
  { label: "Meetings", href: "/admin/meetings", icon: Video },
  { label: "Invoices", href: "/admin/invoices", icon: FileSpreadsheet },
  { label: "Blog CMS", href: "/admin/blog", icon: PenBox },
  { label: "Portfolio CMS", href: "/admin/portfolio", icon: FolderHeart },
  { label: "Services CMS", href: "/admin/services", icon: LayoutTemplate },
  { label: "Analytics", href: "/admin/analytics", icon: PieChart },
  { label: "Reports", href: "/admin/reports", icon: LineChart },
  { label: "Users & Security", href: "/admin/users", icon: ShieldCheck },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminHeader() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generate simple breadcrumb text
  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts.length > 1 ? pathParts[1].toUpperCase() : "DASHBOARD";

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 select-none">
        {/* Left Search & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
            ADMIN / <span className="text-blue-600 dark:text-blue-400 font-extrabold">{currentPage}</span>
          </div>

          <div className="relative hidden md:block w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search CMS, leads, articles..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Live Site Button */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </Link>

          {/* Notifications Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 space-y-3 text-slate-900 dark:text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-medium">
                    <span className="font-bold text-blue-700 dark:text-blue-400 block">New Consultation Lead</span>
                    Veloce Financial booked a technical call.
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">System Backup Completed</span>
                    MongoDB automated snapshot stored.
                  </div>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User Profile Menu */}
          <div className="relative border-l border-slate-200 dark:border-slate-800 pl-3">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                SA
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs text-slate-900 dark:text-slate-100">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">Super Admin</div>
                  <div className="text-[10px] text-slate-400">admin@nuvexora.com</div>
                </div>
                <Link href="/admin/settings" className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Security Settings
                </Link>
                <Link href="/" className="flex items-center gap-2 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            data-lenis-prevent
            className="lg:hidden bg-slate-950 text-slate-300 border-b border-slate-800 p-4 z-40 max-h-[75vh] overflow-y-auto"
          >
            <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Mobile Menu</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
