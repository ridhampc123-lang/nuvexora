"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  LogOut, 
  Wifi,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  CreditCard,
  LifeBuoy,
  X,
  Check,
  Menu,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  Calendar,
  FileText,
  Settings
} from "lucide-react";
import { useSocket } from "@/providers/socket-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

const clientMobileItems = [
  { label: "Portal Overview", href: "/client", icon: LayoutDashboard },
  { label: "My Projects", href: "/client/projects", icon: FolderKanban },
  { label: "Deliverable Approvals", href: "/client/approvals", icon: CheckCircle2 },
  { label: "Task Tracker", href: "/client/tasks", icon: CheckSquare },
  { label: "Engineering Chat", href: "/client/messages", icon: MessageSquare },
  { label: "Billing & Invoices", href: "/client/invoices", icon: CreditCard },
  { label: "Strategy Calls", href: "/client/meetings", icon: Calendar },
  { label: "Assets & Files", href: "/client/files", icon: FileText },
  { label: "Support Desk", href: "/client/tickets", icon: LifeBuoy },
  { label: "Portal Settings", href: "/client/settings", icon: Settings },
];

export function ClientHeader() {
  const pathname = usePathname();
  const { isConnected } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Deliverable Ready for Signoff",
      desc: "API v4 Schema Spec requires your digital approval.",
      category: "Approvals",
      href: "/client/approvals",
      time: "10 mins ago",
      icon: CheckCircle2,
      unread: true
    },
    {
      id: "n2",
      title: "New Invoice Issued",
      desc: "Sprint #14 Invoice #INV-2026-089 generated ($12,500).",
      category: "Billing",
      href: "/client/invoices",
      time: "1 hour ago",
      icon: CreditCard,
      unread: true
    },
    {
      id: "n3",
      title: "Support SLA Update",
      desc: "DevOps team updated ticket TICK-9041 webhook latency investigation.",
      category: "Support",
      href: "/client/tickets",
      time: "2 hours ago",
      icon: LifeBuoy,
      unread: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const pathParts = pathname.split("/").filter(Boolean);
  const currentPage = pathParts.length > 1 ? pathParts[1].toUpperCase() : "PORTAL OVERVIEW";

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 select-none">
        {/* Breadcrumbs & Search */}
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
            CLIENT PLATFORM / <span className="text-blue-600 dark:text-blue-400 font-extrabold">{currentPage}</span>
          </div>

          <div className="relative hidden md:block w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deliverables, tasks, invoices..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Controls & Live Socket Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Socket Indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
            isConnected
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
          }`}>
            <Wifi className="w-3 h-3" />
            <span>{isConnected ? "Live Socket Sync" : "Connecting..."}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 space-y-3 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Automatic Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs max-h-72 overflow-y-auto" data-lenis-prevent>
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setShowNotifications(false)}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                          n.unread
                            ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60"
                            : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800"
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 dark:text-white leading-tight">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* User Profile */}
          <div className="relative border-l border-slate-200 dark:border-slate-800 pl-3">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                MV
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Marcus Vance</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs text-slate-900 dark:text-slate-100">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">Marcus Vance</div>
                  <div className="text-[10px] text-slate-400">m.vance@velocefin.com</div>
                </div>
                <Link href="/client/settings" className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-200 font-medium">
                  Account Settings
                </Link>
                <Link href="/" className="flex items-center gap-2 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            data-lenis-prevent
            className="lg:hidden bg-slate-900 text-slate-300 border-b border-slate-800 p-4 z-40 max-h-[75vh] overflow-y-auto"
          >
            <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client Portal Menu</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {clientMobileItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/client" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
