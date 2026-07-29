"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Download, FileText, Calendar, Filter, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const reports = [
    { id: "financial", title: "Executive Financial & P&L Statement", desc: "Detailed breakdown of monthly recurring revenue, active retainers, client invoices, and payment disbursements.", category: "Finance", format: "PDF / CSV" },
    { id: "leads", title: "Sales Pipeline & Lead Conversion Audit", desc: "Performance breakdown of consultation requests, client acquisitions, and proposal acceptance rates.", category: "Sales & Marketing", format: "XLSX" },
    { id: "projects", title: "Project Delivery & SLA Compliance Report", desc: "Milestone completion telemetry, engineering task throughput, and client approval velocities.", category: "Operations", format: "PDF" },
    { id: "hr", title: "Employee Attendance & Payroll Ledger", desc: "Hours logged, leave balance calculations, department resource allocation, and payroll prep audit.", category: "HR & People", format: "CSV" },
  ];

  const handleGenerate = (id: string, title: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      toast.success(`Generated report: ${title}`);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Automated Reporting Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Enterprise Financial & System Reports</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Generate, schedule, and export verified system audits, revenue ledgers, and operational telemetry.</p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
                  {report.category}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{report.format}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{report.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{report.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-updates daily
              </span>

              <button
                onClick={() => handleGenerate(report.id, report.title)}
                disabled={generating === report.id}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {generating === report.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
