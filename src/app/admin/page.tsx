"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Users, Building2, FolderKanban, CheckSquare, Briefcase, FileText, 
  MessageSquare, Video, FileSpreadsheet, Plus, TrendingUp
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { useAdminMetricsQuery } from "@/hooks/use-api-queries";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

const analyticsData = [
  { month: "Jan", leads: 32, visitors: 4200 },
  { month: "Feb", leads: 45, visitors: 5600 },
  { month: "Mar", leads: 68, visitors: 7800 },
  { month: "Apr", leads: 52, visitors: 6400 },
  { month: "May", leads: 89, visitors: 9200 },
  { month: "Jun", leads: 104, visitors: 11400 },
];

const projectStatusData = [
  { name: "Discovery", count: 4 },
  { name: "Development", count: 12 },
  { name: "QA Testing", count: 6 },
  { name: "Deployed", count: 18 },
];

export default function AdminDashboardPage() {
  const { data: metricsData, isLoading } = useAdminMetricsQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to backend Socket.IO
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Admin Dashboard connected to Socket.IO real-time engine.");
    });

    socket.on("dashboard_update", () => {
      console.log("Real-time dashboard update received! Invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ["adminMetrics"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const metrics = [
    { label: "Total Clients", value: isLoading ? "..." : String(metricsData?.totalClients ?? 0), change: "+3", icon: Building2, color: "text-blue-600 bg-blue-50" },
    { label: "Active Projects", value: isLoading ? "..." : String(metricsData?.activeProjects ?? 0), change: "+2", icon: FolderKanban, color: "text-indigo-600 bg-indigo-50" },
    { label: "Total Employees", value: isLoading ? "..." : String(metricsData?.totalUsers ?? 0), change: "+1", icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Tasks", value: isLoading ? "..." : String(metricsData?.totalTasks ?? 0), change: "-5", icon: CheckSquare, color: "text-rose-600 bg-rose-50" },
    { label: "New Leads", value: isLoading ? "..." : String(metricsData?.totalLeads ?? 0), change: "+12%", icon: MessageSquare, color: "text-orange-600 bg-orange-50" },
    { label: "Upcoming Meetings", value: isLoading ? "..." : String(metricsData?.upcomingMeetings ?? 0), change: "+4", icon: Video, color: "text-purple-600 bg-purple-50" },
    { label: "Total Invoices", value: isLoading ? "..." : String(metricsData?.totalInvoices ?? 0), change: "+8", icon: FileSpreadsheet, color: "text-amber-600 bg-amber-50" },
    { label: "Published Blogs", value: isLoading ? "..." : String(metricsData?.totalBlogs ?? 0), change: "+1", icon: FileText, color: "text-sky-600 bg-sky-50" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-0">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Enterprise Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time business intelligence metrics connected via Socket.IO
            {metricsData?.systemHealth === "OPTIMAL" && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM OPTIMAL
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-sm transition-all"
          >
            <FolderKanban className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/80">
                  {m.change}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">{m.value}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead & Visitor Growth Area Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Financial & Lead Trends</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly aggregate data</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">2026 H1</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Pipeline Bar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Project Status</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Pipeline distribution</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}