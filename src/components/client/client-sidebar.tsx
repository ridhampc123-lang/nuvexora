"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  LifeBuoy
} from "lucide-react";

const clientNavItems = [
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

export function ClientSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  
  const initials = user?.name ? user.name.split(" ").map((n: string) => n.charAt(0)).join("").toUpperCase().slice(0, 2) : "CP";

  return (
    <aside
      className={`hidden lg:flex relative bg-slate-900 text-slate-300 border-r border-slate-800 flex-col justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand & Client Workspace Selector */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/client" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 shadow-md ring-1 ring-white/10 overflow-hidden">
            <img src="/logos/logo.png" alt="Nuvexora Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-white text-base tracking-tight">Veloce Financial</span>
              <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest mt-0.5">Enterprise Client</span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto" data-lenis-prevent>
        {clientNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/client" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Account Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user?.name || "Client"}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">99.999% SLA Active</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
