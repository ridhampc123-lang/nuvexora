"use client";

import React, { useState } from "react";
import { ShieldCheck, UserCheck, Key, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles] = useState([
    { id: "1", name: "SUPER_ADMIN", title: "Super Administrator", users: 1, permissionsCount: "ALL (Wildcard)", description: "Full unrestricted system access, database mutations, and security policy control." },
    { id: "2", name: "ADMIN", title: "Systems Administrator", users: 3, permissionsCount: "48 Active", description: "Standard management access for CRM, projects, billing, and blog content." },
    { id: "3", name: "CLIENT", title: "Enterprise Client Lead", users: 14, permissionsCount: "12 Client Portal", description: "Restricted workspace access for deliverable approvals, tasks, and invoice payments." },
    { id: "4", name: "EMPLOYEE", title: "Engineering Staff", users: 28, permissionsCount: "18 Staff Portal", description: "Access to task execution, milestone logging, attendance, and technical chat." },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Identity & Access Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Role-Based Access Control (RBAC)</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Configure system roles, granular authorization policies, and access scopes.</p>
        </div>

        <button 
          onClick={() => toast.info("Role editor modal active")}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold font-mono uppercase tracking-widest">
                {role.name}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" /> {role.users} Assigned Users
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{role.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{role.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 font-bold">{role.permissionsCount}</span>
              <button onClick={() => toast.success(`Viewing policies for ${role.title}`)} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Configure Permissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
