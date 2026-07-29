"use client";

import React from "react";
import { ShieldCheck, FileText } from "lucide-react";

export default function EmployeePoliciesPage() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Company Policies & Compliance</span>
        </h1>
        <p className="text-xs text-slate-400">Official HR policies, remote work guidelines, and data confidentiality agreements.</p>
      </div>

      <div className="space-y-4">
        {[
          { title: "Global Remote Work & Flexible Hours Policy", updated: "Jan 2026" },
          { title: "Information Security & Data Protection Policy (SOC2)", updated: "Mar 2026" }
        ].map((p) => (
          <div key={p.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <h2 className="font-bold text-white text-sm">{p.title}</h2>
              <p className="text-slate-400">Last updated: {p.updated}</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold">View Policy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
