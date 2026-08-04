"use client";

import React from "react";
import { HelpCircle, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useBusinessTicketsQuery } from "@/hooks/use-api-queries";

interface TicketItem {
  id: string;
  number: string;
  subject: string;
  client: string;
  category: string;
  priority: "urgent" | "high" | "normal";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export default function SupportDeskPage() {
  const { data: dbTickets = [], isLoading } = useBusinessTicketsQuery();

  const tickets: TicketItem[] = dbTickets.map((t: any, idx: number) => ({
    id: t._id || t.id || String(idx),
    number: t.ticketNumber || `TCK-${String(idx + 4000)}`,
    subject: t.subject || t.title || "Support Request",
    client: t.clientId?.name || t.clientName || "Enterprise Client",
    category: t.category || "Technical",
    priority: (t.priority || "normal").toLowerCase() as any,
    status: (t.status || "open").toLowerCase() as any,
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent",
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Support Desk Ticketing Inbox</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage technical support inquiries, SLA ticket prioritization, and internal developer assignments.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ticket #</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-extrabold text-slate-900 dark:text-white">{t.number}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">{t.subject}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{t.client}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.priority === "urgent" ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200" : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === "resolved" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{t.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Support Tickets Logged</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Client tickets raised from the Client Portal will appear here in real time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
