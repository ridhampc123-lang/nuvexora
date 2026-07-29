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

export default function EmployeeDashboard() {
  const todaysTasks = [
    { title: "Refactor Next.js App Router Edge Cache Headers", project: "Veloce SaaS", priority: "HIGH", status: "IN_PROGRESS", due: "5:00 PM" },
    { title: "Review Pull Request #142 for RAG Vector Pipeline", project: "Omni RAG AI", priority: "MEDIUM", status: "PENDING", due: "6:30 PM" },
    { title: "Design System Figma Design Token Audit", project: "Design Specs", priority: "LOW", status: "COMPLETED", due: "Done" },
  ];

  const assignedProjects = [
    { name: "Veloce Cloud Platform", role: "Lead Architect", progress: 78, status: "ON_TRACK" },
    { name: "Omni Global RAG AI Engine", role: "Senior Engineer", progress: 92, status: "NEAR_COMPLETION" },
    { name: "Aura Headless E-Commerce", role: "Advisor", progress: 45, status: "IN_PROGRESS" },
  ];

  const upcomingMeetings = [
    { title: "Daily Engineering Sync & Sprint Standup", time: "10:30 AM (In 15 mins)", host: "Alexander Vance", link: "#" },
    { title: "Client Architecture Review - Veloce Cloud", time: "3:00 PM Today", host: "David Sterling (Client)", link: "#" },
  ];

  const recentNotifications = [
    { title: "New Task Assigned: API Gateway Rate Limiter", time: "10 mins ago", type: "TASK" },
    { title: "Leave Request Approved by HR Manager", time: "2 hours ago", type: "LEAVE" },
    { title: "Project Milestone Reached: 90% Code Coverage", time: "1 day ago", type: "MILESTONE" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
            Senior Full-Stack Architect Pod
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Alexander! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-normal">
            You have 3 tasks due today and 2 upcoming meetings. Work hours recorded: 38.5 / 40.0 Hrs this week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/employee/tasks"
            className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>View My Tasks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/employee/attendance"
            className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white border border-blue-400/40 font-bold text-xs transition-all"
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
          <div className="text-2xl font-extrabold text-white">38.5 Hrs</div>
          <div className="text-[10px] text-emerald-400 font-medium">96% of weekly target</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Task Completion</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">92%</div>
          <div className="text-[10px] text-slate-400 font-medium">23 of 25 tasks completed</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">3 Active</div>
          <div className="text-[10px] text-cyan-400 font-medium">All sprints on schedule</div>
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
              {todaysTasks.map((t) => (
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
              ))}
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
              {assignedProjects.map((p) => (
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
              ))}
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
              {upcomingMeetings.map((m) => (
                <div key={m.title} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">{m.title}</div>
                  <div className="text-[11px] text-indigo-400 font-semibold">{m.time}</div>
                  <div className="text-[10px] text-slate-400">Host: {m.host}</div>
                </div>
              ))}
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
              {recentNotifications.map((n) => (
                <div key={n.title} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-0.5">
                  <div className="font-semibold text-slate-200">{n.title}</div>
                  <div className="text-[10px] text-slate-500">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
