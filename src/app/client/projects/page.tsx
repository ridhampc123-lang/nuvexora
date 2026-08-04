"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Users, 
  Code2, 
  Wifi, 
  ChevronRight,
  ShieldCheck,
  PlayCircle
} from "lucide-react";
import { useClientProjectsQuery } from "@/hooks/use-api-queries";

interface ProjectItem {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  progressPercentage: number;
  status: string;
  startDate?: string;
  targetDate?: string;
  deadline?: string;
  techStack?: string[];
  team?: string[];
}

export default function ClientProjectsPage() {
  const { data: projects = [], isLoading } = useClientProjectsQuery();
  const [activeTab, setActiveTab] = useState<"active" | "all">("active");

  const projectList: ProjectItem[] = isLoading ? [] : projects;

  const milestonesData = [
    { title: "Sprint #12: Database Schema & High-Concurrency Indexing", status: "completed", date: "Jun 15, 2026", lead: "Dr. Aris Thorne" },
    { title: "Sprint #13: Real-Time Event Stream Bus (Kafka & Redis)", status: "completed", date: "Jul 05, 2026", lead: "Elena Rostova" },
    { title: "Sprint #14: Risk AI Inference Engine & Banking API v4", status: "in_progress", date: "Aug 01, 2026", lead: "Alexander Vance" },
    { title: "Sprint #15: Multi-Region Staging & Penetration Testing", status: "scheduled", date: "Aug 15, 2026", lead: "Security Lead" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Real-Time Project Delivery Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Engineering Projects & Milestones</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Track real-time sprint progression, active architecture deliverables, assigned engineering teams, and target completion deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Live WebSocket Telemetry</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-6">
        {projectList.length === 0 && !isLoading && (
          <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            No engineering projects found for your account.
          </div>
        )}

        {projectList.map((p) => {
          const pId = p._id || p.id || "";
          const pTech = p.techStack || ["Next.js 16", "Node.js", "PostgreSQL", "PyTorch AI", "Apache Kafka", "Docker"];
          const pTeam = p.team || ["Alexander Vance (Lead)", "Elena Rostova (DevOps)", "Dr. Aris Thorne (AI)", "Marcus Vance (Client)"];
          const target = p.targetDate || p.deadline || "Aug 15, 2026";

          return (
            <div key={pId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Project Card Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{p.title}</h2>
                    <span className="px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold capitalize border border-blue-200/60 dark:border-blue-800/80">
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    {p.description || "High-throughput microservices architecture with automated risk assessment and real-time ledger settlement."}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{p.progressPercentage}%</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Sprint Progress</div>
                  </div>

                  <Link
                    href="/client/approvals"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Review Deliverables</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Progress Telemetry Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Sprint Delivery Telemetry</span>
                  <span className="font-semibold text-slate-400">Target Delivery: <strong className="text-slate-800 dark:text-slate-200">{target}</strong></span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${p.progressPercentage}%` }} />
                </div>
              </div>

              {/* Milestone Timeline Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>Sprint Roadmaps & Milestones</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {milestonesData.map((m, idx) => {
                    const isDone = m.status === "completed";
                    const isInProgress = m.status === "in_progress";

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isDone
                            ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40"
                            : isInProgress
                            ? "bg-blue-50/50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isDone ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : isInProgress ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-slate-200 text-slate-500 dark:bg-slate-800"
                          }`}>
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : isInProgress ? <PlayCircle className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{m.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Lead: {m.lead} • Due {m.date}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                          isDone ? "bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200" : isInProgress ? "bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {m.status.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack & Team Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="space-y-2">
                  <div className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" />
                    <span>Technology Stack & Integrations</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pTech.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/60 dark:border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Assigned Nuvexora Team</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-slate-750 dark:text-slate-300 font-medium leading-relaxed">
                    {pTeam.join(" • ")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
