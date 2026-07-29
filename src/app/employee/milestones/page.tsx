"use client";

import React from "react";
import { Milestone, CheckCircle2, Clock } from "lucide-react";

export default function EmployeeMilestonesPage() {
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
        {[
          { name: "Veloce M1: Architecture Specification", status: "COMPLETED", date: "Jan 20" },
          { name: "Veloce M2: Next.js Edge Router", status: "COMPLETED", date: "Feb 10" },
          { name: "Veloce M3: API Gateway & Redis Cache", status: "IN_PROGRESS", date: "Mar 15" },
        ].map((m) => (
          <div key={m.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">{m.name}</h2>
              <p className="text-xs text-slate-400">Target Date: {m.date}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
