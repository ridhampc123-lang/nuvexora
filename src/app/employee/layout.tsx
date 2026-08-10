"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NuvexoraLogoMark } from "@/components/common/nuvexora-logo-mark";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Milestone,
  Calendar,
  Video,
  MessageSquare,
  Bell,
  Folder,
  Clock,
  UserCheck,
  CalendarDays,
  TrendingUp,
  Megaphone,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
  { label: "My Profile", href: "/employee/profile", icon: User },
  { label: "My Projects", href: "/employee/projects", icon: FolderKanban },
  { label: "My Tasks", href: "/employee/tasks", icon: CheckSquare },
  { label: "Milestones", href: "/employee/milestones", icon: Milestone },
  { label: "Calendar", href: "/employee/calendar", icon: Calendar },
  { label: "Meetings", href: "/employee/meetings", icon: Video },
  { label: "Messages", href: "/employee/messages", icon: MessageSquare },
  { label: "Notifications", href: "/employee/notifications", icon: Bell },
  { label: "Files Vault", href: "/employee/files", icon: Folder },
  { label: "Timesheets", href: "/employee/timesheets", icon: Clock },
  { label: "Attendance", href: "/employee/attendance", icon: UserCheck },
  { label: "Leave Requests", href: "/employee/leave", icon: CalendarDays },
  { label: "Performance", href: "/employee/performance", icon: TrendingUp },
  { label: "Announcements", href: "/employee/announcements", icon: Megaphone },
  { label: "Knowledge Base", href: "/employee/kb", icon: BookOpen },
  { label: "Company Policies", href: "/employee/policies", icon: ShieldCheck },
  { label: "Support", href: "/employee/support", icon: HelpCircle },
  { label: "Settings", href: "/employee/settings", icon: Settings },
];

import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuth } from "@/providers/auth-provider";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user?.name ? user.name.split(" ").map((n: string) => n.charAt(0)).join("").toUpperCase().slice(0, 2) : "EP";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard allowedRoles={["EMPLOYEE", "SUPER_ADMIN", "ADMIN"]} portalName="Employee Portal">
      <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/employee" className="group flex items-center gap-3">
            <NuvexoraLogoMark size={38} />
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight leading-none">Nuvexora OS</div>
              <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mt-1">Employee Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{user?.name || "Employee"}</div>
              <div className="text-[10px] text-slate-400">{user?.department || "Team Member"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative hidden sm:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, projects, files..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Clock In Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Workspace Active</span>
            </div>

            {/* Notification Bell */}
            <Link
              href="/employee/notifications"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
            </Link>
          </div>
        </header>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1 z-40 max-h-[75vh] overflow-y-auto"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
    </AuthGuard>
  );
}
