"use client";

import React, { useState } from "react";
import { 
  LineChart, TrendingUp, Users, Cpu, IndianRupee, Activity, RefreshCw, FolderKanban
} from "lucide-react";
import { useAdminAnalyticsQuery } from "@/hooks/use-api-queries";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30d");
  const { data: analytics, isLoading, refetch } = useAdminAnalyticsQuery();

  const metrics = [
    { title: "Total Platform Revenue", value: isLoading ? "..." : `₹${(analytics?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, subtext: "Recorded invoices total" },
    { title: "Active Projects", value: isLoading ? "..." : String(analytics?.totalProjects ?? 0), icon: FolderKanban, subtext: "Database count" },
    { title: "Active Client Accounts", value: isLoading ? "..." : String(analytics?.activeClients ?? 0), icon: Users, subtext: "Active client status" },
    { title: "System Uptime SLA", value: isLoading ? "..." : (analytics?.systemUptimeSla ?? "99.99%"), icon: Cpu, subtext: "Multi-region cluster SLA" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
            <LineChart className="w-4 h-4" />
            <span>Business Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Executive Analytics & Telemetry</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Real-time performance metrics, client conversion funnels, and infrastructure telemetry.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Year to Date</option>
          </select>
          
          <button 
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">{m.value}</div>
                <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">{m.title}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">{m.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
