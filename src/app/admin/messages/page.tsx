"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminMessagesQuery, useUpdateAdminMessageMutation, useDeleteAdminMessageMutation } from "@/hooks/use-api-queries";
import { Mail, MessageSquare, Clock, CheckCircle2, User, Phone } from "lucide-react";

export default function MessagesPage() {
  const { data: messages = [], isLoading } = useAdminMessagesQuery();
  const updateMessage = useUpdateAdminMessageMutation();
  const deleteMessage = useDeleteAdminMessageMutation();

  const toggleReadStatus = (message: any) => {
    updateMessage.mutate({ id: message._id, isRead: !message.isRead });
  };

  const toggleRepliedStatus = (message: any) => {
    updateMessage.mutate({ id: message._id, replied: !message.replied });
  };

  const columns: Column<any>[] = [
    {
      header: "Sender",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className={`font-bold ${row.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{row.senderName}</div>
            <div className="text-[10px] text-slate-500">{row.senderEmail}</div>
          </div>
        </div>
      )
    },
    {
      header: "Subject & Message",
      cell: (row) => (
        <div className="max-w-md">
          <div className={`text-sm ${row.isRead ? 'font-medium text-slate-700 dark:text-slate-300' : 'font-bold text-slate-900 dark:text-white'}`}>
            {row.subject}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {row.message}
          </div>
        </div>
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
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.isRead ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700" :
            "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
          }`}>
            {row.isRead ? "Read" : "Unread"}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.replied ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
            "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
          }`}>
            {row.replied ? "Replied" : "Pending"}
          </span>
        </div>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleReadStatus(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Mark {row.isRead ? "Unread" : "Read"}
          </button>
          <button
            onClick={() => toggleRepliedStatus(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            {row.replied ? "Unmark Reply" : "Mark Replied"}
          </button>
          <button
            onClick={() => deleteMessage.mutate(row._id)}
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
        title="Contact Messages"
        description="View and manage messages from the public website contact form."
        columns={columns}
        data={isLoading ? [] : messages}
        searchPlaceholder="Search messages by name, email, or subject..."
      />
    </div>
  );
}
