"use client";

import React, { useState } from "react";
import { 
  LifeBuoy, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  MessageSquare, 
  X, 
  ShieldAlert, 
  Search, 
  User, 
  Zap
} from "lucide-react";
import { useClientTicketsQuery, useCreateTicketMutation } from "@/hooks/use-api-queries";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export default function SupportTicketsPage() {
  const { data: tickets = [], isLoading } = useClientTicketsQuery();
  const createTicketMutation = useCreateTicketMutation();
  const { user } = useAuth();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newMessageText, setNewMessageText] = useState("");

  // Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [priority, setPriority] = useState("P2_HIGH");
  const [description, setDescription] = useState("");

  const activeTicket = tickets.find((t: any) => t.id === (selectedTicketId || tickets[0]?.id));

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in subject and description.");
      return;
    }

    createTicketMutation.mutate(
      { subject, category, priority, description },
      {
        onSuccess: () => {
          toast.success("Support ticket created successfully! SLA tracking initiated.");
          setShowNewTicketModal(false);
          setSubject("");
          setDescription("");
        }
      }
    );
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !activeTicket) return;
    activeTicket.messages.push({
      sender: user?.name || "Client",
      role: "Client",
      text: newMessageText,
      timestamp: "Just now"
    });
    toast.success("Response sent to support engineers.");
    setNewMessageText("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 Enterprise Support Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Support & SLA Desk</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Raise high-priority technical support tickets, request SLA escalation, and track incident resolution with Nuvexora DevOps and Core Engineering team.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* Ticket Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400">Guaranteed Response Time SLA</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <span>&lt; 15 Mins</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Enterprise 99.99% SLA</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400">Open Tickets</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">1 Active Ticket</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">P1 Critical SLA in progress</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-400">Resolved This Month</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">8 Tickets</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">100% SLA Compliance</div>
        </div>
      </div>

      {/* Main Grid: Left List + Right Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Support Tickets ({tickets.length})
          </h2>

          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading support tickets...</div>
          ) : (
            tickets.map((t: any) => {
              const isSelected = t.id === (activeTicket?.id);
              const isCritical = t.priority === "P1_CRITICAL";
              const isResolved = t.status === "resolved";

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-md"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{t.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        : "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {t.subject}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">{t.status.replace("_", " ")}</span>
                    <span>SLA: <strong className="text-slate-700 dark:text-slate-300">{t.slaTimeRemaining}</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Ticket Conversation Thread */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col h-[600px] justify-between">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{activeTicket.id}</span>
                  <span className="text-xs text-slate-400">{activeTicket.createdAt}</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeTicket.subject}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>Assigned to: <strong className="text-slate-800 dark:text-slate-200">{activeTicket.assignedTo}</strong></span>
                  <span>•</span>
                  <span>Category: {activeTicket.category}</span>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 font-sans" data-lenis-prevent>
                {activeTicket.messages.map((m: any, idx: number) => {
                  const isClient = m.role === "Client";
                  return (
                    <div key={idx} className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{m.sender}</span>
                        <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                      </div>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                        isClient
                          ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type follow-up response or upload log details..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              Select a support ticket to view conversation details.
            </div>
          )}
        </div>
      </div>

      {/* New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTicket} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">New Technical Support Ticket</h3>
                  <p className="text-[11px] text-slate-500">Fast-track response from Nuvexora engineering team</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Ticket Subject / Title</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. API webhook endpoint returns 504 timeout on batch requests"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Infrastructure">Infrastructure / Cloud</option>
                    <option value="API & Gateway">API & Gateway</option>
                    <option value="Integration">Integration / Sandbox</option>
                    <option value="Billing & Billing">Billing & Invoices</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">SLA Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="P1_CRITICAL">P1 - Critical (&lt; 15 min SLA)</option>
                    <option value="P2_HIGH">P2 - High (&lt; 1 hour SLA)</option>
                    <option value="P3_NORMAL">P3 - Normal (&lt; 4 hours SLA)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Issue Details & Repro Steps</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, error codes, affected environment, or timestamps..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
