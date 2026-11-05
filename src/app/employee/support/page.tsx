"use client";

import React, { useState } from "react";
import { HelpCircle, Send, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { useEmployeeTicketsQuery, useCreateEmployeeTicketMutation } from "@/hooks/use-api-queries";

export default function EmployeeSupportPage() {
  const { data: tickets = [], isLoading, isError, error } = useEmployeeTicketsQuery();
  const createTicketMutation = useCreateEmployeeTicketMutation();

  const [category, setCategory] = useState("technical");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!subject.trim() || !description.trim()) {
      setErrorMsg("Please enter both a subject and a description.");
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        category,
        subject,
        description,
        priority: "medium",
      });
      setSubject("");
      setDescription("");
      setSuccessMsg("Internal support ticket submitted successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to submit support ticket.");
    }
  };

  return (
    <div className="space-y-8 text-white max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          <span>Internal IT & HR Support Desk</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Submit internal support tickets for hardware provisioning, HR payroll inquiries, or cloud access permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-extrabold text-white">Create New Request</h2>

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Ticket Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
            >
              <option value="technical">IT & Hardware Provisioning</option>
              <option value="general">HR & Workplace Inquiry</option>
              <option value="billing">Payroll & Reimbursement</option>
              <option value="sales">Account & Access Permissions</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of request..."
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of hardware, software, or HR request..."
              className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={createTicketMutation.isPending}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 font-bold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {createTicketMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{createTicketMutation.isPending ? "Submitting..." : "Submit Internal Support Ticket"}</span>
          </button>
        </form>

        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Your Support Tickets</h2>
            <span className="text-[11px] text-slate-400 font-semibold">{tickets.length} total</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading your tickets...</div>
          ) : isError ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              Failed to load tickets: {error instanceof Error ? error.message : "Network error"}
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No support tickets filed yet. All systems operational.
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {tickets.map((t: any) => (
                <div key={t._id || t.ticketNumber} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-400">{t.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === "resolved" || t.status === "closed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : t.status === "in_progress"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{t.subject}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{t.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}