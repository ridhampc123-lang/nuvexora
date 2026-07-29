"use client";

import React, { useState } from "react";
import { HelpCircle, AlertCircle, CheckCircle2, Clock } from "lucide-react";

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

const initialTickets: TicketItem[] = [
  { id: "1", number: "TCK-4091", subject: "Kafka Cluster SSL Certificate Renewal", client: "Veloce Financial", category: "Technical", priority: "urgent", status: "open", createdAt: "1 hour ago" },
  { id: "2", number: "TCK-4088", subject: "Patient Portal SSO Integration Query", client: "Apex Health", category: "Technical", priority: "high", status: "in_progress", createdAt: "5 hours ago" },
  { id: "3", number: "TCK-4075", subject: "Sprint #13 Invoice Clarification", client: "OmniLogistics", category: "Billing", priority: "normal", status: "resolved", createdAt: "Yesterday" },
];

export default function SupportDeskPage() {
  const [tickets] = useState<TicketItem[]>(initialTickets);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Support Desk Ticketing Inbox</h1>
        <p className="text-xs text-slate-500 mt-1">Manage technical support inquiries, SLA ticket prioritization, and internal developer assignments.</p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ticket #</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-extrabold text-slate-900">{t.number}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{t.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{t.client}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.priority === "urgent" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700"
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === "resolved" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{t.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
