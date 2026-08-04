"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Clock,
  FolderKanban,
  AlertCircle,
  Video,
  Bell,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import { useEmployeeProjectsQuery, useEmployeeTasksQuery } from "@/hooks/use-api-queries";
import { useAuth } from "@/providers/auth-provider";

export default function EmployeeDashboard() {
  const { data: dbProjects = [], isLoading: loadingProjects } = useEmployeeProjectsQuery();
  const { data: dbTasks = [], isLoading: loadingTasks } = useEmployeeTasksQuery();
  const { user } = useAuth();

  const todaysTasks = dbTasks.map((t: any) => ({
    title: t.title,
    project: t.projectId?.title || "Project",
    priority: (t.priority || "MEDIUM").toUpperCase(),
    status: (t.status || "TODO").replace("_", " ").toUpperCase(),
    due: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No Due Date"
  }));

  const assignedProjects = dbProjects.map((p: any) => ({
    name: p.title,
    role: "Assigned Engineer",
    progress: p.progressPercentage || 0,
    status: p.status === "completed" ? "COMPLETED" : "ON_TRACK"
  }));

  const upcomingMeetings: any[] = [];
  const recentNotifications: any[] = [];

  const completedTasksCount = todaysTasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/5 backdrop-blur-md">
            {user?.department || "Engineering"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Team Member"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
            You have {todaysTasks.length} assigned tasks and {assignedProjects.length} active projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/employee/tasks"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 hover:-translate-y-0.5"
          >
            <span>View My Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/employee/attendance"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all hover:-translate-y-0.5"
          >
            Clock Out / Break
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Work Hours</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">40.0 Hrs</div>
          <div className="text-[10px] text-emerald-400 font-medium">100% of weekly target</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Task Completion</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {todaysTasks.length > 0 ? Math.round((completedTasksCount / todaysTasks.length) * 100) : 0}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium">{completedTasksCount} of {todaysTasks.length} tasks completed</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{assignedProjects.length} Active</div>
          <div className="text-[10px] text-cyan-400 font-medium">Assigned to your account</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Performance Score</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">4.95 / 5.0</div>
          <div className="text-[10px] text-amber-400 font-medium">Top 5% Quarterly Rank</div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <span>Today's Assigned Tasks</span>
              </h2>
              <Link href="/employee/tasks" className="text-xs font-semibold text-blue-400 hover:underline">
                View All Tasks →
              </Link>
            </div>

            <div className="space-y-3">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((t) => (
                  <div
                    key={t.title}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === "HIGH"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{t.project}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white">{t.title}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-400">{t.due}</div>
                      <span
                        className={`text-[10px] font-bold ${
                          t.status === "COMPLETED" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No active tasks assigned to your account.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Projects */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-cyan-400" />
                <span>My Assigned Projects</span>
              </h2>
              <Link href="/employee/projects" className="text-xs font-semibold text-blue-400 hover:underline">
                Manage Projects →
              </Link>
            </div>

            <div className="space-y-4">
              {assignedProjects.length > 0 ? (
                assignedProjects.map((p) => (
                  <div key={p.name} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-slate-400">{p.role}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Progress: {p.progress}%</span>
                      <span className="text-emerald-400 font-semibold">{p.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No projects currently assigned to you.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Meetings & Notifications */}
        <div className="space-y-6">
          {/* Upcoming Meetings Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                <span>Upcoming Meetings</span>
              </h2>
            </div>

            <div className="space-y-3">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((m) => (
                  <div key={m.title} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <div className="text-[11px] text-indigo-400 font-semibold">{m.time}</div>
                    <div className="text-[10px] text-slate-400">Host: {m.host}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No upcoming meetings scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Notifications</span>
              </h2>
            </div>

            <div className="space-y-2.5">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((n) => (
                  <div key={n.title} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-0.5">
                    <div className="font-semibold text-slate-200">{n.title}</div>
                    <div className="text-[10px] text-slate-500">{n.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  No new notifications.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
