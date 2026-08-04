"use client";

import React, { useState } from "react";
import { History, ShieldAlert, CheckCircle2, Search, Filter, ShieldCheck, Terminal } from "lucide-react";
import { useAdminAuditLogsQuery } from "@/hooks/use-api-queries";

export default function AuditLogsPage() {
  const [filterSeverity, setFilterSeverity] = useState("all");
  const { data: logs = [], isLoading } = useAdminAuditLogsQuery();

  const filteredLogs = filterSeverity === "all" ? logs : logs.filter((l: any) => l.severity === filterSeverity);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
            <History className="w-4 h-4" />
            <span>Security & Compliance Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Audit & Event Logs</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Real-time immutable audit trail for administrative changes, security alerts, and authentication attempts.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter by Severity:</span>
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="INFO">INFO Only</option>
            <option value="WARNING">WARNING Only</option>
          </select>
        </div>

        <div className="text-xs font-mono font-bold text-slate-400">
          {filteredLogs.length} Events Logged
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filteredLogs.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                <th className="p-4 pl-6">Event Action</th>
                <th className="p-4">User / Agent</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {filteredLogs.map((log: any, idx: number) => (
                <tr key={log._id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors font-mono">
                  <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{log.action || log.event || "SYSTEM_EVENT"}</span>
                  </td>
                  <td className="p-4 font-sans">{log.user || log.userId || "System"}</td>
                  <td className="p-4 text-slate-500">{log.ipAddress || log.ip || "127.0.0.1"}</td>
                  <td className="p-4 font-sans">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      (log.status || "SUCCESS") === "SUCCESS" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                    }`}>
                      {log.status || "SUCCESS"}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right text-slate-400">{log.createdAt ? new Date(log.createdAt).toLocaleString() : (log.timestamp || "Just now")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Security Events Logged</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">System security telemetry is actively monitoring API calls and authentication routines.</p>
          </div>
        )}
      </div>
    </div>
  );
}

