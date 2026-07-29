"use client";

import React, { useState } from "react";
import { History, ShieldAlert, CheckCircle2, Search, Filter, ShieldCheck, Terminal } from "lucide-react";

export default function AuditLogsPage() {
  const [filterSeverity, setFilterSeverity] = useState("all");

  const logs = [
    { id: "1", action: "SUPER_ADMIN_LOGIN", user: "admin@nuvexora.com", ip: "192.168.1.104", status: "SUCCESS", timestamp: "2026-07-29 14:02:18", severity: "INFO" },
    { id: "2", action: "API_KEY_ROTATION", user: "system_cron", ip: "10.0.0.1", status: "SUCCESS", timestamp: "2026-07-29 12:00:00", severity: "INFO" },
    { id: "3", action: "FAILED_LOGIN_ATTEMPT", user: "unknown_client", ip: "185.220.101.4", status: "BLOCKED", timestamp: "2026-07-29 11:45:12", severity: "WARNING" },
    { id: "4", action: "PROJECT_SLA_MODIFIED", user: "admin@nuvexora.com", ip: "192.168.1.104", status: "SUCCESS", timestamp: "2026-07-29 10:15:30", severity: "INFO" },
    { id: "5", action: "DB_SHARD_REBALANCE", user: "system_cluster", ip: "10.0.4.12", status: "SUCCESS", timestamp: "2026-07-29 09:00:00", severity: "INFO" },
  ];

  const filteredLogs = filterSeverity === "all" ? logs : logs.filter(l => l.severity === filterSeverity);

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
          5 Events Logged
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
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
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors font-mono">
                <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{log.action}</span>
                </td>
                <td className="p-4 font-sans">{log.user}</td>
                <td className="p-4 text-slate-500">{log.ip}</td>
                <td className="p-4 font-sans">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    log.status === "SUCCESS" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right text-slate-400">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
