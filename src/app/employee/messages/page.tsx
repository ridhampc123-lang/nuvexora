"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Paperclip, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useSocket } from "@/providers/socket-provider";
import { useChannelMessagesQuery, useSendChatMessageMutation, useChatChannelsQuery, useTeamMembersQuery } from "@/hooks/use-api-queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DynamicChannel {
  channelId: string;
  name: string;
  type: string;
}

export default function EmployeeMessagesPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const { data: chatChannels = [], isLoading: isLoadingChannels } = useChatChannelsQuery();
  const { data: teamMembers = [] } = useTeamMembersQuery();

  const dynamicChannels: DynamicChannel[] = React.useMemo(() => {
    const list: DynamicChannel[] = [];
    const map = new Map<string, boolean>();

    chatChannels.forEach((c: any) => {
      list.push({
        channelId: c.channelId,
        name: c.name || c.channelId,
        type: c.type || "Channel",
      });
      map.set(c.channelId, true);
    });

    teamMembers.forEach((tm: any) => {
      if (!map.has(tm.channelId)) {
        list.push({
          channelId: tm.channelId,
          name: `${tm.name} (${tm.role})`,
          type: "Direct Channel",
        });
      }
    });

    return list;
  }, [chatChannels, teamMembers]);

  const [activeChannel, setActiveChannel] = useState<DynamicChannel | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dynamicChannels.length > 0 && !activeChannel) {
      setActiveChannel(dynamicChannels[0]);
    }
  }, [dynamicChannels, activeChannel]);

  const channelId = activeChannel?.channelId || "";
  const { data: dbMessages = [], isLoading } = useChannelMessagesQuery(channelId);
  const sendMutation = useSendChatMessageMutation();

  // Connect to channel room
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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendMutation.isPending || !channelId) return;

    const text = inputMessage.trim();
    setInputMessage("");

    sendMutation.mutate(
      {
        channelId,
        senderId: user?.id || "employee-user",
        senderName: user?.name || "Alexander Vance",
        senderRole: user?.jobTitle || "Lead Systems Architect",
        text,
      },
      {
        onError: () => {
          toast.error("Failed to send message.");
        },
      }
    );
  };

  return (
    <div className="space-y-6 text-white h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <span>Real-Time Team & Client Messaging</span>
        </h1>
        <p className="text-xs text-slate-400">
          Secure end-to-end chat channels with client representatives, engineering squads, and project leads.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl min-h-0">
        {/* Sidebar Channels */}
        <div className="p-4 bg-slate-950 border-r border-slate-800 space-y-3">
          <h2 className="text-xs font-extrabold uppercase text-slate-400">Active Channels</h2>
          {isLoadingChannels ? (
            <div className="p-4 text-center text-xs text-slate-500">Loading channels...</div>
          ) : dynamicChannels.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No active channels</div>
          ) : (
            dynamicChannels.map((ch) => (
              <button
                key={ch.channelId}
                onClick={() => setActiveChannel(ch)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  activeChannel?.channelId === ch.channelId ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="text-xs font-bold truncate"># {ch.name}</div>
                <div className="text-[10px] opacity-75">{ch.type}</div>
              </button>
            ))
          )}
        </div>

        {/* Chat Main Area */}
        <div className="md:col-span-3 flex flex-col justify-between p-6 bg-slate-900">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white"># {activeChannel?.name || "Select Channel"}</h2>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isConnected ? "Live Socket Sync Active" : "Connecting..."}
            </span>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar" data-lenis-prevent>
            {!activeChannel ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select a channel from the left menu to start messaging.
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span>Loading channel history...</span>
              </div>
            ) : dbMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No messages sent yet in this channel. Send a note to start chatting!
              </div>
            ) : (
              dbMessages.map((m: any) => {
                const empUserName = user?.name || "Alexander Vance";
                const isSelf = m.senderName?.toLowerCase().includes(empUserName.toLowerCase()) || m.senderRole?.toLowerCase().includes("architect") || m.senderRole?.toLowerCase().includes("employee");
                const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={m._id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400 mb-0.5">{m.senderName} ({m.senderRole}) • {timeStr}</span>
                    <div
                      className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        isSelf ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
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
          <form onSubmit={sendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <button 
              type="button" 
              onClick={() => toast.info("Select file attachment from local system...")}
              className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={activeChannel ? `Message #${activeChannel.name}...` : "Select a channel to chat..."}
              disabled={!activeChannel}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              disabled={sendMutation.isPending || !inputMessage.trim() || !activeChannel}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
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
    </div>
  );
}
