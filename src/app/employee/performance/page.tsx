"use client";

import React from "react";
import { TrendingUp, Award, CheckCircle2 } from "lucide-react";

export default function EmployeePerformancePage() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span>Performance & Reviews</span>
        </h1>
        <p className="text-xs text-slate-400">Quarterly performance score, sprint code quality metrics, and manager feedback.</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs text-slate-400">Overall Rating (Q2 2026)</div>
            <div className="text-4xl font-extrabold text-amber-400">4.95 / 5.0</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Top 5% Rank
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Code Quality Coverage</div>
            <div className="text-xl font-bold text-white">98.2%</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">On-Time Sprint Delivery</div>
            <div className="text-xl font-bold text-emerald-400">100%</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Peer Review Rating</div>
            <div className="text-xl font-bold text-purple-400">5.0 / 5.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
