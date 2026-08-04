"use client";

import React, { useState } from "react";
import { FolderKanban, GitBranch, ExternalLink, FileText, CheckSquare, Layers, Clock } from "lucide-react";
import { useEmployeeProjectsQuery } from "@/hooks/use-api-queries";

export default function EmployeeProjectsPage() {
  const { data: projects = [], isLoading } = useEmployeeProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(0);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading assigned projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
        <FolderKanban className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
        <h3 className="text-lg font-bold text-white">No Assigned Projects</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          You are not currently assigned to any active engineering projects. Please contact your administrator.
        </p>
      </div>
    );
  }

  const current = projects[selectedProject] || projects[0];
  const currentIdStr = current._id?.slice(-6).toUpperCase() || "PRJ-100";
  const clientName = current.clientId?.companyName || current.clientId?.ownerName || "Unknown Client";
  const projectTech = current.techStack && current.techStack.length > 0 ? current.techStack : ["Next.js 16", "Node.js", "PostgreSQL", "PyTorch AI", "Apache Kafka", "Docker"];
  const projectOverview = current.category || "Active engineering project with full delivery timeline tracking.";
  
  const milestones = current.milestones && current.milestones.length > 0 ? current.milestones.map((m: any) => ({
    name: m.title,
    status: m.status?.toUpperCase() || "PENDING",
  })) : [
    { name: "M1: Architecture Specification", status: "COMPLETED" },
    { name: "M2: Next.js Edge Router & Auth", status: "COMPLETED" },
    { name: "M3: API Gateway & Redis Cache", status: "IN_PROGRESS" },
  ];

  const tasks = [
    { title: "Refactor Next.js Edge Cache Headers", status: "IN_PROGRESS" },
    { title: "Configure Redis Rate Limiting Gate", status: "PENDING" },
  ];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-blue-400" />
          <span>My Assigned Projects</span>
        </h1>
        <p className="text-xs text-slate-400">
          Projects assigned strictly to your authenticated employee account.
        </p>
      </div>

      {/* Selector Pills */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {projects.map((p: any, idx: number) => (
          <button
            key={p._id}
            onClick={() => setSelectedProject(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedProject === idx ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Active Project Details */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-mono text-blue-400">{currentIdStr}</span>
            <h2 className="text-2xl font-extrabold">{current.title}</h2>
            <p className="text-xs text-slate-400">Client: {clientName} • Category: {current.category}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" /> Repo
            </a>
            <a href="https://figma.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Figma
            </a>
            <a href="https://nuvexora.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> App Live
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase text-slate-400">Overview</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">{projectOverview}</p>
        </div>

        {/* Milestones & Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Milestones
            </h3>
            <div className="space-y-2 text-xs">
              {milestones.map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-medium text-slate-200">{m.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400">{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Tasks
            </h3>
            <div className="space-y-2 text-xs">
              {tasks.map((t) => (
                <div key={t.title} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-medium text-slate-200">{t.title}</span>
                  <span className="text-[10px] font-bold text-amber-400">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
