"use client";

import React from "react";
import { TrendingUp, Award } from "lucide-react";

export default function EmployeePerformancePage() {
  return (
    <div className="space-y-8 text-white max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span>Performance & Reviews</span>
        </h1>
        <p className="text-xs text-slate-400">Quarterly performance score, sprint code quality metrics, and manager feedback.</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-center">
        <Award className="w-12 h-12 text-slate-600 mx-auto opacity-50 animate-pulse" />
        <h2 className="text-lg font-bold">Evaluation Pending</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Your quarterly performance evaluation and peer review scorecards have not been compiled yet for the current review cycle.
        </p>
      </div>
    </div>
  );
}
