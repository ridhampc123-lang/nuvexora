"use client";

import React, { useState } from "react";
import { Clock, Plus, Calendar, CheckCircle2 } from "lucide-react";

export default function EmployeeTimesheetsPage() {
  const [logs, setLogs] = useState([
    { date: "2026-07-24", project: "Veloce SaaS", task: "Next.js App Router Cache Headers", hours: 6.5, type: "BILLABLE" },
    { date: "2026-07-24", project: "Omni RAG AI", task: "Vector Search Benchmark Testing", hours: 2.0, type: "BILLABLE" },
    { date: "2026-07-23", project: "Internal", task: "Sprint Standup & Architecture Sync", hours: 1.0, type: "NON_BILLABLE" },
  ]);

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-400" />
          <span>My Timesheets & Work Logs</span>
        </h1>
        <p className="text-xs text-slate-400">
          Track daily work logs, billable vs non-billable hours, and weekly summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Total Hours (This Week)</div>
          <div className="text-3xl font-extrabold text-white">38.5 Hrs</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Billable Hours</div>
          <div className="text-3xl font-extrabold text-emerald-400">35.0 Hrs</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Non-Billable Hours</div>
          <div className="text-3xl font-extrabold text-amber-400">3.5 Hrs</div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold">Daily Work Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Project</th>
                <th className="p-3">Task Description</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-300">{log.date}</td>
                  <td className="p-3 font-bold text-white">{log.project}</td>
                  <td className="p-3 text-slate-300">{log.task}</td>
                  <td className="p-3 font-bold text-blue-400">{log.hours} Hrs</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "BILLABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
