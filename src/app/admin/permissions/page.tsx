"use client";

import React, { useState } from "react";
import { Key, Lock, ShieldCheck, CheckCircle2, Sliders } from "lucide-react";
import { useAdminPermissionsQuery } from "@/hooks/use-api-queries";

export default function PermissionsPage() {
  const { data: permissions = [], isLoading } = useAdminPermissionsQuery();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Key className="w-4 h-4" />
            <span>Policy Engine & Security Scope</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Granular Permission Matrix</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage API route access policies, database mutations, and system operation flags.</p>
        </div>
      </div>

      {/* Permissions List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {permissions.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                <th className="p-4 pl-6">Permission Key</th>
                <th className="p-4">Module</th>
                <th className="p-4">Description</th>
                <th className="p-4 pr-6 text-right">Scope Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              {permissions.map((perm: any, idx: number) => (
                <tr key={perm._id || perm.key || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-blue-600 dark:text-blue-400">{perm.key || perm.name || "sys.perm"}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{perm.module || "Core"}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{perm.description || perm.desc || "System permission directive."}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE POLICY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Custom Policies Defined</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Standard role RBAC rules are enforced automatically across system endpoints.</p>
          </div>
        )}
      </div>
    </div>
  );
}

