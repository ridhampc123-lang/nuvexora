"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Upload,
  Database,
  RefreshCw,
  CheckCircle2,
  Clock,
  HardDrive,
  Layers,
  Sparkles,
  AlertTriangle,
  Server
} from "lucide-react";
import { getMasterBackupSnapshot, restoreMasterBackup } from "@/lib/api/admin-api";
import { executeMasterExcelExport, executeEmergencyJsonBackup } from "@/lib/export/master-excel-exporter";
import { toast } from "sonner";

export default function AdminBackupPage() {
  const [snapshotData, setSnapshotData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [restoreResults, setRestoreResults] = useState<any>(null);

  const loadSnapshotSummary = async () => {
    setLoading(true);
    try {
      const data = await getMasterBackupSnapshot();
      setSnapshotData(data);
    } catch (err) {
      console.error("Failed to load snapshot summary", err);
      toast.error("Unable to connect to database backup service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnapshotSummary();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.collections) {
          throw new Error("Invalid backup file format. Missing collections payload.");
        }

        if (
          !confirm(
            `EMERGENCY RESTORE: Are you sure you want to restore data from backup created at ${
              json.timestamp || "unknown time"
            }? This will upsert and sync records across your database.`
          )
        ) {
          return;
        }

        setRestoring(true);
        const result = await restoreMasterBackup(json);
        setRestoreResults(result);
        toast.success("Database restored successfully from backup!");
        loadSnapshotSummary();
      } catch (err: any) {
        toast.error(err.message || "Failed to parse or restore backup file");
      } finally {
        setRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  const totalDocuments = snapshotData?.counts
    ? Object.values(snapshotData.counts as Record<string, number>).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            <Database className="w-3.5 h-3.5" />
            <span>Mission-Critical Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Master Data Export & Emergency Backups
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Export the entire Nuvexora enterprise database into formatted Excel spreadsheets (.xlsx) with one click, or generate complete JSON snapshots for disaster recovery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={executeMasterExcelExport}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Master Excel Export (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={executeEmergencyJsonBackup}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-900/30 transition-all hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Create Emergency Snapshot</span>
          </button>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Database Status</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              Connected & Healthy
            </span>
          </div>
          <span className="text-xs text-slate-400 block mt-1">MongoDB Enterprise Cluster</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stored Records</span>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalDocuments.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Across all collections</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Collections</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {snapshotData?.counts ? Object.keys(snapshotData.counts).length : 0}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Ready for instant export</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Last Snapshot</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
            {snapshotData?.timestamp
              ? new Date(snapshotData.timestamp).toLocaleTimeString()
              : "Just now"}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Automatic real-time sync</span>
        </div>
      </div>

      {/* Main Panels: Master Export & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel 1: Master Excel Export Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Multi-Sheet Master Excel Workbook
                </h3>
                <p className="text-xs text-slate-500">
                  Compiles all business modules into independent Microsoft Excel sheets.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When you click Master Export, our engine streams an official Excel (.xlsx) file containing complete records for Leads, Clients, Projects, Invoices, Payments, Contracts, Pricing Plans, Currencies, Services, and Blogs.
            </p>

            {/* Collection Counts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {snapshotData?.counts &&
                Object.entries(snapshotData.counts).map(([name, count]) => (
                  <div
                    key={name}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border text-xs flex items-center justify-between"
                  >
                    <span className="capitalize text-slate-600 dark:text-slate-400 font-medium">
                      {name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {Number(count)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={executeMasterExcelExport}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Complete Master Excel File</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Emergency Disaster Recovery & Restore */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Emergency Disaster Recovery
                </h3>
                <p className="text-xs text-slate-500">
                  Full schema JSON snapshot and one-click database restore.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Use this tool to create an offline database snapshot or restore from a previous backup file. The engine validates JSON payloads and safely synchronizes data without downtime.
            </p>

            {/* Restore File Upload Box */}
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Upload Emergency Snapshot (.json)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select a valid Nuvexora backup file to restore records.
                </p>
              </div>

              <label className="inline-block cursor-pointer">
                <span className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Backup File</span>
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={restoring}
                  className="hidden"
                />
              </label>

              {restoring && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 pt-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Restoring collections...</span>
                </div>
              )}

              {restoreResults && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 text-left">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Restore Completed!
                  </p>
                  <pre className="text-[10px] mt-1 font-mono">
                    {JSON.stringify(restoreResults.restoreLog, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={executeEmergencyJsonBackup}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Snapshot</span>
            </button>

            <button
              type="button"
              onClick={loadSnapshotSummary}
              className="p-3.5 rounded-2xl border border-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
