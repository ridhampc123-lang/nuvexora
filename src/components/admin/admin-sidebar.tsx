"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, UserPlus, Briefcase, FolderKanban, CheckSquare,
  Milestone, Building2, Landmark, Clock, CalendarDays, Video, Calendar,
  MessageSquare, LifeBuoy, FileSpreadsheet, CreditCard, ScrollText, PenTool,
  FolderOpen, LineChart, PieChart, LayoutTemplate, PenBox, FolderHeart, ShieldCheck,
  Image as ImageIcon, Key, History, Settings, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";

const navGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    title: "CRM",
    items: [
      { label: "Leads", href: "/admin/leads", icon: UserPlus },
      { label: "Clients", href: "/admin/clients", icon: Users },
      { label: "Companies", href: "/admin/companies", icon: Building2 },
    ]
  },
  {
    title: "Projects",
    items: [
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
      { label: "Milestones", href: "/admin/milestones", icon: Milestone },
    ]
  },
  {
    title: "HR & Employees",
    items: [
      { label: "Employees", href: "/admin/employees", icon: Briefcase },
      { label: "Departments", href: "/admin/departments", icon: Landmark },
      { label: "Attendance", href: "/admin/attendance", icon: Clock },
      { label: "Leave", href: "/admin/leave", icon: CalendarDays },
    ]
  },
  {
    title: "Communication",
    items: [
      { label: "Meetings", href: "/admin/meetings", icon: Video },
      { label: "Calendar", href: "/admin/calendar", icon: Calendar },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Support", href: "/admin/support", icon: LifeBuoy },
    ]
  },
  {
    title: "Finance & Legal",
    items: [
      { label: "Invoices", href: "/admin/invoices", icon: FileSpreadsheet },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Proposals", href: "/admin/proposals", icon: PenTool },
      { label: "Contracts", href: "/admin/contracts", icon: ScrollText },
    ]
  },
  {
    title: "Assets & Reporting",
    items: [
      { label: "Files", href: "/admin/files", icon: FolderOpen },
      { label: "Reports", href: "/admin/reports", icon: LineChart },
      { label: "Analytics", href: "/admin/analytics", icon: PieChart },
    ]
  },
  {
    title: "Website CMS",
    items: [
      { label: "Blog", href: "/admin/blog", icon: PenBox },
      { label: "Portfolio", href: "/admin/portfolio", icon: FolderHeart },
      { label: "Services", href: "/admin/services", icon: LayoutTemplate },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
    ]
  },
  {
    title: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Roles", href: "/admin/roles", icon: ShieldCheck },
      { label: "Permissions", href: "/admin/permissions", icon: Key },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex relative bg-slate-950 text-slate-300 border-r border-slate-800 flex-col justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 shadow-md ring-1 ring-white/10 overflow-hidden">
            <img src="/logos/logo.png" alt="Nuvexora Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-white text-base tracking-tight">Nuvexora</span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest mt-0.5">Admin Studio</span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar" data-lenis-prevent>
        <div className="px-3 space-y-6">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  {group.title}
                </h3>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Profile Mini Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            SA
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">Super Admin</div>
              <div className="text-[10px] text-slate-400 truncate">admin@nuvexora.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
