"use client";

import React, { useState } from "react";
import { 
  Send, 
  Paperclip, 
  ShieldCheck, 
  User, 
  Wifi, 
  CheckCheck, 
  Sparkles, 
  FileText, 
  Smile,
  Circle
} from "lucide-react";
import { useSocket } from "@/providers/socket-provider";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isSelf: boolean;
  attachmentName?: string;
}

const initialTeam = [
  { id: "tm-1", name: "Alexander Vance", role: "Lead Systems Architect", online: true, avatar: "AV" },
  { id: "tm-2", name: "Elena Rostova", role: "Principal Product Designer", online: true, avatar: "ER" },
  { id: "tm-3", name: "Dr. Aris Thorne", role: "AI & ML Specialist", online: false, avatar: "AT" },
  { id: "tm-4", name: "DevOps & SLA Team", role: "Infrastructure Lead", online: true, avatar: "DO" },
];

const initialMessages: ChatMessage[] = [];

export default function ClientMessagesPage() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [selectedMember, setSelectedMember] = useState(initialTeam[0]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "Marcus Vance",
      role: "Client CTO",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    if (socket) {
      socket.emit("send_message", { text: inputText });
    }
    const currentInput = inputText;
    setInputText("");

    // Simulate instant Nuvexora Team Response after 1.2s
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: selectedMember.name,
        role: selectedMember.role,
        text: `Got your note regarding "${currentInput.slice(0, 30)}...". Our engineering team is on it!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSelf: false,
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  const handleAttachFile = () => {
    toast.info("Select file attachment from local system...");
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] max-w-7xl mx-auto flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-sm overflow-hidden">
      {/* Left Sidebar: Team Directory */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Nuvexora Assigned Team</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time collaboration channel</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5" data-lenis-prevent>
          {initialTeam.map((tm) => {
            const isSelected = tm.id === selectedMember.id;

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
          })}
        </div>
      </div>

      {/* Right Pane: Message Workspace */}
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              {selectedMember.avatar}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>{selectedMember.name}</span>
                <span className="text-[10px] font-semibold text-slate-400">({selectedMember.role})</span>
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
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">Start a Conversation</div>
              <p className="max-w-xs text-[11px] text-slate-500">Send a message to start communicating directly with {selectedMember.name} and the engineering team.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{m.sender}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">({m.role}) • {m.time}</span>
                </div>
                <div
                  className={`max-w-md p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm ${
                    m.isSelf
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
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
            placeholder={`Message ${selectedMember.name} and Nuvexora team...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 transition-all outline-none"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
