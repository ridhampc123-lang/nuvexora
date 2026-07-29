"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminTicketsQuery, useUpdateAdminTicketMutation, useDeleteAdminTicketMutation } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, LifeBuoy, Clock, AlertCircle } from "lucide-react";

export default function SupportTicketsPage() {
  const { data: tickets = [], isLoading } = useAdminTicketsQuery();
  const updateTicket = useUpdateAdminTicketMutation();
  const deleteTicket = useDeleteAdminTicketMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<any>(null);

  const [formData, setFormData] = useState({
    status: "open",
    priority: "medium",
  });

  const openDrawer = (ticket: any) => {
    setEditingTicket(ticket);
    setFormData({
      status: ticket.status,
      priority: ticket.priority,
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      updateTicket.mutate(
        { id: editingTicket._id, ...formData },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Ticket",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{row.subject}</div>
            <div className="text-[10px] text-slate-500 font-mono">ID: {row.ticketId || row._id.slice(-6).toUpperCase()}</div>
          </div>
        </div>
      )
    },
    {
      header: "Client",
      cell: (row) => (
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.clientId?.name || 'Unknown Client'}
        </div>
      )
    },
    {
      header: "Priority",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.priority === "high" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" :
          row.priority === "medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" :
          "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
        }`}>
          {row.priority}
        </span>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "resolved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "in_progress" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}>
          {row.status.replace("_", " ")}
        </span>
      )
    },
    {
      header: "Date",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDrawer(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => deleteTicket.mutate(row._id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Support Tickets"
        description="Manage client support requests and issues."
        columns={columns}
        data={isLoading ? [] : tickets}
        searchPlaceholder="Search tickets by subject..."
      />

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Update Ticket
                    </h2>
                    <p className="text-xs text-slate-500">Change status or priority</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{editingTicket?.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 whitespace-pre-wrap">{editingTicket?.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50">
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Priority</label>
                    <select required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateTicket.isPending} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50">
                    {updateTicket.isPending ? "Saving..." : "Update Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
