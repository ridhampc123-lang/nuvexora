"use client";

import React, { useState } from "react";
import { FolderKanban, GitBranch, ExternalLink, FileText, CheckSquare, Layers, Clock } from "lucide-react";

export default function EmployeeProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(0);

  const projects = [
    {
      id: "PRJ-101",
      name: "Veloce Cloud Platform",
      client: "Veloce Cloud Systems",
      status: "ACTIVE",
      role: "Lead Architect",
      timeline: "Jan 2026 – Apr 2026",
      repo: "https://github.com/nuvexora/veloce-cloud",
      figma: "https://figma.com/file/veloce-design-system",
      deployment: "https://veloce-cloud.nuvexora-edge.app",
      overview: "High-throughput Next.js 15 App Router platform with microservices gateway and sub-350ms TTFB global edge latency.",
      milestones: [
        { name: "M1: Architecture Specification", status: "COMPLETED", date: "Jan 20" },
        { name: "M2: Next.js Edge Router & Auth", status: "COMPLETED", date: "Feb 10" },
        { name: "M3: API Gateway & Redis Cache", status: "IN_PROGRESS", date: "Mar 15" },
        { name: "M4: Production E2E Cutover", status: "PENDING", date: "Apr 05" },
      ],
      tasks: [
        { title: "Refactor Next.js Edge Cache Headers", status: "IN_PROGRESS" },
        { title: "Configure Redis Rate Limiting Gate", status: "PENDING" },
      ],
      files: ["architecture-blueprint.pdf", "api-gateway-schema.json"]
    },
    {
      id: "PRJ-102",
      name: "Omni Global RAG AI Engine",
      client: "OmniGlobal Consulting",
      status: "ACTIVE",
      role: "Senior Neural Engineer",
      timeline: "Feb 2026 – May 2026",
      repo: "https://github.com/nuvexora/omni-rag-ai",
      figma: "https://figma.com/file/omni-ai-portal",
      deployment: "https://rag.omniglobal.nuvexora.ai",
      overview: "Private vector database search pipeline utilizing Claude 3.5 Sonnet and pgvector semantic embeddings for 50,000 PDF case studies.",
      milestones: [
        { name: "M1: Vector DB Data Ingestion", status: "COMPLETED", date: "Feb 15" },
        { name: "M2: RAG Citation Engine", status: "IN_PROGRESS", date: "Mar 20" },
      ],
      tasks: [
        { title: "Review Pull Request #142 for RAG Vector Pipeline", status: "PENDING" },
      ],
      files: ["vector-search-eval.csv"]
    }
  ];

  const current = projects[selectedProject] || projects[0];

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
        {projects.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedProject(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedProject === idx ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Active Project Details */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-mono text-blue-400">{current.id}</span>
            <h2 className="text-2xl font-extrabold">{current.name}</h2>
            <p className="text-xs text-slate-400">Client: {current.client} • Role: {current.role}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={current.repo} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-blue-400" /> Repo
            </a>
            <a href={current.figma} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Figma
            </a>
            <a href={current.deployment} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" /> App Live
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase text-slate-400">Overview</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">{current.overview}</p>
        </div>

        {/* Milestones & Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Milestones
            </h3>
            <div className="space-y-2 text-xs">
              {current.milestones.map((m) => (
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
              {current.tasks.map((t) => (
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
