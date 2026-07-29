"use client";

import React from "react";
import { HelpCircle, Mail, MessageSquare } from "lucide-react";

export default function EmployeeSupportPage() {
  return (
    <div className="space-y-8 text-white max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>Internal IT & HR Support</span>
        </h1>
        <p className="text-xs text-slate-400">Submit internal support tickets for hardware, payroll, or access permissions.</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase text-slate-300">Ticket Category</label>
          <select className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white">
            <option>IT & Hardware Provisioning</option>
            <option>HR & Payroll Inquiry</option>
            <option>Access & Permission Request</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-300">Subject</label>
          <input type="text" placeholder="Brief issue summary..." className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-300">Description</label>
          <textarea rows={4} placeholder="Describe the issue or request..." className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white" />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 font-bold text-xs text-white">Submit Internal Support Ticket</button>
      </form>
    </div>
  );
}
