"use client";

import React from "react";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function FinanceLedgerPage() {
  const financialMetrics = [
    { label: "Q3 Total Gross Revenue", value: "$482,000", change: "+18%", positive: true },
    { label: "Operating Expenses", value: "$124,000", change: "-4%", positive: true },
    { label: "Net Profit Margin", value: "74.2%", change: "+3.2%", positive: true },
    { label: "Pending Accounts Receivable", value: "$37,500", change: "3 Invoices", positive: false },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Finance & Revenue Ledger</h1>
        <p className="text-xs text-slate-500 mt-1">Corporate profit & loss metrics, account receivables, and recurring revenue stream tracking.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                m.positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {m.change}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-sans">{m.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
