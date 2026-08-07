"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { 
  useAdminMessagesQuery, 
  useUpdateAdminMessageMutation, 
  useDeleteAdminMessageMutation,
  useChannelMessagesQuery,
  useSendChatMessageMutation,
  useChatChannelsQuery,
  useTeamMembersQuery
} from "@/hooks/use-api-queries";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Send, 
  Paperclip, 
  Loader2, 
  ShieldCheck,
  Globe,
  Radio
} from "lucide-react";
import { useSocket } from "@/providers/socket-provider";
import { useAuth } from "@/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AdminChannel {
  channelId: string;
  name: string;
  type: string;
  lastMessage?: string;
  totalMessages?: number;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"workspace" | "contact">("workspace");
  const [selectedChannel, setSelectedChannel] = useState<AdminChannel | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries for Contact Form Messages
  const { data: contactMessages = [], isLoading: isLoadingContact } = useAdminMessagesQuery();
  const updateContactMessage = useUpdateAdminMessageMutation();
  const deleteContactMessage = useDeleteAdminMessageMutation();

  // Queries for Live Workspace Chats
  const { data: chatChannels = [], isLoading: isLoadingChannels } = useChatChannelsQuery();
  const { data: teamMembers = [] } = useTeamMembersQuery();

  // Merge dynamic channels from DB & team members
  const dynamicChannels: AdminChannel[] = React.useMemo(() => {
    const list: AdminChannel[] = [];
    const map = new Map<string, boolean>();

    // 1. Channels from database chat logs
    chatChannels.forEach((c: any) => {
      list.push({
        channelId: c.channelId,
        name: c.name || c.channelId,
        type: c.type || "Channel",
        lastMessage: c.lastMessage,
        totalMessages: c.totalMessages,
      });
      map.set(c.channelId, true);
    });

    // 2. Team member channels
    teamMembers.forEach((tm: any) => {
      if (!map.has(tm.channelId)) {
        list.push({
          channelId: tm.channelId,
          name: `${tm.name} (${tm.role})`,
          type: "Team Member",
          lastMessage: "No messages yet",
          totalMessages: 0,
        });
      }
    });

    return list;
  }, [chatChannels, teamMembers]);

  // Set default selected channel once dynamic list is available
  useEffect(() => {
    if (dynamicChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(dynamicChannels[0]);
    }
  }, [dynamicChannels, selectedChannel]);

  const channelId = selectedChannel?.channelId || "";
  const { data: dbMessages = [], isLoading: isLoadingChats } = useChannelMessagesQuery(channelId);
  const sendChatMessageMutation = useSendChatMessageMutation();

  // Socket room joining and admin global broadcast listener
  useEffect(() => {
    if (!socket || !channelId) return;

    socket.emit("join_channel", channelId);

    const handleNewMessage = (msg: any) => {
      if (msg.channelId === channelId) {
        queryClient.invalidateQueries({ queryKey: ["chatMessages", channelId] });
      }
      queryClient.invalidateQueries({ queryKey: ["chatChannels"] });
    };

    const handleAdminBroadcast = (msg: any) => {
      if (msg.channelId === channelId) {
        queryClient.invalidateQueries({ queryKey: ["chatMessages", channelId] });
      }
      queryClient.invalidateQueries({ queryKey: ["chatChannels"] });
    };

    socket.on("new_chat_message", handleNewMessage);
    socket.on("admin_chat_broadcast", handleAdminBroadcast);

    return () => {
      socket.emit("leave_channel", channelId);
      socket.off("new_chat_message", handleNewMessage);
      socket.off("admin_chat_broadcast", handleAdminBroadcast);
    };
  }, [socket, channelId, queryClient]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages]);

  const handleAdminSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendChatMessageMutation.isPending || !channelId) return;

    const text = inputMessage.trim();
    setInputMessage("");

    sendChatMessageMutation.mutate(
      {
        channelId,
        senderId: user?.id || "admin-user",
        senderName: user?.name || "Nuvexora Super Admin",
        senderRole: "Super Admin",
        text,
      },
      {
        onError: () => {
          toast.error("Failed to send admin response.");
        },
      }
    );
  };

  const toggleReadStatus = (message: any) => {
    updateContactMessage.mutate({ id: message._id, isRead: !message.isRead });
  };

  const toggleRepliedStatus = (message: any) => {
    updateContactMessage.mutate({ id: message._id, replied: !message.replied });
  };

  const contactColumns: Column<any>[] = [
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
            onClick={() => deleteContactMessage.mutate(row._id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Central Communication Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Live Messages & Enquiries</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Monitor real-time client & employee chats and process public website enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "workspace"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Workspace Live Chats</span>
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "contact"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Contact Form Enquiries</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Real-time Workspace Chat Console */}
      {activeTab === "workspace" && (
        <div className="h-[calc(100vh-14rem)] flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Left Sidebar Channels */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 shrink-0 hidden md:flex">
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
              <h2 className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">Active Chat Channels</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time sync across Client & Employee portals</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5" data-lenis-prevent>
              {isLoadingChannels ? (
                <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading channels...</span>
                </div>
              ) : dynamicChannels.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No active channels found.</div>
              ) : (
                dynamicChannels.map((ch) => {
                  const isSelected = selectedChannel?.channelId === ch.channelId;

                  return (
                    <div
                      key={ch.channelId}
                      onClick={() => setSelectedChannel(ch)}
                      className={`p-3 rounded-2xl flex flex-col gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{ch.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {ch.type}
                        </span>
                      </div>

                      <p className={`text-[11px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {ch.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Workspace */}
          <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/40">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span>{selectedChannel?.name || "Select Channel"}</span>
                  {selectedChannel && (
                    <span className="text-[10px] font-semibold text-slate-400">({selectedChannel.type} Channel)</span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isConnected ? "Live Socket Sync Active" : "Connecting..."}</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Audit View</span>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans" data-lenis-prevent>
              {!selectedChannel ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Select a channel from the left sidebar to monitor messages live.
                </div>
              ) : isLoadingChats ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span>Loading real-time message stream...</span>
                </div>
              ) : dbMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 text-blue-500" />
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">Channel Active</div>
                  <p className="max-w-xs text-[11px] text-slate-500">No messages sent yet in this channel. Send a note to start chatting live!</p>
                </div>
              ) : (
                dbMessages.map((m: any) => {
                  const isAdminSender = m.senderRole?.toLowerCase().includes("admin") || m.senderName?.toLowerCase().includes("admin");
                  const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <div key={m._id} className={`flex flex-col ${isAdminSender ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.senderName}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">({m.senderRole}) • {timeStr}</span>
                      </div>
                      <div
                        className={`max-w-md p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
                          isAdminSender
                            ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/20"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleAdminSend} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => toast.info("Select file attachment...")}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={selectedChannel ? `Reply live to ${selectedChannel.name} as Super Admin...` : "Select a channel to reply..."}
                disabled={!selectedChannel}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 transition-all outline-none"
              />

              <button
                type="submit"
                disabled={sendChatMessageMutation.isPending || !inputMessage.trim() || !selectedChannel}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {sendChatMessageMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Contact Form Enquiries */}
      {activeTab === "contact" && (
        <AdminDataTable
          title="Contact Form Messages"
          description="View and manage messages submitted through the public website contact form."
          columns={contactColumns}
          data={isLoadingContact ? [] : contactMessages}
          searchPlaceholder="Search messages by name, email, or subject..."
        />
      )}
    </div>
  );
}
