"use client";

import React from "react";
import { User, ShieldCheck, Mail, Phone, Calendar, Award, Code, Building, Lock } from "lucide-react";

export default function EmployeeProfilePage() {
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
            AV
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Alexander Vance</h2>
            <div className="text-xs text-blue-400 font-semibold">Senior Full-Stack Architect • Engineering Guild</div>
            <div className="text-[11px] text-slate-400">EMP-001 • Joined: Jan 15, 2024</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold uppercase text-slate-400">General Info</h3>
            <div>Email: <strong className="text-white">alexander.vance@nuvexora.com</strong></div>
            <div>Shift: <strong className="text-white">40 Hrs / Week (EST)</strong></div>
            <div>Type: <strong className="text-emerald-400">FULL_TIME</strong></div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="font-bold uppercase text-slate-400">Emergency & Bank Vault</h3>
            <div>Emergency Contact: <strong className="text-white">+1 (555) 918-2041</strong></div>
            <div>Bank Payroll Placeholder: <strong className="text-emerald-400">Direct Deposit Active (****9012)</strong></div>
            <div>Salary Band Placeholder: <strong className="text-white">$145,000 / Year</strong></div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400">Assigned Skills & Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js 15", "React 19", "TypeScript", "Node.js", "Go", "PostgreSQL", "Docker", "AWS", "Terraform"].map((s) => (
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
