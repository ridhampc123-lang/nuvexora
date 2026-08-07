"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Sparkles, 
  Loader2,
  Users
} from "lucide-react";
import { useSocket } from "@/providers/socket-provider";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useChannelMessagesQuery, useSendChatMessageMutation, useTeamMembersQuery } from "@/hooks/use-api-queries";
import { useQueryClient } from "@tanstack/react-query";

interface TeamMember {
  id: string;
  channelId: string;
  name: string;
  role: string;
  online: boolean;
  avatar: string;
}

export default function ClientMessagesPage() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading: isLoadingTeam } = useTeamMembersQuery();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set default selected member when dynamic list loads
  useEffect(() => {
    if (teamMembers.length > 0 && !selectedMember) {
      setSelectedMember(teamMembers[0]);
    }
  }, [teamMembers, selectedMember]);

  const channelId = selectedMember?.channelId || "";
  const { data: dbMessages = [], isLoading: isLoadingMessages } = useChannelMessagesQuery(channelId);
  const sendMutation = useSendChatMessageMutation();

  // Socket room connection & real-time listener
  useEffect(() => {
    if (!socket || !channelId) return;

    socket.emit("join_channel", channelId);

    const handleNewMessage = (msg: any) => {
      if (msg.channelId === channelId) {
        queryClient.invalidateQueries({ queryKey: ["chatMessages", channelId] });
        queryClient.invalidateQueries({ queryKey: ["chatChannels"] });
      }
    };

    socket.on("new_chat_message", handleNewMessage);

    return () => {
      socket.emit("leave_channel", channelId);
      socket.off("new_chat_message", handleNewMessage);
    };
  }, [socket, channelId, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sendMutation.isPending || !channelId) return;

    const text = inputText.trim();
    setInputText("");

    sendMutation.mutate(
      {
        channelId,
        senderId: user?.id || "client-user",
        senderName: user?.name || "Marcus Vance (Client)",
        senderRole: "Client CTO",
        text,
      },
      {
        onError: () => {
          toast.error("Failed to send message. Please check connection.");
        },
      }
    );
  };

  const handleAttachFile = () => {
    toast.info("Select file attachment from local system...");
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] max-w-7xl mx-auto flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-sm overflow-hidden">
      {/* Left Sidebar: Dynamic Team Directory */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Assigned Team Members</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time collaboration channel</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5" data-lenis-prevent>
          {isLoadingTeam ? (
            <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>Loading team members...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-1">
              <Users className="w-6 h-6 mx-auto stroke-1 text-slate-400" />
              <p>No active team members assigned yet.</p>
            </div>
          ) : (
            teamMembers.map((tm: TeamMember) => {
              const isSelected = selectedMember?.id === tm.id;

              return (
                <div
                  key={tm.id}
                  onClick={() => setSelectedMember(tm)}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
                      isSelected ? "bg-white text-blue-600" : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    }`}>
                      {tm.avatar}
                    </div>
                    {tm.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{tm.name}</div>
                    <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {tm.role}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Message Workspace */}
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              {selectedMember?.avatar || "N"}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>{selectedMember?.name || "Select Team Member"}</span>
                {selectedMember && (
                  <span className="text-[10px] font-semibold text-slate-400">({selectedMember.role})</span>
                )}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isConnected ? "Live Socket Sync Active" : "Connecting..."}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Workspace</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans" data-lenis-prevent>
          {!selectedMember ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              Select a team member to open chat stream
            </div>
          ) : isLoadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span>Loading encrypted message stream...</span>
            </div>
          ) : dbMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">Start a Conversation</div>
              <p className="max-w-xs text-[11px] text-slate-500">Send a message to start communicating directly with {selectedMember.name}.</p>
            </div>
          ) : (
            dbMessages.map((m: any) => {
              const clientUserName = user?.name || "Marcus Vance";
              const isSelf = m.senderName?.toLowerCase().includes(clientUserName.toLowerCase()) || m.senderRole?.toLowerCase().includes("client");
              const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={m._id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.senderName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">({m.senderRole}) • {timeStr}</span>
                  </div>
                  <div
                    className={`max-w-md p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
                      isSelf
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

        {/* Input Box */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 flex items-center gap-3">
          <button 
            type="button" 
            onClick={handleAttachFile}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={selectedMember ? `Message ${selectedMember.name}...` : "Select a team member to chat..."}
            disabled={!selectedMember}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 transition-all outline-none"
          />

          <button
            type="submit"
            disabled={sendMutation.isPending || !inputText.trim() || !selectedMember}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {sendMutation.isPending ? (
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
  );
}
