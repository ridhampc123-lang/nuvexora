"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminMeetingsQuery, useCreateAdminMeetingMutation, useUpdateAdminMeetingMutation, useDeleteAdminMeetingMutation } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Video, Calendar, Clock, Globe } from "lucide-react";

export default function MeetingsPage() {
  const { data: meetings = [], isLoading } = useAdminMeetingsQuery();
  const createMeeting = useCreateAdminMeetingMutation();
  const updateMeeting = useUpdateAdminMeetingMutation();
  const deleteMeeting = useDeleteAdminMeetingMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "Technical Strategy Consultation",
    organizerName: "",
    organizerEmail: "",
    companyName: "",
    meetingDate: "",
    timeSlot: "",
    timezone: "UTC",
    topic: "",
    status: "scheduled",
    meetingLink: ""
  });

  const openDrawer = (meeting?: any) => {
    if (meeting) {
      setEditingMeeting(meeting);
      setFormData({
        title: meeting.title,
        organizerName: meeting.organizerName,
        organizerEmail: meeting.organizerEmail,
        companyName: meeting.companyName || "",
        meetingDate: meeting.meetingDate ? new Date(meeting.meetingDate).toISOString().split("T")[0] : "",
        timeSlot: meeting.timeSlot,
        timezone: meeting.timezone,
        topic: meeting.topic,
        status: meeting.status,
        meetingLink: meeting.meetingLink || ""
      });
    } else {
      setEditingMeeting(null);
      setFormData({
        title: "Technical Strategy Consultation",
        organizerName: "",
        organizerEmail: "",
        companyName: "",
        meetingDate: new Date().toISOString().split("T")[0],
        timeSlot: "10:00 AM - 11:00 AM",
        timezone: "UTC",
        topic: "",
        status: "scheduled",
        meetingLink: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      meetingDate: formData.meetingDate ? new Date(formData.meetingDate).toISOString() : undefined,
    };

    if (editingMeeting) {
      updateMeeting.mutate(
        { id: editingMeeting._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createMeeting.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Meeting",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.title}</div>
            <div className="text-[10px] text-slate-500">{row.topic || 'General Discussion'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Organizer",
      cell: (row) => (
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{row.organizerName}</div>
          <div className="text-[10px] text-slate-500">{row.companyName || row.organizerEmail}</div>
        </div>
      )
    },
    {
      header: "Schedule",
      cell: (row) => (
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            {new Date(row.meetingDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
            <Clock className="w-3 h-3" />
            {row.timeSlot} ({row.timezone})
          </div>
        </div>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "cancelled" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" :
          "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Link",
      cell: (row) => (
        row.meetingLink ? (
          <a href={row.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            <Globe className="w-3.5 h-3.5" />
            Join Meeting
          </a>
        ) : <span className="text-xs text-slate-400">No link</span>
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
            Edit
          </button>
          <button
            onClick={() => deleteMeeting.mutate(row._id)}
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
        title="Meetings"
        description="Schedule and manage client consultations and meetings."
        columns={columns}
        data={isLoading ? [] : meetings}
        searchPlaceholder="Search meetings..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
        }
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingMeeting ? "Edit Meeting" : "Schedule Meeting"}
                    </h2>
                    <p className="text-xs text-slate-500">Meeting details</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Organizer Name</label>
                      <input required type="text" value={formData.organizerName} onChange={e => setFormData({...formData, organizerName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email</label>
                      <input required type="email" value={formData.organizerEmail} onChange={e => setFormData({...formData, organizerEmail: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Company</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date</label>
                      <input required type="date" value={formData.meetingDate} onChange={e => setFormData({...formData, meetingDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Time Slot</label>
                      <input required type="text" placeholder="e.g. 10:00 AM - 11:00 AM" value={formData.timeSlot} onChange={e => setFormData({...formData, timeSlot: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timezone</label>
                      <input required type="text" value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</label>
                      <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50">
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Topic</label>
                    <textarea required rows={2} value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Meeting Link</label>
                    <input type="url" placeholder="https://zoom.us/j/..." value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMeeting.isPending || updateMeeting.isPending} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50">
                    {createMeeting.isPending || updateMeeting.isPending ? "Saving..." : editingMeeting ? "Save Changes" : "Schedule Meeting"}
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
