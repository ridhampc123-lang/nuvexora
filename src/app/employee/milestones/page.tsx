"use client";

import React from "react";
import { Milestone, CheckCircle2, Clock } from "lucide-react";
import { useEmployeeProjectsQuery } from "@/hooks/use-api-queries";

export default function EmployeeMilestonesPage() {
  const { data: projects = [], isLoading } = useEmployeeProjectsQuery();

  const milestones = projects.flatMap((p: any) => {
    return (p.milestones || []).map((m: any) => ({
      name: `${p.title}: ${m.title}`,
      status: (m.status || "PENDING").toUpperCase(),
      date: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "TBD"
    }));
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading milestones...</div>;
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Milestone className="w-6 h-6 text-cyan-400" />
          <span>My Project Milestones</span>
        </h1>
        <p className="text-xs text-slate-400">Track sprint milestones and target completion dates.</p>
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
            <Milestone className="w-12 h-12 text-slate-650 mx-auto opacity-55 animate-pulse" />
            <h3 className="text-lg font-bold text-white">No Milestones</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              There are no milestones assigned to your current active engineering projects.
            </p>
          </div>
        ) : (
          milestones.map((m: any) => {
            const isCompleted = m.status === "COMPLETED" || m.status === "SUCCESS";
            return (
              <div key={m.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">{m.name}</h2>
                  <p className="text-xs text-slate-400">Target Date: {m.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isCompleted ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {m.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
