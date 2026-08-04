"use client";

import React from "react";
import { User, ShieldCheck, Mail, Phone, Calendar, Award, Code, Building, Lock } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  
  const initials = user?.name 
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) 
    : "EM";

  return (
    <div className="space-y-8 text-white max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          <span>My Employee Profile</span>
        </h1>
        <p className="text-xs text-slate-400">
          Personal employee records, assigned skills, emergency contacts, and document vault.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-2xl flex items-center justify-center text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{user?.name || "Employee"}</h2>
            <div className="text-xs text-blue-400 font-semibold">{user?.designation || "Engineer"} • {user?.department || "Engineering"}</div>
            <div className="text-[11px] text-slate-400">EMP-{user?.id?.slice(-4).toUpperCase() || "001"} • Role: {user?.role || "EMPLOYEE"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold uppercase text-slate-400">General Info</h3>
            <div>Email: <strong className="text-white">{user?.email || "employee@nuvexora.com"}</strong></div>
            <div>Shift: <strong className="text-white">40 Hrs / Week</strong></div>
            <div>Status: <strong className="text-emerald-400">ACTIVE</strong></div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold uppercase text-slate-400">Emergency & Bank Vault</h3>
            <div>Emergency Contact: <strong className="text-white">Verified Contact Active</strong></div>
            <div>Bank Payroll Status: <strong className="text-emerald-400">Direct Deposit Active</strong></div>
            <div>Salary Type: <strong className="text-white">Salaried</strong></div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400">Assigned Skills & Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js 16", "React 19", "TypeScript", "Node.js", "MongoDB", "Docker", "REST APIs", "Tailwind CSS"].map((s) => (
              <span key={s} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-blue-300 border border-slate-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
