"use client";

import React from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  CheckSquare, 
  CreditCard, 
  Clock, 
  ArrowUpRight, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  LifeBuoy,
  Calendar,
  FileText,
  Download
} from "lucide-react";
import { useClientDashboardQuery } from "@/hooks/use-api-queries";

export default function ClientDashboardOverviewPage() {
  const { data: dashboard, isLoading } = useClientDashboardQuery();

  const clientName = dashboard?.clientName ?? "Client";
  const primaryProjectName = dashboard?.primaryProject ?? "No Active Projects";
  const deliveryProgress = dashboard?.deliveryProgress ?? 0;

  const metrics = [
    { 
      label: "Active Projects", 
      value: isLoading ? "..." : String(dashboard?.activeProjectsCount ?? 0), 
      subtext: "Assigned engineering projects", 
      icon: FolderKanban, 
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/80" 
    },
    { 
      label: "Pending Tasks", 
      value: isLoading ? "..." : String(dashboard?.pendingTasksCount ?? 0), 
      subtext: "Awaiting action/review", 
      icon: CheckCircle2, 
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/80" 
    },
    { 
      label: "Uptime SLA Target", 
      value: isLoading ? "..." : (dashboard?.slaUptimeTarget ?? "99.99%"), 
      subtext: "Uptime guarantee", 
      icon: Clock, 
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80" 
    },
    { 
      label: "Outstanding Balance", 
      value: isLoading ? "..." : (dashboard?.outstandingInvoicesTotal ?? "₹0"), 
      subtext: "Unpaid invoices", 
      icon: CreditCard, 
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/80" 
    },
  ];

  const pendingTasks = dashboard?.tasks?.filter((t: any) => t.status !== "completed") || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Enterprise Client Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Welcome back, {clientName}</h1>
            {dashboard?.primaryProject ? (
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                {primaryProjectName} engineering sprint is currently <span className="text-emerald-400 font-bold">{deliveryProgress}% complete</span>.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                No active projects assigned to your account. Reach out to your account manager to get started.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/client/approvals"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Sign-offs</span>
            </Link>

            <Link
              href="/client/messages"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Team Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">{m.value}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{m.label}</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">{m.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Feature Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/client/approvals"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group flex flex-col justify-between space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Stage Approvals</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Formal milestone sign-off</div>
          </div>
        </Link>

        <Link
          href="/client/files"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group flex flex-col justify-between space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Download Vault</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Design exports & PDFs</div>
          </div>
        </Link>

        <Link
          href="/client/meetings"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group flex flex-col justify-between space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Schedule Calls</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Strategy video calls</div>
          </div>
        </Link>

        <Link
          href="/client/tickets"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-sm group flex flex-col justify-between space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Support SLA Desk</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Raise tech tickets</div>
          </div>
        </Link>
      </div>

      {/* Account instructions and notes from admin if any */}
      {dashboard?.notes && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Instructions & Updates from Account Manager</h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {dashboard.notes}
          </div>
        </div>
      )}

      {/* Active Project Delivery Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Project Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/80">
                Primary Contract
              </span>
              {dashboard?.projects?.[0]?.estimatedCompletion && (
                <span className="text-xs font-semibold text-slate-400">
                  Est. Completion: {new Date(dashboard.projects[0].estimatedCompletion).toLocaleDateString()}
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{primaryProjectName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {dashboard?.projects?.[0]?.category || "No categories assigned yet."}
            </p>

            {/* Delivery Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Sprint Delivery Progress</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">{deliveryProgress}% Complete</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${deliveryProgress}%` }} />
              </div>
            </div>

            {/* Milestone Checklist */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dashboard?.projects?.[0]?.milestones?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === "completed" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300" : "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
              {(!dashboard?.projects?.[0]?.milestones || dashboard.projects[0].milestones.length === 0) && (
                <div className="col-span-2 p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  No milestones specified for this project.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Assigned Engineers: Nuvexora Delivery Team</span>
            <Link href="/client/projects" className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>View Full Project Hub</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tasks & Action Required */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Action Required</h3>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/80">
                {pendingTasks.length} Pending
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {pendingTasks.slice(0, 3).map((task: any) => (
                <div key={task._id || task.id} className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50">
                  <div className="font-bold text-amber-900 dark:text-amber-200">{task.title}</div>
                  <div className="text-[11px] text-amber-750 dark:text-amber-305 mt-0.5">
                    {task.description || "Engineering item awaiting client review/action."}
                  </div>
                  <Link href="/client/tasks" className="mt-2 inline-block text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
                    View Task →
                  </Link>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  All action items completed.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/client/tasks" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              View All Project Tasks →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}