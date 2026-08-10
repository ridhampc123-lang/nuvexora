"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NuvexoraLogoMark } from "@/components/common/nuvexora-logo-mark";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  HelpCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase,
  Layers,
  Settings,
  Bot
} from "lucide-react";

const businessNavItems = [
  { label: "CRM & Deals Funnel", href: "/business/crm", icon: TrendingUp },
  { label: "HRMS & Staff Directory", href: "/business/hr", icon: Users },
  { label: "Finance & Ledger", href: "/business/finance", icon: DollarSign },
  { label: "Support Desk Inbox", href: "/business/support", icon: HelpCircle },
  { label: "Nuvexora AI Studio", href: "/business/ai", icon: Bot },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/business/crm" className="group flex items-center gap-3 overflow-hidden">
          <NuvexoraLogoMark size={38} />
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-white text-base tracking-tight">Nuvexora</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Business OS</span>
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
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto" data-lenis-prevent>
        {businessNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/business" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            OS
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">Business Operating System</div>
              <div className="text-[10px] text-blue-400 font-semibold">Nuvexora Enterprise v1.0</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
